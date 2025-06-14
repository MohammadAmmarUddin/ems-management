const {
  getAttendances,
  updateAttendance,
  attendanceReport,
} = require("../controller/attendanceController");
const authMiddleware = require("../middleware/authMiddleware");
const express = require("express");
const defaultAttendanceMiddleware = require("../middleware/defaultAttendance");
const router = express.Router();

//get
router.get("/getAttendances", defaultAttendanceMiddleware, getAttendances);
router.put(
  "/updateAttendance/:employeeId",
  authMiddleware,
  defaultAttendanceMiddleware,
  updateAttendance
);

router.get("/report", authMiddleware, attendanceReport);

module.exports = router;
