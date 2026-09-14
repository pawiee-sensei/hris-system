const express = require("express");

const {
    createDepartmentControllerFn,
    getAllDepartmentsControllerFn,
    getDepartmentDetailsControllerFn,
    getAvailableEmployeesControllerFn,
    addMembersControllerFn,
    removeMemberControllerFn,
    setManagerControllerFn
} = require("../controllers/departmentController");

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");
const asyncHandler = require("../utils/asyncHandler");
const handleValidationError = require("../middleware/handleValidationError");
const {
    createDepartmentValidation,
    addMembersValidation,
    setManagerValidation
} = require("../middleware/validation/departmentValidation");

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

// GET /api/departments/:id
router.get(
    "/:id",
    authMiddleware,
    authorize("ADMIN", "HR"),
    asyncHandler(getDepartmentDetailsControllerFn)
);

// GET /api/departments/:id/available-employees
router.get(
    "/:id/available-employees",
    authMiddleware,
    authorize("ADMIN", "HR"),
    asyncHandler(getAvailableEmployeesControllerFn)
);

// POST /api/departments/:id/members
router.post(
    "/:id/members",
    authMiddleware,
    authorize("ADMIN", "HR"),
    addMembersValidation,
    handleValidationError,
    asyncHandler(addMembersControllerFn)
);

// DELETE /api/departments/:id/members/:employeeId
router.delete(
    "/:id/members/:employeeId",
    authMiddleware,
    authorize("ADMIN", "HR"),
    asyncHandler(removeMemberControllerFn)
);

// PATCH /api/departments/:id/manager
router.patch(
    "/:id/manager",
    authMiddleware,
    authorize("ADMIN", "HR"),
    setManagerValidation,
    handleValidationError,
    asyncHandler(setManagerControllerFn)
);

module.exports = router;