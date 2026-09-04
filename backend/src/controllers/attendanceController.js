const {
    clockInService,
    clockOutService,
    getMyAttendanceService
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

module.exports = {
    clockInControllerFn,
    clockOutControllerFn,
    getMyAttendanceControllerFn
};