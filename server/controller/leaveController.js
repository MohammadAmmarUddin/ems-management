const employeeModel = require("../models/employeeModel");
const leave = require("../models/leave");


exports.getAllLeaves = async (req, res) => {
  const result = await leave.find({});
  res.status(200).send({ result, success: true });
};

exports.getLeave = async (req, res) => {
  const { id } = req.params;
  const leaves = await leave.find({ employeeId: id });

  if (!leaves) {
    return res.status(404).send({ success: false, message: "No leaves found" });
  }

  res.status(200).send({ success: true, leaves });
};

exports.addLeave = async (req, res) => {
  const { userId, leaveType, startDate, endDate, reason } = req.body;
  if (!userId || !leaveType || !startDate || !endDate || !reason) {
    return res.status(400).send({ error: "All fields are required", success: false });
  }

  const result = await leave.create({
    employeeId: userId,
    leaveType,
    startDate,
    endDate,
    reason,
    
  });

  res.status(200).send({ result, success: true });
};

exports.approveLeave = async (req, res) => {
  try {
    console.log(`Approving leave with ID: ${req.params.id}`);
     const { id } = req.params;
    const result = await leave.findByIdAndUpdate(
       id,
      { status: "Approved" },
      { new: true }
    );
    res.status(200).json({ message: "Result approved", result });
  } catch (err) {
    res.status(500).json({ error: "Failed to approve result" });
  }
};

exports.rejectLeave = async (req, res) => {
  try {
   console.log(`Rejecting leave with ID: ${req.params.id}`);
     const { id } = req.params;
    const result = await leave.findByIdAndUpdate(
      id,
      { status: "Rejected" },
      { new: true }
    );
    res.status(200).json({ message: "Leave rejected", result });
  } catch (err) {
    res.status(500).json({ error: "Failed to reject leave" });
  }
};


exports.getLeavesByStatus = async (req, res) => {
  const { status } = req.params;

  const validStatuses = ["pending", "approved", "rejected"];
  if (!validStatuses.includes(status)) {
    return res.status(400).send({ success: false, message: "Invalid status" });
  }

  const leaves = await leave.find({ status });
  res.status(200).send({ success: true, leaves });
};
