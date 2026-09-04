const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

// Verify the JWT and identify the logged-in user.
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check if the Authorization header exists.
    if (!authHeader) {
        return next(
            new AppError("Authentication required", 401)
        );
    }

    // Expected format: "Bearer <token>"
    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return next(
            new AppError("Invalid authorization format", 401)
        );
    }

    const token = parts[1];

    try {
        // Verify the token using our JWT secret.
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // decoded.userId = users.id
        // decoded.role = users.role
        req.user = decoded;

        next();
    } catch (error) {
        return next(
            new AppError("Invalid or expired token", 401)
        );
    }
};

module.exports = authMiddleware;