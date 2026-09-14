import axiosClient from "./axiosClient";

export const createDepartment = async (name) => {
    const response = await axiosClient.post("/departments", { name });
    return response.data;
};

export const getAllDepartments = async () => {
    const response = await axiosClient.get("/departments");
    return response.data;
};

export const getDepartmentDetails = async (id) => {
    const response = await axiosClient.get(`/departments/${id}`);
    return response.data;
};

export const getAvailableEmployees = async (id) => {
    const response = await axiosClient.get(`/departments/${id}/available-employees`);
    return response.data;
};

export const addMembersToDepartment = async (id, employeeIds) => {
    const response = await axiosClient.post(`/departments/${id}/members`, { employeeIds });
    return response.data;
};

export const removeMemberFromDepartment = async (id, employeeId) => {
    const response = await axiosClient.delete(`/departments/${id}/members/${employeeId}`);
    return response.data;
};

export const setDepartmentManager = async (id, managerId) => {
    const response = await axiosClient.patch(`/departments/${id}/manager`, { managerId });
    return response.data;
};