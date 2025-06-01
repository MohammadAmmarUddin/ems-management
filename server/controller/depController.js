const depModel = require("../models/depModel");

exports.getDepartmentDistribution = async (req, res) => {
  try {
    const result = await depModel.aggregate([
      {
        $lookup: {
          from: "employees",
          localField: "dep_name",
          foreignField: "dep_name",
          as: "employees"
        }
      },
      {
        $project: {
          name: 1,
          value: { $size: "$employees" }
        }
      }
    ]);

    res.status(200).json(result); // ✅ Return to frontend
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};

exports.countDep = async (req, res) => {

   try{
      const count= await depModel.estimatedDocumentCount();
      res.status(200).send({success:true,countDep:count})

   }
   catch(error){
     res.status(500).send({success:false,message:"Error counting departments",error:error.message});
   }
}
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
