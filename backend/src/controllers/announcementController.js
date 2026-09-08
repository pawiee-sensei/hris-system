const {
    createAnnouncementService,
    getAllAnnouncementsService
} = require("../services/announcementService");

const createAnnouncementControllerFn = async (req, res) => {
    const announcement = await createAnnouncementService({
        title: req.body.title,
        message: req.body.message,
        postedBy: req.user.userId
    });

    res.status(201).json({
        success: true,
        message: "Announcement posted",
        data: announcement
    });
};

const getAllAnnouncementsControllerFn = async (req, res) => {
    const announcements = await getAllAnnouncementsService();

    res.status(200).json({
        success: true,
        data: announcements
    });
};

module.exports = {
    createAnnouncementControllerFn,
    getAllAnnouncementsControllerFn
};