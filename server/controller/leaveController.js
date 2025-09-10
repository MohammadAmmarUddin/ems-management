const Leave = require("../models/leave");
const Employee = require("../models/employeeModel");

exports.getLeaveStatusStats = async (req, res) => {
  try {
    const result = await Leave.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $project: { _id: 0, name: "$_id", value: "$count" } },
    ]);

    const allStatuses = ["Approved", "Pending", "Rejected"];
    const filledResult = allStatuses.map((status) => {
      const found = result.find((item) => item.name === status);
      return { name: status, value: found ? found.value : 0 };
    });

    const totalLeaves = filledResult.reduce((sum, item) => sum + item.value, 0);

    res
      .status(200)
      .json({ success: true, statusBreakdown: filledResult, totalLeaves });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

exports.updateLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { leaveType, startDate, endDate, reason } = req.body;
    const updatedLeave = await Leave.findByIdAndUpdate(
      id,
      { leaveType, startDate, endDate, reason },
      { new: true }
    );
    res.status(200).json({ success: true, updatedLeave });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({})
      .populate({
        path: "empId", // ✅ must match schema field
        select: "employeeId emp_name emp_email department role", // safe fields
        populate: {
          path: "department", // ✅ nested populate for department details
          select: "dep_name dep_desc", // only return department fields you need
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, result: leaves });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch leaves",
      error: error.message,
    });
  }
};
exports.filterByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const validStatuses = ["Pending", "Approved", "Rejected"];
    if (!validStatuses.includes(status))
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });

    const leaves = await Leave.find({ status })
      .populate({
        path: "empId",
        select: "employeeId emp_name emp_email department role",
        populate: { path: "department", select: "dep_name dep_desc" },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, result: leaves });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};
exports.searchLeaves = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res
        .status(400)
        .json({ success: false, message: "Search query required" });
    }

    const regex = new RegExp(q, "i"); // case-insensitive search

    const leaves = await Leave.aggregate([
      {
        $lookup: {
          from: "employees",
          localField: "empId",
          foreignField: "_id",
          as: "employee",
        },
      },
      { $unwind: "$employee" },
      {
        $lookup: {
          from: "departments",
          localField: "employee.department",
          foreignField: "_id",
          as: "employee.department",
        },
      },
      {
        $unwind: {
          path: "$employee.department",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $or: [
            { leaveType: regex },
            { reason: regex },
            { status: regex },
            { "employee.emp_name": regex },
            { "employee.emp_email": regex },
            { "employee.employeeId": regex },
            { "employee.role": regex },
            { "employee.department.dep_name": regex },
          ],
        },
      },
      {
        $project: {
          leaveType: 1,
          startDate: 1,
          endDate: 1,
          reason: 1,
          status: 1,
          createdAt: 1,
          empId: "$employee._id",
          employeeId: "$employee.employeeId",
          emp_name: "$employee.emp_name",
          emp_email: "$employee.emp_email",
          role: "$employee.role",
          department: "$employee.department.dep_name",
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    res.status(200).json({ success: true, result: leaves });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to search leaves",
      error: error.message,
    });
  }
};

exports.getLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const leaves = await Leave.find({ empId: id });
    if (!leaves.length)
      return res
        .status(404)
        .json({ success: false, message: "No leaves found" });
    res.status(200).json({ success: true, leaves });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.addLeave = async (req, res) => {
  try {
    const { userId, leaveType, startDate, endDate, reason } = req.body;

    if (!userId || !leaveType || !startDate || !endDate || !reason) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const employee = await Employee.findOne({ userId });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found for this userId",
      });
    }

    const result = await Leave.create({
      empId: employee._id,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    res.status(201).json({ success: true, result });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Server Error. Please try again." });
  }
};

exports.approveLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Leave.findByIdAndUpdate(
      id,
      { status: "Approved" },
      { new: true }
    );
    res.status(200).json({ success: true, message: "Leave approved", result });
  } catch {
    res.status(500).json({ success: false, error: "Failed to approve leave" });
  }
};

exports.rejectLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Leave.findByIdAndUpdate(
      id,
      { status: "Rejected" },
      { new: true }
    );
    res.status(200).json({ success: true, message: "Leave rejected", result });
  } catch {
    res.status(500).json({ success: false, error: "Failed to reject leave" });
  }
};

exports.getLeavesByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const validStatuses = ["Pending", "Approved", "Rejected"];
    if (!validStatuses.includes(status))
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    const leaves = await Leave.find({ status }).populate(
      "empId",
      "emp_name emp_email employeeId department role"
    );
    res.status(200).json({ success: true, leaves });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
