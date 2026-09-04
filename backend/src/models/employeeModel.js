const pool = require("../../config/db");

const createEmployee = async ({
    userId,
    employeeNumber,
    firstName,
    lastName,
    phone,
    birthDate,
    department,
    position,
    dateHired
}) => {
    const [result] = await pool.execute(
        `
        INSERT INTO employees (
            user_id,
            employee_number,
            first_name,
            last_name,
            phone,
            birth_date,
            department,
            position,
            date_hired
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [userId, employeeNumber, firstName, lastName, phone, birthDate, department, position, dateHired]
    );

    return result.insertId;
};

const findAllEmployees = async () => {
    const [rows] = await pool.execute(
        `SELECT * FROM employees ORDER BY created_at DESC`
    );

    return rows;
};

const findEmployeeById = async (id) => {
    const [rows] = await pool.execute(
        `SELECT * FROM employees WHERE id = ?`,
        [id]
    );

    return rows[0];
};

const findEmployeeByUserId = async (userId) => {
    const [rows] = await pool.execute(
        `SELECT * FROM employees WHERE user_id = ?`,
        [userId]
    );

    return rows[0];
};

module.exports = {
    createEmployee,
    findAllEmployees,
    findEmployeeById,
    findEmployeeByUserId
};