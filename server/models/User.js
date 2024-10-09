const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { Type: String, required: true },
  email: { Type: String, required: true },
  password: { Type: String, required: true },
  role: { Type: String, required: true, enum: ["admin", "employee"] },
  profileImage: { Type: String},
  name: { Type: String, required: true },
  
},{Timestamp:true});


const User = mongoose.model("user",userSchema)

export default User