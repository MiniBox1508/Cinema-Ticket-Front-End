const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { blacklistedTokens } = require('../config/tokenBlackList');

// Đăng kí
exports.signup = async (req, res) => {
    const { name, email, phone, password } = req.body;

    try {
        // Kiểm tra dữ liệu đầu vào
        if (!name || !email || !phone || !password) {
            return res.status(400).json({ error: 'Name, email, phone number, and password are required' });
        }
        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters long' });
        }

        // Kiểm tra email và số điện thoại trùng lặp
        const duplicateCheckQuery = `
            SELECT * FROM Users 
            WHERE Email = ? OR Phone = ?
        `;
        db.query(duplicateCheckQuery, [email, phone], async (err, results) => {
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).json({ error: 'Database query error' });
            }

            if (results.length > 0) {
                // Phản hồi nếu email hoặc số điện thoại đã tồn tại
                const existingField = results[0].Email === email ? 'Email' : 'Phone number';
                return res.status(400).json({ error: `${existingField} already exists` });
            }

            // Mã hóa mật khẩu
            const hashedPassword = await bcrypt.hash(password, 12);
            const role = "customer";
            const status = "active";
            const createAt = new Date();

            // Thêm người dùng vào cơ sở dữ liệu
            const insertQuery = `
                INSERT INTO Users (Name, Password, Email, Phone, Role, CreateAt, Status) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            db.query(insertQuery, [name, hashedPassword, email, phone, role, createAt, status], (err, results) => {
                if (err) {
                    console.error('Database query error:', err);
                    return res.status(500).json({ error: 'Database query error' });
                }

                // Tạo token JWT
                const token = jwt.sign(
                    { userId: results.insertId },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );

                // Phản hồi thành công
                res.status(201).json({
                    success: true,
                    message: 'Registration successful',
                    token,
                    user: {
                        UserId: results.insertId,
                        Name: name,
                        Email: email,
                        Phone: phone,
                        Role: role,
                        Status: status,
                        CreateAt: createAt
                    }
                });
            });
        });
    } catch (error) {
        console.error('Error during sign-up:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Đăng nhập
exports.signin = async (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM Users WHERE Email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query error' });
        if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

        const user = results[0];

        if (user.Status !== 'active') return res.status(403).json({ error: 'User account is not active' });
        console.log("server check req.body: ", req.body);

        const validPassword = await bcrypt.compare(password, user.Password);
        if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

        const accessToken = jwt.sign(
            { userId: user.UserId, role: user.Role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION }
        );
        const refreshToken = jwt.sign(
            { userId: user.UserId },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_REFRESH_EXPIRATION }
        );
        res.json({ accessToken, refreshToken, user });
    });
};

// Đăng nhập chỉ dành cho admin
exports.adminSignin = async (req, res) => {
    const { email, password } = req.body;

    // Kiểm tra xem email và password có được cung cấp không
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    db.query('SELECT * FROM Users WHERE Email = ?', [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query error' });
        }

        // Kiểm tra xem người dùng có tồn tại không
        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = results[0];

        // Kiểm tra trạng thái tài khoản
        if (user.Status !== 'active') {
            return res.status(403).json({ error: 'User account is not active' });
        }

        // Kiểm tra role của tài khoản
        if (user.Role !== 'admin') {
            return res.status(403).json({ error: 'Only admin accounts can log in' });
        }

        // Kiểm tra mật khẩu
        const validPassword = await bcrypt.compare(password, user.Password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Tạo access token và refresh token
        const accessToken = jwt.sign(
            { userId: user.UserId, role: user.Role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION }
        );

        const refreshToken = jwt.sign(
            { userId: user.UserId },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_REFRESH_EXPIRATION }
        );

        res.json({ accessToken, refreshToken, user });
    });
};


// Đăng xuất
exports.signout = (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(400).json({ error: 'Token is required for logout' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
        blacklistedTokens.push(token);
        res.status(200).json({ message: 'Logged out successfully' });
    });
};

// Làm mới AccessToken
exports.refreshAccessToken = (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token is required' });
    }

    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Invalid or expired refresh token' });

        const accessToken = jwt.sign(
            { userId: decoded.userId, role: decoded.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION }
        );

        res.json({ accessToken });
    });
};