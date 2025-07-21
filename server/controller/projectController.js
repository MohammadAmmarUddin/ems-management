const Project = require("../models/projectModel");
const employeeModel = require("../models/employeeModel.js");
const Department = require("../models/depModel");
const taskModel = require("../models/taskModel");

exports.totalPendingTasks = async (req, res) => {
  try {
    const tasks = await taskModel.find({ status: "pending" }).countDocuments();
    res.status(200).json({ success: true, totalPendingTasks: tasks });
  } catch (error) {
    console.error("Error fetching total pending tasks:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
exports.getAllTasksByDepartment = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("api called", userId);
    // Find logged-in employee with department populated
    const employee = await employeeModel
      .findOne({ userId })
      .populate("department");

    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    if (!employee.department) {
      return res.status(400).json({
        success: false,
        message: "Department not assigned to this employee",
      });
    }

    const departmentId = employee.department._id;

    const employeesInDepartment = await employeeModel
      .find({ department: departmentId })
      .select("_id");

    const employeeIds = employeesInDepartment.map((emp) => emp._id);

    const tasks = await taskModel
      .find({ employee: { $in: employeeIds } })
      .populate({
        path: "employee",
        select: "emp_name emp_email department",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, result: tasks });
  } catch (error) {
    console.error("Error fetching department tasks:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await taskModel.findByIdAndDelete(req.params.id);

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
// GET /api/projects/getEmployeeTasks

exports.getTaskCountByEmployee = async (req, res) => {
  try {
    const userId = req.user._id;
    const employee = await employeeModel.findOne({ userId });
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }
    const count = await taskModel.countDocuments({ employee: employee._id });
    res.status(200).json({ success: true, count });
  } catch (error) {
    console.error("Error getting task count:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
exports.getTasksForEmployee = async (req, res) => {
  try {
    const userId = req.user._id;
    const employee = await employeeModel.findOne({ userId });
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }
    const tasks = await taskModel
      .find({ employee: employee._id })
      .populate("project", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, result: tasks });
  } catch (error) {
    console.error("Error fetching employee tasks:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updatedTask = await taskModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      result: updatedTask,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.assignTask = async (req, res) => {
  try {
    const { project, employee, taskTitle, taskDescription, deadline } =
      req.body;

    console.log("Assigning task with data:", req.body);

    if (!project || !employee || !taskTitle) {
      return res.status(400).json({
        success: false,
        message: "Project, Employee, and Task Title are required",
      });
    }

    const task = await taskModel.create({
      project,
      employee,
      taskTitle,
      taskDescription,
      deadline,
    });

    return res
      .status(200)
      .json({ success: true, message: "Task assigned successfully", task });
  } catch (error) {
    console.error("Error assigning task:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTasksByDepartment = async (req, res) => {
  try {
    const employee = await employeeModel
      .findById(req.user._id)
      .populate("department");

    if (!employee || !employee.department) {
      return res
        .status(404)
        .json({ success: false, message: "Department not found" });
    }

    const tasks = await taskModel
      .find({})
      .populate({
        path: "employee",
        match: { department: employee.department._id },
        select: "emp_name emp_email",
      })
      .sort({ createdAt: -1 });

    // Filter out tasks with null employee due to mismatch
    const filteredTasks = tasks.filter((task) => task.employee !== null);

    res.status(200).json({ success: true, result: filteredTasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(200).json({ success: true, result: project });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.AllProjectInProgress = async (req, res) => {
  try {
    const projects = await Project.find({ status: "in progress" });
    const projectsCount = await Project.countDocuments({
      status: "in progress",
    });
    res.status(200).json({ success: true, projects, projectsCount });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res
      .status(500)
      .json({ success: false, message: "Error Fetching Projects" });
  }
};
exports.AllProjectInProgressUnderManager = async (req, res) => {
  try {
    const managerId = req.user._id;
    const manager = await employeeModel.findOne({ userId: managerId });

    if (!manager) {
      return res
        .status(404)
        .json({ success: false, message: "Manager not found" });
    }
    const department = await Department.findOne({
      _id: manager.department,
    });
    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found for this manager",
      });
    }
    const projects = await Project.find({
      status: "in progress",
      department: department?._id,
    });
    const projectsCount = await Project.countDocuments({
      status: "in progress",
      department: department?._id,
    });
    if (!projects || projects.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No in-progress projects found for this manager",
      });
    }
    res.status(200).json({ success: true, projects, projectsCount });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res
      .status(500)
      .json({ success: false, message: "Error Fetching Projects" });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({}).populate({
      path: "department",
      select: "dep_name manager emp_name",
      populate: {
        path: "manager",
        model: "employees",
        select: "emp_name  emp_email profileImage emp_phone",
      },
    });

    res.status(200).json({ success: true, result: projects });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("department", "dep_name")
      .populate("manager", "emp_name")
      .populate("assignedEmployees", "emp_name");
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    res.status(200).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProjectsByDepartment = async (req, res) => {
  try {
    const userCheckId = req.user._id;

    // Check if user exists in employees collection
    const employee = await employeeModel
      .findOne({ userId: userCheckId })
      .populate({
        path: "department",
        select: "dep_name manager",
        populate: {
          path: "manager",
          model: "employees",
          select: "emp_name emp_email",
        },
      });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "User not found in employees.",
      });
    }

    if (!employee.department) {
      return res.status(400).json({
        success: false,
        message: "Department not assigned to this employee.",
      });
    }

    const departmentId = employee.department._id;

    // Fetch projects under this department
    const projects = await Project.find({ department: departmentId })
      .populate({
        path: "department",
        select: "dep_name manager",
        populate: {
          path: "manager",
          model: "employees",
          select: "emp_name emp_email",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, result: projects });
  } catch (error) {
    console.error("Error fetching department projects:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    res.status(200).json({ success: true, project });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    res.status(200).json({ success: true, message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
