const {
    createEmployeeService,
    getAllEmployeesService,
    getEmployeeByIdService,
    getMyProfileService,
    updateMyProfileService
} = require("../services/employeeService");

const createEmployeeControllerFn = async (req, res) => {
    const employee = await createEmployeeService(req.body);

    res.status(201).json({
        success: true,
        message: "Employee created successfully",
        data: employee
    });
};

const getAllEmployeesControllerFn = async (req, res) => {
    const employees = await getAllEmployeesService();

    res.status(200).json({
        success: true,
        data: employees
    });
};

const getEmployeeByIdControllerFn = async (req, res) => {
    const employee = await getEmployeeByIdService(req.params.id);

    res.status(200).json({
        success: true,
        data: employee
    });
};

const getMyProfileControllerFn = async (req, res) => {
    const employee = await getMyProfileService(req.user.userId);

    res.status(200).json({
        success: true,
        data: employee
    });
};

const updateMyProfileControllerFn = async (req, res) => {
    const employee = await updateMyProfileService(req.user.userId, req.body);

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: employee
    });
};

module.exports = {
    createEmployeeControllerFn,
    getAllEmployeesControllerFn,
    getEmployeeByIdControllerFn,
    getMyProfileControllerFn,
    updateMyProfileControllerFn
};