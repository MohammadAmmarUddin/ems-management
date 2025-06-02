const employee = require("../models/employeeModel");
const employeeModel = require("../models/employeeModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.totalEmployeesCount = async (req, res) => {

  try {
    const totalEmployees = await employeeModel.estimatedDocumentCount();
    res.status(200).json({ success: true, totalEmployees });
  } catch (error) {
    console.error("Error fetching total employees count:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}


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
      return res.status(400).json({ success: false, message: "Employee ID is required" });
    }

    // Fetch the employee from the database
    const emp = await employeeModel.findOne({ _id: id }); // or { id: id } if you're using a custom field name

    if (!emp) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    // Send the employee data as a response
    res.status(200).json({ success: true, employee: emp });
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(500).json({ success: false, message: "Error fetching employee data" });
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
  const {
    emp_id,
    emp_name,
    dep_name,
    emp_email,
    emp_phone,
    salary,
    role,
    designation,
    image,
    password,
  } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Create the new employee with the hashed password
    const newEmp = await employeeModel.create({
      emp_id,
      emp_name,
      dep_name,
      emp_email,
      emp_phone,
      salary,
      role,
      designation,
      image,
      password: hashedPassword, // Store the hashed password
    });

    // Send a response (You can customize this as needed)
    res.status(201).json({
      success: true,
      message: "Employee added successfully",
      employee: newEmp,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to add employee",
      error: error.message,
    });
  }
};

exports.searchEmployee = async (req, res) => {
  const searchQuery = req.query.query || ''; // Get the search query from the request

  try {
    const employees = await employee.find({
      $or: [
        { emp_name: { $regex: searchQuery, $options: 'i' } }, // Case-insensitive search for emp_name
        { emp_id: { $regex: searchQuery, $options: 'i' } },
        { role: { $regex: searchQuery, $options: 'i' } },
        { dep_name: { $regex: searchQuery, $options: 'i' } }
      ]
    });

    res.json({ emp: employees });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees', error });
  }
}


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {return res.status(400).send({ success: false, message: "Email and password are required" });}
    const user =
     
      (await employee.findOne({  $or: [
        { emp_email: email },
        { emp_name: email },
        { emp_phone: email }
      ] }));

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

exports.verify = async (req, res) => {
 
  
  return res.status(200).send({ success: true, user: req.user });
};

// forget password

exports.forgetPassword = async (req, res) => {
  const { email } = req.body;

  const user = await employee.findOne({ email });
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

    await employee.findByIdAndUpdate({ _id: id }, { password: hashPassword });

    return res.json({ status: true, message: "successfully reset!" });
  } catch (err) {
    console.log(err);

    res.send({ status: false, message: "Something went wrong!" });
  }
};

exports.deleteEmployee = async (req, res) => {

  const {id}= req.params;
  try {
    const deletedEmployee= await employeeModel.findByIdAndDelete(id);
    if (!deletedEmployee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    res.status(200).json({ success: true, message: "Employee deleted successfully" });
    
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
    
  }

}