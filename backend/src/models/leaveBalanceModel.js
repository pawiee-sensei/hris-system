const pool = require("../../config/db");

const createLeaveBalance = async ({ employeeId, leaveType, totalCredits }) => {
    const [result] = await pool.execute(
        `
        INSERT INTO leave_balances (employee_id, leave_type, total_credits)
        VALUES (?, ?, ?)
        `,
        [employeeId, leaveType, totalCredits]
    );

    return result.insertId;
};

const findBalanceByEmployeeAndType = async (employeeId, leaveType) => {
    const [rows] = await pool.execute(
        `SELECT * FROM leave_balances WHERE employee_id = ? AND leave_type = ?`,
        [employeeId, leaveType]
    );

    return rows[0];
};

const findBalancesByEmployee = async (employeeId) => {
    const [rows] = await pool.execute(
        `SELECT * FROM leave_balances WHERE employee_id = ?`,
        [employeeId]
    );

    return rows;
};

const incrementUsedCredits = async (id, days) => {
    await pool.execute(
        `UPDATE leave_balances SET used_credits = used_credits + ? WHERE id = ?`,
        [days, id]
    );
};

module.exports = {
    createLeaveBalance,
    findBalanceByEmployeeAndType,
    findBalancesByEmployee,
    incrementUsedCredits
};