const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./src/routes/authRoutes");
const errorHandler = require("./src/middleware/errorHandler");

const employeeRoutes = require("./src/routes/employeeRoutes");
const attendanceRoutes = require("./src/routes/attendanceRoutes");
const leaveRoutes = require("./src/routes/leaveRoutes");
const leaveBalanceRoutes = require("./src/routes/leaveBalanceRoutes");
const departmentRoutes = require("./src/routes/departmentRoutes");
const announcementRoutes = require("./src/routes/announcementRoutes");

const app = express();

// Allow the frontend (running on a different port) to call this API.
app.use(cors({
    origin: "http://localhost:5173"
}));

// Log every incoming request to the terminal for debugging.
app.use(morgan("dev"));

// Cap requests per IP — loosened for active development.
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000
});
app.use(limiter);

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

app.use("/api/employees", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/leave-balances", leaveBalanceRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/announcements", announcementRoutes);

app.use(errorHandler);

// Start the server.
const PORT = process.env.PORT || 5000;

// start connection
app.listen(PORT, () => {
    console.log(`HRIS server running on port ${PORT}`);
});