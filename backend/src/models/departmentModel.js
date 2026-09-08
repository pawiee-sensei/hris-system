const pool = require("../../config/db");

const createDepartment = async (name) => {
    const [result] = await pool.execute(
        `INSERT INTO departments (name) VALUES (?)`,
        [name]
    );

    return result.insertId;
};

const findAllDepartments = async () => {
    const [rows] = await pool.execute(
        `SELECT * FROM departments ORDER BY name ASC`
    );

    return rows;
};

const findDepartmentById = async (id) => {
    const [rows] = await pool.execute(
        `SELECT * FROM departments WHERE id = ?`,
        [id]
    );

    return rows[0];
};

module.exports = {
    createDepartment,
    findAllDepartments,
    findDepartmentById
};