const express = require("express");
const router = express.Router();
const Tag = require("../../../models/templates/Tags");


router.get("/",  async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const tags = await Tag.find().skip(skip).limit(limit);
    const totalTags = await Tag.countDocuments();

    const totalPages = Math.ceil(totalTags / limit);
    
    res.status(200).json({
      tags,
      pagination: {
        totalTags,
        totalPages,
        currentPage: parseInt(page),
        pageSize: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
