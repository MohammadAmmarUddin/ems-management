const Announcement = require("../models/annoucement");
const employeeModel = require("../models/employeeModel");

// Admin creates announcement
exports.createAnnouncement = async (req, res) => {
  try {
    const { message, type, selectedEmployee } = req.body;

    if (!message || !type) {
      return res
        .status(400)
        .json({ success: false, message: "Message and type are required." });
    }

    const announcement = await Announcement.create({
      message,
      type,
      selectedEmployee: type === "selected" ? selectedEmployee : null,
      senderType: "admin",
      sender: null,
    });

    res.status(201).json({ success: true, announcement });
  } catch (error) {
    console.error("Error creating admin announcement:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
// Manager deletes own announcement
exports.deleteManagerAnnouncement = async (req, res) => {
  try {
    const id = req.params.id;
    const managerId = req.user._id;

    const announcement = await Announcement.findOneAndDelete({
      _id: id,
      senderType: "manager",
      sender: managerId,
    });

    if (!announcement) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Announcement not found or unauthorized.",
        });
    }

    res
      .status(200)
      .json({ success: true, message: "Announcement deleted by manager." });
  } catch (error) {
    console.error("Error deleting manager announcement:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Manager creates announcement to employees
exports.createManagerAnnouncement = async (req, res) => {
  try {
    const { message, selectedEmployee } = req.body;
    const managerId = req.user._id;

    if (!message) {
      return res
        .status(400)
        .json({ success: false, message: "Message is required." });
    }

    const announcement = await Announcement.create({
      message,
      type: selectedEmployee ? "selected" : "employees",
      selectedEmployee: selectedEmployee || null,
      senderType: "manager",
      sender: managerId,
    });

    res.status(201).json({ success: true, announcement });
  } catch (error) {
    console.error("Error creating manager announcement:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Admin fetches all announcements created by admin
exports.getAdminAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({ senderType: "admin" })
      .populate("selectedEmployee", "emp_name emp_email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, announcements });
  } catch (error) {
    console.error("Error fetching admin announcements:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Manager fetches own + admin announcements relevant to them
exports.getManagerAnnouncements = async (req, res) => {
  try {
    const managerId = req.user._id;

    const announcements = await Announcement.find({
      $or: [
        { senderType: "manager", sender: managerId },
        { senderType: "admin", type: { $in: ["all", "employees"] } },
        { senderType: "admin", type: "selected", selectedEmployee: managerId },
      ],
    })
      .populate("selectedEmployee", "emp_name emp_email")
      .populate("sender", "emp_name emp_email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, announcements });
  } catch (error) {
    console.error("Error fetching manager announcements:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Employee fetches relevant announcements
exports.getAnnouncementsForEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id;

    const announcements = await Announcement.find({
      $or: [
        { type: "all" },
        { type: "employees" },
        { type: "selected", selectedEmployee: employeeId },
      ],
    })
      .populate("selectedEmployee", "emp_name emp_email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, announcements });
  } catch (error) {
    console.error("Error fetching announcements for employee:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Delete Announcement
exports.deleteAnnouncement = async (req, res) => {
  try {
    const id = req.params.id;
    const announcement = await Announcement.findByIdAndDelete(id);

    if (!announcement) {
      return res
        .status(404)
        .json({ success: false, message: "Announcement not found." });
    }

    res.status(200).json({ success: true, message: "Announcement deleted." });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
