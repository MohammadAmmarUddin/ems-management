const mongoose = require("mongoose");
const employee = require("./employeeModel");
const leave = require("./leave");
const salary = require("./Salary");
const depSchema = new mongoose.Schema(
  {
    dep_name: {
      type: String,
      required: true,
    },
    dep_desc: {
      type: String,
    },
  },
  { timestamps: true }
);
depSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      const employees = await employee.find({
        department: this._id,
      });

      const empIds = employees.map((emp) => emp._id);

      await employee.deleteMany({
        department: this._id,
      });

      await leave.deleteMany({ employeeId: { $in: empIds } });
      await salary.deleteMany({ employeeId: { $in: empIds } });
      next();
    } catch (error) {
      next(error);
    }
  }
);
const dep_model = mongoose.model("department", depSchema);

module.exports = dep_model;
