const supabase = require('../utils/supabaseClient');
class Order {
    static async findAll() { const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false }); if (error) throw error; return data; }
    static async findByUser(userId) { const { data, error } = await supabase.from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false }); if (error) throw error; return data; }
    static async create(orderData) { const { data, error } = await supabase.from('orders').insert([orderData]).select().single(); if (error) throw error; return data; }
    static async updateStatus(id, status) { const { data, error } = await supabase.from('orders').update({ status }).eq('id', id).select().single(); if (error) throw error; return data; }
}
module.exports = Order;