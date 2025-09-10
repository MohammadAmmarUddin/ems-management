const mongoose = require("mongoose");
const Department = require("../models/depModel");
const Employee = require("../models/employeeModel");

exports.getDepartmentDistribution = async (req, res) => {
  try {
    const result = await Department.aggregate([
      {
        $lookup: {
          from: "employees",
          localField: "_id",
          foreignField: "department",
          as: "employees",
        },
      },
      {
        $project: {
          _id: 0,
          name: "$dep_name",
          value: { $size: "$employees" },
        },
      },
    ]);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.countDep = async (req, res) => {
  try {
    const count = await Department.estimatedDocumentCount();
    res.status(200).json({ success: true, count });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error counting departments",
      error: error.message,
    });
  }
};

exports.addDep = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { dep_name, dep_desc, manager } = req.body;
    if (!dep_name || !manager) {
      return res.status(400).json({
        success: false,
        message: "Department name and manager are required.",
      });
    }
    const newDepartment = await Department.create(
      [{ dep_name, dep_desc, manager }],
      { session }
    );
    await Employee.findByIdAndUpdate(
      manager,
      { department: newDepartment[0]._id },
      { session }
    );
    await session.commitTransaction();
    res.status(201).json({
      success: true,
      message: "Department created and manager updated.",
      result: newDepartment[0],
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      success: false,
      message: "Failed to create department.",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};
exports.getAllDep = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Department.countDocuments();

    const departments = await Department.find({})
      .populate({
        path: "manager",
        select: "name email profileImage", // ensure these fields exist in User model
      })
      .skip(skip)
      .limit(limit)
      .lean();

    const departmentsWithCount = await Promise.all(
      departments.map(async (dep) => {
        const count = await Employee.countDocuments({ department: dep._id });
        return { ...dep, employeeCount: count };
      })
    );

    res.status(200).json({
      success: true,
      result: departmentsWithCount,
      total,
      page,
      limit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch departments",
      error: error.message,
    });
  }
};
exports.searchDepartment = async (req, res) => {
  try {
    const { q = "", page = 1, limit = 5, all = "false" } = req.query;
    let query = {};
    if (q) {
      const regex = { $regex: q, $options: "i" };
      query = { $or: [{ dep_name: regex }, { dep_desc: regex }] };
      if (mongoose.Types.ObjectId.isValid(q)) {
        query.$or.push({ manager: q });
      }
    }
    const total = await Department.countDocuments(query);
    let departmentsQuery = Department.find(query)
      .populate("manager", "emp_name emp_email profileImage")
      .sort({ createdAt: -1 });
    if (all !== "true") {
      departmentsQuery = departmentsQuery
        .skip((page - 1) * limit)
        .limit(Number(limit));
    }
    const departments = await departmentsQuery;
    const departmentsWithCount = await Promise.all(
      departments.map(async (dep) => {
        const count = await Employee.countDocuments({ department: dep._id });
        return { ...dep.toObject(), employeeCount: count };
      })
    );
    res.json({
      success: true,
      total,
      page: Number(page),
      limit: all === "true" ? total : Number(limit),
      result: departmentsWithCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.getSingleDep = async (req, res) => {
  try {
    const result = await Department.findById(req.params.id).populate(
      "manager",
      "name email profileImage"
    );
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Department not found" });
    }
    res.status(200).json({ success: true, result });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

exports.deleteDep = async (req, res) => {
  try {
    const deleted = await Department.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Department not found" });
    }
    res.status(200).json({ success: true, result: deleted });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

exports.updateDep = async (req, res) => {
  try {
    const { dep_name, dep_desc, manager } = req.body;
    if (!dep_name || !manager) {
      return res.status(400).json({
        success: false,
        message: "Department name and manager are required.",
      });
    }
    const updated = await Department.findByIdAndUpdate(
      req.params.id,
      { dep_name, dep_desc, manager },
      { new: true }
    );
    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Department not found" });
    }
    await Employee.findByIdAndUpdate(manager, { department: updated._id });
    res.status(200).json({
      success: true,
      message: "Department updated and manager assigned.",
      result: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update department.",
      error: error.message,
    });
  }
};
