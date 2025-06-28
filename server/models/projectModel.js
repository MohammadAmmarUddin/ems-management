const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "department",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "in progress", "completed"],
      default: "pending",
    },

    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
  },
  { timestamps: true }
);

const project = mongoose.model("projects", projectSchema);
module.exports = project;
