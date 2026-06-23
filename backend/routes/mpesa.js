// backend/routes/mpesa.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Safaricom Daraja Credentials Placeholder Keys
const CONSUMER_KEY = rQFWBNUt0FKSx3rq4zaM49gdTQAUAwFvjTMdPqKsE4dn3vXL;
const CONSUMER_SECRET = KxcDmRLSALbHmxEvzlhUGjgISLRwF8y4PMtaWSsZaAzKkGrK2SpWICYctKWOQmXu;
const SHORTCODE = "174379"; // Default test Lipa Na M-Pesa passbook shortcode
const PASSKEY = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2cbe9";

// Middleware helper to generate dynamic OAuth Access Tokens from Safaricom
async function getOAuthToken(req, res, next) {
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
    try {
        const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
            headers: { Authorization: `Basic ${auth}` }
        });
        req.authToken = response.data.access_token;
        next();
    } catch (error) {
        console.error("Daraja Auth Error Token Mismatch:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to authenticate with Safaricom Daraja" });
    }
}

// POST: /api/mpesa/stkpush
router.post('/stkpush', getOAuthToken, async (req, res) => {
    const { phone, amount } = req.body;
    
    // Format timestamp: YYYYMMDDHHmmss
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString('base64');
    
    const stkPayload = {
        BusinessShortCode: SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(amount),
        PartyA: phone, // Must be 2547XXXXXXXX
        PartyB: SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: "https://qhpzqtwzifgthwovkpwp.supabase.co/functions/v1/super-processor",
        AccountReference: "BahariFreshSeafood",
        TransactionDesc: "Payment for Fish Order"
    };

    try {
        const response = await axios.post(
            'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
            stkPayload,
            { headers: { Authorization: `Bearer ${req.authToken}` } }
        );
        res.status(200).json(response.data);
    } catch (error) {
        console.error("STK Push Request Fail:", error.response?.data || error.message);
        res.status(500).json({ error: error.response?.data?.customerMessage || "STK Push generation failed" });
    }
});

module.exports = router;