// backend/src/controller/QuizController.js
const { Module, UserGamification, User } = require('../model');
const QuizService = require('../services/QuizService');

class QuizController {
    /**
     * Creates a new gamified quiz linked to a specific module
     */
    async createQuiz(req, res) {
        try {
            const { module_id } = req.body;
            const userId = req.user.id;

            // 1. Verify that the module exists
            const targetModule = await Module.findByPk(module_id);
            if (!targetModule) {
                return res.status(404).json({
                    success: false,
                    message: 'The module you are trying to link this quiz to does not exist.'
                });
            }

            // 2. Create the quiz via service
            const result = await QuizService.createQuiz(req.body, userId);
            
            return res.status(201).json({
                success: true,
                message: 'Gamified quiz created and linked to module successfully',
                quiz: result
            });
        } catch (error) {
            console.error('QuizController.createQuiz error:', error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * Fetches all quizzes associated with a specific module ID
     */
    async getByModule(req, res) {
        try {
            const { moduleId } = req.params;
            
            const moduleExists = await Module.findByPk(moduleId);
            if (!moduleExists) {
                return res.status(404).json({ success: false, message: 'Module not found' });
            }

            const quizzes = await QuizService.getQuizzesByModule(moduleId);
            return res.status(200).json({ success: true, quizzes: quizzes || [] });
        } catch (error) {
            console.error('QuizController.getByModule error:', error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * Fetches a single quiz detail by its primary ID
     */
    async getQuizById(req, res) {
        try {
            const result = await QuizService.getQuizById(req.params.id);
            return res.status(200).json({
                success: true,
                quiz: result
            });
        } catch (error) {
            console.error('QuizController.getQuizById error:', error);
            return res.status(404).json({ success: false, message: error.message });
        }
    }

    /**
     * Handles quiz submission, saves attempts, and updates XP/Level
     */
    async submitResults(req, res) {
        try {
            const quizId = req.params.id;
            const userId = req.user.id;
            
            // Payload: { pointsEarned, correctCount, totalQuestions, timeTaken }
            const result = await QuizService.submitAttempt(userId, quizId, req.body);
            
            return res.status(200).json({ 
                success: true, 
                message: 'Progress saved successfully!',
                data: result 
            });
        } catch (error) {
            console.error('QuizController.submitResults error:', error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * Fetches the top 10 players based on experience points
     * PATH: /api/v1/quizzes/gamification/leaderboard
     */
    async getLeaderboard(req, res) {
        try {
            const leaderboard = await UserGamification.findAll({
                limit: 10,
                order: [['experience_points', 'DESC']],
                include: [{
                    model: User,
                    as: 'user', // Tiyaking ito ang as sa model/index.js
                    attributes: ['id', 'name']
                }]
            });

            return res.status(200).json({
                success: true,
                leaderboard: leaderboard || []
            });
        } catch (error) {
            console.error('QuizController.getLeaderboard error:', error);
            return res.status(500).json({ 
                success: false, 
                message: 'Internal Server Error while fetching leaderboard' 
            });
        }
    }
}

module.exports = new QuizController();