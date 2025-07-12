const express = require("express");
const router = express.Router();
const {
  createAnnouncement,
  createManagerAnnouncement,
  getAdminAnnouncements,
  getManagerAnnouncements,
  getAnnouncementsForEmployee,
  deleteAnnouncement,
} = require("../controller/annoucementController");

const authMiddleware = require("../middleware/authMiddleware");

// ---------------- Admin Routes ---------------- //
// Create announcement from admin to all/employee/manager/selected
router.post("/", authMiddleware, createAnnouncement);

// Get all announcements created by admin (admin dashboard)
router.get("/admin", authMiddleware, getAdminAnnouncements);

// ---------------- Manager Routes ---------------- //
// Manager creates announcement (to all employees or selected)
router.post("/manager", authMiddleware, createManagerAnnouncement);

// Manager gets announcements:
// - Their own created ones
// - Admin announcements directed to them
router.get("/manager", authMiddleware, getManagerAnnouncements);

// ---------------- Employee Specific ---------------- //
// Fetch announcements meant for a specific employee
router.get("/employee/:id", getAnnouncementsForEmployee);

// ---------------- Delete ---------------- //
router.delete("/:id", authMiddleware, deleteAnnouncement);

module.exports = router;
