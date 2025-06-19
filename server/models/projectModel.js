const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "departments",
      required: true,
    },

    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "managers",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "in progress", "completed"],
      default: "pending",
    },

    startDate: { type: String, required: true },
    endDate: { type: String, required: true },

    assignedEmployees: [
      { type: mongoose.Schema.Types.ObjectId, ref: "employees" },
    ],
  },
  { timestamps: true }
);

const project = mongoose.model("projects", projectSchema);
module.exports = project;
