const {
  createAnnouncement,
  getAnnouncements,
  deleteAnnouncement,
  getAnnouncementsForEmployee,
} = require("../controller/annoucementController");
const express = require("express");
const router = express.Router();
const authMiddlware = require("../middleware/authMiddleware");
// Create Announcement
router.post("/", authMiddlware, createAnnouncement);

// Get All Announcements
router.get("/", getAnnouncements);

// Delete Announcement
router.delete("/:id", authMiddlware, deleteAnnouncement);
// Get Announcements for Specific Employee
router.get("/employee/:id", getAnnouncementsForEmployee);

module.exports = router;
