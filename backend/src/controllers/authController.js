const {
    registerUserService,
    loginUserService,
    changePasswordService,
    resetPasswordService,
    forgotPasswordService,
    resetPasswordWithTokenService
} = require("../services/authService"); 

// Handle user registration request.
const registerController = async (req, res) => {
    const { email, password } = req.body;

    const user = await registerUserService({
        email,
        password
    });

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: user
    });
};

// Handle user login request.
const loginController = async (req, res) => {
    const { email, password } = req.body;

    const user = await loginUserService({
        email,
        password
    });

    res.status(200).json({
        success: true,
        message: "Login successful",
        data: user
    });
};

const meController = (req, res) => {
    res.status(200).json({
        success: true,
        data: req.user
    });
};

const changePasswordControllerFn = async (req, res) => {
    await changePasswordService(req.user.userId, req.body);

    res.status(200).json({
        success: true,
        message: "Password changed successfully"
    });
};

const resetPasswordControllerFn = async (req, res) => {
    await resetPasswordService(req.params.id, req.body.newPassword);

    res.status(200).json({
        success: true,
        message: "Password reset successfully"
    });
};

const forgotPasswordControllerFn = async (req, res) => {
    await forgotPasswordService(req.body.email);

    res.status(200).json({
        success: true,
        message: "If that email exists, a reset link has been sent"
    });
};

const resetPasswordWithTokenControllerFn = async (req, res) => {
    await resetPasswordWithTokenService(req.body.token, req.body.newPassword);

    res.status(200).json({
        success: true,
        message: "Password reset successfully"
    });
};

module.exports = {
    registerController,
    loginController,
    meController,
    changePasswordControllerFn,
    resetPasswordControllerFn,
    forgotPasswordControllerFn,
    resetPasswordWithTokenControllerFn
};

