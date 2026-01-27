const { sequelize } = require('../config/db');
const User = require('./User');
const Subject = require('./Subject');
const Class = require('./Class');
const Grade = require('./Grade');

// Associations

// Teacher <-> Subject (One-to-Many for simplicity, seeing as Subject has teacher_id)
User.hasMany(Subject, { foreignKey: 'teacher_id', as: 'teachingSubjects' });
Subject.belongsTo(User, { foreignKey: 'teacher_id', as: 'teacher' });

// Student <-> Class (Many-to-Many)
User.belongsToMany(Class, { through: 'students_classes', foreignKey: 'student_id', as: 'classes' });
Class.belongsToMany(User, { through: 'students_classes', foreignKey: 'class_id', as: 'students' });

// Student <-> Grade (One-to-Many)
User.hasMany(Grade, { foreignKey: 'student_id', as: 'grades' });
Grade.belongsTo(User, { foreignKey: 'student_id', as: 'student' });

// Subject <-> Grade (One-to-Many)
Subject.hasMany(Grade, { foreignKey: 'subject_id', as: 'grades' });
Grade.belongsTo(Subject, { foreignKey: 'subject_id', as: 'subject' });

module.exports = {
    sequelize,
    User,
    Subject,
    Class,
    Grade
};
