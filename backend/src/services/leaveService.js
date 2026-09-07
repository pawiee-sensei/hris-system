const {
    createLeaveRequest,
    findLeaveRequestsByEmployee,
    findLeaveRequestById,
    findAllLeaveRequests,
    updateLeaveStatus
} = require("../models/leaveModel");

const { findEmployeeByUserId } = require("../models/employeeModel");
const { deductLeaveBalanceService } = require("./leaveBalanceService");

const AppError = require("../utils/AppError");

const resolveEmployeeId = async (userId) => {
    const employee = await findEmployeeByUserId(userId);

    if (!employee) {
        throw new AppError("No employee profile linked to this account", 404);
    }

    return employee.id;
};

const fileLeaveRequestService = async (userId, { leaveType, startDate, endDate, reason }) => {
    const employeeId = await resolveEmployeeId(userId);

    if (new Date(startDate) > new Date(endDate)) {
        throw new AppError("Start date cannot be after end date", 400);
    }

    const id = await createLeaveRequest({ employeeId, leaveType, startDate, endDate, reason });

    return { id, employeeId, leaveType, startDate, endDate, reason, status: "PENDING" };
};

const getMyLeaveRequestsService = async (userId) => {
    const employeeId = await resolveEmployeeId(userId);
    return await findLeaveRequestsByEmployee(employeeId);
};

const getAllLeaveRequestsService = async () => {
    return await findAllLeaveRequests();
};

const countLeaveDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const oneDay = 1000 * 60 * 60 * 24;

    return Math.round((end - start) / oneDay) + 1;
};

const reviewLeaveRequestService = async ({ leaveId, status, approverUserId }) => {
    const leave = await findLeaveRequestById(leaveId);

    if (!leave) {
        throw new AppError("Leave request not found", 404);
    }

    if (leave.status !== "PENDING") {
        throw new AppError("This leave request has already been reviewed", 409);
    }

    if (status === "APPROVED") {
        const days = countLeaveDays(leave.start_date, leave.end_date);
        await deductLeaveBalanceService(leave.employee_id, leave.leave_type, days);
    }

    await updateLeaveStatus({ id: leaveId, status, approvedBy: approverUserId });

    return { id: leaveId, status, approvedBy: approverUserId };
};

module.exports = {
    fileLeaveRequestService,
    getMyLeaveRequestsService,
    getAllLeaveRequestsService,
    reviewLeaveRequestService
};