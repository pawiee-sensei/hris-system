const { body } = require("express-validator");

const createDepartmentValidation = [
    body("name").trim().notEmpty().withMessage("Department name is required")
];

const addMembersValidation = [
    body("employeeIds").isArray({ min: 1 }).withMessage("At least one employee must be selected"),
    body("employeeIds.*").isInt({ min: 1 }).withMessage("Invalid employee id")
];

const setManagerValidation = [
    body("managerId").optional({ checkFalsy: true }).isInt({ min: 1 }).withMessage("Invalid manager id")
];

module.exports = {
    createDepartmentValidation,
    addMembersValidation,
    setManagerValidation
};