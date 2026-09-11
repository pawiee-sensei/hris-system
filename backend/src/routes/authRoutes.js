const express = require("express");

const {
    registerController,
    loginController,
    meController,
    changePasswordControllerFn,
    resetPasswordControllerFn,
    forgotPasswordControllerFn,
    resetPasswordWithTokenControllerFn,
    getUnassignedUsersControllerFn
} = require("../controllers/authController");

const {
    registerValidation,
    loginValidation,
    changePasswordValidation,
    resetPasswordValidation,
    forgotPasswordValidation,
    resetPasswordWithTokenValidation
} = require("../middleware/validation/authValidation");

const handleValidationError = require("../middleware/handleValidationError");
const asyncHandler = require("../utils/asyncHandler");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const router = express.Router();

// POST /api/auth/register
router.post(
    "/register",
    registerValidation,
    handleValidationError,
    asyncHandler(registerController)
);

// POST /api/auth/login
router.post(
    "/login",
    loginValidation,
    handleValidationError,
    asyncHandler(loginController)
);

router.get("/me", authMiddleware, asyncHandler(meController));

// PATCH /api/auth/change-password
router.patch(
    "/change-password",
    authMiddleware,
    changePasswordValidation,
    handleValidationError,
    asyncHandler(changePasswordControllerFn)
);

// PATCH /api/auth/users/:id/reset-password
router.patch(
    "/users/:id/reset-password",
    authMiddleware,
    authorize("ADMIN", "HR"),
    resetPasswordValidation,
    handleValidationError,
    asyncHandler(resetPasswordControllerFn)
);
// POST /api/auth/forgot-password
router.post(
    "/forgot-password",
    forgotPasswordValidation,
    handleValidationError,
    asyncHandler(forgotPasswordControllerFn)
);

// POST /api/auth/reset-password
router.post(
    "/reset-password",
    resetPasswordWithTokenValidation,
    handleValidationError,
    asyncHandler(resetPasswordWithTokenControllerFn)
);

// GET /api/auth/unassigned-users
router.get(
    "/unassigned-users",
    authMiddleware,
    authorize("ADMIN", "HR"),
    asyncHandler(getUnassignedUsersControllerFn)
);

module.exports = router;