const UserTemplateSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        templateId: { type: mongoose.Schema.Types.ObjectId, ref: "Template", required: true },
        name: { type: String, required: true },
        components: [ComponentSchema]
    },
    { timestamps: true }
);

module.exports = mongoose.model("UserTemplate", UserTemplateSchema);
