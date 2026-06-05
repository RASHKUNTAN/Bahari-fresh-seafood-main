const express = require('express');
const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const { data, error } = await req.supabase.from('products').select('*').order('name');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await req.supabase.from('products').select('*').eq('id', req.params.id).single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create product (admin only)
router.post('/', async (req, res) => {
  try {
    const { name, price, category, stock_quantity, image_url } = req.body;
    if (!name || !price) return res.status(400).json({ error: 'Name and price required' });
    
    const { data, error } = await req.supabase.from('products').insert([{
      name, price: Number(price), category, stock_quantity: Number(stock_quantity) || 0, image_url
    }]).select().single();
    
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update product (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { data, error } = await req.supabase.from('products').update(req.body).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete product (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await req.supabase.from('products').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;