const pool = require("../../config/db");

const clockIn = async ({ employeeId, date, timeIn, lateMinutes }) => {
    const [result] = await pool.execute(
        `
        INSERT INTO attendance (employee_id, date, time_in, late_minutes)
        VALUES (?, ?, ?, ?)
        `,
        [employeeId, date, timeIn, lateMinutes]
    );

    return result.insertId;
};

const clockOut = async ({ employeeId, date, timeOut, undertimeMinutes }) => {
    await pool.execute(
        `
        UPDATE attendance
        SET time_out = ?, undertime_minutes = ?
        WHERE employee_id = ? AND date = ?
        `,
        [timeOut, undertimeMinutes, employeeId, date]
    );
};

const findAttendanceByEmployeeAndDate = async (employeeId, date) => {
    const [rows] = await pool.execute(
        `
        SELECT * FROM attendance
        WHERE employee_id = ? AND date = ?
        `,
        [employeeId, date]
    );

    return rows[0];
};

const findAttendanceByEmployee = async (employeeId) => {
    const [rows] = await pool.execute(
        `
        SELECT * FROM attendance
        WHERE employee_id = ?
        ORDER BY date DESC
        `,
        [employeeId]
    );

    return rows;
};

module.exports = {
    clockIn,
    clockOut,
    findAttendanceByEmployeeAndDate,
    findAttendanceByEmployee
};