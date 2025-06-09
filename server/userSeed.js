const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const employee = require("./models/employeeModel.js");
const User = require("./models/User.js");
const userRegister = async () => {
  try {
    const hashPassword = await bcrypt.hash("admin", 10);
    mongoose.connect(
      "mongodb+srv://safara:safara@cluster0.t9lecvs.mongodb.net/EMS?retryWrites=true&w=majority&appName=Cluster0"
    );

    await User.create({
      name: "Admin",
      role: "admin",
      email: "admin@gmail.com",
      profileImage:
        "https://res.cloudinary.com/dq1xj3k2h/image/upload/v1735688850/ems/admin.png",
      password: hashPassword,
    });
  } catch (error) {
    console.log(error);
  }
};
userRegister();
