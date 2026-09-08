const pool = require("../../config/db");

const createEmployee = async ({
    userId,
    employeeNumber,
    firstName,
    lastName,
    phone,
    birthDate,
    departmentId,
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
            department_id,
            position,
            date_hired
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [userId, employeeNumber, firstName, lastName, phone, birthDate, departmentId, position, dateHired]
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

const updateOwnProfile = async (id, { phone, birthDate }) => {
    await pool.execute(
        `UPDATE employees SET phone = ?, birth_date = ? WHERE id = ?`,
        [phone, birthDate, id]
    );
};

module.exports = {
    createEmployee,
    findAllEmployees,
    findEmployeeById,
    findEmployeeByUserId,
    updateOwnProfile
};