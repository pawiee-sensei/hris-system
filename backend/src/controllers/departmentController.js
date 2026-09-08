const {
    createDepartmentService,
    getAllDepartmentsService
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

module.exports = {
    createDepartmentControllerFn,
    getAllDepartmentsControllerFn
};