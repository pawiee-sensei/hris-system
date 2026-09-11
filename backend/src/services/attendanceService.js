const {
    clockIn,
    clockOut,
    findAttendanceByEmployeeAndDate,
    findAttendanceByEmployee,
    findAttendanceByEmployeePaginated,
    countAttendanceByEmployee
} = require("../models/attendanceModel");

const { findEmployeeByUserId } = require("../models/employeeModel");

const AppError = require("../utils/AppError");

// Fixed company shift — adjust these two values if the shift ever changes.
const SHIFT_START = "09:00:00";
const SHIFT_END = "18:00:00";

const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
};

const calculateLateMinutes = (timeIn) => {
    const diff = timeToMinutes(timeIn) - timeToMinutes(SHIFT_START);
    return diff > 0 ? diff : 0;
};

const calculateUndertimeMinutes = (timeOut) => {
    const diff = timeToMinutes(SHIFT_END) - timeToMinutes(timeOut);
    return diff > 0 ? diff : 0;
};

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

    const lateMinutes = calculateLateMinutes(now);

    const attendanceId = await clockIn({
        employeeId,
        date: today,
        timeIn: now,
        lateMinutes
    });

    return { id: attendanceId, employeeId, date: today, timeIn: now, lateMinutes };
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

    const undertimeMinutes = calculateUndertimeMinutes(now);

    await clockOut({ employeeId, date: today, timeOut: now, undertimeMinutes });

    return { employeeId, date: today, timeOut: now, undertimeMinutes };
};

const getMyAttendanceService = async (userId) => {
    const employeeId = await resolveEmployeeId(userId);
    return await findAttendanceByEmployee(employeeId);
};

const getMyAttendancePaginatedService = async (userId, page = 1, limit = 8) => {
    const employeeId = await resolveEmployeeId(userId);

    const offset = (page - 1) * limit;

    const records = await findAttendanceByEmployeePaginated(employeeId, limit, offset);
    const total = await countAttendanceByEmployee(employeeId);

    return {
        records,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};

module.exports = {
    clockInService,
    clockOutService,
    getMyAttendanceService,
    getMyAttendancePaginatedService
};