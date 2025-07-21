const express = require("express");
const {
  createProject,
  getAllProjects,
  updateProject,
  deleteProject,
  deleteTask,
  assignTask,
  AllProjectInProgress,
  getProjectsByDepartment,
  getAllTasksByDepartment,
  AllProjectInProgressUnderManager,
  getTasksForEmployee,
  updateTaskStatus,
  getTaskCountByEmployee,
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
router.put("/updateTaskStatus/:id", authMiddleWare, updateTaskStatus);

router.get(
  "/runningProjectsByManager",
  authMiddleWare,
  AllProjectInProgressUnderManager
);
router.get("/getTaskCountByEmployee", authMiddleWare, getTaskCountByEmployee);
router.get("/getAllTasksByDepartment", authMiddleWare, getAllTasksByDepartment);
router.get("/getTasksForEmployee", authMiddleWare, getTasksForEmployee);
// router.get("/getTasksByDepartment", authMiddleWare, getTasksByDepartment);
router.delete("/deleteTask/:id", authMiddleWare, deleteTask);

module.exports = router;
