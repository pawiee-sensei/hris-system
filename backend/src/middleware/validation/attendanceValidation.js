const { body } = require("express-validator");

const clockInValidation = [
    // No body fields required — employeeId now comes from the token, not the request.
];

module.exports = {
    clockInValidation
};