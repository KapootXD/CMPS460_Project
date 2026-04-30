import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from './db.js';

const app = express();
const PORT = process.env.PORT || process.env.API_PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_only_set_JWT_SECRET_in_env';

// Middleware
app.use(cors());
app.use(express.json());

async function ensureCheckoutSchema() {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS checkout_orders (
       checkout_id  SERIAL PRIMARY KEY,
       customer_id  INT NOT NULL REFERENCES customers(customer_id),
       cart_id      INT NOT NULL REFERENCES cart(cart_id),
       order_status VARCHAR(20) NOT NULL DEFAULT 'completed'
                    CHECK (order_status IN ('pending', 'completed')),
       total_amount NUMERIC(10,2) NOT NULL CHECK (total_amount >= 0),
       created_at   TIMESTAMP NOT NULL DEFAULT NOW()
     )`,
  );

  await pool.query(
    `CREATE TABLE IF NOT EXISTS checkout_order_items (
       checkout_item_id SERIAL PRIMARY KEY,
       checkout_id      INT NOT NULL REFERENCES checkout_orders(checkout_id) ON DELETE CASCADE,
       coffee_id        INT NOT NULL REFERENCES coffees(coffee_id),
       coffee_name      VARCHAR(100) NOT NULL,
       quantity         INT NOT NULL CHECK (quantity > 0),
       unit_price       NUMERIC(6,2) NOT NULL CHECK (unit_price >= 0)
     )`,
  );
}

function signCustomerToken(customerId) {
  return jwt.sign(
    { sub: String(customerId), typ: 'customer' },
    JWT_SECRET,
    { expiresIn: '7d' },
  );
}

/** Object-level auth: cart routes use customer_id from verified JWT only (not client-supplied ids). */
function requireCartAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || typeof header !== 'string' || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required.' });
  }
  const token = header.slice(7).trim();
  if (!token) {
    return res.status(401).json({ error: 'Authentication required.' });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const id = Number.parseInt(payload.sub, 10);
    if (Number.isNaN(id) || id <= 0) {
      return res.status(401).json({ error: 'Invalid token.' });
    }
    req.authCustomerId = id;
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      message: 'OneCoffe API is running!',
      database: 'connected',
      time: result.rows[0].now,
    });
  } catch (err) {
    res.status(500).json({
      message: 'API is running but database is not connected',
      error: err.message,
    });
  }
});

// Placeholder: Coffee routes
app.get('/api/coffees', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM coffees ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Report 1: list all available coffees
app.get('/api/reports/available-coffees', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT coffee_id, name, theme_tag, price
       FROM coffees
       WHERE is_available = TRUE
       ORDER BY name`,
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to load available coffees report.' });
  }
});

// Report 2: coffees under $5.00
app.get('/api/reports/coffees-under-five', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT coffee_id, name, price
       FROM coffees
       WHERE price < 5.00
       ORDER BY price, name`,
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to load coffees-under-five report.' });
  }
});

// Report 3: cart items in active carts (simple join report)
app.get('/api/reports/active-cart-items', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.cart_id,
              c.customer_id,
              ci.coffee_id,
              ci.quantity,
              ci.unit_price
       FROM cart c
       JOIN cart_items ci ON ci.cart_id = c.cart_id
       WHERE c.cart_status = 'active'
       ORDER BY c.cart_id, ci.coffee_id`,
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to load active cart items report.' });
  }
});

// Signup route
app.post('/api/auth/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required.' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO customers (full_name, email, password_hash, phone)
       VALUES ($1, $2, $3, $4)
       RETURNING customer_id, full_name, email, phone, created_at`,
      [username.trim(), email.trim().toLowerCase(), passwordHash, null],
    );

    const customer = result.rows[0];
    const token = signCustomerToken(customer.customer_id);

    return res.status(201).json({
      message: 'Signup successful.',
      customer,
      token,
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email is already registered.' });
    }
    return res.status(500).json({ error: 'Failed to create account.' });
  }
});

// Login route
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const result = await pool.query(
      `SELECT customer_id, full_name, email, phone, created_at, password_hash
       FROM customers
       WHERE email = $1 AND is_active = TRUE
       LIMIT 1`,
      [email.trim().toLowerCase()],
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: 'Incorrect email or password.' });
    }

    const customer = result.rows[0];

    // Development seed data ships with a placeholder bcrypt string, so keep demo login usable.
    const matchesSeedPassword = (
      customer.password_hash === '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012'
      && password === 'password123'
    );
    const passwordMatches = matchesSeedPassword || await bcrypt.compare(password, customer.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({ error: 'Incorrect email or password.' });
    }

    const token = signCustomerToken(customer.customer_id);

    return res.json({
      message: 'Login successful.',
      customer: {
        customer_id: customer.customer_id,
        full_name: customer.full_name,
        email: customer.email,
        phone: customer.phone,
        created_at: customer.created_at,
      },
      token,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to log in.' });
  }
});

function normalizeCustomerId(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) || parsed <= 0 ? null : parsed;
}

async function getOrCreateActiveCart(client, customerId) {
  const existing = await client.query(
    `SELECT cart_id
     FROM cart
     WHERE customer_id = $1
       AND cart_status = 'active'
     ORDER BY updated_at DESC, cart_id DESC
     LIMIT 1`,
    [customerId],
  );

  if (existing.rowCount > 0) {
    return existing.rows[0].cart_id;
  }

  const created = await client.query(
    `INSERT INTO cart (customer_id, cart_status, updated_at)
     VALUES ($1, 'active', NOW())
     RETURNING cart_id`,
    [customerId],
  );

  return created.rows[0].cart_id;
}

async function getActiveCartId(client, customerId) {
  const result = await client.query(
    `SELECT cart_id
     FROM cart
     WHERE customer_id = $1
       AND cart_status = 'active'
     ORDER BY updated_at DESC, cart_id DESC
     LIMIT 1`,
    [customerId],
  );

  if (result.rowCount === 0) {
    return null;
  }

  return result.rows[0].cart_id;
}

async function fetchCartItemsByCustomer(client, customerId) {
  const result = await client.query(
    `SELECT ci.coffee_id,
            SUM(ci.quantity)::INT AS quantity,
            MAX(ci.unit_price) AS unit_price
     FROM cart c
     JOIN cart_items ci ON ci.cart_id = c.cart_id
     WHERE c.customer_id = $1
       AND c.cart_status = 'active'
     GROUP BY ci.coffee_id
     ORDER BY ci.coffee_id`,
    [customerId],
  );

  return result.rows;
}

app.get('/api/cart', requireCartAuth, async (req, res) => {
  const customerId = req.authCustomerId;

  try {
    const customerLookup = await pool.query(
      'SELECT customer_id FROM customers WHERE customer_id = $1 AND is_active = TRUE LIMIT 1',
      [customerId],
    );

    if (customerLookup.rowCount === 0) {
      return res.status(404).json({ error: 'Customer not found.' });
    }

    const items = await fetchCartItemsByCustomer(pool, customerId);
    return res.json({ customer_id: customerId, items });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to load cart.' });
  }
});

app.post('/api/cart/items', requireCartAuth, async (req, res) => {
  const customerId = req.authCustomerId;
  const spoofId = normalizeCustomerId(req.body.customer_id);
  if (spoofId !== null && spoofId !== customerId) {
    return res.status(403).json({ error: 'You may only modify your own cart.' });
  }

  const coffeeId = normalizeCustomerId(req.body.coffee_id);
  const quantity = Number.parseInt(req.body.quantity ?? 1, 10);

  if (!coffeeId || Number.isNaN(quantity) || quantity <= 0) {
    return res.status(400).json({ error: 'Valid coffee_id and quantity are required.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const customerLookup = await client.query(
      'SELECT customer_id FROM customers WHERE customer_id = $1 AND is_active = TRUE LIMIT 1',
      [customerId],
    );
    if (customerLookup.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Customer not found.' });
    }

    const coffeeLookup = await client.query(
      'SELECT coffee_id, price FROM coffees WHERE coffee_id = $1 AND is_available = TRUE LIMIT 1',
      [coffeeId],
    );
    if (coffeeLookup.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Coffee not found.' });
    }

    const unitPrice = coffeeLookup.rows[0].price;
    const cartId = await getOrCreateActiveCart(client, customerId);
    const existing = await client.query(
      'SELECT cart_item_id, quantity FROM cart_items WHERE cart_id = $1 AND coffee_id = $2 LIMIT 1',
      [cartId, coffeeId],
    );

    if (existing.rowCount > 0) {
      await client.query(
        `UPDATE cart_items
         SET quantity = $1,
             unit_price = $2
         WHERE cart_item_id = $3`,
        [existing.rows[0].quantity + quantity, unitPrice, existing.rows[0].cart_item_id],
      );
    } else {
      await client.query(
        `INSERT INTO cart_items (cart_id, coffee_id, quantity, unit_price)
         VALUES ($1, $2, $3, $4)`,
        [cartId, coffeeId, quantity, unitPrice],
      );
    }

    await client.query(
      'UPDATE cart SET updated_at = NOW() WHERE cart_id = $1',
      [cartId],
    );

    const items = await fetchCartItemsByCustomer(client, customerId);
    await client.query('COMMIT');
    return res.status(201).json({ customer_id: customerId, items });
  } catch (err) {
    await client.query('ROLLBACK');
    return res.status(500).json({ error: 'Failed to add item to cart.' });
  } finally {
    client.release();
  }
});

app.put('/api/cart/items/:coffeeId', requireCartAuth, async (req, res) => {
  const customerId = req.authCustomerId;
  const spoofId = normalizeCustomerId(req.body.customer_id);
  if (spoofId !== null && spoofId !== customerId) {
    return res.status(403).json({ error: 'You may only modify your own cart.' });
  }

  const coffeeId = normalizeCustomerId(req.params.coffeeId);
  const quantity = Number.parseInt(req.body.quantity, 10);

  if (!coffeeId || Number.isNaN(quantity)) {
    return res.status(400).json({ error: 'Valid coffee_id and quantity are required.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const customerLookup = await client.query(
      'SELECT customer_id FROM customers WHERE customer_id = $1 AND is_active = TRUE LIMIT 1',
      [customerId],
    );
    if (customerLookup.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Customer not found.' });
    }

    const cartId = await getOrCreateActiveCart(client, customerId);

    if (quantity <= 0) {
      await client.query(
        'DELETE FROM cart_items WHERE cart_id = $1 AND coffee_id = $2',
        [cartId, coffeeId],
      );
    } else {
      const coffeeLookup = await client.query(
        'SELECT coffee_id, price FROM coffees WHERE coffee_id = $1 LIMIT 1',
        [coffeeId],
      );
      if (coffeeLookup.rowCount === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Coffee not found.' });
      }

      const updated = await client.query(
        `UPDATE cart_items
         SET quantity = $1,
             unit_price = $2
         WHERE cart_id = $3
           AND coffee_id = $4`,
        [quantity, coffeeLookup.rows[0].price, cartId, coffeeId],
      );

      if (updated.rowCount === 0) {
        await client.query(
          `INSERT INTO cart_items (cart_id, coffee_id, quantity, unit_price)
           VALUES ($1, $2, $3, $4)`,
          [cartId, coffeeId, quantity, coffeeLookup.rows[0].price],
        );
      }
    }

    await client.query(
      'UPDATE cart SET updated_at = NOW() WHERE cart_id = $1',
      [cartId],
    );
    const items = await fetchCartItemsByCustomer(client, customerId);
    await client.query('COMMIT');
    return res.json({ customer_id: customerId, items });
  } catch (err) {
    await client.query('ROLLBACK');
    return res.status(500).json({ error: 'Failed to update cart item.' });
  } finally {
    client.release();
  }
});

app.delete('/api/cart/items/:coffeeId', requireCartAuth, async (req, res) => {
  const customerId = req.authCustomerId;
  const coffeeId = normalizeCustomerId(req.params.coffeeId);

  if (!coffeeId) {
    return res.status(400).json({ error: 'Valid coffee_id is required.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const cartId = await getOrCreateActiveCart(client, customerId);

    await client.query(
      'DELETE FROM cart_items WHERE cart_id = $1 AND coffee_id = $2',
      [cartId, coffeeId],
    );
    await client.query(
      'UPDATE cart SET updated_at = NOW() WHERE cart_id = $1',
      [cartId],
    );

    const items = await fetchCartItemsByCustomer(client, customerId);
    await client.query('COMMIT');
    return res.json({ customer_id: customerId, items });
  } catch (err) {
    await client.query('ROLLBACK');
    return res.status(500).json({ error: 'Failed to remove cart item.' });
  } finally {
    client.release();
  }
});

app.delete('/api/cart', requireCartAuth, async (req, res) => {
  const customerId = req.authCustomerId;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const cartId = await getOrCreateActiveCart(client, customerId);
    await client.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);
    await client.query(
      'UPDATE cart SET updated_at = NOW() WHERE cart_id = $1',
      [cartId],
    );
    await client.query('COMMIT');
    return res.json({ customer_id: customerId, items: [] });
  } catch (err) {
    await client.query('ROLLBACK');
    return res.status(500).json({ error: 'Failed to clear cart.' });
  } finally {
    client.release();
  }
});

app.post('/api/checkout', requireCartAuth, async (req, res) => {
  const customerId = req.authCustomerId;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const customerLookup = await client.query(
      `SELECT customer_id, full_name
       FROM customers
       WHERE customer_id = $1
         AND is_active = TRUE
       LIMIT 1`,
      [customerId],
    );
    if (customerLookup.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Customer not found.' });
    }

    const cartId = await getActiveCartId(client, customerId);
    if (!cartId) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Your cart is empty.' });
    }

    const itemsResult = await client.query(
      `SELECT ci.coffee_id,
              c.name AS coffee_name,
              ci.quantity,
              ci.unit_price
       FROM cart_items ci
       JOIN coffees c ON c.coffee_id = ci.coffee_id
       WHERE ci.cart_id = $1
       ORDER BY ci.coffee_id`,
      [cartId],
    );

    if (itemsResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Your cart is empty.' });
    }

    const totalAmount = itemsResult.rows.reduce(
      (sum, row) => sum + (Number(row.quantity) * Number(row.unit_price)),
      0,
    );

    const checkoutInsert = await client.query(
      `INSERT INTO checkout_orders (customer_id, cart_id, order_status, total_amount)
       VALUES ($1, $2, 'completed', $3)
       RETURNING checkout_id, customer_id, cart_id, order_status, total_amount, created_at`,
      [customerId, cartId, totalAmount],
    );

    const checkout = checkoutInsert.rows[0];

    for (const item of itemsResult.rows) {
      await client.query(
        `INSERT INTO checkout_order_items (checkout_id, coffee_id, coffee_name, quantity, unit_price)
         VALUES ($1, $2, $3, $4, $5)`,
        [checkout.checkout_id, item.coffee_id, item.coffee_name, item.quantity, item.unit_price],
      );
    }

    await client.query(
      `UPDATE cart
       SET cart_status = 'abandoned',
           updated_at = NOW()
       WHERE cart_id = $1`,
      [cartId],
    );

    await client.query('COMMIT');

    return res.status(201).json({
      checkout: {
        ...checkout,
        customer_name: customerLookup.rows[0].full_name,
      },
      items: itemsResult.rows.map((item) => ({
        coffee_id: Number(item.coffee_id),
        coffee_name: item.coffee_name,
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price),
        line_total: Number(item.quantity) * Number(item.unit_price),
      })),
    });
  } catch (err) {
    await client.query('ROLLBACK');
    return res.status(500).json({ error: 'Failed to complete checkout.' });
  } finally {
    client.release();
  }
});

app.get('/api/checkout/:checkoutId', requireCartAuth, async (req, res) => {
  const customerId = req.authCustomerId;
  const checkoutId = normalizeCustomerId(req.params.checkoutId);

  if (!checkoutId) {
    return res.status(400).json({ error: 'Valid checkout_id is required.' });
  }

  try {
    const checkoutResult = await pool.query(
      `SELECT co.checkout_id,
              co.customer_id,
              co.cart_id,
              co.order_status,
              co.total_amount,
              co.created_at,
              cu.full_name AS customer_name
       FROM checkout_orders co
       JOIN customers cu ON cu.customer_id = co.customer_id
       WHERE co.checkout_id = $1
         AND co.customer_id = $2
       LIMIT 1`,
      [checkoutId, customerId],
    );

    if (checkoutResult.rowCount === 0) {
      return res.status(404).json({ error: 'Checkout not found.' });
    }

    const itemsResult = await pool.query(
      `SELECT coffee_id, coffee_name, quantity, unit_price
       FROM checkout_order_items
       WHERE checkout_id = $1
       ORDER BY coffee_id`,
      [checkoutId],
    );

    return res.json({
      checkout: checkoutResult.rows[0],
      items: itemsResult.rows.map((item) => ({
        coffee_id: Number(item.coffee_id),
        coffee_name: item.coffee_name,
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price),
        line_total: Number(item.quantity) * Number(item.unit_price),
      })),
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to load checkout.' });
  }
});

async function startServer() {
  try {
    await ensureCheckoutSchema();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 OneCoffe API running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to ensure checkout schema:', err.message);
    process.exit(1);
  }
}

startServer();
