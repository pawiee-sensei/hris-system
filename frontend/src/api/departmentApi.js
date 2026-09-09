import axiosClient from "./axiosClient";

export const createDepartment = async (name) => {
    const response = await axiosClient.post("/departments", { name });
    return response.data;
};

export const getAllDepartments = async () => {
    const response = await axiosClient.get("/departments");
    return response.data;
};