import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import pool from './db.js';

const app = express();
const PORT = process.env.PORT || process.env.API_PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

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

    return res.status(201).json({
      message: 'Signup successful.',
      customer: result.rows[0],
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

    return res.json({
      message: 'Login successful.',
      customer: {
        customer_id: customer.customer_id,
        full_name: customer.full_name,
        email: customer.email,
        phone: customer.phone,
        created_at: customer.created_at,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to log in.' });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 OneCoffe API running on port ${PORT}`);
});
