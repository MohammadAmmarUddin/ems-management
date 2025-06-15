const depModel = require("../models/depModel");
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
  try {
    const { dep_name, dep_desc } = req.body;

    console.log(dep_name);

    const result = await depModel.create({
      dep_name,
      dep_desc,
    });
    res.status(200).send({ success: true, result });
  } catch (error) {
    console.log(error);
  }
};

exports.getAllDep = async (req, res) => {
  try {
    const result = await depModel.find({});
    res.status(200).send({ success: true, result });
  } catch (error) {
    console.log(error);
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
    res.status(200).send({ success: true, result });
  } catch (error) {
    console.log(error);
  }
};

exports.updateDep = async (req, res) => {
  try {
    const { dep_name, dep_desc } = req.body;

    const result = await depModel.findByIdAndUpdate(
      req.params.id,
      { dep_name, dep_desc },
      { new: true }
    );

    res.status(200).send({ success: true, result });
  } catch (error) {}
};
