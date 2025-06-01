const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    emp_id: { type:String, unique: true },
    emp_name: { type: String },
    emp_email: { type: String, unique: true },
 emp_phone: { type: String, required: true, unique: true },

    dep_name: { type: String},
    salary: { type: String },
    role: { type: String },
    designation: { type: String },
    image: { type: String },
    password: { type: String },
  },
  { timestamps: true }
);

const employee = mongoose.model("employees", employeeSchema);

module.exports = employee;
