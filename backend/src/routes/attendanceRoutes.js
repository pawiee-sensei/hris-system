const express = require("express");

const {
    clockInControllerFn,
    clockOutControllerFn,
    getMyAttendanceControllerFn,
    getMyAttendancePaginatedControllerFn
} = require("../controllers/attendanceController");

const authMiddleware = require("../middleware/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

// POST /api/attendance/clock-in
router.post(
    "/clock-in",
    authMiddleware,
    asyncHandler(clockInControllerFn)
);

// POST /api/attendance/clock-out
router.post(
    "/clock-out",
    authMiddleware,
    asyncHandler(clockOutControllerFn)
);

// GET /api/attendance/me
router.get(
    "/me",
    authMiddleware,
    asyncHandler(getMyAttendanceControllerFn)
);

// GET /api/attendance/me/history?page=1&limit=8
router.get(
    "/me/history",
    authMiddleware,
    asyncHandler(getMyAttendancePaginatedControllerFn)
);

module.exports = router;