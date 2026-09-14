const {
    createDepartment,
    findAllDepartmentsWithSummary,
    findDepartmentById,
    findDepartmentWithDetails,
    findMembersByDepartment,
    findEmployeesForPicker,
    assignEmployeesToDepartment,
    removeEmployeeFromDepartment,
    setManager,
    clearManagerIfMatches
} = require("../models/departmentModel");

const { findEmployeeById } = require("../models/employeeModel");

const AppError = require("../utils/AppError");

const createDepartmentService = async (name) => {
    const id = await createDepartment(name);
    return { id, name };
};

const getAllDepartmentsService = async () => {
    return await findAllDepartmentsWithSummary();
};

const getDepartmentDetailsService = async (id) => {
    const department = await findDepartmentWithDetails(id);

    if (!department) {
        throw new AppError("Department not found", 404);
    }

    const members = await findMembersByDepartment(id);

    return { ...department, members };
};

const getAvailableEmployeesService = async (departmentId) => {
    return await findEmployeesForPicker(departmentId);
};

const addMembersService = async (departmentId, employeeIds) => {
    if (!employeeIds || employeeIds.length === 0) {
        throw new AppError("Select at least one employee", 400);
    }

    await assignEmployeesToDepartment(employeeIds, departmentId);
};

const removeMemberService = async (departmentId, employeeId) => {
    const employee = await findEmployeeById(employeeId);

    if (!employee || employee.department_id !== Number(departmentId)) {
        throw new AppError("Employee is not a member of this department", 400);
    }

    // If this employee was the manager, clear it — they're no longer part of the department.
    await clearManagerIfMatches(employeeId);
    await removeEmployeeFromDepartment(employeeId);
};

const setManagerService = async (departmentId, managerId) => {
    const department = await findDepartmentById(departmentId);

    if (!department) {
        throw new AppError("Department not found", 404);
    }

    if (managerId) {
        const employee = await findEmployeeById(managerId);

        if (!employee || employee.department_id !== Number(departmentId)) {
            throw new AppError("Manager must be a current member of this department", 400);
        }
    }

    await setManager(departmentId, managerId || null);
};

module.exports = {
    createDepartmentService,
    getAllDepartmentsService,
    getDepartmentDetailsService,
    getAvailableEmployeesService,
    addMembersService,
    removeMemberService,
    setManagerService
};