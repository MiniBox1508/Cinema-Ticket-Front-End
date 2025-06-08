const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');

const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.getAll();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users', details: err });
    }
};

const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await UserModel.getById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user', details: err });
    }
};

const createUser = async (req, res) => {
    try {
        const { Name, Password, Email, Phone } = req.body;
        
        // Validate required fields
        if (!Name || !Password || !Email || !Phone) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                details: 'Name, Password, Email and Phone are required'
            });
        }

        console.log('Creating user with data:', { Name, Email, Phone }); // Debug log

        const hashedPassword = await bcrypt.hash(Password, 12);
        
        const result = await UserModel.create({ 
            Name, 
            Password: hashedPassword, // Use hashedPassword here
            Email, 
            Phone, 
            Role: 'user',
            CreateAt: new Date(),
            Status: 'active'
        });

        res.status(201).json({ 
            message: 'User created successfully',
            userId: result.UserId 
        });

    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ 
            error: 'Failed to create user',
            details: err.message 
        });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { Name, Password, Email, Phone, Role, CreateAt, Status } = req.body;
    const hashedPassword = await bcrypt.hash(Password, 12);

    try {
        const result = await UserModel.update(id, { Name, hashedPassword, Email, Phone, Role, CreateAt, Status });
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update user', details: err });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await UserModel.delete(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete user', details: err });
    }
};

const changePassword = async (req, res) => {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
        return res.status(400).json({ error: "New password is required." });
    }

    try {
        // Hash mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Cập nhật mật khẩu
        const result = await UserModel.updatePassword(id, hashedPassword);

        if (result.affectedRows === 0) {
            return res.status(400).json({ error: "Failed to update password." });
        }

        res.status(200).json({ message: "Password updated successfully." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error." });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    changePassword,
};
