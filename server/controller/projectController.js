const Project = require("../models/projectModel");

exports.assignTask = async (req, res) => {
  const { employee, taskTitle, taskDescription, deadline } = req.body;

  try {
    const project = await Project.findById(req.params.id);
    if (!project)
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });

    project.tasks.push({ employee, taskTitle, taskDescription, deadline });
    await project.save();

    res.status(200).json({ success: true, message: "Task assigned", project });
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
