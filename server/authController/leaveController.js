const employeeModel = require("../models/employeeModel");

exports.getAllLeaves = async (req, res) => {
  const result = await employeeModel.find({});

  res.status(200).send({ result, success: true });
};
exports.addLeave = async (req, res) => {
  const { userId, name, leave_type, department, days, status } = req.body;

  const result = await employeeModel.create({
    userId,
    name,
    leave_type,
    department,
    days,
    status,
  });

  res.status(200).send({ result, success: true });
};
