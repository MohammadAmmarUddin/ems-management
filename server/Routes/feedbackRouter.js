const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  submitFeedback,
  listFeedback,
} = require("../controller/feedbackController");

const router = express.Router();

router.post("/", authMiddleware, submitFeedback);
router.get("/", authMiddleware, listFeedback);

module.exports = router;
