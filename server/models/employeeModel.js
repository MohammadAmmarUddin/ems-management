const mongoose = require("mongoose");
const { Schema } = require("./User");

const employeeSchema = new mongoose.Schema(
  {
    emp_id: { type:String },
    emp_name: { type: String },
    dep_name: { type: String},
    salary: { type: String },
    role: { type: String },
    designation: { type: String },
    image: { type: String },
    password: { type: String },
  },
  { timestamps: true }
);

const employee = mongoose.model("employee", employeeSchema);

module.exports = employee;
