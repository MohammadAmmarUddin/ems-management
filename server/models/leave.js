const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "employees" },
    emp_id: { type: String },
    name: { type: String },
    leave_type: { type: String },
    dep_name: { type: mongoose.Schema.Types.ObjectId, ref: "departments" },
    days: { type: Number },
    status: { type: String },
  },
  { Timestamps: true }
);

const leave = mongoose.model("leaves", leaveSchema);

module.exports = leave;
