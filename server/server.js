const express = require('express');
const cors = require('cors');
const { connectDB } = require('./src/config/db');
const authRoutes = require('./src/routes/auth');
const subjectRoutes = require('./src/routes/subjects');
const gradeRoutes = require('./src/routes/grades');
const dataRoutes = require('./src/routes/data');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const corsOptions = {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Connect to Database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api', dataRoutes); // /api/students, /api/classes

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
