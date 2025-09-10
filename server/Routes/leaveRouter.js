const express = require("express");
const {
  getAllLeaves,
  getLeave,
  addLeave,
  approveLeave,
  rejectLeave,
  getLeaveStatusStats,
  updateLeave,
  searchLeaves,
  getLeavesByStatus,
} = require("../controller/leaveController");

const router = express.Router();

router.get("/all", getAllLeaves);
router.get("/search", searchLeaves);
router.get("/:id", getLeave);
router.get("/stats/summary", getLeaveStatusStats);
router.get("/stats/:status", getLeavesByStatus);

router.post("/", addLeave);

router.put("/:id/approve", approveLeave);
router.put("/:id/reject", rejectLeave);
router.put("/:id", updateLeave);

module.exports = router;
