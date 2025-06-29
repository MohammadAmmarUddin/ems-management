const employee = require("../models/employeeModel");
const salary = require("../models/Salary");

exports.getMonthlySalarySummary = async (req, res) => {
  try {
    const result = await salary.aggregate([
      {
        $group: {
          _id: { $month: "$payDate" }, // Extract month number (1-12)
          salary: { $sum: "$netSalary" },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          salary: 1,
        },
      },
      {
        $sort: { month: 1 },
      },
    ]);

    // Map month numbers to short names
    const MONTH_NAMES = [
      "",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const formatted = result.map((item) => ({
      name: MONTH_NAMES[item.month],
      salary: item.salary,
    }));

    res.status(200).send(formatted);
  } catch (error) {
    res.status(500).send({
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.totalSalary = async (req, res) => {
  try {
    const totalSalary = await salary.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$netSalary" },
          totalCount: { $sum: 1 },
        },
      },
    ]);

    res.status(200).send({ success: true, totalSalary });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error calculating total salary",
      error: error.message,
    });
  }
};

// exports.salaryCount = async (req, res) => {
//  try{
//     const count = await salary.estimatedDocumentCount();
//     res.status(200).send({ success: true, countSalary: count });
//  }
//  catch(error){
//   res.status(500).send({ success: false, message: "Error counting salaries", error: error.message });

//  }
// }
const mongoose = require("mongoose");

exports.getSalaryById = async (req, res) => {
  const { id } = req.params;

  try {
    const salaries = await salary.aggregate([
      {
        $match: { employeeId: new mongoose.Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: "employees",
          localField: "employeeId",
          foreignField: "userId",
          as: "employeeDetails",
        },
      },
      { $unwind: "$employeeDetails" },
      {
        $project: {
          _id: 1,
          basicSalary: 1,
          allowance: 1,
          deductions: 1,
          netSalary: 1,
          payDate: 1,
          emp_name: "$employeeDetails.emp_name",
          userId: "$employeeDetails.userId",
        },
      },
    ]);

    if (!salaries || salaries.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Salaries not found" });
    }

    res.status(200).json({ success: true, result: salaries });
  } catch (error) {
    console.error("Error fetching salaries:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getAllSalaries = async (req, res) => {
  try {
    const salaries = await salary.aggregate([
      {
        $lookup: {
          from: "employees", // collection name in your db
          localField: "employeeId", // field in salaries
          foreignField: "userId", // field in employees
          as: "employee",
        },
      },
      { $unwind: "$employee" },
      {
        $project: {
          _id: 1,
          basicSalary: 1,
          allowance: 1,
          deductions: 1,
          netSalary: 1,
          payDate: 1,
          "employee.emp_name": 1,
          "employee.userId": 1,
        },
      },
    ]);

    res.status(200).json({ success: true, result: salaries });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
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
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }
    console.log(req.body, "req.body");
    // Optional: Check if employee exists
    const employeeExists = await employee.find({ userId: employeeId });
    if (!employeeExists) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found." });
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
      return res.status(404).json({ message: "Salary not found" });
    }
    res.status(200).json({
      success: true,
      message: "Salary updated successfully",
      salary: updatedSalary,
    });
  } catch (error) {
    console.error("Error updating salary:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
exports.deleteSalary = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedSalary = await salary.findByIdAndDelete(id);
    if (!deletedSalary) {
      return res.status(404).json({ message: "Salary not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Salary deleted successfully" });
  } catch (error) {
    console.error("Error deleting salary:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
