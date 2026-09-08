const {
    createEmployee,
    findAllEmployees,
    findEmployeeById,
    findEmployeeByUserId,
    updateOwnProfile
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

const getMyProfileService = async (userId) => {
    const employee = await findEmployeeByUserId(userId);

    if (!employee) {
        throw new AppError("No employee profile linked to this account", 404);
    }

    return employee;
};

const updateMyProfileService = async (userId, { phone, birthDate }) => {
    const employee = await findEmployeeByUserId(userId);

    if (!employee) {
        throw new AppError("No employee profile linked to this account", 404);
    }

    await updateOwnProfile(employee.id, { phone, birthDate });

    return { ...employee, phone, birth_date: birthDate };
};

module.exports = {
    createEmployeeService,
    getAllEmployeesService,
    getEmployeeByIdService,
    getMyProfileService,
    updateMyProfileService
};