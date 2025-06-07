const express = require('express');
const router = express.Router();
const { sql } = require('../config/db');

// GET tất cả phim
router.get('/', async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM Movies`;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET phim theo ID
router.get('/:id', async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM Movies WHERE MovieID = ${req.params.id}`;
        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.status(404).json({ message: 'Không tìm thấy phim' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST thêm phim mới
router.post('/', async (req, res) => {
    const { title, description, duration } = req.body;
    try {
        const result = await sql.query`
            INSERT INTO Movies (Title, Description, Duration)
            VALUES (${title}, ${description}, ${duration});
            SELECT SCOPE_IDENTITY() AS MovieID;
        `;
        res.status(201).json({ id: result.recordset[0].MovieID, message: 'Thêm phim thành công' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
