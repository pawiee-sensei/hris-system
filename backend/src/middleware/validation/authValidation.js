const { body } = require("express-validator");

const registerValidation = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Valid email is required"),

    body("password")
        .isString()
        .withMessage("Password must be a string")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters")
];

const loginValidation = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Valid email is required"),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
];

const changePasswordValidation = [
    body("currentPassword")
        .notEmpty()
        .withMessage("Current password is required"),

    body("newPassword")
        .isString()
        .withMessage("New password must be a string")
        .isLength({ min: 8 })
        .withMessage("New password must be at least 8 characters")
];

const resetPasswordValidation = [
    body("newPassword")
        .isString()
        .withMessage("New password must be a string")
        .isLength({ min: 8 })
        .withMessage("New password must be at least 8 characters")
];

const forgotPasswordValidation = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Valid email is required")
];

const resetPasswordWithTokenValidation = [
    body("token")
        .notEmpty()
        .withMessage("Reset token is required"),

    body("newPassword")
        .isString()
        .withMessage("New password must be a string")
        .isLength({ min: 8 })
        .withMessage("New password must be at least 8 characters")
];

module.exports = {
    registerValidation,
    loginValidation,
    changePasswordValidation,
    resetPasswordValidation,
    forgotPasswordValidation,
    resetPasswordWithTokenValidation
};