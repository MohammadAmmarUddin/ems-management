const Announcement = require("../models/annoucement");

exports.createAnnouncement = async (req, res) => {
  try {
    const { message, type, selectedEmployee } = req.body;

    if (!message || !type) {
      return res
        .status(400)
        .json({ success: false, message: "Message and type are required." });
    }

    if (type === "selected" && !selectedEmployee) {
      return res
        .status(400)
        .json({ success: false, message: "Selected employee is required." });
    }

    const announcement = new Announcement({
      message,
      type,
      selectedEmployee: type === "selected" ? selectedEmployee : null,
    });

    await announcement.save();

    res.status(201).json({
      success: true,
      message: "Announcement created successfully.",
      announcement,
    });
  } catch (error) {
    console.error("Error creating announcement:", error);
    res.status(500).json({ success: false, message: "Internal Server Error." });
  }
};

exports.getAnnouncements = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 5;

    const announcements = await Announcement.find()
      .populate("selectedEmployee", "emp_name emp_email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({ success: true, announcements });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    res.status(500).json({ success: false, message: "Internal Server Error." });
  }
};
exports.deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const announcement = await Announcement.findByIdAndDelete(id);

    if (!announcement) {
      return res
        .status(404)
        .json({ success: false, message: "Announcement not found." });
    }

    res.status(200).json({
      success: true,
      message: "Announcement deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    res.status(500).json({ success: false, message: "Internal Server Error." });
  }
};
exports.getAnnouncementsForEmployee = async (req, res) => {
  try {
    const { id } = req.params; // Employee ID

    const announcements = await Announcement.find({
      $or: [
        { type: "all" },
        { type: "employees" },
        { type: "selected", selectedEmployee: id },
      ],
    })
      .populate("selectedEmployee", "emp_name emp_email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, announcements });
  } catch (error) {
    console.error("Error fetching employee announcements:", error);
    res.status(500).json({ success: false, message: "Internal Server Error." });
  }
};
exports.deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const announcement = await Announcement.findByIdAndDelete(id);

    if (!announcement) {
      return res
        .status(404)
        .json({ success: false, message: "Announcement not found." });
    }

    res.status(200).json({
      success: true,
      message: "Announcement deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    res.status(500).json({ success: false, message: "Internal Server Error." });
  }
};
