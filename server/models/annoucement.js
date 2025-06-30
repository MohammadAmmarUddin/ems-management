const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["all", "employees", "managers", "selected"],
      required: true,
    },
    selectedEmployee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employees",
      default: null,
    },
  },
  { timestamps: true }
);

const Announcement = mongoose.model("announcement", announcementSchema);
module.exports = Announcement;
