const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const employeeSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
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
      required: true,
    },
    salary: { type: String },
    role: { type: String },
    designation: { type: String },
    profileImage: { type: String },
  },
  { timestamps: true }
);

const employee = mongoose.model("employees", employeeSchema);

module.exports = employee;
