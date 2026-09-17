const {
    createLeaveBalance,
    findBalanceByEmployeeTypeYear,
    findBalancesByEmployeeYear,
    incrementUsedCredits,
    addToTotalCredits,
    findEmployeeIdsMissingYearBalance,
    createGrantLog,
    findGrantLogsByEmployee,
    findAllGrantLogs
} = require("../models/leaveBalanceModel");

const AppError = require("../utils/AppError");

// Default yearly leave policy — adjust these if the company's policy changes.
const DEFAULT_LEAVE_POLICY = {
    VACATION: 15,
    SICK: 10,
    EMERGENCY: 5
};

// Anomaly review thresholds — flags are for review, not automatic blocking.
const LARGE_GRANT_THRESHOLD = 15;
const VAGUE_REASON_MIN_LENGTH = 10;
const FREQUENT_GRANT_WINDOW_DAYS = 30;
const FREQUENT_GRANT_COUNT = 3;

const flagLog = (log, allLogsForEmployee) => {
    const reasons = [];

    if (log.credits_granted > LARGE_GRANT_THRESHOLD) {
        reasons.push(`Large grant (${log.credits_granted} days)`);
    }

    if (log.reason.trim().length < VAGUE_REASON_MIN_LENGTH) {
        reasons.push("Vague or very short reason");
    }

    const windowStart = new Date(log.created_at);
    windowStart.setDate(windowStart.getDate() - FREQUENT_GRANT_WINDOW_DAYS);

    const recentCount = allLogsForEmployee.filter((l) =>
        new Date(l.created_at) >= windowStart && new Date(l.created_at) <= new Date(log.created_at)
    ).length;

    if (recentCount >= FREQUENT_GRANT_COUNT) {
        reasons.push(`Frequent grants to this employee (${recentCount} within ${FREQUENT_GRANT_WINDOW_DAYS} days)`);
    }

    return { ...log, flagged: reasons.length > 0, flagReasons: reasons };
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
// Every manual grant requires who granted it and why — logged permanently, never overwritten.
const grantLeaveBalanceService = async ({ employeeId, leaveType, totalCredits, grantedBy, reason }) => {
    const year = getCurrentYear();
    const existing = await findBalanceByEmployeeTypeYear(employeeId, leaveType, year);

    if (existing) {
        await addToTotalCredits(existing.id, totalCredits);
        await createGrantLog({ employeeId, leaveType, year, creditsGranted: totalCredits, grantedBy, reason });

        return {
            employeeId, leaveType, year,
            totalCredits: existing.total_credits + Number(totalCredits),
            usedCredits: existing.used_credits,
            toppedUp: true
        };
    }

    const id = await createLeaveBalance({ employeeId, leaveType, year, totalCredits });
    await createGrantLog({ employeeId, leaveType, year, creditsGranted: totalCredits, grantedBy, reason });

    return { id, employeeId, leaveType, year, totalCredits, usedCredits: 0, toppedUp: false };
};

const getGrantLogsForEmployeeService = async (employeeId) => {
    const logs = await findGrantLogsByEmployee(employeeId);
    return logs.map((log) => flagLog(log, logs));
};

const getAllGrantLogsService = async () => {
    const logs = await findAllGrantLogs();

    // Group by employee so frequency-check only compares grants to the SAME person.
    const byEmployee = {};
    logs.forEach((log) => {
        if (!byEmployee[log.employee_id]) byEmployee[log.employee_id] = [];
        byEmployee[log.employee_id].push(log);
    });

    return logs.map((log) => flagLog(log, byEmployee[log.employee_id]));
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
    previewYearlyGenerationService,
    getGrantLogsForEmployeeService,
    getAllGrantLogsService
};