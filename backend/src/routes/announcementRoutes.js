const express = require("express");

const {
    createAnnouncementControllerFn,
    getAllAnnouncementsControllerFn
} = require("../controllers/announcementController");

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");
const asyncHandler = require("../utils/asyncHandler");
const handleValidationError = require("../middleware/handleValidationError");
const { createAnnouncementValidation } = require("../middleware/validation/announcementValidation");

const router = express.Router();

// POST /api/announcements
router.post(
    "/",
    authMiddleware,
    authorize("ADMIN", "HR"),
    createAnnouncementValidation,
    handleValidationError,
    asyncHandler(createAnnouncementControllerFn)
);

// GET /api/announcements
router.get(
    "/",
    authMiddleware,
    asyncHandler(getAllAnnouncementsControllerFn)
);

module.exports = router;