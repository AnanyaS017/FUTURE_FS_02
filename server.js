const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const { connectDB } = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const leadRoutes = require("./routes/leadRoutes");
const noteRoutes = require("./routes/noteRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(express.static(__dirname + "/public"));




// Authentication routes
app.use("/api/auth", authRoutes);

app.use("/api/leads", leadRoutes);

app.use("/api/notes", noteRoutes);

app.use("/api/dashboard", dashboardRoutes);
// Start server
async function startServer() {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error.message);
    }
}

startServer();