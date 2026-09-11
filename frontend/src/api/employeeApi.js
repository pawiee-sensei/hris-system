import axiosClient from "./axiosClient";

export const createEmployee = async (data) => {
    const response = await axiosClient.post("/employees", data);
    return response.data;
};

export const getAllEmployees = async () => {
    const response = await axiosClient.get("/employees");
    return response.data;
};

export const getEmployeeById = async (id) => {
    const response = await axiosClient.get(`/employees/${id}`);
    return response.data;
};

export const getMyProfile = async () => {
    const response = await axiosClient.get("/employees/me");
    return response.data;
};

export const updateMyProfile = async (data) => {
    const response = await axiosClient.patch("/employees/me", data);
    return response.data;
};

export const updateEmployee = async (id, data) => {
    const response = await axiosClient.patch(`/employees/${id}`, data);
    return response.data;
};

export const updateEmploymentStatus = async (id, status) => {
    const response = await axiosClient.patch(`/employees/${id}/status`, { status });
    return response.data;
};