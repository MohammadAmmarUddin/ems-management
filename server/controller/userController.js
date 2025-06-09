const userModel = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .send({ success: false, message: "Email and password are required" });
    }
    const user = await userModel.findOne({
      $or: [{ name: email }, { email: email }],
    });

    if (!user) {
      res.send({ message: "user not found" });
    }

    isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.send({ success: false, message: "password not matched" });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_KEY,
      {
        expiresIn: "3d",
      }
    );
    res.status(200).send({ token, user, success: true });
  } catch (error) {
    console.log(error);
  }
};
exports.verify = async (req, res) => {
  return res.status(200).send({ success: true, user: req.user });
};
exports.getAllUsers = async (req, res) => {
  try {
    const result = await userModel.find({});
    res.status(200).send({ result, success: true });
  } catch (error) {
    console.log(error);
  }
};

// forget password

exports.forgetPassword = async (req, res) => {
  const { email } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.json({ message: "user not registered" });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
    expiresIn: "5m",
  });

  var transporter = nodemailer.createTransport({
    auth: {
      user: "ammaraslam7164@gmail.com",
      pass: "wefopxlsdumlohpx",
    },
  });

  var mailOptions = {
    from: "ammaraslam7164@gmail.com",
    to: email,
    subject: "Sending Email for reset password",
    text: `http://localhost:5173/resetPassword/${token}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.send({ status: false, message: "error sending mail" });
    } else {
      console.log("Email sent: " + info.response);
      res.send({ status: true, message: "successfully sent!!" });
    }
  });
};

// reset password

exports.resetPassword = async (req, res) => {
  const { token } = req.params;

  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    const id = decoded.id;
    const hashPassword = await bcrypt.hash(password, 10);

    await userModel.findByIdAndUpdate({ _id: id }, { password: hashPassword });

    return res.json({ status: true, message: "successfully reset!" });
  } catch (err) {
    console.log(err);

    res.send({ status: false, message: "Something went wrong!" });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const userDelete = await userModel.findByIdAndDelete(id);
    if (!userDelete) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
