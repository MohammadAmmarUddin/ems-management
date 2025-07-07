const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "projects",
      required: true,
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employees",
      required: true,
    },
    taskTitle: { type: String, required: true },
    taskDescription: { type: String },
    status: {
      type: String,
      enum: ["pending", "in progress", "completed"],
      default: "pending",
    },
    deadline: { type: String, required: true },
  },
  { timestamps: true }
);

const taskModel = mongoose.model("tasks", taskSchema);
module.exports = taskModel;
