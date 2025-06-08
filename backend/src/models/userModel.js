const { sql } = require('../config/db');

const UserModel = {
    // Lấy danh sách tất cả người dùng
    getAll: async () => {
        const result = await sql.query`SELECT * FROM Users`;
        return result.recordset;
    },

    // Lấy thông tin chi tiết một người dùng
    getById: async (id) => {
        const result = await sql.query`
            SELECT * FROM Users WHERE UserId = ${id}`;
        return result.recordset[0];
    },

    // Kiểm tra email tồn tại
    findByEmail: async (email) => {
        try {
            const pool = await sql.connect();
            const request = pool.request();
            request.input('email', sql.NVarChar, email);

            const result = await request.query(`
                SELECT * FROM Users WHERE Email = @email
            `);
            
            return result.recordset[0];
        } catch (err) {
            console.error('Error in findByEmail:', err);
            throw err;
        }
    },

    // Tạo tài khoản mới
    create: async (userData) => {
        try {
            const { Name, Password, Email, Phone, Role, Status } = userData;
            const result = await executeQuery(`
                INSERT INTO Users (Name, Password, Email, Phone, Role, CreateAt, Status)
                OUTPUT INSERTED.UserId
                VALUES (@name, @password, @email, @phone, @role, GETDATE(), @status)
            `, [
                { name: 'name', type: sql.NVarChar, value: Name },
                { name: 'password', type: sql.NVarChar, value: Password },
                { name: 'email', type: sql.NVarChar, value: Email },
                { name: 'phone', type: sql.NVarChar, value: Phone },
                { name: 'role', type: sql.NVarChar, value: Role },
                { name: 'status', type: sql.NVarChar, value: Status }
            ]);
            return result.recordset[0];
        } catch (err) {
            console.error('Error in create:', err);
            throw err;
        }
    },

    // Cập nhật thông tin người dùng
    update: async (id, user) => {
        const { Name, hashedPassword, Email, Phone, Role, CreateAt, Status } = user;
        const result = await sql.query`
            UPDATE Users 
            SET Name = ${Name},
                Password = ${hashedPassword},
                Email = ${Email},
                Phone = ${Phone},
                Role = ${Role},
                CreateAt = ${CreateAt},
                Status = ${Status}
            WHERE UserId = ${id}
        `;
        return result.rowsAffected[0] > 0;
    },

    // Cập nhật mật khẩu
    updatePassword: async (id, newPassword) => {
        const result = await sql.query`
            UPDATE Users 
            SET Password = ${newPassword}
            WHERE UserId = ${id}
        `;
        return result.rowsAffected[0] > 0;
    },

    // Xóa một người dùng
    delete: async (id) => {
        const result = await sql.query`
            DELETE FROM Users WHERE UserId = ${id}
        `;
        return result.rowsAffected[0] > 0;
    }
};

module.exports = UserModel;
