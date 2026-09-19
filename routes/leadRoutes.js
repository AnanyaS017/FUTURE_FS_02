const express = require("express");
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/database");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Protect all lead routes
router.use(authMiddleware);

// Get all leads
router.get("/", async (req, res) => {
    try {
        const db = getDB();

        const { search, status } = req.query;

        const filter = {};

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
                { company: { $regex: search, $options: "i" } }
            ];
        }

        if (status) {
            filter.status = status;
        }

        const leads = await db
            .collection("leads")
            .find(filter)
            .sort({ createdAt: -1 })
            .toArray();

        res.status(200).json({
            success: true,
            leads
        });

    } catch (error) {
        console.error("Get leads error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch leads"
        });
    }
});


// Add a new lead
router.post("/", async (req, res) => {
    try {
        const db = getDB();

        const {
            name,
            email,
            phone,
            company,
            status,
            source
        } = req.body;

        if (!name || !email || !phone) {
            return res.status(400).json({
                success: false,
                message: "Name, email and phone are required"
            });
        }

        const newLead = {
            name,
            email,
            phone,
            company: company || "",
            status: status || "New",
            source: source || "",
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db
            .collection("leads")
            .insertOne(newLead);

        res.status(201).json({
            success: true,
            message: "Lead created successfully",
            leadId: result.insertedId
        });

    } catch (error) {
        console.error("Create lead error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to create lead"
        });
    }
});


// Get one lead by ID
router.get("/:id", async (req, res) => {
    try {
        const db = getDB();

        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid lead ID"
            });
        }

        const lead = await db.collection("leads").findOne({
            _id: new ObjectId(req.params.id)
        });

        if (!lead) {
            return res.status(404).json({
                success: false,
                message: "Lead not found"
            });
        }

        res.status(200).json({
            success: true,
            lead
        });

    } catch (error) {
        console.error("Get lead error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch lead"
        });
    }
});


// Update a lead
router.put("/:id", async (req, res) => {
    try {
        const db = getDB();

        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid lead ID"
            });
        }

        const {
            name,
            email,
            phone,
            company,
            status,
            source
        } = req.body;

        const updatedLead = {
            name,
            email,
            phone,
            company: company || "",
            status: status || "New",
            source: source || "",
            updatedAt: new Date()
        };

        const result = await db.collection("leads").updateOne(
            {
                _id: new ObjectId(req.params.id)
            },
            {
                $set: updatedLead
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Lead not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Lead updated successfully"
        });

    } catch (error) {
        console.error("Update lead error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to update lead"
        });
    }
});


// Delete a lead
router.delete("/:id", async (req, res) => {
    try {
        const db = getDB();

        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid lead ID"
            });
        }

        const result = await db.collection("leads").deleteOne({
            _id: new ObjectId(req.params.id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Lead not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Lead deleted successfully"
        });

    } catch (error) {
        console.error("Delete lead error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to delete lead"
        });
    }
});

module.exports = router;