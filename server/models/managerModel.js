const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const managerSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    managerId: { type: String },
    mang_name: { type: String },
    mang_email: { type: String, required: true, unique: true },
    mang_phone: { type: String, required: true, unique: true },
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

const manager = mongoose.model("managers", managerSchema);

module.exports = manager;
