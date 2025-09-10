const express = require("express");
const {
  getAllDep,
  addDep,
  deleteDep,
  updateDep,
  getSingleDep,
  countDep,
  getDepartmentDistribution,
  searchDepartment, // ✅ import new controller
} = require("../controller/depController");

const router = express.Router();

// post
router.post("/add", addDep);

// get
router.get("/getAllDep", getAllDep);
router.get("/getCountDep", countDep);
router.get("/getSingleDep/:id", getSingleDep);
router.get("/distribution", getDepartmentDistribution);
router.get("/search", searchDepartment); // ✅ new search route

// delete
router.delete("/deleteDep/:id", deleteDep);

// update
router.put("/updateDep/:id", updateDep);

module.exports = router;
