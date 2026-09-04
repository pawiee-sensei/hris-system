const pool = require("../../config/db");

const clockIn = async ({ employeeId, date, timeIn }) => {
    const [result] = await pool.execute(
        `
        INSERT INTO attendance (employee_id, date, time_in)
        VALUES (?, ?, ?)
        `,
        [employeeId, date, timeIn]
    );

    return result.insertId;
};

const clockOut = async ({ employeeId, date, timeOut }) => {
    await pool.execute(
        `
        UPDATE attendance
        SET time_out = ?
        WHERE employee_id = ? AND date = ?
        `,
        [timeOut, employeeId, date]
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