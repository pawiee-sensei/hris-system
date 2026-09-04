const express = require("express");

const {
    registerController,
    loginController,
    meController
} = require("../controllers/authController");

const {
    registerValidation,
    loginValidation
} = require("../middleware/validation/authValidation");

const handleValidationError = require("../middleware/handleValidationError");
const asyncHandler = require("../utils/asyncHandler");
const authMiddleware = require("../middleware/authMiddleware");

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

module.exports = router;