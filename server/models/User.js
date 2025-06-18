const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "employee", "manager"] },
    profileImage: { type: String },
    isActive: { type: Boolean, default: false },
    lastLogin: { type: Date },
    meta: {
      lastLoginIp: { type: String },
      lastLoginDevice: { type: String },
      preferences: { type: Object },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
