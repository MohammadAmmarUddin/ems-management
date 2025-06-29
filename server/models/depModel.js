const mongoose = require("mongoose");
const { Schema } = mongoose;
const Attendance = require("../models/attendance");
const Salary = require("../models/Salary");
const Leave = require("../models/leave");

const employeeSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    employeeId: { type: String },
    emp_name: { type: String },
    emp_email: { type: String, required: true, unique: true },
    emp_phone: { type: String, required: true, unique: true },
    gender: { type: String, enum: ["male", "female", "other"] },
    dob: { type: Date },
    marital_status: {
      type: String,
      enum: ["single", "married", "divorced", "widowed"],
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: "department",
    },
    salary: { type: String },
    role: { type: String },
    designation: { type: String },
    profileImage: { type: String },
  },
  { timestamps: true }
);

employeeSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      await Attendance.deleteMany({ employeeId: this._id });
      await Leave.deleteMany({ employeeId: this._id });
      await Salary.deleteMany({ employeeId: this._id });
      next();
    } catch (error) {
      next(error);
    }
  }
);

const employee = mongoose.model("employees", employeeSchema);
module.exports = employee;
