const mongoose = require("mongoose");

const ComponentSchema = new mongoose.Schema({
    type: { type: String, required: true }, // text, image, shape, etc.
    content: { type: String, default: "" }, // For text components
    src: { type: String, default: "" }, // For images
    position: {
        x: { type: Number, required: true },
        y: { type: Number, required: true }
    },
    width: Number,
    height: Number,
    fontSize: Number,
    color: { type: mongoose.Schema.Types.ObjectId, ref: "Color" },
    editable: { type: Boolean, default: true }
});

const TemplateSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
        thumbnail: { type: String, required: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
        components: [ComponentSchema],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Template", TemplateSchema);
