const {
    fileLeaveRequestService,
    getMyLeaveRequestsService,
    getAllLeaveRequestsService,
    reviewLeaveRequestService
} = require("../services/leaveService");

const fileLeaveControllerFn = async (req, res) => {
    const leave = await fileLeaveRequestService(req.user.userId, req.body);

    res.status(201).json({
        success: true,
        message: "Leave request submitted",
        data: leave
    });
};

const getMyLeaveControllerFn = async (req, res) => {
    const leaves = await getMyLeaveRequestsService(req.user.userId);

    res.status(200).json({
        success: true,
        data: leaves
    });
};

const getAllLeaveControllerFn = async (req, res) => {
    const leaves = await getAllLeaveRequestsService();

    res.status(200).json({
        success: true,
        data: leaves
    });
};

const reviewLeaveControllerFn = async (req, res) => {
    const result = await reviewLeaveRequestService({
        leaveId: req.params.id,
        status: req.body.status,
        approverUserId: req.user.userId
    });

    res.status(200).json({
        success: true,
        message: `Leave request ${result.status.toLowerCase()}`,
        data: result
    });
};

module.exports = {
    fileLeaveControllerFn,
    getMyLeaveControllerFn,
    getAllLeaveControllerFn,
    reviewLeaveControllerFn
};