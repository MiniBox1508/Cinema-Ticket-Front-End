const jwt = require('jsonwebtoken');
const { blacklistedTokens } = require('../config/tokenBlackList'); // Sử dụng danh sách token chung

// Middleware xác thực token
function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    // Kiểm tra token đã bị thu hồi
    if (blacklistedTokens.includes(token)) {
        return res.status(403).json({ error: 'Token has been revoked' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user; // Gắn thông tin user vào request
        next();
    });
}

// Middleware kiểm tra quyền
function authorizeRoles(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access forbidden: insufficient rights' });
        }
        next();
    };
}

module.exports = { authenticateToken, authorizeRoles };