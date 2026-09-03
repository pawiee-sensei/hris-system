const {
    registerUserService,
    loginUserService
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

module.exports = {
    registerController,
    loginController
};