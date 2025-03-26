const mongoose = require("mongoose");

const ColorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // Example: "Ocean Blue"

    hex: { 
      type: String, 
      match: /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, 
      default: null 
    }, // Example: "#1E90FF"

    rgb: {
      r: { type: Number, min: 0, max: 255 },
      g: { type: Number, min: 0, max: 255 },
      b: { type: Number, min: 0, max: 255 }
    },

    rgba: {
      r: { type: Number, min: 0, max: 255 },
      g: { type: Number, min: 0, max: 255 },
      b: { type: Number, min: 0, max: 255 },
      a: { type: Number, min: 0, max: 1 } // Alpha transparency (0-1)
    },

    hsl: {
      h: { type: Number, min: 0, max: 360 }, // Hue (0-360)
      s: { type: Number, min: 0, max: 100 }, // Saturation (0-100)
      l: { type: Number, min: 0, max: 100 }  // Lightness (0-100)
    },

    hsv: {
      h: { type: Number, min: 0, max: 360 }, // Hue (0-360)
      s: { type: Number, min: 0, max: 100 }, // Saturation (0-100)
      v: { type: Number, min: 0, max: 100 }  // Value (0-100)
    },

   

    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Admin", 
      default: null 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Color", ColorSchema);
