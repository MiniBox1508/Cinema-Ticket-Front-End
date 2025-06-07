const sql = require('mssql');

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
};

async function connectDB() {
    try {
        const pool = await sql.connect(config);
        console.log('Connected to SQL Server');
        return pool;
    } catch (err) {
        console.error('Database Connection Failed! Bad Config: ', err);
        throw err;
    }
}

module.exports = {
    sql,
    connectDB
};
