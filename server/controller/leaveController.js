const leave = require("../models/leave");

exports.getLeaveStatusStats = async (req, res) => {
  try {
    // Get the grouped leave counts by status
    const result = await leave.aggregate([
      {
        $group: {
          _id: "$status", // Group by leave status
          count: { $sum: 1 }, // Count the number of leaves per status
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id", // Rename _id to name (status)
          value: "$count", // Rename count to value
        },
      },
    ]);

    // All possible statuses we want to ensure exist in the result
    const allStatuses = ["Approved", "Pending", "Rejected"];

    // Ensure each expected status exists in the result (even if 0)
    const filledResult = allStatuses.map((status) => {
      const found = result.find((item) => item.name === status);
      return {
        name: status,
        value: found ? found.value : 0,
      };
    });

    // Calculate the total number of leaves
    const totalLeaves = filledResult.reduce((sum, item) => sum + item.value, 0);

    // Send response
    res.status(200).json({
      statusBreakdown: filledResult,
      totalLeaves,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
exports.updateLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { leaveType, startDate, endDate, reason } = req.body;
    console.log("req.body", req.body);
    const updateLeave = await leave.findByIdAndUpdate(
      id,
      { leaveType, startDate, endDate, reason },
      { new: true }
    );

    res.status(200).json({ success: true, updateLeave });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false });
  }
};

exports.getLeaveCountSperate = async (req, res) => {
  try {
    const result = await leave.aggregate([
      {
        $group: {
          _id: "$status",
          value: { $sum: 1 },
        },
      },
    ]);
  } catch (error) {}
};

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
  try {
    const { userId, leaveType, startDate, endDate, reason } = req.body;

    if (!userId || !leaveType || !startDate || !endDate || !reason) {
      res.status(400).json({
        success: false,
        message: "All fields are  required!",
      });
    }

    const result = await leave.create({
      employeeId: userId,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    res.status(200).send({ result, success: true });
  } catch (error) {
    console.log("from leave controller addLeave", error);
    res
      .status(500)
      .send({ error: "Server Error. Please try again.", success: false });
  }
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
