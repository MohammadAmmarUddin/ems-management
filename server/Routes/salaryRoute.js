const express = require("express");
const {
  getAllSalaries,
  getSalaryById,
  addSalary,
  editSalary,
  deleteSalary,
  totalSalary,
  getMonthlySalarySummary,
} = require("../controller/salaryController");

const router = express.Router();

router.get("/getSalary/:id", getSalaryById);
router.get("/getAllSalaries", getAllSalaries);
router.get("/getTotalSalary", totalSalary);
router.get("/monthly-summary", getMonthlySalarySummary);
router.post("/addSalary", addSalary);
router.put("/editSalary/:id", editSalary);
router.delete("/deleteSalary/:id", deleteSalary);

module.exports = router;
