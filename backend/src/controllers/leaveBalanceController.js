const {
    grantLeaveBalanceService,
    getMyLeaveBalancesService,
    previewYearlyGenerationService,
    generateYearlyBalancesService
} = require("../services/leaveBalanceService");

const { findEmployeeByUserId } = require("../models/employeeModel");

const grantLeaveBalanceControllerFn = async (req, res) => {
    const balance = await grantLeaveBalanceService(req.body);

    res.status(201).json({
        success: true,
        message: "Leave balance granted",
        data: balance
    });
};

const getMyLeaveBalancesControllerFn = async (req, res) => {
    const employee = await findEmployeeByUserId(req.user.userId);
    const balances = await getMyLeaveBalancesService(employee.id);

    res.status(200).json({
        success: true,
        data: balances
    });
};

const getEmployeeBalancesControllerFn = async (req, res) => {
    const balances = await getMyLeaveBalancesService(req.params.employeeId);

    res.status(200).json({
        success: true,
        data: balances
    });
};

const previewYearlyGenerationControllerFn = async (req, res) => {
    const result = await previewYearlyGenerationService(req.query.year);

    res.status(200).json({
        success: true,
        data: result
    });
};

const generateYearlyBalancesControllerFn = async (req, res) => {
    const result = await generateYearlyBalancesService(req.body.year);

    res.status(200).json({
        success: true,
        message: "Yearly leave balances generated",
        data: result
    });
};

module.exports = {
    grantLeaveBalanceControllerFn,
    getMyLeaveBalancesControllerFn,
    getEmployeeBalancesControllerFn,
    previewYearlyGenerationControllerFn,
    generateYearlyBalancesControllerFn
};