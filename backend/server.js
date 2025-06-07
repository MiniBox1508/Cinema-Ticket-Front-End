require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./src/config/db');

const app = express();

app.use(cors());
app.use(express.json());

// Connect to database
connectDB().catch(err => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
});

// Routes
app.use('/api/movies', require('./src/routes/movies'));
app.use('/api/users', require('./src/routes/userRoutes')); // Thêm route này
app.use('/api/theaters', require('./src/routes/theaterRoutes'));
app.use('/api/rooms', require('./src/routes/roomRoutes'));
app.use('/api/seats', require('./src/routes/seatRoutes'));
app.use('/api/bookings', require('./src/routes/bookingRoutes'));
app.use('/api/tickets', require('./src/routes/ticketRoutes'));
app.use('/api/payments', require('./src/routes/paymentRoutes'));
app.use('/api/showtimes', require('./src/routes/showtimeRoutes')); // Thêm route cho showtimes

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
