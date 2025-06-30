const express = require("express");
const router = express.Router();
const {
  createAnnouncement,
  getAnnouncements,
} = require("../controller/annoucementController");

// Create Announcement
router.post("/", createAnnouncement);
router.post("/:id", createAnnouncement);

// Get All Announcements
router.get("/", getAnnouncements);

module.exports = router;
