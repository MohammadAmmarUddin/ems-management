const mongoose = require("mongoose");

const depSchema = new mongoose.Schema({
  dep_name: {
    type: String,
    required: true,
  },
  dep_desc: {
    type: String,
  },
});

const dep_model = mongoose.model("department", depSchema);

module.exports = dep_model;
