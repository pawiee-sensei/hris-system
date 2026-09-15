import axiosClient from "./axiosClient";

export const grantLeaveBalance = async (data) => {
    const response = await axiosClient.post("/leave-balances", data);
    return response.data;
};

export const getMyLeaveBalances = async () => {
    const response = await axiosClient.get("/leave-balances/me");
    return response.data;
};

export const getEmployeeBalances = async (employeeId) => {
    const response = await axiosClient.get(`/leave-balances/employee/${employeeId}`);
    return response.data;
};

export const previewYearlyGeneration = async (year) => {
    const response = await axiosClient.get(`/leave-balances/yearly-preview${year ? `?year=${year}` : ""}`);
    return response.data;
};

export const generateYearlyBalances = async (year) => {
    const response = await axiosClient.post("/leave-balances/generate-yearly", { year });
    return response.data;
};

export const getAllGrantLogs = async () => {
    const response = await axiosClient.get("/leave-balances/logs");
    return response.data;
};

export const getEmployeeGrantLogs = async (employeeId) => {
    const response = await axiosClient.get(`/leave-balances/employee/${employeeId}/logs`);
    return response.data;
};