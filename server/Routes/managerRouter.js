const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware.js");
const {
  searchManager,
  getAllManagers,
  totalManagersCount,
  getManager,
  addManager,
  updateManager,
  deleteManager,
  upload,
} = require("../controller/manageController.js");

// GET
router.get("/searchManagers", authMiddleware, searchManager);
router.get("/getManagers", authMiddleware, getAllManagers);
router.get("/getManagersCount", authMiddleware, totalManagersCount);
router.get("/getManager/:id", authMiddleware, getManager);

// POST
router.post(
  "/addManager",
  authMiddleware,
  upload.single("profileImage"),
  addManager
);

// PUT
router.put(
  "/updateManager/:id",
  authMiddleware,
  upload.single("profileImage"),
  updateManager
);

// DELETE
router.delete("/deleteManager/:id", authMiddleware, deleteManager);

module.exports = router;
