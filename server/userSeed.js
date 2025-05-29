const User = require("./models/User.js");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const employee = require("./models/employeeModel.js");
const userRegister = async () => {
  try {
    const hashPassword = await bcrypt.hash("admin", 10);
    mongoose.connect(
      "mongodb+srv://safara:safara@cluster0.t9lecvs.mongodb.net/EMS?retryWrites=true&w=majority&appName=Cluster0"
    );

    await employee.create({
   
    emp_id: "1",
    emp_name: "admin",
    dep_name: "it",
    salary: "2000000",
    role: "admin",
    phone: "1234567890",
    designation: "engineer",
    emp_email: "admin@gmail.com",
    image: "https://res.cloudinary.com/dqj1x8k2f/image/upload/v1738856260/ems/employee/employee.png",
    password: hashPassword,
    });
  } catch (error) {
    console.log(error);
  }
};
userRegister();
