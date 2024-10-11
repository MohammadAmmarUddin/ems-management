const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "employee"], required: true },
    profileImage: { type: String },
  },
  { Timestamp: true }
);

const User = mongoose.model("user", userSchema);

module.exports = User;
