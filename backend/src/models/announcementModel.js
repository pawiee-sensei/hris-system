const pool = require("../../config/db");

const createAnnouncement = async ({ title, message, postedBy }) => {
    const [result] = await pool.execute(
        `INSERT INTO announcements (title, message, posted_by) VALUES (?, ?, ?)`,
        [title, message, postedBy]
    );

    return result.insertId;
};

const findAllAnnouncements = async () => {
    const [rows] = await pool.execute(
        `SELECT * FROM announcements ORDER BY created_at DESC`
    );

    return rows;
};

module.exports = {
    createAnnouncement,
    findAllAnnouncements
};