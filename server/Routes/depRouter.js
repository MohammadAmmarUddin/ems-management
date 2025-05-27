const express = require("express");
const { getAllDep, addDep, deleteDep, updateDep, getSingleDep } = require("../controller/depController");

const router = express.Router();
//post
router.post("/add", addDep);
//get
router.get("/getAllDep", getAllDep);
router.get("/getSingleDep/:id", getSingleDep);
//delete
router.delete('/deleteDep/:id',deleteDep)
router.put('/updateDep/:id',updateDep)
module.exports = router;
