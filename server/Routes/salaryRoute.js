const express = require('express');
const {  getAllSalaries, getSalaryById, addSalary, editSalary, deleteSalary,  totalSalary } = require('../controller/salaryController');

const router = express.Router();


router.get('/getSalary/:id',getSalaryById);
router.get('/getAllSalaries', getAllSalaries);
router.get('/getTotalSalary', totalSalary);
router.post('/addSalary', addSalary);
router.put('/editSalary/:id', editSalary);
router.delete('/deleteSalary/:id', deleteSalary);


module.exports = router;