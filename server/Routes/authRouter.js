const express = require("express");
const { login, verify } = require("../authController/authController.js");
const authMiddleware = require("../middleware/authMiddleware.js");
const router = express.Router();

// post method
router.post("/login", login);
router.get("/verify", authMiddleware, verify);

module.exports = router;
