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
    const totalEmployees = await employeeModel.estimatedDocumentCount();
    res.status(200).json({ success: true, totalEmployees });
  } catch (error) {
    console.error("Error fetching total employees count:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getEmployees = async (req, res) => {
  const emp = await employeeModel.find({ role: "employee" });

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
    const emp =
      (await employeeModel.findOne({ _id: id })) ||
      (await employeeModel.findOne({ userId: id })); // or { id: id } if you're using a custom field name

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

    const updateFields = {
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
    // Handle optional password update
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    }

    const employee = await employeeModel.findById(id);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    // Handle optional image upload (local)
    if (req.file) {
      // Delete old image if it exists
      if (employee.profileImage) {
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

      updateFields.profileImage = req.file.filename; // just save the filename
    }

    const updatedEmployee = await employeeModel.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      updateEmployee: updatedEmployee,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.addEmployee = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.startTransaction();

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

    if (req.file) {
      const imagePath = path.join(__dirname, "../public/uploads", profileImage);
      if (!fs.existsSync(imagePath)) {
        throw new Error("Uploaded profile image not found.");
      }
    }

    // Check for existing email and phone
    const [existingEmail, existingPhone] = await Promise.all([
      userModel.findOne({ email: emp_email }).session(session),
      userModel.findOne({ phone: emp_phone }).session(session),
    ]);

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
      userId: savedUser._id,
    });

    const savedEmployee = await newEmployee.save({ session });

    await session.commitTransaction();
    res.status(201).json({
      success: true,
      message: "User and Employee created successfully",
      employee: savedEmployee,
    });
  } catch (error) {
    await session.abortTransaction();
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
    session.endSession(); // Always end session in finally
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
