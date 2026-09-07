const {
    grantLeaveBalanceService,
    getMyLeaveBalancesService
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

module.exports = {
    grantLeaveBalanceControllerFn,
    getMyLeaveBalancesControllerFn
};