const {
    createDepartmentService,
    getAllDepartmentsService,
    getDepartmentDetailsService,
    getAvailableEmployeesService,
    addMembersService,
    removeMemberService,
    setManagerService
} = require("../services/departmentService");

const createDepartmentControllerFn = async (req, res) => {
    const department = await createDepartmentService(req.body.name);

    res.status(201).json({
        success: true,
        message: "Department created successfully",
        data: department
    });
};

const getAllDepartmentsControllerFn = async (req, res) => {
    const departments = await getAllDepartmentsService();

    res.status(200).json({
        success: true,
        data: departments
    });
};

const getDepartmentDetailsControllerFn = async (req, res) => {
    const department = await getDepartmentDetailsService(req.params.id);

    res.status(200).json({
        success: true,
        data: department
    });
};

const getAvailableEmployeesControllerFn = async (req, res) => {
    const employees = await getAvailableEmployeesService(req.params.id);

    res.status(200).json({
        success: true,
        data: employees
    });
};

const addMembersControllerFn = async (req, res) => {
    await addMembersService(req.params.id, req.body.employeeIds);

    res.status(200).json({
        success: true,
        message: "Members added successfully"
    });
};

const removeMemberControllerFn = async (req, res) => {
    await removeMemberService(req.params.id, req.params.employeeId);

    res.status(200).json({
        success: true,
        message: "Member removed successfully"
    });
};

const setManagerControllerFn = async (req, res) => {
    await setManagerService(req.params.id, req.body.managerId);

    res.status(200).json({
        success: true,
        message: "Manager updated successfully"
    });
};

module.exports = {
    createDepartmentControllerFn,
    getAllDepartmentsControllerFn,
    getDepartmentDetailsControllerFn,
    getAvailableEmployeesControllerFn,
    addMembersControllerFn,
    removeMemberControllerFn,
    setManagerControllerFn
};