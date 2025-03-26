const express = require("express");
const router = express.Router();
const Color = require("../../../models/templates/Colors");




router.get("/", async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const colors = await Color.find()
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .select("name hex rgb rgba hsl hsv createdAt")
            .exec();

        const totalColors = await Color.countDocuments();

        res.status(200).json({
            totalColors,
            totalPages: Math.ceil(totalColors / limit),
            currentPage: parseInt(page),
            colors,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
module.exports = router;