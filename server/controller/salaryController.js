const employee = require("../models/employeeModel");
const salary = require("../models/Salary");


 exports.getSalaryById=async (req, res) => {
  const { id } = req.params;
  try {
    const result = await salary.findById(id);
    if (!result) {
      return res.status(404).json({ message: 'Salary not found' });
    }
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('Error fetching result:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

exports.getAllSalaries = async (req, res) => {
  try {
   const salaries = await salary.find().populate("employeeId", "emp_name _id");

    res.status(200).json({ success: true, result: salaries });
  } catch (error) {
    console.error('Error fetching salaries:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.addSalary = async (req, res) => {
  try {
    const {
      employeeId,
      basicSalary,
      allowance,
      deductions,
      netSalary,
      payDate,
    } = req.body;

    // Validate required fields
    if (
      !employeeId ||
      basicSalary === undefined ||
      allowance === undefined ||
      deductions === undefined ||
      netSalary === undefined ||
      !payDate
    ) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // Optional: Check if employee exists
    const employeeExists = await employee.findById(employeeId);
    if (!employeeExists) {
      return res.status(404).json({ success: false, message: "Employee not found." });
    }

    // Create new salary entry
    const newSalary = new salary({
      employeeId,
      basicSalary,
      allowance,
      deductions,
      netSalary,
      payDate: new Date(Number(payDate)),
    });

    await newSalary.save();

    res.status(201).json({
      success: true,
      message: "Salary added successfully.",
      data: newSalary,
    });
  } catch (err) {
    console.error("Error adding salary:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

exports.editSalary = async (req, res) => {
  const { id } = req.params;
  const { emp_id, name, salary, month, year } = req.body;
  try {
    const updatedSalary = await salary.findByIdAndUpdate(
      id,
      { emp_id, name, salary, month, year },
      { new: true }
    );
    if (!updatedSalary) {
      return res.status(404).json({ message: 'Salary not found' });
    }
    res.status(200).json({ success: true, message: 'Salary updated successfully', salary: updatedSalary });
  } catch (error) {
    console.error('Error updating salary:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
exports.deleteSalary = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedSalary = await salary.findByIdAndDelete(id);
    if (!deletedSalary) {
      return res.status(404).json({ message: 'Salary not found' });
    }
    res.status(200).json({ success: true, message: 'Salary deleted successfully' });
  } catch (error) {
    console.error('Error deleting salary:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

