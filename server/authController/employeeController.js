const employeeModel = require("../models/employeeModel");

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

  console.log("id,updte data", id, updateData);

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
    salary,
    role,
    designation,
    image,
    password,
  } = req.body;

  const newEmp = await employeeModel.create({
    emp_id,
    emp_name,
    dep_name,
    salary,
    role,
    designation,
    image,
    password,
  });
  console.log(newEmp);
};
