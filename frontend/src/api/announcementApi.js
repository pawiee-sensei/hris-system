import axiosClient from "./axiosClient";

export const createAnnouncement = async (data) => {
    const response = await axiosClient.post("/announcements", data);
    return response.data;
};

export const getAllAnnouncements = async () => {
    const response = await axiosClient.get("/announcements");
    return response.data;
};