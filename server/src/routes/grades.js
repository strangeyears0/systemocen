const express = require('express');
const router = express.Router();
const { getGradesByStudent, addGrade } = require('../controllers/gradeController');
const { protect, authorize } = require('../middleware/auth');

router.get('/student/:studentId', protect, getGradesByStudent);
router.post('/', protect, authorize('teacher'), addGrade);

module.exports = router;
