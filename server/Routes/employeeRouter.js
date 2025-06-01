const {
  getEmployees,
  getEmployee,
  addEmployee,
  editEmployee,
  searchEmployee,
  resetPassword,
  forgetPassword,
  getSingleUser,
  getAllUsers,
  verify,
  login,
  totalEmployeesCount,
} = require("../controller/employeeController");

const express = require("express");
const authMiddleware = require("../middleware/authMiddleware.js");
const router = express.Router();

//get

router.get("/searchEmployees", searchEmployee);
router.get("/getEmployees", getEmployees);
router.get("/getEmployeesCount", totalEmployeesCount);
router.get("/getEmployee/:id", getEmployee);

// post

router.post("/addEmployee", addEmployee);

//put update

router.put("/edit/:id", editEmployee);
router.post("/login", login);
router.get("/verify",authMiddleware,verify);
router.get("/getAllUser",  getAllUsers);
router.get("/getSingleUser/:id",  getSingleUser);
router.post("/forgetPassword", forgetPassword);
router.post("/resetPassword/:token", resetPassword);

module.exports = router;
