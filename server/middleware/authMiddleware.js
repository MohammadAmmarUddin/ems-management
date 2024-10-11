const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();
const verifyUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log("token verify", token);

    if (!token) {
      return res
        .status(404)
        .send({ success: false, error: "Token Not Providers" });
    }
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    if (!decoded) {
      return res.status(404).send({ success: false, error: "Token Not Valid" });
    }

    const user = await User.findById({ _id: decoded._id }).select("-password");

    if (!user) {
      return res.status(404).send({ success: false, error: "User Not Found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(404).send({ success: false, error: "server side error" });
  }
};

module.exports = verifyUser;
