const express = require('express');
const router = express.Router();
const { getAllStudents, getStudentById, getAllClasses, createClass } = require('../controllers/dataController');
const { protect, authorize } = require('../middleware/auth');

// Student Routes
router.get('/students', protect, getAllStudents);
router.get('/students/:id', protect, getStudentById);

// Class Routes
router.get('/classes', protect, getAllClasses);
router.post('/classes', protect, authorize('teacher'), createClass);

module.exports = router;
