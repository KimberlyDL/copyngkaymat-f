const { Op } = require('sequelize');
const { MLAnalysisResult, QuizAttempt, Quiz, Notification } = require('../model');

const ASSESSMENT_TITLE = 'Behavioral Pattern & Risk Check';

class PersonalizationService {
    _riskScore(level) {
        const map = { Low: 1, Moderate: 2, High: 3, Severe: 4 };
        return map[level] || 1;
    }

    _attemptRatio(attempt) {
        const total = Number(attempt?.total_questions || 0);
        const correct = Number(attempt?.correct_answers || 0);
        if (total <= 0) return 0;
        return Math.max(0, Math.min(1, correct / total));
    }

    _alertLevelFromScore(score) {
        if (score >= 3.4) return 'high';
        if (score >= 2.1) return 'moderate';
        return 'low';
    }

    _extractTopBehaviors(analysisResults = [], limit = 3) {
        if (!Array.isArray(analysisResults)) return [];

        const counts = {};
        analysisResults.forEach((item) => {
            if (!item || !Array.isArray(item.behaviors)) return;
            item.behaviors.forEach((behavior) => {
                const key = String(behavior || '').trim();
                if (!key) return;
                counts[key] = (counts[key] || 0) + 1;
            });
        });

        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([label, count]) => ({ label, count }));
    }

    async buildGuidance(userId, options = {}) {
        const { analysisLimit = 8, attemptLimit = 10 } = options;

        const assessmentQuiz = await Quiz.findOne({
            where: { title: ASSESSMENT_TITLE },
            attributes: ['id', 'title']
        });

        const [analyses, attempts, latestAssessment] = await Promise.all([
            MLAnalysisResult.findAll({
                where: { user_id: userId },
                include: [{
                    model: Quiz,
                    as: 'quiz',
                    attributes: ['id', 'title'],
                    required: false
                }],
                order: [['created_at', 'DESC']],
                limit: analysisLimit
            }),
            QuizAttempt.findAll({
                where: { user_id: userId },
                include: [{
                    model: Quiz,
                    as: 'quiz',
                    attributes: ['id', 'title', 'quiz_type', 'module_id'],
                    required: false
                }],
                order: [['created_at', 'DESC']],
                limit: attemptLimit
            }),
            assessmentQuiz
                ? MLAnalysisResult.findOne({
                    where: {
                        user_id: userId,
                        quiz_id: assessmentQuiz.id
                    },
                    include: [{
                        model: Quiz,
                        as: 'quiz',
                        attributes: ['id', 'title'],
                        required: false
                    }],
                    order: [['created_at', 'DESC']]
                })
                : null
        ]);

        const latestAnalysis = analyses[0] || null;
        const riskScores = analyses.map(a => this._riskScore(a.overall_risk_level));
        const avgRiskScore = riskScores.length
            ? riskScores.reduce((sum, value) => sum + value, 0) / riskScores.length
            : 1;

        const recentWindow = analyses.slice(0, 3);
        const recentFlaggedCount = recentWindow.filter(a => a.flags_detected).length;
        const highOrSevereRecentCount = recentWindow.filter(a => ['High', 'Severe'].includes(a.overall_risk_level)).length;

        const attemptRatios = attempts.map(a => this._attemptRatio(a));
        const recentPerformance = attemptRatios.slice(0, 3);
        const baselinePerformance = attemptRatios.slice(3);

        const recentAvg = recentPerformance.length
            ? recentPerformance.reduce((sum, value) => sum + value, 0) / recentPerformance.length
            : null;

        const baselineAvg = baselinePerformance.length
            ? baselinePerformance.reduce((sum, value) => sum + value, 0) / baselinePerformance.length
            : null;

        const performanceDrop = (baselineAvg !== null && recentAvg !== null)
            ? Math.max(0, baselineAvg - recentAvg)
            : 0;

        const attemptsLast24h = attempts.filter(a => {
            const createdAt = new Date(a.created_at || a.createdAt);
            return !Number.isNaN(createdAt.getTime()) && (Date.now() - createdAt.getTime()) <= 24 * 60 * 60 * 1000;
        }).length;

        const alertScore = Math.max(
            avgRiskScore,
            latestAnalysis ? this._riskScore(latestAnalysis.overall_risk_level) : 1,
            recentFlaggedCount >= 1 ? 3 : 1,
            highOrSevereRecentCount >= 2 ? 3.2 : 1
        );

        const alertLevel = this._alertLevelFromScore(alertScore);
        const recommendations = [];

        if (alertLevel === 'high') {
            recommendations.push({
                id: 'safety-escalation',
                severity: 'high',
                title: 'Prioritize a safety check-in today',
                message: 'Your recent responses show elevated stress indicators. Reach out to a trusted facilitator or support contact for a guided check-in.',
                actionUrl: '/profile',
                source: 'stress_pattern'
            });
            recommendations.push({
                id: 'grounding-reset',
                severity: 'high',
                title: 'Take a 5-minute regulation pause',
                message: 'Pause learning for a short breathing or grounding routine before continuing modules to reduce overload.',
                actionUrl: '/modules',
                source: 'early_intervention'
            });
        }

        if (alertLevel === 'moderate' || performanceDrop >= 0.2) {
            recommendations.push({
                id: 'paced-learning',
                severity: 'moderate',
                title: 'Switch to paced learning blocks',
                message: 'Break sessions into shorter blocks and answer reflection prompts before the next quiz to stabilize performance.',
                actionUrl: '/modules',
                source: 'behavior_pattern'
            });
        }

        if (attemptsLast24h >= 4) {
            recommendations.push({
                id: 'fatigue-watch',
                severity: 'moderate',
                title: 'Watch for fatigue signs',
                message: 'You have many quiz attempts today. Consider a brief rest period to maintain focus and emotional balance.',
                actionUrl: '/dashboard',
                source: 'behavior_pattern'
            });
        }

        if (!recommendations.length) {
            recommendations.push({
                id: 'resilience-maintain',
                severity: 'low',
                title: 'Maintain your learning rhythm',
                message: 'Your recent responses look stable. Keep a consistent pace and continue reflection-based quizzes.',
                actionUrl: '/modules',
                source: 'preventive_support'
            });
        }

        const latestAssessmentAnalysis = latestAssessment
            ? {
                quizId: latestAssessment.quiz_id,
                quizTitle: latestAssessment.quiz?.title || ASSESSMENT_TITLE,
                analyzedAt: latestAssessment.created_at || latestAssessment.createdAt,
                overallRiskLevel: latestAssessment.overall_risk_level,
                dominantCategory: latestAssessment.dominant_category,
                concerningAnswersCount: latestAssessment.concerning_answers_count,
                totalAnswersAnalyzed: latestAssessment.total_answers_analyzed,
                flagsDetected: !!latestAssessment.flags_detected,
                topBehaviors: this._extractTopBehaviors(latestAssessment.analysis_results)
            }
            : null;

        return {
            alertLevel,
            stressSummary: {
                latestRiskLevel: latestAnalysis?.overall_risk_level || 'Low',
                flaggedInRecentWindow: recentFlaggedCount,
                highOrSevereInRecentWindow: highOrSevereRecentCount,
                averageRiskScore: Number(avgRiskScore.toFixed(2)),
                attemptsLast24h,
                performanceDrop: Number((performanceDrop * 100).toFixed(1))
            },
            latestAssessmentAnalysis,
            recommendations,
            generatedAt: new Date().toISOString()
        };
    }

    async createAlertIfNeeded(userId, guidance, metadata = {}) {
        try {
            console.log(">>> Attempting DB Save for User ID:", userId);

            const alert = await Notification.create({
                user_id: userId,
                type: 'system', // Must match one of the ENUM values in Notification.js
                title: 'Supportive Intervention',
                message: 'We detected stress indicators. Please check in with your mentor.',
                icon: 'shield-alert',
                action_url: '/dashboard',
                metadata: metadata // This matches the JSON type in your model
            });

            return alert;
        } catch (dbError) {
            // THIS IS THE MOST IMPORTANT PART: It will print the exact reason for the failure
            console.error("❌ DATABASE ERROR DETAILS:");
            console.error("Message:", dbError.message);
            if (dbError.errors) {
                dbError.errors.forEach(err => console.error("Constraint Error:", err.message));
            }
            return null;
        }
    }

    // async processPostQuizSignals(userId, quizId, mlResult) {
    //     if (!mlResult) return null;

    //     const guidance = await this.buildGuidance(userId);

    //     const shouldAlert = guidance.alertLevel !== 'low'
    //         || mlResult.flags_detected
    //         || ['High', 'Severe'].includes(mlResult.overall_risk_level);

    //     if (!shouldAlert) return { guidance, alertCreated: false };

    //     const alert = await this.createAlertIfNeeded(userId, guidance, {
    //         source: 'post_quiz_ml_analysis',
    //         quiz_id: quizId,
    //         ml_risk_level: mlResult.overall_risk_level,
    //         ml_flags_detected: mlResult.flags_detected
    //     });

    //     return { guidance, alertCreated: !!alert };
    // }

    async processPostQuizSignals(userId, quizId, mlResult) {
    try {
        const guidance = await this.buildGuidance(userId);
        const riskLevel = mlResult?.overall_risk_level || 'High';

        const alert = await Notification.create({
            user_id: userId,
            type: 'system', // Must be 'system', 'quiz', etc.
            title: 'Personalized Intervention',
            message: 'We noticed some stress indicators in your last assessment. Please check in with your facilitator.',
            icon: 'shield-alert',
            action_url: '/dashboard',
            metadata: {
                quiz_id: quizId,
                risk_level: riskLevel
            }
        });

        if (alert) {
            console.log(`✅ Notification created: ID ${alert.id} for User ${userId}`);
        }
        
        return { guidance, alertCreated: !!alert };
    } catch (err) {
        console.error("❌ Notification Error:", err.message);
        return { alertCreated: false };
    }

}
}

module.exports = new PersonalizationService();
