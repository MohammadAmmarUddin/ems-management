const Attendance = require("../models/attendance");
const employee = require("../models/employeeModel");
const defaultAttendance = async (req, res, next) => {
  try {
    const date = new Date().toISOString().split("T")[0];

    const existingAttendance = await Attendance.findOne({ date });

    if (!existingAttendance) {
      const employees = await employee.find({});
      const attendance = employees.map((emp) => ({
        date,
        employeeId: emp._id,
        status: null,
      }));
      await Attendance.insertMany(attendance);
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
module.exports = defaultAttendance;
