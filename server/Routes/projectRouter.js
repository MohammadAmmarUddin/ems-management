const express = require("express");
const {
  createProject,
  getAllProjects,

  updateProject,
  deleteProject,
} = require("../controller/projectController.js");

const router = express.Router();

// /api/projects
router.post("/", createProject);
router.get("/", getAllProjects);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

module.exports = router;
