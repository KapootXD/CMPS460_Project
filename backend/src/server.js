import express from 'express';
import cors from 'cors';
import pool from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

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

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 OneCoffe API running on port ${PORT}`);
});
