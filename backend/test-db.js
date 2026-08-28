const pool = require("./config/db");

const testDatabase = async () => {
    try {
        const [rows] = await pool.execute("SELECT 1 AS result");

        console.log("Database connected successfully.");
        console.log(rows);
    } catch (error) {
        console.error("Database connection failed:", error.message);
    } finally {
        await pool.end();
    }
};

testDatabase();