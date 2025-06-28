const { default: mongoose } = require("mongoose");

const taskSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "employees",
    required: true,
  },
  taskTitle: { type: String, required: true },
  taskDescription: { type: String },
  status: {
    type: String,
    enum: ["assigned", "in progress", "completed"],
    default: "assigned",
  },
  deadline: { type: Date },
});

const task = mongoose.Schema("task", taskSchema);
module.exports = task;
