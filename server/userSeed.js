const User = require("./models/User.js");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const userRegister = async () => {
  try {
    const hashPassword = await bcrypt.hash("employee", 10);
    mongoose.connect(
      "mongodb+srv://safara:safara@cluster0.t9lecvs.mongodb.net/EMS?retryWrites=true&w=majority&appName=Cluster0"
    );

    await User.create({
      name: "raihan",
      email: "employee@gmail.com",
      password: hashPassword,
      role: "employee",
    });
  } catch (error) {
    console.log(error);
  }
};
userRegister();
