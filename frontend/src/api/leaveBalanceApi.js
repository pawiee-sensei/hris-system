import axiosClient from "./axiosClient";

export const grantLeaveBalance = async (data) => {
    const response = await axiosClient.post("/leave-balances", data);
    return response.data;
};

export const getMyLeaveBalances = async () => {
    const response = await axiosClient.get("/leave-balances/me");
    return response.data;
};