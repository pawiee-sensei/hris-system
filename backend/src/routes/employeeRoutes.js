const express = require("express");

const {
    createEmployeeControllerFn,
    getAllEmployeesControllerFn,
    getEmployeeByIdControllerFn
} = require("../controllers/employeeController");

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

// POST /api/employees
router.post(
    "/",
    authMiddleware,
    authorize("ADMIN", "HR"),
    asyncHandler(createEmployeeControllerFn)
);

// GET /api/employees
router.get(
    "/",
    authMiddleware,
    authorize("ADMIN", "HR", "MANAGER"),
    asyncHandler(getAllEmployeesControllerFn)
);

// GET /api/employees/:id
router.get(
    "/:id",
    authMiddleware,
    authorize("ADMIN", "HR", "MANAGER"),
    asyncHandler(getEmployeeByIdControllerFn)
);

module.exports = router;