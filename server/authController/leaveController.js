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
    status: "pending",
  });

  res.status(200).send({ result, success: true });
};

exports.approveLeave = async (req, res) => {
  const { id } = req.params;

  const leaveRequest = await leave.findById(id);
  if (!leaveRequest) {
    return res.status(404).send({ success: false, message: "Leave request not found" });
  }

  if (leaveRequest.status === "approved") {
    return res.status(400).send({ success: false, message: "Leave is already approved" });
  }

  if (leaveRequest.status === "rejected") {
    return res.status(400).send({ success: false, message: "Leave is already rejected" });
  }

  leaveRequest.status = "approved";
  const result = await leaveRequest.save();

  res.status(200).send({ success: true, message: "Leave approved", leave: result });
};

exports.rejectLeave = async (req, res) => {
  const { id } = req.params;

  const leaveRequest = await leave.findById(id);
  if (!leaveRequest) {
    return res.status(404).send({ success: false, message: "Leave request not found" });
  }

  if (leaveRequest.status === "approved") {
    return res.status(400).send({ success: false, message: "Leave is already approved" });
  }

  if (leaveRequest.status === "rejected") {
    return res.status(400).send({ success: false, message: "Leave is already rejected" });
  }

  leaveRequest.status = "rejected";
  const result = await leaveRequest.save();

  res.status(200).send({ success: true, message: "Leave rejected", leave: result });
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
