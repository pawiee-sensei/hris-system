const express = require("express");

const {
    createEmployeeControllerFn,
    getAllEmployeesControllerFn,
    getEmployeeByIdControllerFn,
    getMyProfileControllerFn,
    updateMyProfileControllerFn,
    updateEmployeeControllerFn,
    updateEmploymentStatusControllerFn
} = require("../controllers/employeeController");

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");
const asyncHandler = require("../utils/asyncHandler");
const handleValidationError = require("../middleware/handleValidationError");
const {
    createEmployeeValidation,
    updateMyProfileValidation,
    updateEmployeeValidation,
    updateEmploymentStatusValidation
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

// PATCH /api/employees/:id
router.patch(
    "/:id",
    authMiddleware,
    authorize("ADMIN", "HR"),
    updateEmployeeValidation,
    handleValidationError,
    asyncHandler(updateEmployeeControllerFn)
);

// PATCH /api/employees/:id/status
router.patch(
    "/:id/status",
    authMiddleware,
    authorize("ADMIN", "HR"),
    updateEmploymentStatusValidation,
    handleValidationError,
    asyncHandler(updateEmploymentStatusControllerFn)
);

module.exports = router;