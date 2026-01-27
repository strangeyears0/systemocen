const express = require('express');
const router = express.Router();
const {
    getAllSubjects,
    getSubjectById,
    createSubject,
    deleteSubject
} = require('../controllers/subjectController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getAllSubjects);
router.get('/:id', protect, getSubjectById);
router.post('/', protect, authorize('teacher'), createSubject);
router.delete('/:id', protect, authorize('teacher'), deleteSubject);

module.exports = router;
