const { sequelize, User, Subject, Class, Grade } = require('../src/models');
const bcrypt = require('bcrypt');

const seedDb = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to database.');

        // Clear existing data (optional, be careful)
        // await sequelize.sync({ force: true });

        // Check if data exists
        const userCount = await User.count();
        if (userCount > 0) {
            console.log('⚠️ Database already contains data. Skipping seed.');
            process.exit(0);
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash('password123', saltRounds);

        console.log('🌱 Seeding users...');
        const teacher = await User.create({
            email: 'teacher@example.com',
            password_hash: passwordHash,
            name: 'Jan Nauczyciel',
            type: 'teacher',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher'
        });

        const student = await User.create({
            email: 'student@example.com',
            password_hash: passwordHash,
            name: 'Piotr Uczeń',
            type: 'student',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student'
        });

        console.log('🌱 Seeding classes...');
        const class1a = await Class.create({ name: '1A' });
        const class2b = await Class.create({ name: '2B' });

        console.log('🌱 Seeding subjects...');
        const math = await Subject.create({
            name: 'Matematyka',
            description: 'Królowa nauk',
            teacher_id: teacher.id,
            student_count: 25
        });

        const physics = await Subject.create({
            name: 'Fizyka',
            description: 'Badanie materii',
            teacher_id: teacher.id,
            student_count: 20
        });

        // Associations
        await student.addClasses([class1a]);
        // await teacher.addTeachingSubjects([math, physics]); // already set via teacher_id

        console.log('🌱 Seeding grades...');
        await Grade.create({
            student_id: student.id,
            subject_id: math.id,
            value: 5,
            type: 'Sprawdzian',
            date: new Date()
        });

        await Grade.create({
            student_id: student.id,
            subject_id: math.id,
            value: 4,
            type: 'Kartkówka',
            date: new Date()
        });

        console.log('✅ Database seeded successfully.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDb();
