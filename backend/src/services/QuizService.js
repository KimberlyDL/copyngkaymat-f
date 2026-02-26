// backend/src/services/QuizService.js
const { Quiz, Module, QuizAttempt, UserGamification } = require('../model');

class QuizService {
    async createQuiz(quizData, userId) {
        const moduleRecord = await Module.findByPk(quizData.module_id);
        if (!moduleRecord) throw new Error('Reference module not found');

        return await Quiz.create({
            module_id: quizData.module_id,
            title: quizData.title || 'Module Reviewer',
            description: quizData.description,
            quiz_type: quizData.quiz_type || 'time_attack',
            questions_data: quizData.questions_data,
            time_limit: quizData.time_limit || 30,
            points_per_question: quizData.points_per_question || 10, 
            created_by: userId
        });
    }

    /**
     * Submission Logic: Inauupdate ang points, level, at progress tracking
     */
    async submitAttempt(userId, quizId, results) {
        // 1. Siguraduhing Number ang values para hindi mag-error ang Sequelize
        const points = parseInt(results.pointsEarned) || 0;
        const correct = parseInt(results.correctCount) || 0;
        const total = parseInt(results.totalQuestions) || 0;
        const time = parseInt(results.timeTaken) || 0;

        // 2. I-save ang attempt sa QuizAttempts table
        const attempt = await QuizAttempt.create({
            user_id: userId,
            quiz_id: quizId,
            score: points,
            correct_answers: correct,
            total_questions: total,
            time_taken: time
        });

        // 3. XP at Gamification Update gamit ang tamang column names
        // Gagamit tayo ng findOrCreate para siguradong may record ang user sa usergamification table
        const [stats] = await UserGamification.findOrCreate({
            where: { user_id: userId },
            defaults: { 
                experience_points: 0, 
                level: 1,
                streak: 0
            }
        });

        // Update ang experience points base sa nakuha sa quiz
        stats.experience_points += points;
        
        // Simpleng logic para sa leveling (halimbawa: every 500 XP ay 1 level)
        stats.level = Math.floor(stats.experience_points / 500) + 1;
        
        await stats.save();

        return { 
            attempt, 
            experiencePoints: stats.experience_points, 
            level: stats.level 
        };
    }

    async getQuizzesByModule(moduleId) {
        return await Quiz.findAll({
            where: { module_id: moduleId },
            order: [['created_at', 'DESC']]
        });
    }

    async getQuizById(quizId) {
        const quiz = await Quiz.findByPk(quizId, {
            include: [{
                model: Module,
                as: 'module',
                attributes: ['title', 'category']
            }]
        });
        if (!quiz) throw new Error('Quiz not found');
        return quiz;
    }
}

module.exports = new QuizService();