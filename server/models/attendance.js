const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const attendanceSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: "employees",
    required: true,
  },
  status: {
    type: String,
    enum: ["Present", "Absent", "Sick", "Leave"],
    default: null,
  },
});

const Attendance = mongoose.model("attendance", attendanceSchema);
module.exports = Attendance;
