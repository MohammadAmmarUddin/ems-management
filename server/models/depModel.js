const mongoose = require("mongoose");
const { Schema } = mongoose;

const departmentSchema = new Schema(
  {
    dep_name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    manager: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dep_desc: {
      type: String,
    },
  },
  { timestamps: true }
);

const Department = mongoose.model("department", departmentSchema);

module.exports = Department;
