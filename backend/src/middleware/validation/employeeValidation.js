const { body } = require("express-validator");

const createEmployeeValidation = [
    body("userId").isInt({ min: 1 }).withMessage("Valid userId is required"),
    body("employeeNumber").trim().notEmpty().withMessage("Employee number is required"),
    body("firstName").trim().notEmpty().withMessage("First name is required"),
    body("lastName").trim().notEmpty().withMessage("Last name is required"),
    body("phone").optional({ checkFalsy: true }).isString(),
    body("birthDate").optional({ checkFalsy: true }).isDate().withMessage("Birth date must be a valid date"),
    body("departmentId").optional({ checkFalsy: true }).isInt({ min: 1 }).withMessage("departmentId must be a valid number"),
    body("position").optional({ checkFalsy: true }).isString(),
    body("dateHired").optional({ checkFalsy: true }).isDate().withMessage("Date hired must be a valid date")
];

const updateMyProfileValidation = [
    body("phone").optional({ checkFalsy: true }).isString(),
    body("birthDate").optional({ checkFalsy: true }).isDate().withMessage("Birth date must be a valid date")
];

const updateEmployeeValidation = [
    body("firstName").trim().notEmpty().withMessage("First name is required"),
    body("lastName").trim().notEmpty().withMessage("Last name is required"),
    body("phone").optional({ checkFalsy: true }).isString(),
    body("birthDate").optional({ checkFalsy: true }).isDate().withMessage("Birth date must be a valid date"),
    body("departmentId").optional({ checkFalsy: true }).isInt({ min: 1 }).withMessage("departmentId must be a valid number"),
    body("position").optional({ checkFalsy: true }).isString(),
    body("dateHired").optional({ checkFalsy: true }).isDate().withMessage("Date hired must be a valid date")
];

const updateEmploymentStatusValidation = [
    body("status")
        .isIn(["ACTIVE", "RESIGNED", "TERMINATED"])
        .withMessage("Status must be ACTIVE, RESIGNED, or TERMINATED")
];

module.exports = {
    createEmployeeValidation,
    updateMyProfileValidation,
    updateEmployeeValidation,
    updateEmploymentStatusValidation
};