const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const salarySchema = new mongoose.Schema(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "employees",
      required: true,
    },
    basicSalary: {
      type: Number,
      required: true,
    },
    allowance: {
      type: Number,
    },
    deductions: {
      type: Number,
    },
    netSalary: {
      type: Number,
    },

    payDate: {
      type: Date,
    },
    createdAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const salary = mongoose.model("salary", salarySchema);

module.exports = salary;
