const Attendance = require("../models/attendance");
const employee = require("../models/employeeModel");
const { ObjectId } = require("mongoose"); // at the top of your file

exports.getAttendances = async (req, res) => {
  try {
    const date = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    const attendance = await Attendance.find({ date }).populate({
      path: "employeeId",
      populate: ["department", "userId"],
    });

    res.status(200).json({
      success: true,
      message: "Attendance fetched successfully",
      attendance,
    });
  } catch (error) {
    console.log("get attendances", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch attendance",
      error: error.message,
    });
  }
};

exports.updateAttendance = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { status } = req.body;
    const date = new Date().toISOString().split("T")[0];
    const emp = await employee.findOne({ _id: employeeId });

    const attendance = await Attendance.findOneAndUpdate(
      {
        employeeId: emp._id,
        date: date,
      },
      { status },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Attendance updated successfully",
      attendance,
    });
  } catch (error) {
    console.log("update attendance error", error);
  }
};
exports.attendanceReport = async (req, res) => {
  try {
    const { date, limit = 5, skip = 0 } = req.query;
    const query = {};

    if (date) {
      query.date = date;
    }

    const attendanceData = await Attendance.find(query)
      .populate({
        path: "employeeId",
        populate: ["department", "userId"],
      })
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const groupData = attendanceData.reduce((acc, att) => {
      // 🧠 Skip invalid or unpopulated attendance
      if (!att || !att.employeeId) {
        console.warn("⚠️ Skipping invalid attendance record:", att?._id);
        return acc;
      }

      const dateKey =
        att.date instanceof Date
          ? att.date.toISOString().split("T")[0]
          : att.date;

      if (!acc[dateKey]) acc[dateKey] = [];

      acc[dateKey].push({
        employeeId: att.employeeId.employeeId || "N/A",
        name: att.employeeId.userId?.name || "Unknown",
        department: att.employeeId.department?.dep_name || "N/A",
        status: att.status || "Not Marked",
      });

      return acc;
    }, {});

    res.status(200).json({
      success: true,
      groupData,
    });
  } catch (error) {
    console.error("attendance report error", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
