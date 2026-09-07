const express = require("express");

const {
    fileLeaveControllerFn,
    getMyLeaveControllerFn,
    getAllLeaveControllerFn,
    reviewLeaveControllerFn
} = require("../controllers/leaveController");

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

// POST /api/leave
router.post(
    "/",
    authMiddleware,
    asyncHandler(fileLeaveControllerFn)
);

// GET /api/leave/me
router.get(
    "/me",
    authMiddleware,
    asyncHandler(getMyLeaveControllerFn)
);

// GET /api/leave
router.get(
    "/",
    authMiddleware,
    authorize("ADMIN", "HR"),
    asyncHandler(getAllLeaveControllerFn)
);

// PATCH /api/leave/:id/review
router.patch(
    "/:id/review",
    authMiddleware,
    authorize("ADMIN", "HR"),
    asyncHandler(reviewLeaveControllerFn)
);

module.exports = router;