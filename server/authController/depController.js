
const depModel = require('../models/depModel')
exports.addDep = async (req, res) => {
  try {
    const { dep_name, dep_desc } = req.body;

    console.log(dep_name);

    const result = await depModel.create({
      dep_name,
      dep_desc,
    });
    res.send(result);
  } catch (error) {
    console.log(error);
  }
};

exports.getAllDep = async (req, res) => {
  try {
    const result = await depModel.find({});
    res.send(result);
  } catch (error) {}
};

exports.deleteDep = async (req, res) => {
  try {
  } catch (error) {}
};
