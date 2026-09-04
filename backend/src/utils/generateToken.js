const jwt = require("jsonwebtoken");

// Generate a JWT containing the authenticated user's identity and role.
const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user.id,   // userId = users.id
            role: user.role    // role = users.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );
};

module.exports = generateToken;