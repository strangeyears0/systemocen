const { User, Class, Grade } = require('../models');

// STUDENT CONTROLLER
const getAllStudents = async (req, res) => {
    try {
        const students = await User.findAll({
            where: { type: 'student' },
            attributes: { exclude: ['password_hash'] },
            include: [
                {
                    model: Class,
                    as: 'classes',
                    attributes: ['id', 'name'],
                    through: { attributes: [] }
                },
                {
                    model: Grade,
                    as: 'grades',
                    attributes: ['id', 'value', 'subject_id', 'type']
                }
            ]
        });
        res.json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getStudentById = async (req, res) => {
    try {
        const student = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password_hash'] },
            include: [{ model: Class, as: 'classes', through: { attributes: [] } }]
        });

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}


// CLASS CONTROLLER
const getAllClasses = async (req, res) => {
    try {
        const classes = await Class.findAll();
        res.json(classes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const createClass = async (req, res) => {
    try {
        const { name } = req.body;
        const newClass = await Class.create({ name });
        res.status(201).json(newClass);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    getAllStudents,
    getStudentById,
    getAllClasses,
    createClass
};
