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
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

exports.upload = multer({ storage: storage });

exports.totalEmployeesCount = async (req, res) => {
  try {
    const totalEmployees = await employeeModel.estimatedDocumentCount();
    res.status(200).json({ success: true, totalEmployees });
  } catch (error) {
    console.error("Error fetching total employees count:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getEmployees = async (req, res) => {
  const emp = await employeeModel.find({});

  res.status(200).send({ emp, success: true });
};

exports.getEmployee = async (req, res) => {
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
    const emp = await employeeModel.findOne({ _id: id }); // or { id: id } if you're using a custom field name

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

exports.editEmployee = async (req, res) => {
  const { id, ...updateData } = req.body;

  const updateEmployee = await employeeModel.findByIdAndUpdate(
    id,
    {
      $set: req.body,
    },

    { new: true }
  );

  if (!updateEmployee) {
    res.send({ success: false });
  }

  res
    .status(200)
    .send({ success: true, message: "updated success", updateEmployee });
};
exports.addEmployee = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      employeeId,
      emp_name,
      department,
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

    // Check for duplicate email
    const existingUser = await userModel
      .findOne({ email: emp_email })
      .session(session);
    if (existingUser) throw new Error("Email already exists");

    // Check for duplicate phone
    const existingPhone = await userModel
      .findOne({ phone: emp_phone })
      .session(session);
    if (existingPhone) throw new Error("Phone number already exists");

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new userModel({
      name: emp_name,
      email: emp_email,
      password: hashedPassword,
      role,
      phone: emp_phone,
      profileImage,
    });

    const savedUser = await newUser.save({ session });

    // Create employee and link to user via user _id or shared email
    const newEmployee = new employee({
      employeeId,
      emp_name,
      department,
      emp_email,
      emp_phone,
      dob,
      marital_status,
      gender,
      salary,
      role,
      designation,
      profileImage,
      userId: savedUser._id, // optional link if your schema supports it
    });

    const savedEmployee = await newEmployee.save({ session });

    // Update user with employeeId (if needed)
    savedUser.employeeId = savedEmployee._id;
    await savedUser.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "User and Employee created successfully",
      employee: savedEmployee,
      user: savedUser,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    // Delete uploaded file if exists
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
      message: error.message || "Transaction failed",
    });
  }
};

exports.searchEmployee = async (req, res) => {
  const searchQuery = req.query.query || ""; // Get the search query from the request

  try {
    const employees = await employee.find({
      $or: [
        { emp_name: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search for emp_name
        { emp_id: { $regex: searchQuery, $options: "i" } },
        { role: { $regex: searchQuery, $options: "i" } },
        { dep_name: { $regex: searchQuery, $options: "i" } },
      ],
    });

    res.json({ emp: employees });
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees", error });
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
    const result = await employee.find({});
    res.status(200).send({ result, success: true });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const emp = await employeeModel.findById(id);
    const deletedEmployee = await employeeModel.findByIdAndDelete(id);
    if (!deletedEmployee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    if (emp.profileImage) {
      const imagePath = path.join(
        __dirname,
        "../public/uploads",
        emp.profileImage
      );

      // Check if file exists before deleting
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    res
      .status(200)
      .json({ success: true, message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
