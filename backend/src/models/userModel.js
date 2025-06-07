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

    // Thêm một người dùng mới
    create: async (user) => {
        const { Name, hashedPassword, Email, Phone, Role, CreateAt, Status } = user;
        const result = await sql.query`
            INSERT INTO Users (Name, Password, Email, Phone, Role, CreateAt, Status)
            VALUES (${Name}, ${hashedPassword}, ${Email}, ${Phone}, ${Role}, ${CreateAt}, ${Status});
            SELECT SCOPE_IDENTITY() AS UserId;
        `;
        return result.recordset[0];
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
