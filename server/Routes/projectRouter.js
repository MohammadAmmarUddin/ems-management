const express = require("express");
const {
  createProject,
  getAllProjects,

  updateProject,
  deleteProject,
  assignTask,
  AllProjectCount,
  AllProjectInProgress,
} = require("../controller/projectController.js");

const router = express.Router();
const authMiddleWare = require("../middleware/authMiddleware");
// /api/projects
router.post("/:id/assign-task", assignTask);
router.post("/create", createProject);
router.get("/getAllProjects", authMiddleWare, getAllProjects);
router.get("/getInProgressProjects", AllProjectInProgress);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

module.exports = router;
