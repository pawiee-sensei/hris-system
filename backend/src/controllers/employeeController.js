const {
    createEmployeeService,
    getAllEmployeesService,
    getEmployeeByIdService
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

module.exports = {
    createEmployeeControllerFn,
    getAllEmployeesControllerFn,
    getEmployeeByIdControllerFn
};