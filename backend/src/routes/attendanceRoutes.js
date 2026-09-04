const express = require("express");

const {
    clockInControllerFn,
    clockOutControllerFn,
    getMyAttendanceControllerFn
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

module.exports = router;