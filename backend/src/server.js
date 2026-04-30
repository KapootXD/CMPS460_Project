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

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 OneCoffe API running on port ${PORT}`);
});
