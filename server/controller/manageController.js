const Manager = require("../models/managerModel");
const User = require("../models/User");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
exports.upload = multer({ storage });

// Add Manager
exports.addManager = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.startTransaction();

    const {
      mang_name,
      mang_email,
      mang_phone,
      gender,
      dob,
      marital_status,
      department,
      designation,
      role,
      salary,
      password,
    } = req.body;

    if (!mang_name || !mang_email || !mang_phone || !password || !department) {
      throw new Error("Required fields are missing.");
    }

    const profileImage = req.file ? req.file.filename : "";

    const [emailExists, phoneExists] = await Promise.all([
      User.findOne({ email: mang_email }).session(session),
      User.findOne({ phone: mang_phone }).session(session),
    ]);

    if (emailExists) throw new Error("Email already exists");
    if (phoneExists) throw new Error("Phone already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: mang_name,
      email: mang_email,
      phone: mang_phone,
      password: hashedPassword,
      role,
      profileImage,
    });

    const savedUser = await newUser.save({ session });

    const newManager = new Manager({
      userId: savedUser._id,
      mang_name,
      mang_email,
      mang_phone,
      gender,
      dob,
      marital_status,
      department,
      designation,
      role,
      salary,
      profileImage,
    });

    const savedManager = await newManager.save({ session });

    await session.commitTransaction();
    res.status(201).json({ success: true, manager: savedManager });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};

// Get All Managers
exports.getAllManagers = async (req, res) => {
  try {
    console.log("get all managers called");
    const managers = await Manager.find().populate("department", "dep_name");
    res.status(200).json({ success: true, result: managers });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch managers" });
  }
};

// Get Single Manager
exports.getManager = async (req, res) => {
  const { id } = req.params;
  try {
    const manager = await Manager.findById(id).populate(
      "department",
      "dep_name"
    );
    if (!manager)
      return res
        .status(404)
        .json({ success: false, message: "Manager not found" });
    res.status(200).json({ success: true, manager });
  } catch {
    res.status(500).json({ success: false, message: "Error fetching manager" });
  }
};

// Update Manager
exports.updateManager = async (req, res) => {
  const { id } = req.params;
  const {
    mang_name,
    mang_email,
    mang_phone,
    gender,
    dob,
    marital_status,
    department,
    designation,
    role,
    salary,
    password,
  } = req.body;

  const updateFields = {
    mang_name,
    mang_email,
    mang_phone,
    gender,
    dob,
    marital_status,
    department,
    designation,
    role,
    salary,
  };

  try {
    const manager = await Manager.findById(id);
    if (!manager)
      return res
        .status(404)
        .json({ success: false, message: "Manager not found" });

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.findById(manager.userId);
      if (user) user.password = hashedPassword;
      await user.save();
    }

    if (req.file) {
      if (manager.profileImage) {
        const oldPath = path.join(
          __dirname,
          "../public/uploads",
          manager.profileImage
        );
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      updateFields.profileImage = req.file.filename;
    }

    const updatedManager = await Manager.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );
    res.status(200).json({ success: true, manager: updatedManager });
  } catch {
    res.status(500).json({ success: false, message: "Update failed" });
  }
};

// Delete Manager
exports.deleteManager = async (req, res) => {
  const { id } = req.params;
  try {
    const manager = await Manager.findById(id);
    if (!manager)
      return res
        .status(404)
        .json({ success: false, message: "Manager not found" });

    await User.findByIdAndDelete(manager.userId);
    await Manager.findByIdAndDelete(id);

    if (manager.profileImage) {
      const imgPath = path.join(
        __dirname,
        "../public/uploads",
        manager.profileImage
      );
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    res.status(200).json({ success: true, message: "Manager deleted" });
  } catch {
    res.status(500).json({ success: false, message: "Deletion failed" });
  }
};

// Total Manager Count
exports.totalManagersCount = async (req, res) => {
  try {
    const count = await Manager.estimatedDocumentCount();
    res.status(200).json({ success: true, totalManagers: count });
  } catch {
    res
      .status(500)
      .json({ success: false, message: "Error counting managers" });
  }
};

// Search Managers
exports.searchManager = async (req, res) => {
  const { query } = req.query;
  try {
    const managers = await Manager.find({
      $or: [
        { mang_name: { $regex: query, $options: "i" } },
        { mang_email: { $regex: query, $options: "i" } },
        { mang_phone: { $regex: query, $options: "i" } },
        { role: { $regex: query, $options: "i" } },
      ],
    }).populate("department", "dep_name");

    res.status(200).json({ success: true, managers });
  } catch {
    res.status(500).json({ success: false, message: "Search failed" });
  }
};
