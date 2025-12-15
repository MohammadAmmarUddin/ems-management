const Feedback = require("../models/Feedback");

exports.submitFeedback = async (req, res) => {
  try {
    const { type, message } = req.body;
    if (!message) {
      return res
        .status(400)
        .json({ success: false, message: "Feedback message is required" });
    }

    const feedback = await Feedback.create({
      userId: req.user._id,
      type: type || "idea",
      message,
    });

    return res
      .status(201)
      .json({ success: true, feedback, message: "Feedback submitted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.listFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({})
      .sort({ createdAt: -1 })
      .limit(200)
      .populate("userId", "name email role");
    return res.status(200).json({ success: true, feedback });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
