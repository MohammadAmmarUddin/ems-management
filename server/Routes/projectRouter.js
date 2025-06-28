const express = require("express");
const {
  createProject,
  getAllProjects,

  updateProject,
  deleteProject,
  assignTask,
} = require("../controller/projectController.js");

const router = express.Router();
const authMiddleWare = require("../middleware/authMiddleware");
// /api/projects
router.post("/:id/assign-task", assignTask);
router.post("/create", createProject);
router.get("/getAllProjects", authMiddleWare, getAllProjects);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

module.exports = router;
