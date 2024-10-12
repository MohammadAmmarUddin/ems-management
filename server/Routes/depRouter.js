const express = require("express");
const { getAllDep, addDep, deleteDep } = require("../authController/depController");

const router = express.Router();
//post
router.post("/add", addDep);
//get
router.get("/getAllDep", getAllDep);
//delete
router.delete('/deleteDep',deleteDep)
module.exports = router;
