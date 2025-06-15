const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const leaveSchema = new mongoose.Schema(
  {
    employeeId: { type: Schema.Types.ObjectId, ref: "employees" },
    leaveType: {
      type: String,
      enum: ["Sick Leave", "Casual Leave", "Annual Leave"],
      required: true,
    },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const leave = mongoose.model("leave", leaveSchema);

module.exports = leave;
