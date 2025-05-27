const express = require("express");
const {
  getAllLeaves,
  getLeave,
  addLeave,
  approveLeave,
  rejectLeave
} = require("../controller/leaveController");

const router = express.Router();

// GET
router.get("/getAllLeaves", getAllLeaves);
router.get("/getLeave/:id", getLeave);

// POST
router.post("/addLeave", addLeave);

// PUT (Better for state changes like approve/reject)
router.put("/approveLeave/:id", approveLeave);
router.put("/rejectLeave/:id", rejectLeave);

module.exports = router;
