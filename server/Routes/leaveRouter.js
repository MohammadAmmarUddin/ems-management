const express = require("express");
const { getAllLeaves, addLeave } = require("../authController/leaveController");

const router = express.Router();

router.get("/getAllleaves", getAllLeaves);

// post

router.post("/addLeave", addLeave);
module.exports = router;
