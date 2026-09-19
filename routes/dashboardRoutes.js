const express = require("express");
const { getDB } = require("../config/database");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Protect dashboard route
router.use(authMiddleware);

// Get dashboard statistics
router.get("/stats", async (req, res) => {
    try {
        const db = getDB();

        const leadsCollection = db.collection("leads");

        const totalLeads = await leadsCollection.countDocuments();

        const newLeads = await leadsCollection.countDocuments({
            status: "New"
        });

        const contactedLeads = await leadsCollection.countDocuments({
            status: "Contacted"
        });

        const convertedLeads = await leadsCollection.countDocuments({
            status: "Converted"
        });

        res.status(200).json({
            success: true,
            stats: {
                totalLeads,
                newLeads,
                contactedLeads,
                convertedLeads
            }
        });

    } catch (error) {
        console.error("Dashboard stats error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard statistics"
        });
    }
});

module.exports = router;