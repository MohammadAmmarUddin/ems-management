const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: { type: String, enum: ["idea", "issue", "praise"], default: "idea" },
    message: { type: String, required: true },
    status: { type: String, enum: ["open", "reviewed"], default: "open" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
