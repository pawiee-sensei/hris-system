const pool = require("../../config/db");

const createDepartment = async (name) => {
    const [result] = await pool.execute(
        `INSERT INTO departments (name) VALUES (?)`,
        [name]
    );

    return result.insertId;
};

const findAllDepartmentsWithSummary = async () => {
    const [rows] = await pool.execute(
        `
        SELECT
            d.id,
            d.name,
            d.manager_id,
            CONCAT(m.first_name, ' ', m.last_name) AS manager_name,
            (SELECT COUNT(*) FROM employees e WHERE e.department_id = d.id) AS member_count
        FROM departments d
        LEFT JOIN employees m ON m.id = d.manager_id
        ORDER BY d.name ASC
        `
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

const findDepartmentWithDetails = async (id) => {
    const [rows] = await pool.execute(
        `
        SELECT
            d.id,
            d.name,
            d.manager_id,
            CONCAT(m.first_name, ' ', m.last_name) AS manager_name
        FROM departments d
        LEFT JOIN employees m ON m.id = d.manager_id
        WHERE d.id = ?
        `,
        [id]
    );

    return rows[0];
};

const findMembersByDepartment = async (departmentId) => {
    const [rows] = await pool.execute(
        `
        SELECT id, first_name, last_name, position
        FROM employees
        WHERE department_id = ?
        ORDER BY first_name ASC
        `,
        [departmentId]
    );

    return rows;
};

const findEmployeesForPicker = async (excludeDepartmentId) => {
    const [rows] = await pool.execute(
        `
        SELECT e.id, e.first_name, e.last_name, e.position, e.department_id, d.name AS department_name
        FROM employees e
        LEFT JOIN departments d ON d.id = e.department_id
        WHERE e.department_id IS NULL OR e.department_id != ?
        ORDER BY e.first_name ASC
        `,
        [excludeDepartmentId]
    );

    return rows;
};

const assignEmployeesToDepartment = async (employeeIds, departmentId) => {
    const placeholders = employeeIds.map(() => "?").join(",");
    await pool.execute(
        `UPDATE employees SET department_id = ? WHERE id IN (${placeholders})`,
        [departmentId, ...employeeIds]
    );
};

const removeEmployeeFromDepartment = async (employeeId) => {
    await pool.execute(
        `UPDATE employees SET department_id = NULL WHERE id = ?`,
        [employeeId]
    );
};

const setManager = async (departmentId, managerId) => {
    await pool.execute(
        `UPDATE departments SET manager_id = ? WHERE id = ?`,
        [managerId, departmentId]
    );
};

const clearManagerIfMatches = async (employeeId) => {
    await pool.execute(
        `UPDATE departments SET manager_id = NULL WHERE manager_id = ?`,
        [employeeId]
    );
};

module.exports = {
    createDepartment,
    findAllDepartmentsWithSummary,
    findDepartmentById,
    findDepartmentWithDetails,
    findMembersByDepartment,
    findEmployeesForPicker,
    assignEmployeesToDepartment,
    removeEmployeeFromDepartment,
    setManager,
    clearManagerIfMatches
};