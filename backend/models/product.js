const supabase = require('../utils/supabaseClient');
class Product {
    static async findAll() { const { data, error } = await supabase.from('products').select('*').order('name'); if (error) throw error; return data; }
    static async findById(id) { const { data, error } = await supabase.from('products').select('*').eq('id', id).single(); if (error) throw error; return data; }
    static async create(productData) { const { data, error } = await supabase.from('products').insert([productData]).select().single(); if (error) throw error; return data; }
    static async update(id, updates) { const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single(); if (error) throw error; return data; }
    static async delete(id) { const { error } = await supabase.from('products').delete().eq('id', id); if (error) throw error; return true; }
    static async updateStock(id, quantity) { const { data, error } = await supabase.from('products').update({ stock_quantity: quantity }).eq('id', id).select().single(); if (error) throw error; return data; }
}
module.exports = Product;