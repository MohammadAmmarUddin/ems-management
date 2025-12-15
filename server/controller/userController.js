const userModel = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();
const UAParser = require("ua-parser-js");

exports.logoutUser = async (req, res) => {
  try {
    const userId = req.user.id;
    await userModel.findByIdAndUpdate(userId, { isActive: false });
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Logout failed" });
  }
};

exports.getActiveUsers = async (req, res) => {
  try {
    const activeUsers = await userModel
      .find({ isActive: true })
      .select("-password");
    return res.status(200).json({ success: true, result: activeUsers });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const ip = req.headers["x-forwarded-for"] || req.ip;
    const parser = new UAParser(req.headers["user-agent"]);
    const device = `${parser.getDevice().model || "Unknown"} - ${
      parser.getOS().name
    }`;

    const user = await userModel.findOne({
      $or: [{ name: email }, { email: email }],
    });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    user.isActive = true;
    user.lastLogin = new Date();
    user.meta = { ...user.meta, lastLoginIp: ip, lastLoginDevice: device };

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: "3d" }
    );

    await user.save();
    return res.status(200).json({ token, user, success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.verify = async (req, res) => {
  return res.status(200).json({ success: true, user: req.user });
};

exports.getAllUsers = async (req, res) => {
  try {
    const result = await userModel.find({});
    return res.status(200).json({ result, success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not registered" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
      expiresIn: "5m",
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password",
      text: `http://localhost:5173/resetPassword/${token}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res
          .status(500)
          .json({ success: false, message: "Error sending email" });
      }
      return res
        .status(200)
        .json({ success: true, message: "Reset link sent" });
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const id = decoded.id;

    const hashPassword = await bcrypt.hash(password, 10);

    await userModel.findByIdAndUpdate(id, { password: hashPassword });
    return res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

// Update own profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, email, phone, preferences } = req.body;

    const update = {};
    if (name) update.name = name;
    if (email) update.email = email;
    if (phone) update["meta.phone"] = phone;
    if (preferences) update["meta.preferences"] = preferences;

    const updatedUser = await userModel
      .findByIdAndUpdate(userId, { $set: update }, { new: true })
      .select("-password");

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res
      .status(200)
      .json({ success: true, user: updatedUser, message: "Profile updated" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Change password (requires current password)
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current and new password required",
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userDelete = await userModel.findByIdAndDelete(id);

    if (!userDelete) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
