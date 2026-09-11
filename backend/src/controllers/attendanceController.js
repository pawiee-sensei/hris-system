const {
    clockInService,
    clockOutService,
    getMyAttendanceService,
    getMyAttendancePaginatedService
} = require("../services/attendanceService");

const clockInControllerFn = async (req, res) => {
    const attendance = await clockInService(req.user.userId);   

    res.status(201).json({
        success: true,
        message: "Clocked in successfully",
        data: attendance
    });
};

const clockOutControllerFn = async (req, res) => {
    const attendance = await clockOutService(req.user.userId);

    res.status(200).json({
        success: true,
        message: "Clocked out successfully",
        data: attendance
    });
};

const getMyAttendanceControllerFn = async (req, res) => {
    const records = await getMyAttendanceService(req.user.userId);

    res.status(200).json({
        success: true,
        data: records
    });
};

const getMyAttendancePaginatedControllerFn = async (req, res) => {
    const { page, limit } = req.query;
    const result = await getMyAttendancePaginatedService(req.user.userId, page, limit);

    res.status(200).json({
        success: true,
        data: result.records,
        pagination: result.pagination
    });
};

module.exports = {
    clockInControllerFn,
    clockOutControllerFn,
    getMyAttendanceControllerFn,
    getMyAttendancePaginatedControllerFn
};