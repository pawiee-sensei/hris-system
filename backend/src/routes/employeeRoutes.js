const express = require("express");

const {
    createEmployeeControllerFn,
    getAllEmployeesControllerFn,
    getEmployeeByIdControllerFn,
    getMyProfileControllerFn,
    updateMyProfileControllerFn
} = require("../controllers/employeeController");

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");
const asyncHandler = require("../utils/asyncHandler");
const handleValidationError = require("../middleware/handleValidationError");
const {
    createEmployeeValidation,
    updateMyProfileValidation
} = require("../middleware/validation/employeeValidation");

const router = express.Router();

// POST /api/employees
router.post(
    "/",
    authMiddleware,
    authorize("ADMIN", "HR"),
    createEmployeeValidation,
    handleValidationError,
    asyncHandler(createEmployeeControllerFn)
);

// GET /api/employees
router.get(
    "/",
    authMiddleware,
    authorize("ADMIN", "HR", "MANAGER"),
    asyncHandler(getAllEmployeesControllerFn)
);

// GET /api/employees/me
router.get(
    "/me",
    authMiddleware,
    asyncHandler(getMyProfileControllerFn)
);

// PATCH /api/employees/me
router.patch(
    "/me",
    authMiddleware,
    updateMyProfileValidation,
    handleValidationError,
    asyncHandler(updateMyProfileControllerFn)
);

// GET /api/employees/:id
router.get(
    "/:id",
    authMiddleware,
    authorize("ADMIN", "HR", "MANAGER"),
    asyncHandler(getEmployeeByIdControllerFn)
);

module.exports = router;