// backend/models/mpesa.js
class MpesaTransaction {
    constructor(id, phone, amount, checkoutRequestID, status, createdAt) {
        this.id = id;
        this.phone = phone;
        this.amount = amount;
        this.checkoutRequestID = checkoutRequestID;
        this.status = status || 'Pending';
        this.createdAt = createdAt || new Date();
    }
}

module.exports = MpesaTransaction;