const depModel = require("../models/depModel");
exports.addDep = async (req, res) => {
  try {
    const { dep_name, dep_desc } = req.body;

    console.log(dep_name);

    const result = await depModel.create({
      dep_name,
      dep_desc,
    });
    res.status(200).send({success:true,result})
  } catch (error) {
    console.log(error);
  }
};

exports.getAllDep = async (req, res) => {
  try {
    const result = await depModel.find({});
    res.status(200).send({success:true,result})
  } catch (error) {
    console.log(error);
  }
};
exports.getSingleDep = async (req, res) => {
  try {
    const result = await depModel.findById(req.params.id);
    res.status(200).send({success:true,result})
  } catch (error) {
    console.log(error);
  }
};

exports.deleteDep = async (req, res) => {
  try {
    const result = await depModel.findByIdAndDelete({ _id: req.params.id });
    res.status(200).send({success:true,result})
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

    res.status(200).send({success:true,result})
  } catch (error) {}
};
