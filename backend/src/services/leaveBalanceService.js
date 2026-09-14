const {
    createLeaveBalance,
    findBalanceByEmployeeTypeYear,
    findBalancesByEmployeeYear,
    incrementUsedCredits,
    addToTotalCredits,
    findEmployeeIdsMissingYearBalance
} = require("../models/leaveBalanceModel");

const AppError = require("../utils/AppError");

// Default yearly leave policy — adjust these if the company's policy changes.
const DEFAULT_LEAVE_POLICY = {
    VACATION: 15,
    SICK: 10,
    EMERGENCY: 5
};

const getCurrentYear = () => new Date().getFullYear();

// Called automatically when a new employee is created.
const grantDefaultBalancesForEmployee = async (employeeId) => {
    const year = getCurrentYear();

    for (const [leaveType, totalCredits] of Object.entries(DEFAULT_LEAVE_POLICY)) {
        await createLeaveBalance({ employeeId, leaveType, year, totalCredits });
    }
};

// Manual grant — tops up if a balance already exists for this year, creates one if not.
const grantLeaveBalanceService = async ({ employeeId, leaveType, totalCredits }) => {
    const year = getCurrentYear();
    const existing = await findBalanceByEmployeeTypeYear(employeeId, leaveType, year);

    if (existing) {
        await addToTotalCredits(existing.id, totalCredits);
        return {
            employeeId, leaveType, year,
            totalCredits: existing.total_credits + Number(totalCredits),
            usedCredits: existing.used_credits,
            toppedUp: true
        };
    }

    const id = await createLeaveBalance({ employeeId, leaveType, year, totalCredits });
    return { id, employeeId, leaveType, year, totalCredits, usedCredits: 0, toppedUp: false };
};

const getMyLeaveBalancesService = async (employeeId) => {
    return await findBalancesByEmployeeYear(employeeId, getCurrentYear());
};

const deductLeaveBalanceService = async (employeeId, leaveType, days) => {
    const year = getCurrentYear();
    const balance = await findBalanceByEmployeeTypeYear(employeeId, leaveType, year);

    if (!balance) {
        throw new AppError("No leave balance found for this leave type this year", 404);
    }

    const remaining = balance.total_credits - balance.used_credits;

    if (remaining < days) {
        throw new AppError("Insufficient leave balance", 400);
    }

    await incrementUsedCredits(balance.id, days);
};

// Admin-triggered: generate this year's default balances for every employee missing them.
const generateYearlyBalancesService = async (year) => {
    const targetYear = year || getCurrentYear();
    const results = {};

    for (const [leaveType, totalCredits] of Object.entries(DEFAULT_LEAVE_POLICY)) {
        const missingIds = await findEmployeeIdsMissingYearBalance(targetYear, leaveType);

        for (const employeeId of missingIds) {
            await createLeaveBalance({ employeeId, leaveType, year: targetYear, totalCredits });
        }

        results[leaveType] = missingIds.length;
    }

    return { year: targetYear, created: results };
};

const previewYearlyGenerationService = async (year) => {
    const targetYear = year || getCurrentYear();
    const preview = {};

    for (const leaveType of Object.keys(DEFAULT_LEAVE_POLICY)) {
        const missingIds = await findEmployeeIdsMissingYearBalance(targetYear, leaveType);
        preview[leaveType] = missingIds.length;
    }

    return { year: targetYear, affectedCounts: preview };
};

module.exports = {
    grantDefaultBalancesForEmployee,
    grantLeaveBalanceService,
    getMyLeaveBalancesService,
    deductLeaveBalanceService,
    generateYearlyBalancesService,
    previewYearlyGenerationService
};