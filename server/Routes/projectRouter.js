const express = require("express");
const {
  createProject,
  getAllProjects,
  updateProject,
  deleteProject,
  getAllTasks,
  deleteTask,
  assignTask,
  getTasksByDepartment,
  AllProjectInProgress,
  getProjectsByDepartment,
  getAllTasksByDepartment,
  getRunningProjectsByManager,
  AllProjectInProgressUnderManager,
} = require("../controller/projectController.js");

const authMiddleWare = require("../middleware/authMiddleware");

const router = express.Router();

// 🔹 Project Routes
router.post("/create", authMiddleWare, createProject);
router.get("/getAllProjects", authMiddleWare, getAllProjects);
router.get("/getByDepartment", authMiddleWare, getProjectsByDepartment);
router.get("/getInProgressProjects", authMiddleWare, AllProjectInProgress);
router.put("/:id", authMiddleWare, updateProject);
router.delete("/:id", authMiddleWare, deleteProject);

router.post("/:id/assign-task", authMiddleWare, assignTask);
// router.get(
//   "/runningProjectsByManager",
//   authMiddleWare,
//   getRunningProjectsByManager
// );
router.get(
  "/runningProjectsByManager",
  authMiddleWare,
  AllProjectInProgressUnderManager
);
router.get("/getAllTasksByDepartment", authMiddleWare, getAllTasksByDepartment);
// router.get("/getTasksByDepartment", authMiddleWare, getTasksByDepartment);
router.delete("/deleteTask/:id", authMiddleWare, deleteTask);

module.exports = router;
