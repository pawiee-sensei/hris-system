const pool = require("../../config/db");

const findUserByEmail = async(email) => {
    const [rows] = await pool.execute(
        `
        SELECT
            id,
            email,
            password_hash,
            role,
            is_active,
            created_at,
            updated_at
        FROM users
        WHERE email = ?
        `,
        [email]
    );

    return rows[0];
};

const findUserById = async(id) => {
    const [rows] = await pool.execute(
        `
        SELECT
            id,
            email,
            password_hash,
            role,
            is_active,
            created_at,
            updated_at
        FROM users
        WHERE id = ?
        `,
        [id]
    );

    return rows[0];
};

const createUser = async ({ email, passwordHash, role = "EMPLOYEE" }) => {
    const [result] = await pool.execute(
        `
        INSERT INTO users (
            email,
            password_hash,
            role
        )
        VALUES (?, ?, ?)
        `,
        [email, passwordHash, role]
    );

    // result.insertId = users.id of the newly created user.
    return result.insertId;
};

module.exports = {
    findUserByEmail,
    findUserById,
    createUser
};

