const express = require("express");
const router = express.Router();
const Color = require("../../../models/templates/Colors");
const verifyToken = require('../../../middleware/verifyToken')


router.post("/", verifyToken, async (req, res) => {
    try {
        const { name, hex, rgb, rgba, hsl, hsv } = req.body;
        const createdBy = req.user.id;

        if (!name || (!hex && !rgb && !rgba && !hsl && !hsv)) {
            return res.status(400).json({ message: "Color name and at least one format (hex, rgb, etc.) are required" });
        }


        const newColor = new Color({
            name,
            hex,
            rgb,
            rgba,
            hsl,
            hsv,
            createdBy
        });


        const savedColor = await newColor.save();
        res.status(201).json(savedColor);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
