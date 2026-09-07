const {
    createLeaveBalance,
    findBalanceByEmployeeAndType,
    findBalancesByEmployee,
    incrementUsedCredits
} = require("../models/leaveBalanceModel");

const AppError = require("../utils/AppError");

const grantLeaveBalanceService = async ({ employeeId, leaveType, totalCredits }) => {
    const existing = await findBalanceByEmployeeAndType(employeeId, leaveType);

    if (existing) {
        throw new AppError("Balance already exists for this leave type", 409);
    }

    const id = await createLeaveBalance({ employeeId, leaveType, totalCredits });
    return { id, employeeId, leaveType, totalCredits, usedCredits: 0 };
};

const getMyLeaveBalancesService = async (employeeId) => {
    return await findBalancesByEmployee(employeeId);
};

const deductLeaveBalanceService = async (employeeId, leaveType, days) => {
    const balance = await findBalanceByEmployeeAndType(employeeId, leaveType);

    if (!balance) {
        throw new AppError("No leave balance found for this leave type", 404);
    }

    const remaining = balance.total_credits - balance.used_credits;

    if (remaining < days) {
        throw new AppError("Insufficient leave balance", 400);
    }

    await incrementUsedCredits(balance.id, days);
};

module.exports = {
    grantLeaveBalanceService,
    getMyLeaveBalancesService,
    deductLeaveBalanceService
};