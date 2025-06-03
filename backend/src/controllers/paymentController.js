const PaymentModel = require('../models/paymentModel');

// Lấy danh sách tất cả các thanh toán
const getAllPayments = async (req, res) => {
    try {
        const payments = await PaymentModel.getAll();
        res.status(200).json(payments);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch payments', details: err });
    }
};

// Lấy thông tin thanh toán theo ID
const getPaymentById = async (req, res) => {
    const { id } = req.params;
    try {
        const payment = await PaymentModel.getById(id);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json(payment);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch payment', details: err });
    }
};

// Tạo mới một thanh toán
const createPayment = async (req, res) => {
    const { PaymentStatus, Amount, PaymentTime, PaymentMethod, UserId } = req.body;
    const payment = { PaymentStatus, Amount, PaymentTime, PaymentMethod, UserId };
    try {
        const result = await PaymentModel.create(payment);
        res.status(201).json({ message: 'Payment created successfully', paymentId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create payment', details: err });
    }
};

// Cập nhật thông tin thanh toán
const updatePayment = async (req, res) => {
    const { id } = req.params;
    const { PaymentStatus, Amount, PaymentTime, PaymentMethod, UserId } = req.body;
    const payment = { PaymentStatus, Amount, PaymentTime, PaymentMethod, UserId };
    try {
        const result = await PaymentModel.update(id, payment);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json({ message: 'Payment updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update payment', details: err });
    }
};

// Xóa một thanh toán
const deletePayment = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await PaymentModel.delete(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json({ message: 'Payment deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete payment', details: err });
    }
};

module.exports = {
    getAllPayments,
    getPaymentById,
    createPayment,
    updatePayment,
    deletePayment,
};
