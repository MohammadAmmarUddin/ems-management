const {
  getAttendances,
  updateAttendance,
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

module.exports = router;
