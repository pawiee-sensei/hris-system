const { body } = require("express-validator");

const createEmployeeValidation = [
    body("userId").isInt({ min: 1 }).withMessage("Valid userId is required"),
    body("employeeNumber").trim().notEmpty().withMessage("Employee number is required"),
    body("firstName").trim().notEmpty().withMessage("First name is required"),
    body("lastName").trim().notEmpty().withMessage("Last name is required"),
    body("phone").optional().isString(),
    body("birthDate").optional().isDate().withMessage("Birth date must be a valid date"),
    body("departmentId").optional().isInt({ min: 1 }).withMessage("departmentId must be a valid number"),
    body("position").optional().isString(),
    body("dateHired").optional().isDate().withMessage("Date hired must be a valid date")
];

const updateMyProfileValidation = [
    body("phone").optional().isString(),
    body("birthDate").optional().isDate().withMessage("Birth date must be a valid date")
];

module.exports = {
    createEmployeeValidation,
    updateMyProfileValidation
};