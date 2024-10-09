import User from "./models/User";
const bcrypt = require("bcrypt");
const userRegister = async () => {
  try {
    const hashPassword = await bcrypt.hash("admin", 10);
    const newUser = new User.create({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashPassword,
      role: "admin",
    });
  } catch (error) {console.log(error);}
};
userRegister()