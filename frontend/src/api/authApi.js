import axiosClient from "./axiosClient";

export const registerUser = async (data) => {
    const response = await axiosClient.post("/auth/register", data);
    return response.data;
};

export const loginUser = async (data) => {
    const response = await axiosClient.post("/auth/login", data);
    return response.data;
};

export const getMe = async () => {
    const response = await axiosClient.get("/auth/me");
    return response.data;
};

export const changePassword = async (data) => {
    const response = await axiosClient.patch("/auth/change-password", data);
    return response.data;
};

export const forgotPassword = async (email) => {
    const response = await axiosClient.post("/auth/forgot-password", { email });
    return response.data;
};

export const resetPassword = async (data) => {
    const response = await axiosClient.post("/auth/reset-password", data);
    return response.data;
};

export const getUnassignedUsers = async () => {
    const response = await axiosClient.get("/auth/unassigned-users");
    return response.data;
};