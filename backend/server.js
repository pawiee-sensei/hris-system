const express = require("express");

const authRoutes = require("./src/routes/authRoutes");
const errorHandler = require("./src/middleware/errorHandler");

const app = express();

// Parse JSON request bodies.
// Example: req.body.email
app.use(express.json());

// health check
app.get("/", (req, res) => {
    res.json({
        message: "HRIS API is running"
    });
});
app.use("/api/auth", authRoutes);

app.use(errorHandler);

// Start the server.
const PORT = process.env.PORT || 5000;

// start connection
app.listen(PORT, () => {
    console.log(`HRIS server running on port ${PORT}`);
});