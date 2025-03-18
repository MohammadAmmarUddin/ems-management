const express = require("express");
const { getAllLeaves, addLeave, getLeave } = require("../authController/leaveController");

const router = express.Router();
  
// get
router.get("/getAllleaves", getAllLeaves);
router.get("/getLeave/:id", getLeave);

// post

router.post("/addLeave", addLeave);
module.exports = router;
