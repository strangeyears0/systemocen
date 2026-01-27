const { Grade, Subject, User } = require('../models');

const getGradesByStudent = async (req, res) => {
    try {
        const studentId = req.params.studentId;

        // Authorization check: User can see their own grades, Teacher can see anyone's
        if (req.user.type === 'student' && req.user.id !== parseInt(studentId)) {
            return res.status(403).json({ message: 'Not authorized to view grades of other students' });
        }

        const grades = await Grade.findAll({
            where: { student_id: studentId },
            include: [
                {
                    model: Subject,
                    as: 'subject',
                    attributes: ['id', 'name']
                },
                {
                    model: User,
                    as: 'student', // Include student info (optional)
                    attributes: ['id', 'name']
                }
            ],
            order: [['date', 'DESC']]
        });

        res.json(grades);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const addGrade = async (req, res) => {
    try {
        const { student_id, subject_id, value, type } = req.body;

        // Validate inputs
        if (!student_id || !subject_id || !value || !type) {
            return res.status(400).json({ message: 'Please provide all fields' });
        }

        const grade = await Grade.create({
            student_id,
            subject_id,
            value,
            type
        });

        res.status(201).json(grade);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getGradesByStudent,
    addGrade
};
