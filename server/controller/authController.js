const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const employee = require("../models/employeeModel.js");
require("dotenv").config();

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user =
      (await User.findOne({ email })) ||
      (await employee.findOne({ emp_id: email }));

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
    const emp = await User.findOne({ _id: id }); // or { id: id } if you're using a custom field name

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
    const result = await User.find({});
    res.status(200).send({ result, success: true });
  } catch (error) {
    console.log(error);
  }
};

exports.verify = async (req, res) => {
  return res.status(200).send({ success: true, user: req.user });
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
  console.log(token);

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
