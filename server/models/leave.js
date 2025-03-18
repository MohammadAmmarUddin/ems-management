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
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    appliedAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { Timestamps: true }
);

const leave = mongoose.model("leave", leaveSchema);

module.exports = leave;
