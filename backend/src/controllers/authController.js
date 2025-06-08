const { sql } = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const signup = async (req, res) => {
    try {
        const { Name, Email, Phone, Password } = req.body;
        
        // Hash password
        const hashedPassword = await bcrypt.hash(Password, 12);

        // Create user
        const result = await UserModel.create({
            Name,
            Email,
            Phone,
            Password: hashedPassword,
            Role: 'user',
            CreateAt: new Date(),
            Status: 'active'
        });

        res.status(201).json({
            message: 'User created successfully',
            userId: result.UserId
        });

    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: err.message });
    }
};

const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt:', { email, password });

        // Find user
        const user = await UserModel.findByEmail(email);
        console.log('Found user:', user);

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Kiểm tra trực tiếp mật khẩu vì data chưa được hash
        const validPassword = password === user.Password;
        console.log('Password valid:', validPassword);

        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate token
        const accessToken = jwt.sign(
            { userId: user.UserId },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1h' }
        );

        res.json({
            accessToken,
            user: {
                userId: user.UserId,
                name: user.Name,
                email: user.Email,
                role: user.Role
            }
        });

    } catch (err) {
        console.error('Signin error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    signin,
    signup,
};