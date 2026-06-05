require('dotenv').config();
const express = require('express');
const cors = require('cors');
const supabase = require('./utils/supabaseClient');

// Routes
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const mpesaRoutes = require('./routes/mpesa');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Make supabase available to routes
app.use((req, res, next) => {
  req.supabase = supabase;
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/mpesa', mpesaRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));