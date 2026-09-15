const express = require("express");

const {
    grantLeaveBalanceControllerFn,
    getMyLeaveBalancesControllerFn,
    getEmployeeBalancesControllerFn,
    previewYearlyGenerationControllerFn,
    generateYearlyBalancesControllerFn,
    getGrantLogsForEmployeeControllerFn,
    getAllGrantLogsControllerFn
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

// GET /api/leave-balances/employee/:employeeId
router.get(
    "/employee/:employeeId",
    authMiddleware,
    authorize("ADMIN", "HR"),
    asyncHandler(getEmployeeBalancesControllerFn)
);

// GET /api/leave-balances/logs
router.get(
    "/logs",
    authMiddleware,
    authorize("ADMIN"),
    asyncHandler(getAllGrantLogsControllerFn)
);

// GET /api/leave-balances/employee/:employeeId/logs
router.get(
    "/employee/:employeeId/logs",
    authMiddleware,
    authorize("ADMIN", "HR"),
    asyncHandler(getGrantLogsForEmployeeControllerFn)
);

// GET /api/leave-balances/yearly-preview?year=2027
router.get(
    "/yearly-preview",
    authMiddleware,
    authorize("ADMIN"),
    asyncHandler(previewYearlyGenerationControllerFn)
);

// POST /api/leave-balances/generate-yearly
router.post(
    "/generate-yearly",
    authMiddleware,
    authorize("ADMIN"),
    asyncHandler(generateYearlyBalancesControllerFn)
);

module.exports = router;