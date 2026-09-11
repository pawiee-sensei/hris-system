const {
    createEmployee,
    findAllEmployees,
    findEmployeeById,
    findEmployeeByUserId,
    updateOwnProfile,
    updateEmployee,
    updateEmploymentStatus
} = require("../models/employeeModel");

const AppError = require("../utils/AppError");

const createEmployeeService = async (data) => {
    try {
        const employeeId = await createEmployee(data);
        return { id: employeeId, ...data };
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            if (err.sqlMessage.includes("employee_number")) {
                throw new AppError("This employee number is already in use", 409);
            }
            if (err.sqlMessage.includes("user_id")) {
                throw new AppError("This account is already linked to an employee", 409);
            }
            throw new AppError("A duplicate entry already exists", 409);
        }
        if (err.code === "ER_NO_REFERENCED_ROW_2") {
            throw new AppError("Selected department does not exist", 400);
        }
        throw err;
    }
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

const updateEmployeeService = async (id, data) => {
    const employee = await findEmployeeById(id);

    if (!employee) {
        throw new AppError("Employee not found", 404);
    }

    await updateEmployee(id, data);

    return { id, ...data };
};

const updateEmploymentStatusService = async (id, status) => {
    const employee = await findEmployeeById(id);

    if (!employee) {
        throw new AppError("Employee not found", 404);
    }

    await updateEmploymentStatus(id, status);

    return { id, employment_status: status };
};

module.exports = {
    createEmployeeService,
    getAllEmployeesService,
    getEmployeeByIdService,
    getMyProfileService,
    updateMyProfileService,
    updateEmployeeService,
    updateEmploymentStatusService
};