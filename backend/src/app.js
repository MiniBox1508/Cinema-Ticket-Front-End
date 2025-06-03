const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const movieRoutes = require('./routes/movieRoutes');
const theaterRoutes = require('./routes/theaterRoutes')
const userRoutes = require('./routes/userRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const roomRoutes = require('./routes/roomRoutes');
const seatRoutes = require('./routes/seatRoutes');
const showtimeRoutes = require('./routes/showtimeRoutes');
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const API_PREFIX = '/api/v1';
// Sử dụng các route đã định nghĩa
app.use(`${API_PREFIX}/movies`, movieRoutes);
app.use(`${API_PREFIX}/theater`, theaterRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/tickets`, ticketRoutes);
app.use(`${API_PREFIX}/rooms`, roomRoutes);
app.use(`${API_PREFIX}/seats`, seatRoutes);
app.use(`${API_PREFIX}/showtimes`, showtimeRoutes);
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/bookings`, bookingRoutes);
app.use(`${API_PREFIX}/payment`, paymentRoutes);

// Khởi động server trên cổng 3000 hoặc cổng được cấu hình trong biến môi trường
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); // In ra thông báo khi server bắt đầu chạy
});
