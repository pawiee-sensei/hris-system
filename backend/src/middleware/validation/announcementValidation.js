const { body } = require("express-validator");

const createAnnouncementValidation = [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("message").trim().notEmpty().withMessage("Message is required")
];

module.exports = {
    createAnnouncementValidation
};