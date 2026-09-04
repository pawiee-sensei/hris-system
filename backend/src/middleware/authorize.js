const AppError = require("../utils/AppError");

// Restrict access to specific roles. Must run after authMiddleware.
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return next(
                new AppError("You are not authorized to perform this action", 403)
            );
        }

        next();
    };
};

module.exports = authorize;