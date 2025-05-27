const express = require("express");
const {
  login,
  verify,
  getAllUsers,
  getSingleUser,
  forgetPassword,
  resetPassword,
} = require("../controller/authController.js");
const authMiddleware = require("../middleware/authMiddleware.js");
const router = express.Router();

// post method
router.post("/login", login);
router.get("/verify", authMiddleware, verify);
router.get("/getAllUser",  getAllUsers);
router.get("/getSingleUser/:id",  getSingleUser);
router.post("/forgetPassword", forgetPassword);
router.post("/resetPassword/:token", resetPassword);

module.exports = router;
