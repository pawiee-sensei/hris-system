const pool = require("../../config/db");

const createLeaveBalance = async ({ employeeId, leaveType, year, totalCredits }) => {
    const [result] = await pool.execute(
        `
        INSERT INTO leave_balances (employee_id, leave_type, year, total_credits)
        VALUES (?, ?, ?, ?)
        `,
        [employeeId, leaveType, year, totalCredits]
    );

    return result.insertId;
};

const findBalanceByEmployeeTypeYear = async (employeeId, leaveType, year) => {
    const [rows] = await pool.execute(
        `SELECT * FROM leave_balances WHERE employee_id = ? AND leave_type = ? AND year = ?`,
        [employeeId, leaveType, year]
    );

    return rows[0];
};

const findBalancesByEmployeeYear = async (employeeId, year) => {
    const [rows] = await pool.execute(
        `SELECT * FROM leave_balances WHERE employee_id = ? AND year = ?`,
        [employeeId, year]
    );

    return rows;
};

const incrementUsedCredits = async (id, days) => {
    await pool.execute(
        `UPDATE leave_balances SET used_credits = used_credits + ? WHERE id = ?`,
        [days, id]
    );
};

const addToTotalCredits = async (id, days) => {
    await pool.execute(
        `UPDATE leave_balances SET total_credits = total_credits + ? WHERE id = ?`,
        [days, id]
    );
};

const findEmployeeIdsMissingYearBalance = async (year, leaveType) => {
    const [rows] = await pool.execute(
        `
        SELECT e.id
        FROM employees e
        WHERE e.employment_status = 'ACTIVE'
        AND e.id NOT IN (
            SELECT employee_id FROM leave_balances WHERE leave_type = ? AND year = ?
        )
        `,
        [leaveType, year]
    );

    return rows.map((r) => r.id);
};

const createGrantLog = async ({ employeeId, leaveType, year, creditsGranted, grantedBy, reason }) => {
    const [result] = await pool.execute(
        `
        INSERT INTO leave_balance_grants (employee_id, leave_type, year, credits_granted, granted_by, reason)
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [employeeId, leaveType, year, creditsGranted, grantedBy, reason]
    );

    return result.insertId;
};

const findGrantLogsByEmployee = async (employeeId) => {
    const [rows] = await pool.execute(
        `
        SELECT g.*, u.email AS granted_by_email
        FROM leave_balance_grants g
        JOIN users u ON u.id = g.granted_by
        WHERE g.employee_id = ?
        ORDER BY g.created_at DESC
        `,
        [employeeId]
    );

    return rows;
};

const findAllGrantLogs = async () => {
    const [rows] = await pool.execute(
        `
        SELECT g.*, u.email AS granted_by_email, CONCAT(e.first_name, ' ', e.last_name) AS employee_name
        FROM leave_balance_grants g
        JOIN users u ON u.id = g.granted_by
        JOIN employees e ON e.id = g.employee_id
        ORDER BY g.created_at DESC
        `
    );

    return rows;
};

module.exports = {
    createLeaveBalance,
    findBalanceByEmployeeTypeYear,
    findBalancesByEmployeeYear,
    incrementUsedCredits,
    addToTotalCredits,
    findEmployeeIdsMissingYearBalance,
    createGrantLog,
    findGrantLogsByEmployee,
    findAllGrantLogs
};