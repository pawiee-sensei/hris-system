const { body } = require("express-validator");

const fileLeaveValidation = [
    body("leaveType")
        .isIn(["SICK", "VACATION", "EMERGENCY"])
        .withMessage("Leave type must be SICK, VACATION, or EMERGENCY"),
    body("startDate").isDate().withMessage("Start date must be a valid date"),
    body("endDate").isDate().withMessage("End date must be a valid date"),
    body("reason").optional().isString().isLength({ max: 255 })
];

const reviewLeaveValidation = [
    body("status")
        .isIn(["APPROVED", "REJECTED"])
        .withMessage("Status must be APPROVED or REJECTED")
];

const grantLeaveBalanceValidation = [
    body("employeeId").isInt({ min: 1 }).withMessage("Valid employeeId is required"),
    body("leaveType")
        .isIn(["SICK", "VACATION", "EMERGENCY"])
        .withMessage("Leave type must be SICK, VACATION, or EMERGENCY"),
    body("totalCredits")
        .isInt({ min: 1, max: 365 })
        .withMessage("Total credits must be between 1 and 365")
];

module.exports = {
    fileLeaveValidation,
    reviewLeaveValidation,
    grantLeaveBalanceValidation
};