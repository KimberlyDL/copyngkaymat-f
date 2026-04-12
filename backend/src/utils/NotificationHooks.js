// backend/src/utils/NotificationHooks.js

const RoleDispatcher = require('./RoleDispatcher');

const HOOKS = [

  // ══════════════════════════════════════════════════════
  // PLAYER NOTIFICATIONS
  // ══════════════════════════════════════════════════════

  {
    model: 'QuizAttempt',
    event: 'afterCreate',
    async resolver(attempt, db) {
      // BUG FIX: Quiz → Module association was not defined in index.js.
      // We do a two-step lookup instead of a broken nested include.
      const quiz = await db.Quiz.findByPk(attempt.quiz_id);
      const quizTitle = quiz?.title || 'Quiz';

      // Resolve module and classroom separately
      let moduleId = null;
      let classroomId = quiz?.classroom_id || null;

      if (quiz?.module_id) {
        const mod = await db.Module.findByPk(quiz.module_id, {
          attributes: ['id', 'classroom_id']
        });
        moduleId = mod?.id || null;
        classroomId = classroomId || mod?.classroom_id || null;
      }

      await RoleDispatcher.notifyPlayer(attempt.user_id, {
        title:      'Quiz Complete!',
        message:    `You scored ${attempt.score ?? 0} on "${quizTitle}". Keep it up!`,
        icon:       'play',
        type:       'quiz',
        action_url: moduleId ? `/dashboard/modules/${moduleId}` : '/dashboard/modules'
      });

      if (classroomId) {
        const classroom = await db.Classroom.findByPk(classroomId, { attributes: ['created_by'] });
        if (classroom?.created_by) {
          const student = await db.User.findByPk(attempt.user_id, { attributes: ['name'] });
          await RoleDispatcher.notifyFacilitator(classroom.created_by, {
            title:      'New quiz submission',
            message:    `${student?.name || 'A student'} scored ${attempt.score ?? 0} on "${quizTitle}"`,
            icon:       'clipboard-list',
            type:       'quiz',
            action_url: `/facilitator/classrooms/${classroomId}`
          });
        }
      }
    }
  },

  {
    model: 'UserInventory',
    event: 'afterCreate',
    async resolver(inventory, db) {
      const badge = await db.Badge.findByPk(inventory.badge_id, { attributes: ['name'] });
      await RoleDispatcher.notifyPlayer(inventory.user_id, {
        title:      'Reward Claimed!',
        message:    `"${badge?.name || 'Your reward'}" is ready. Visit the GAD Office to collect it.`,
        icon:       'gift',
        type:       'reward',
        action_url: '/dashboard/my-inventory'
      });
    }
  },

  {
    model: 'UserGamification',
    event: 'afterUpdate',
    async resolver(gamification) {
      const prevLevel = gamification._previousDataValues?.level;
      const newLevel  = gamification.level;
      if (!prevLevel || prevLevel === newLevel) return;

      await RoleDispatcher.notifyPlayer(gamification.user_id, {
        title:      `Level Up! You're now Level ${newLevel}`,
        message:    `You reached Level ${newLevel} with the title "${gamification.current_title}". Excellent progress!`,
        icon:       'zap',
        type:       'achievement',
        action_url: '/dashboard'
      });
    }
  },

  // ══════════════════════════════════════════════════════
  // CLASSROOM NOTIFICATIONS
  // ══════════════════════════════════════════════════════

  {
    model: 'ClassroomMember',
    event: 'afterCreate',
    async resolver(member, db) {
      const classroom = await db.Classroom.findByPk(member.classroom_id, {
        attributes: ['id', 'name', 'created_by']
      });
      if (!classroom) return;

      await RoleDispatcher.notifyPlayer(member.user_id, {
        title:      'Classroom Joined',
        message:    `You've been added to "${classroom.name}". Check it out!`,
        icon:       'school',
        type:       'classroom',
        action_url: `/dashboard/classrooms/${classroom.id}`
      });

      if (classroom.created_by) {
        const student = await db.User.findByPk(member.user_id, { attributes: ['name'] });
        await RoleDispatcher.notifyFacilitator(classroom.created_by, {
          title:      'New student joined',
          message:    `${student?.name || 'A student'} joined "${classroom.name}"`,
          icon:       'user-plus',
          type:       'classroom',
          action_url: `/facilitator/classrooms/${classroom.id}`
        });
      }
    }
  },

  {
    model: 'Announcement',
    event: 'afterCreate',
    async resolver(announcement, db) {
      if (announcement.status !== 'active') return;

      if (announcement.type === 'classroom' && announcement.classroom_id) {
        await RoleDispatcher.notifyClassroom(announcement.classroom_id, {
          title:      announcement.title,
          message:    (announcement.content || '').substring(0, 120),
          icon:       'megaphone',
          type:       'classroom',
          action_url: `/dashboard/classrooms/${announcement.classroom_id}`
        });
      } else if (announcement.type === 'public') {
        const players = await db.User.findAll({
          where: { role: 'player', account_status: 'active' },
          attributes: ['id']
        });
        const playerIds = players.map(p => p.id);
        if (playerIds.length > 0) {
          await RoleDispatcher.notifyManyPlayers(playerIds, {
            title:      announcement.title,
            message:    (announcement.content || '').substring(0, 120),
            icon:       'bell-ring',
            type:       'system',
            action_url: '/dashboard'
          });
        }
      }
    }
  },

  // ══════════════════════════════════════════════════════
  // MODULE NOTIFICATIONS
  // BUG FIX: The hook was skipping ALL modules because ModuleController
  // creates modules as drafts (is_published: false) first, THEN publishes.
  // The afterCreate hook's `if (!module.is_published) return` meant the
  // notification never fired. The afterUpdate hook is the correct place.
  // Removed the afterCreate hook entirely — afterUpdate covers both cases:
  //   1. Facilitator toggles publish on a draft → afterUpdate fires ✓
  //   2. Facilitator creates a module already published → afterUpdate fires
  //      when is_published flips from false → true ✓
  // ══════════════════════════════════════════════════════

  {
    model: 'Module',
    event: 'afterUpdate',
    async resolver(module, db) {
      // Only fire when is_published flips from false → true
      const wasUnpublished = module._previousDataValues?.is_published === false;
      const isNowPublished = module.is_published === true;
      if (!wasUnpublished || !isNowPublished) return;

      // Only notify for classroom modules — public modules have no specific audience
      if (!module.classroom_id) return;

      await RoleDispatcher.notifyClassroom(module.classroom_id, {
        title:      'New module available',
        message:    `"${module.title}" has been published in your classroom.`,
        icon:       'book-open',
        type:       'module',
        action_url: `/dashboard/modules/${module.id}`
      });
    }
  },

  // ══════════════════════════════════════════════════════
  // ADMIN NOTIFICATIONS
  // ══════════════════════════════════════════════════════

  {
    model: 'User',
    event: 'afterCreate',
    async resolver(user) {
      if (user.role !== 'player') return;

      await RoleDispatcher.notifyAdmin({
        title:      'New student registered',
        message:    `${user.name || user.email} created an account and is ready to learn.`,
        icon:       'user',
        type:       'system',
        action_url: '/admin/students'
      });
    }
  },

  {
    model: 'User',
    event: 'afterCreate',
    async resolver(user) {
      if (!['educator', 'moderator'].includes(user.role)) return;

      await RoleDispatcher.notifyAdmin({
        title:      'New facilitator account created',
        message:    `${user.name || user.email} was added as a ${user.role}.`,
        icon:       'shield-check',
        type:       'system',
        action_url: '/admin/facilitators'
      });
    }
  }

];

// ─────────────────────────────────────────────────────────────────────────────
// Boot — called once at the end of model/index.js
// ─────────────────────────────────────────────────────────────────────────────
function registerNotificationHooks(db) {
  let registered = 0;

  for (const { model, event, resolver } of HOOKS) {
    if (!db[model]) {
      console.warn(`[NotificationHooks] Model "${model}" not found — skipping.`);
      continue;
    }

    db[model].addHook(event, async (record) => {
      try {
        await resolver(record, db);
      } catch (err) {
        console.error(`[NotificationHooks] ${model}.${event} failed:`, err.message);
      }
    });

    registered++;
  }

  console.log(`[NotificationHooks] ${registered}/${HOOKS.length} hooks registered.`);
}

module.exports = { registerNotificationHooks };