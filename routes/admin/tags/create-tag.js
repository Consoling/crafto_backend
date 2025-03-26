const express = require("express");
const router = express.Router();
const Tag = require("../../../models/templates/Tags");
const verifyToken = require('../../../middleware/verifyToken');

router.post("/", verifyToken, async (req, res) => {
    try {
        const { tag, emoji } = req.body;
        console.log('tag:', tag);
        console.log('emoji:', emoji);

        const createdBy = req.user.id;

        if (!tag || tag.trim() === "") {
            return res.status(400).json({ message: "Tag name is required" });
        }



        const tagRegex = /^[a-zA-Z0-9-_]+$/;
        if (!tagRegex.test(tag)) {
            return res.status(400).json({ message: "Tag can only contain letters, numbers, dashes, and underscores" });
        }


        const formattedTag = tag.trim().toLowerCase();

        const existingTag = await Tag.findOne({ tag: `#${formattedTag}` });
        if (existingTag) {
            return res.status(400).json({ message: "Tag already exists" });
        }

        const newTag = new Tag({
            tag: `${formattedTag}`,
            emoji: emoji || "",
            createdBy,
        });

        const savedTag = await newTag.save();

        res.status(201).json(savedTag);
    } catch (error) {
        console.error("Error creating tag:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
