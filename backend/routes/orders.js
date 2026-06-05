const express = require('express');
const router = express.Router();

// Get all orders (admin only)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await req.supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's orders
router.get('/user/:userId', async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('orders')
      .select('*')
      .eq('user_id', req.params.userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create order
router.post('/', async (req, res) => {
  try {
    const { phone, items, total, user_id } = req.body;
    if (!phone || !items || !total) {
      return res.status(400).json({ error: 'Phone, items, and total required' });
    }

    const { data, error } = await req.supabase.from('orders').insert([{
      phone,
      items: JSON.stringify(items),
      total,
      status: 'pending',
      user_id
    }]).select().single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status required' });

    const { data, error } = await req.supabase
      .from('orders')
      .update({ status })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;