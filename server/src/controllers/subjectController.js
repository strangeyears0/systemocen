const { Subject, User } = require('../models');

const getAllSubjects = async (req, res) => {
    try {
        const subjects = await Subject.findAll({
            include: [
                {
                    model: User,
                    as: 'teacher',
                    attributes: ['id', 'name', 'email']
                }
            ]
        });
        res.json(subjects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getSubjectById = async (req, res) => {
    try {
        const subject = await Subject.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    as: 'teacher',
                    attributes: ['id', 'name', 'email']
                }
            ]
        });

        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        res.json(subject);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const createSubject = async (req, res) => {
    try {
        const { name, description } = req.body;

        const subject = await Subject.create({
            name,
            description,
            teacher_id: req.user.id
        });

        res.status(201).json(subject);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteSubject = async (req, res) => {
    try {
        const subject = await Subject.findByPk(req.params.id);

        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        // Check if user is the teacher of this subject
        if (subject.teacher_id !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this subject' });
        }

        await subject.destroy();

        res.json({ message: 'Subject removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAllSubjects,
    getSubjectById,
    createSubject,
    deleteSubject
};
