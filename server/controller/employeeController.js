const employee = require("../models/employeeModel");
const employeeModel = require("../models/employeeModel");
const userModel = require("../models/User");
const fs = require("fs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
require("dotenv").config();
const path = require("path");
const User = require("../models/User");
const Attendance = require("../models/attendance");
const leave = require("../models/leave");
const salary = require("../models/Salary");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

exports.upload = multer({ storage: storage });

exports.getActiveEmployeesUnderManager = async (req, res) => {
  try {
    const managerId = req.user._id;
    // Step 1: Find manager and populate department
    const manager = await employeeModel
      .findOne({ userId: managerId, role: "manager" })
      .populate("department");

    if (!manager) {
      return res.status(404).json({
        success: false,
        message: "Manager not found",
      });
    }

    if (!manager.department || !manager.department._id) {
      return res.status(400).json({
        success: false,
        message: "Manager has no assigned department",
      });
    }

    const departmentId = manager.department._id;

    // Step 2: Find employees in same department and populate active users
    const employees = await employeeModel
      .find({
        department: departmentId,
        role: "employee",
      })
      .populate("department", "dep_name")
      .populate({
        path: "userId",
        match: { isActive: true }, // ✅ only online users
        select: "-password -profileImage",
      });
    // Step 3: Filter only employees whose user is active
    const onlineEmployees = employees.filter((emp) => emp.userId);
    // Step 4: Format response
    const result = onlineEmployees.map((emp) => ({
      _id: emp._id,
      emp_name: emp.emp_name,
      emp_email: emp.emp_email,
      emp_phone: emp.emp_phone,
      designation: emp.designation,
      department: emp.department?.dep_name || "N/A",
      user: {
        _id: emp.userId._id,
        name: emp.userId.name,
        email: emp.userId.email,
        role: emp.userId.role,
        isActive: emp.userId.isActive,
      },
    }));

    return res.status(200).json({ success: true, result });
  } catch (error) {
    console.error("Error fetching online employees under manager:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getAllManagers = async (req, res) => {
  try {
    const managers = await employeeModel
      .find({ role: "manager" })
      .populate("department", "dep_name");

    res.status(200).json({
      success: true,
      managers,
    });
  } catch (error) {
    console.error("Error fetching managers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch managers",
    });
  }
};
exports.totalEmployeesCount = async (req, res) => {
  try {
    const totalEmployees = await employeeModel.countDocuments({
      role: "employee",
    });
    const totalManagers = await employeeModel.countDocuments({
      role: "manager",
    });

    res.status(200).json({ success: true, totalEmployees, totalManagers });
  } catch (error) {
    console.error("Error fetching total employees count:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getEmployees = async (req, res) => {
  const emp = await employeeModel.find({ role: "employee" });

  res.status(200).send({ emp, success: true });
};

exports.getEmployeesByDepartment = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("getByDepartment Called", userId);
    const employee = await employeeModel
      .findOne({ userId })
      .populate("department");
    console.log("employee", employee);
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

    // Fetch all employees in the same department
    const employees = await employeeModel
      .find({ department: employee.department._id })
      .select("-userId -salary -profileImage"); // Exclude sensitive fields if needed
    console.log("emplyees by department", employees);
    res.status(200).json({ success: true, result: employees });
  } catch (error) {
    console.error("Error fetching employees by department:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
exports.getEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Employee ID is required" });
    }

    // Fetch employee by _id or userId and populate department name
    const emp =
      (await employeeModel
        .findOne({ _id: id })
        .populate("department", "dep_name")) ||
      (await employeeModel
        .findOne({ userId: id })
        .populate("department", "dep_name"));

    if (!emp) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    return res.status(200).json({ success: true, employee: emp });
  } catch (error) {
    console.error("Error fetching employee:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error fetching employee data" });
  }
};

exports.editEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      employeeId,
      emp_name,
      department,
      emp_email,
      emp_phone,
      marital_status,
      dob,
      gender,
      salary,
      role,
      designation,
      password,
    } = req.body;

    // Prepare Employee update fields
    const updateEmployeeFields = {
      employeeId,
      emp_name,
      department,
      emp_email,
      emp_phone,
      marital_status,
      dob,
      gender,
      salary,
      role,
      designation,
    };

    // Handle profile image
    if (req.file) {
      const employee = await employeeModel.findOne({ userId: id });
      if (employee && employee.profileImage) {
        const oldImagePath = path.join(
          __dirname,
          "..",
          "uploads",
          employee.profileImage
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateEmployeeFields.profileImage = req.file.filename;
    }

    // Prepare User update fields
    const updateUserFields = {
      name: emp_name,
      email: emp_email,
      role: role,
    };
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateUserFields.password = hashedPassword;
    }

    // ✅ Only use transaction if both Employee & User need updating
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const employee = await employeeModel
        .findOne({ userId: id })
        .session(session);
      const userFromDb = await userModel.findById(id).session(session);

      if (!employee || !userFromDb) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }

      // Update Employee
      const updatedEmployee = await employeeModel.findOneAndUpdate(
        { userId: id },
        { $set: updateEmployeeFields },
        { new: true, session }
      );

      // Update User
      await userModel.findByIdAndUpdate(
        id,
        { $set: updateUserFields },
        { new: true, session }
      );

      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
        success: true,
        message: "Employee and User updated successfully",
        updatedEmployee,
      });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  } catch (error) {
    console.error("Update error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
exports.addEmployee = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const {
        employeeId,
        emp_name,

        emp_email,
        emp_phone,
        dob,
        marital_status,
        gender,
        salary,
        role,
        designation,
        password,
      } = req.body;

      if (!employeeId || !emp_name || !emp_email || !emp_phone || !password) {
        throw new Error("Required fields are missing.");
      }

      const profileImage = req.file ? req.file.filename : "";

      if (req.file) {
        const imagePath = path.join(
          __dirname,
          "../public/uploads",
          profileImage
        );
        if (!fs.existsSync(imagePath)) {
          throw new Error("Uploaded profile image not found.");
        }
      }
      const departmentId = req.body.department || null;

      // Check for existing email and phone inside transaction
      const existingEmail = await userModel.findOne({ email: emp_email });

      const existingPhone = await userModel.findOne({ phone: emp_phone });

      if (existingEmail) throw new Error("Email already exists");
      if (existingPhone) throw new Error("Phone number already exists");

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new userModel({
        name: emp_name,
        email: emp_email,
        password: hashedPassword,
        role,
        phone: emp_phone,
        profileImage,
      });

      const savedUser = await newUser.save({ session });

      if (!savedUser || !savedUser._id) {
        throw new Error("User creation failed");
      }

      const newEmployee = new employee({
        employeeId,
        emp_name,
        department: departmentId || undefined,
        emp_email,
        emp_phone,
        dob,
        marital_status,
        gender,
        salary,
        role,
        designation,
        profileImage,
        userId: savedUser._id,
      });

      await newEmployee.save({ session });
    });

    res.status(201).json({
      success: true,
      message: "User and Employee created successfully",
    });
  } catch (error) {
    console.error("Error in addEmployee:", error);

    if (req.file) {
      const imagePath = path.join(
        __dirname,
        "../public/uploads",
        req.file.filename
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.status(500).json({
      success: false,
      message: error.message || "Failed to add employee",
    });
  } finally {
    session.endSession();
  }
};
exports.searchEmployee = async (req, res) => {
  try {
    const { q = "", page = 1, limit = 5, all = "false" } = req.query;

    // Build the query
    let query = {};
    if (q) {
      const searchRegex = { $regex: q, $options: "i" }; // case-insensitive

      query = {
        $or: [
          { emp_name: searchRegex },
          { employeeId: searchRegex },
          { role: searchRegex },
          { "department.dep_name": searchRegex },
        ],
      };

      // If the query contains digits, also search emp_phone
      if (/\d/.test(q)) {
        query.$or.push({
          emp_phone: { $regex: q.replace(/\D/g, ""), $options: "i" },
        });
      }
    }

    // Count total matches
    const total = await employeeModel.countDocuments(query);

    // Fetch employees
    let employees;
    if (all === "true") {
      employees = await employeeModel.find(query).sort({ createdAt: -1 });
    } else {
      employees = await employeeModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));
    }

    res.json({
      success: true,
      total,
      page: Number(page),
      limit: all === "true" ? total : Number(limit),
      employees,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getSingleUser = async (req, res) => {
  try {
    // Use req.params if the ID is in the URL, or req.query if it's passed as a query string
    const { id } = req.params; // or req.query.id if passed as query parameter

    // Ensure id is provided
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Employee ID is required" });
    }

    // Fetch the employee from the database
    const emp = await employee.findOne({ _id: id }); // or { id: id } if you're using a custom field name

    if (!emp) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    // Send the employee data as a response
    res.status(200).json({ success: true, employee: emp });
  } catch (error) {
    console.error("Error fetching employee:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching employee data" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const result = await employeeModel
      .find({ role: "employee" })
      .populate("department", "dep_name"); // Populate only dep_name from department

    res.status(200).send({ result, success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Failed to fetch employees" });
  }
};
exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    const emp = await employeeModel.findOne({ userId: id });

    if (!emp) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    // Delete related Attendance, Leave, Salary records
    await Attendance.deleteMany({ employeeId: emp._id });
    await leave.deleteMany({ employeeId: emp._id });
    await salary.deleteMany({ employeeId: emp._id });

    // Delete profile image if exists
    if (emp.profileImage) {
      const imagePath = path.join(
        __dirname,
        "../public/uploads",
        emp.profileImage
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete employee record
    await employeeModel.findOneAndDelete({ userId: id });

    // Delete from User collection
    const deleteFromUser = await User.findByIdAndDelete(id);

    if (!deleteFromUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Employee and related data deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting employee:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
