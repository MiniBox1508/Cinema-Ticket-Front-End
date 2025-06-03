// db.js
const mysql = require('mysql');
require('dotenv').config();

// Tạo kết nối đến cơ sở dữ liệu MySQL với thông tin cấu hình
const db = mysql.createConnection({
    host: process.env.DB_HOST,        // Địa chỉ máy chủ
    user: process.env.DB_USERNAME,             // Tên đăng nhập MySQL (mặc định là 'root' trong XAMPP)
    password: process.env.DB_PASSWORD,             // Mật khẩu MySQL (để trống nếu sử dụng mặc định trong XAMPP)
    database: process.env.DB_DATABASE_NAME  // Tên cơ sở dữ liệu đã tạo
});

// Kết nối đến MySQL và kiểm tra lỗi
db.connect((err) => {
    if (err) throw err;
    console.log('Database connected!'); // Thông báo nếu kết nối thành công
});

module.exports = db; // Xuất kết nối để dùng trong các model
