const express = require("express");

const {
    createDepartmentControllerFn,
    getAllDepartmentsControllerFn
} = require("../controllers/departmentController");

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");
const asyncHandler = require("../utils/asyncHandler");
const handleValidationError = require("../middleware/handleValidationError");
const { createDepartmentValidation } = require("../middleware/validation/departmentValidation");

const router = express.Router();

// POST /api/departments
router.post(
    "/",
    authMiddleware,
    authorize("ADMIN", "HR"),
    createDepartmentValidation,
    handleValidationError,
    asyncHandler(createDepartmentControllerFn)
);

// GET /api/departments
router.get(
    "/",
    authMiddleware,
    asyncHandler(getAllDepartmentsControllerFn)
);

module.exports = router;