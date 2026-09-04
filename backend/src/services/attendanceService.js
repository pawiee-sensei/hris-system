const {
    clockIn,
    clockOut,
    findAttendanceByEmployeeAndDate,
    findAttendanceByEmployee
} = require("../models/attendanceModel");

const { findEmployeeByUserId } = require("../models/employeeModel");

const AppError = require("../utils/AppError");

const resolveEmployeeId = async (userId) => {
    const employee = await findEmployeeByUserId(userId);

    if (!employee) {
        throw new AppError("No employee profile linked to this account", 404);
    }

    return employee.id;
};

const clockInService = async (userId) => {
    const employeeId = await resolveEmployeeId(userId);
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date().toTimeString().slice(0, 8);

    const existing = await findAttendanceByEmployeeAndDate(employeeId, today);

    if (existing) {
        throw new AppError("Already clocked in today", 409);
    }

    const attendanceId = await clockIn({
        employeeId,
        date: today,
        timeIn: now
    });

    return { id: attendanceId, employeeId, date: today, timeIn: now };
};

const clockOutService = async (userId) => {
    const employeeId = await resolveEmployeeId(userId);
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date().toTimeString().slice(0, 8);

    const existing = await findAttendanceByEmployeeAndDate(employeeId, today);

    if (!existing) {
        throw new AppError("No clock-in record found for today", 404);
    }

    if (existing.time_out) {
        throw new AppError("Already clocked out today", 409);
    }

    await clockOut({ employeeId, date: today, timeOut: now });

    return { employeeId, date: today, timeOut: now };
};

const getMyAttendanceService = async (userId) => {
    const employeeId = await resolveEmployeeId(userId);
    return await findAttendanceByEmployee(employeeId);
};

module.exports = {
    clockInService,
    clockOutService,
    getMyAttendanceService
};