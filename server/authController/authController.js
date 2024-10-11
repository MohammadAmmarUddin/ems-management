const User = require("../models/User.js");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      res.send({ message: "user not found" });
    }
    isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.send({ success: false, message: "password not matched" });
    }

    const token = jwt.sign({ _id: user._id, role: user.role }, "jwtkeysecret", {
      expiresIn: "3d",
    });
    console.log(user);
    res.status(200).json({ token, user, success: true });
  } catch (error) {
    console.log(error);
  }
};
