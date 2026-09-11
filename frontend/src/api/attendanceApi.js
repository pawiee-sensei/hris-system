import axiosClient from "./axiosClient";

export const clockIn = async () => {
    const response = await axiosClient.post("/attendance/clock-in");
    return response.data;
};

export const clockOut = async () => {
    const response = await axiosClient.post("/attendance/clock-out");
    return response.data;
};

export const getMyAttendance = async () => {
    const response = await axiosClient.get("/attendance/me");
    return response.data;
};

export const getMyAttendanceHistory = async (page = 1, limit = 8) => {
    const response = await axiosClient.get(`/attendance/me/history?page=${page}&limit=${limit}`);
    return response.data;
};