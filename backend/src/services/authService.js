const bcrypt = require("bcrypt");

const {
    findUserByEmail,
    findUserById,
    createUser
} = require("../models/userModel");

const AppError = require("../utils/AppError");


const registerUserService = async ({email,password,role = "EMPLOYEE"}) => {
    // Check if the email is already registered.
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
        throw new AppError("Email is already registered", 409);
    }

    // Hash the plain password before storing it.
    const passwordHash = await bcrypt.hash(password, 12);

    // Create the user.
    const userId = await createUser({
        email,
        passwordHash,
        role
    });

    return {
        id: userId,
        email,
        role
    };
};

// Log a user into the HRIS.
const loginUserService = async ({ email, password }) => {

    // Find the account using users.email.
    const user = await findUserByEmail(email);

    // Do not reveal whether the email exists.
    if (!user) {
        throw new AppError("Invalid email or password",401);
    }

    // Prevent inactive accounts from logging in.
    if (!user.is_active) {
        throw new AppError("Account is inactive",403);
    }

    // Compare the plain password with users.password_hash.
    const passwordMatches = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!passwordMatches) {
        throw new AppError("Invalid email or password",401);
    }

    // Return safe user information.
    // Never return password_hash to the controller/frontend.
    return {
        id: user.id,
        email: user.email,
        role: user.role
    };
};

module.exports = {
    registerUserService,
    loginUserService
};