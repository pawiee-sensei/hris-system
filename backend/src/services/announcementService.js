const {
    createAnnouncement,
    findAllAnnouncements
} = require("../models/announcementModel");

const createAnnouncementService = async ({ title, message, postedBy }) => {
    const id = await createAnnouncement({ title, message, postedBy });
    return { id, title, message, postedBy };
};

const getAllAnnouncementsService = async () => {
    return await findAllAnnouncements();
};

module.exports = {
    createAnnouncementService,
    getAllAnnouncementsService
};