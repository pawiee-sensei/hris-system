const { body } = require("express-validator");

const createDepartmentValidation = [
    body("name").trim().notEmpty().withMessage("Department name is required")
];

module.exports = {
    createDepartmentValidation
};