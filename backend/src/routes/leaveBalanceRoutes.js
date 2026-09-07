const express = require("express");

const {
    grantLeaveBalanceControllerFn,
    getMyLeaveBalancesControllerFn
} = require("../controllers/leaveBalanceController");

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");
const asyncHandler = require("../utils/asyncHandler");
const handleValidationError = require("../middleware/handleValidationError");
const { grantLeaveBalanceValidation } = require("../middleware/validation/leaveValidation");

const router = express.Router();

// POST /api/leave-balances
router.post(
    "/",
    authMiddleware,
    authorize("ADMIN", "HR"),
    grantLeaveBalanceValidation,
    handleValidationError,
    asyncHandler(grantLeaveBalanceControllerFn)
);

// GET /api/leave-balances/me
router.get(
    "/me",
    authMiddleware,
    asyncHandler(getMyLeaveBalancesControllerFn)
);

module.exports = router;