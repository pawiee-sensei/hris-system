const bcrypt = require("bcrypt");


const crypto = require("crypto");

const {
    findUserByEmail,
    findUserById,
    createUser,
    updatePasswordHash,
    updateResetToken,
    findUserByResetToken,
    clearResetToken
} = require("../models/userModel");

const generateToken = require("../utils/generateToken");
const sendResetEmail = require("../utils/mailer");
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

    // Generate JWT after successful authentication.
    const token = generateToken(user);


    // Return safe user information.
    // Never return password_hash to the controller/frontend.
    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role
        }
    };
};

const changePasswordService = async (userId, { currentPassword, newPassword }) => {
    const user = await findUserById(userId);

    const passwordMatches = await bcrypt.compare(currentPassword, user.password_hash);

    if (!passwordMatches) {
        throw new AppError("Current password is incorrect", 401);
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 12);
    await updatePasswordHash(userId, newPasswordHash);
};

const resetPasswordService = async (targetUserId, newPassword) => {
    const user = await findUserById(targetUserId);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 12);
    await updatePasswordHash(targetUserId, newPasswordHash);
};

const forgotPasswordService = async (email) => {
    const user = await findUserByEmail(email);

    // Don't reveal whether the email exists.
    if (!user) {
        return;
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await updateResetToken(user.id, resetToken, expiresAt);
    await sendResetEmail(user.email, resetToken);
};

const resetPasswordWithTokenService = async (token, newPassword) => {
    const user = await findUserByResetToken(token);

    if (!user) {
        throw new AppError("Invalid or expired reset token", 400);
    }

    if (new Date(user.reset_token_expires) < new Date()) {
        throw new AppError("Invalid or expired reset token", 400);
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 12);
    await updatePasswordHash(user.id, newPasswordHash);
    await clearResetToken(user.id);
};

module.exports = {
    registerUserService,
    loginUserService,
    changePasswordService,
    resetPasswordService,
    forgotPasswordService,
    resetPasswordWithTokenService
};