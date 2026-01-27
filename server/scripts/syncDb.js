const { sequelize } = require('../src/models');

const syncDb = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to database.');

        // Sync all models
        // alter: true checks what is the current state of the table in the database
        // (which columns it has, what are their data types, etc), and then performs the necessary
        // changes in the table to make it match the model.
        await sequelize.sync({ alter: true });

        console.log('✅ Database synchronized successfully.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error synchronizing database:', error);
        process.exit(1);
    }
};

syncDb();
