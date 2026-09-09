import axiosClient from "./axiosClient";

export const fileLeave = async (data) => {
    const response = await axiosClient.post("/leave", data);
    return response.data;
};

export const getMyLeave = async () => {
    const response = await axiosClient.get("/leave/me");
    return response.data;
};

export const getAllLeave = async () => {
    const response = await axiosClient.get("/leave");
    return response.data;
};

export const reviewLeave = async (id, status) => {
    const response = await axiosClient.patch(`/leave/${id}/review`, { status });
    return response.data;
};