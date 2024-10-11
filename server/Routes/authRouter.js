const express = require("express");
const { login } = require("../authController/authController.js");

const router = express.Router();

// post method
router.post("/login", login);

module.exports = router;
