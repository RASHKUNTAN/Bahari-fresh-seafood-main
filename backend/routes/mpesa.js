const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

const getAccessToken = async () => {
  const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64');
  const baseUrl = process.env.MPESA_ENVIRONMENT === 'production' 
    ? 'https://api.safaricom.co.ke' 
    : 'https://sandbox.safaricom.co.ke';
  
  const response = await axios.get(
    `${baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
    { headers: { Authorization: `Basic ${auth}` } }
  );
  return response.data.access_token;
};

// STK Push for M-Pesa payment
router.post('/stkpush', async (req, res) => {
  try {
    const { phone, cart } = req.body;
    if (!phone || !cart || cart.length === 0) {
      return res.status(400).json({ error: 'Phone and cart items required' });
    }

    let formattedPhone = phone.replace(/\D/g, '');
    if (formattedPhone.startsWith('0')) formattedPhone = '254' + formattedPhone.slice(1);
    if (!formattedPhone.startsWith('254') || formattedPhone.length !== 12) {
      return res.status(400).json({ error: 'Invalid phone number' });
    }

    // Calculate total from cart
    const amount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64');

    const token = await getAccessToken();
    const baseUrl = process.env.MPESA_ENVIRONMENT === 'production' 
      ? 'https://api.safaricom.co.ke' 
      : 'https://sandbox.safaricom.co.ke';

    const response = await axios.post(
      `${baseUrl}/mpesa/stkpush/v1/processrequest`,
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(amount),
        PartyA: formattedPhone,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: formattedPhone,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: 'BahariFresh',
        TransactionDesc: 'Seafood order'
      },
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    );

    if (response.data.ResponseCode === '0') {
      res.json({ success: true, checkoutRequestId: response.data.CheckoutRequestID });
    } else {
      res.status(400).json({ success: false, error: response.data.ResponseDescription });
    }
  } catch (err) {
    console.error('STK Push error:', err.message);
    res.status(500).json({ success: false, error: 'STK Push failed' });
  }
});

// M-Pesa Callback
router.post('/callback', async (req, res) => {
  try {
    console.log('M-Pesa Callback:', JSON.stringify(req.body, null, 2));
    // Store transaction in database for record keeping
    if (req.body.Body?.stkCallback) {
      const callback = req.body.Body.stkCallback;
      // TODO: Update order status based on ResultCode
      if (callback.ResultCode === 0) {
        // Payment successful
        console.log('Payment successful:', callback.CheckoutRequestID);
      }
    }
    res.json({ ResultCode: 0, ResultDesc: 'Success' });
  } catch (err) {
    console.error('Callback error:', err);
    res.status(500).json({ ResultCode: 1, ResultDesc: 'Error' });
  }
});

module.exports = router;