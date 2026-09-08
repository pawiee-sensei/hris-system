const {
    createDepartment,
    findAllDepartments,
    findDepartmentById
} = require("../models/departmentModel");

const AppError = require("../utils/AppError");

const createDepartmentService = async (name) => {
    const id = await createDepartment(name);
    return { id, name };
};

const getAllDepartmentsService = async () => {
    return await findAllDepartments();
};

module.exports = {
    createDepartmentService,
    getAllDepartmentsService
};