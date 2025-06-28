const { default: mongoose } = require("mongoose");
const depModel = require("../models/depModel");
const employee = require("../models/employeeModel");
exports.getDepartmentDistribution = async (req, res) => {
  try {
    const result = await depModel.aggregate([
      {
        $lookup: {
          from: "employees", // collection name for employees
          localField: "_id", // department's _id
          foreignField: "department", // field in employees that references department
          as: "employees",
        },
      },
      {
        $project: {
          _id: 0,
          name: "$dep_name", // department's name
          value: { $size: "$employees" }, // number of employees in department
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
    const count = await depModel.estimatedDocumentCount();
    res.status(200).send({ success: true, countDep: count });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error counting departments",
      error: error.message,
    });
  }
};
exports.addDep = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const { dep_name, dep_desc, manager } = req.body;

      if (!dep_name || !manager) {
        return res.status(400).json({
          success: false,
          message: "Department name and manager are required.",
        });
      }

      const newDepartment = await depModel
        .create({
          dep_name,
          dep_desc,
          manager,
        })
        .session({ session });

      await employee.findByIdAndUpdate(manager, {
        department: newDepartment._id,
      });
    });

    res.status(200).json({
      success: true,
      message: "Department created and manager updated.",
      result: newDepartment,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create department." });
  }
};

exports.getAllDep = async (req, res) => {
  try {
    // Step 1: Get all departments with manager details
    const departments = await depModel
      .find({})
      .populate("manager", "emp_name emp_email profileImage");

    // Step 2: For each department, count the number of employees
    const departmentsWithCount = await Promise.all(
      departments.map(async (dep) => {
        const count = await employee.countDocuments({
          department: dep._id,
        });
        return {
          ...dep.toObject(),
          employeeCount: count,
        };
      })
    );

    // Step 3: Send response
    res.status(200).json({
      success: true,
      result: departmentsWithCount,
    });
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch departments",
    });
  }
};

exports.getSingleDep = async (req, res) => {
  try {
    const result = await depModel.findById(req.params.id);
    res.status(200).send({ success: true, result });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteDep = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteDepartment = await depModel.findById({ _id: id });
    await deleteDepartment.deleteOne();
    res.status(200).send({ success: true, result: deleteDepartment });
  } catch (error) {
    console.log(error);
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

    const updatedDepartment = await depModel.findByIdAndUpdate(
      req.params.id,
      { dep_name, dep_desc, manager },
      { new: true }
    );

    if (!updatedDepartment) {
      return res
        .status(404)
        .json({ success: false, message: "Department not found." });
    }

    await employee.findByIdAndUpdate(manager, {
      department: updatedDepartment._id,
    });

    res.status(200).json({
      success: true,
      message: "Department updated and manager assigned.",
      result: updatedDepartment,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update department." });
  }
};
