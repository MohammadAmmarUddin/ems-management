const jwt = require("jsonwebtoken");
const userModel = require("../models/User");
require("dotenv").config();

const verifyUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .send({ success: false, error: "Token not provided or malformed" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_KEY);

    const user = await userModel.findById(decoded._id).select("-password");

    if (!user) {
      return res.status(404).send({ success: false, error: "User Not Found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).send({ success: false, error: "Server Error" });
  }
};

module.exports = verifyUser;
