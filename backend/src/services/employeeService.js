const {
    createEmployee,
    findAllEmployees,
    findEmployeeById
} = require("../models/employeeModel");

const AppError = require("../utils/AppError");

const createEmployeeService = async (data) => {
    const employeeId = await createEmployee(data);
    return { id: employeeId, ...data };
};

const getAllEmployeesService = async () => {
    return await findAllEmployees();
};

const getEmployeeByIdService = async (id) => {
    const employee = await findEmployeeById(id);

    if (!employee) {
        throw new AppError("Employee not found", 404);
    }

    return employee;
};

module.exports = {
    createEmployeeService,
    getAllEmployeesService,
    getEmployeeByIdService
};