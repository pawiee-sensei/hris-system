const pool = require("../../config/db");

const createLeaveRequest = async ({ employeeId, leaveType, startDate, endDate, reason }) => {
    const [result] = await pool.execute(
        `
        INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, reason)
        VALUES (?, ?, ?, ?, ?)
        `,
        [employeeId, leaveType, startDate, endDate, reason]
    );

    return result.insertId;
};


const findLeaveRequestsByEmployee = async (employeeId) => {
    const [rows] = await pool.execute(
        `SELECT * FROM leave_requests WHERE employee_id = ? ORDER BY created_at DESC`,
        [employeeId]
    );

    return rows;
};

const findLeaveRequestById = async (id) => {
    const [rows] = await pool.execute(
        `SELECT * FROM leave_requests WHERE id = ?`,
        [id]
    );

    return rows[0];
};

const findAllLeaveRequests = async () => {
    const [rows] = await pool.execute(
        `SELECT * FROM leave_requests ORDER BY created_at DESC`
    );

    return rows;
};

const updateLeaveStatus = async ({ id, status, approvedBy }) => {
    await pool.execute(
        `UPDATE leave_requests SET status = ?, approved_by = ? WHERE id = ?`,
        [status, approvedBy, id]
    );
};

module.exports = {
    createLeaveRequest,
    findLeaveRequestsByEmployee,
    findLeaveRequestById,
    findAllLeaveRequests,
    updateLeaveStatus
};