const {
    findUserByEmail,
    findUserById
} = require("./src/models/userModel");

const testUserModel = async () => {
    try {
        const userByEmail = await findUserByEmail(
            "test@example.com"
        );

        console.log("User by email:");
        console.log(userByEmail);

        const userById = await findUserById(1);

        console.log("User by ID:");
        console.log(userById);
    } catch (error) {
        console.error("User model test failed:", error.message);
    }
};

testUserModel();