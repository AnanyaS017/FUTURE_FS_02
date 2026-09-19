const express = require("express");
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/database");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Protect all note routes
router.use(authMiddleware);

// Add a note to a lead
router.post("/", async (req, res) => {
    try {
        const db = getDB();

        const { leadId, text } = req.body;

        if (!leadId || !text) {
            return res.status(400).json({
                success: false,
                message: "Lead ID and note text are required"
            });
        }

        if (!ObjectId.isValid(leadId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid lead ID"
            });
        }

        // Check whether the lead exists
        const lead = await db.collection("leads").findOne({
            _id: new ObjectId(leadId)
        });

        if (!lead) {
            return res.status(404).json({
                success: false,
                message: "Lead not found"
            });
        }

        const newNote = {
            leadId: new ObjectId(leadId),
            text,
            createdAt: new Date()
        };

        const result = await db.collection("notes").insertOne(newNote);

        res.status(201).json({
            success: true,
            message: "Note added successfully",
            noteId: result.insertedId
        });

    } catch (error) {
        console.error("Add note error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to add note"
        });
    }
});


// Get notes for a specific lead
router.get("/:leadId", async (req, res) => {
    try {
        const db = getDB();

        const { leadId } = req.params;

        if (!ObjectId.isValid(leadId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid lead ID"
            });
        }

        const notes = await db
            .collection("notes")
            .find({
                leadId: new ObjectId(leadId)
            })
            .sort({ createdAt: -1 })
            .toArray();

        res.status(200).json({
            success: true,
            notes
        });

    } catch (error) {
        console.error("Get notes error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch notes"
        });
    }
});

module.exports = router;