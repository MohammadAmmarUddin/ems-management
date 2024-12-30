const express = require("express");
const {
  login,
  verify,
  getAllUsers,
} = require("../authController/authController.js");
const authMiddleware = require("../middleware/authMiddleware.js");
const router = express.Router();

// post method
router.post("/login", login);
router.get("/verify", authMiddleware, verify);
router.get("/getAllUser",  getAllUsers);

module.exports = router;
