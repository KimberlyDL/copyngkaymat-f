const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const sequelize = require('./config/db');

const adminRoutes = require('./router/AdminRoutes');
const authRoutes = require('./router/AuthRoutes');
const badgeRoutes = require('./router/BadgeRoutes');
const chatbotRoutes = require('./router/ChatbotRoutes');
const classroomRoutes = require('./router/ClassroomRoutes');
const facilitatorRoutes = require('./router/FacilitatorRoutes');
const mlAnalysisRoutes = require('./router/MLAnalysisRoutes');
const moduleRoutes = require('./router/ModuleRoutes');
const notificationRoutes = require('./router/NotificationRoutes');
const profileRoutes = require('./router/ProfileRoutes');
const quizRoutes = require('./router/QuizRoutes');
const rewardsRoutes = require('./router/RewardsRoutes');

const app = express();

// Middleware
app.use(helmet());
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5000', 'http://127.0.0.1:5000'],
    credentials: true
}));

// SSE requires responses to stay open — do NOT apply express.json() body
// parsing to the /stream route (it has no body and the middleware can
// interfere with streaming on some Node versions).
app.use((req, res, next) => {
    if (req.path.endsWith('/stream')) return next();
    express.json({ limit: '10mb' })(req, res, next);
});
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Health Check
app.get('/api/v1/health', async (req, res) => {
    try {
        await sequelize.authenticate();
        res.status(200).json({ status: 'success', database: 'connected' });
    } catch (error) {
        res.status(503).json({ status: 'error', database: 'disconnected' });
    }
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', profileRoutes);
app.use('/api/v1/badges', badgeRoutes);
app.use('/api/rewards', rewardsRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/v1/classrooms', classroomRoutes);
app.use('/api/v1/facilitators', facilitatorRoutes);
app.use('/api/v1/quizzes', quizRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/chatbot', chatbotRoutes);
app.use('/api/v1/ml-analysis', mlAnalysisRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ status: 'error', message: 'Route not found' });
});

// Global Error Handler
// Guard against double-response — SSE connections are long-lived and Express
// may route errors here after the SSE headers are already sent.
app.use((err, req, res, next) => {
    console.error(`[Error] ${err.message}`);
    if (res.headersSent) {
        // Headers already sent (e.g. mid-SSE-stream) — nothing we can do.
        return;
    }
    res.status(err.statusCode || 500).json({
        status: 'error',
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

module.exports = app;