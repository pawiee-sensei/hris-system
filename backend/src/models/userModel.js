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

const updatePasswordHash = async (id, passwordHash) => {
    await pool.execute(
        `UPDATE users SET password_hash = ? WHERE id = ?`,
        [passwordHash, id]
    );
};

const updateResetToken = async (id, token, expiresAt) => {
    await pool.execute(
        `UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?`,
        [token, expiresAt, id]
    );
};

const findUserByResetToken = async (token) => {
    const [rows] = await pool.execute(
        `
        SELECT id, email, reset_token_expires
        FROM users
        WHERE reset_token = ?
        `,
        [token]
    );

    return rows[0];
};

const clearResetToken = async (id) => {
    await pool.execute(
        `UPDATE users SET reset_token = NULL, reset_token_expires = NULL WHERE id = ?`,
        [id]
    );
};

module.exports = {
    findUserByEmail,
    findUserById,
    createUser,
    updatePasswordHash,
    updateResetToken,
    findUserByResetToken,
    clearResetToken
};

