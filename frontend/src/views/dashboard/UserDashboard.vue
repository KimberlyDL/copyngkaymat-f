<template>
    <div class="page-wrapper animate-in text-slate-800 dark:text-platinum-100">
        <div class="space-y-8">

            <!-- ════════════════════════════════════════
                 HEADER
            ════════════════════════════════════════ -->
            <header class="page-header">
                <div class="space-y-2">
                    <p class="section-eyebrow">Student Dashboard</p>
                    <h1 class="font-madimione text-3xl md:text-4xl text-abyss-900 dark:text-platinum-50 leading-tight">
                        {{ currentGreeting }},
                        <span class="text-calm-lavender-600 dark:text-calm-lavender-400">{{ userFirstName }}</span> 👋
                    </h1>
                    <!-- Motivational sub-line: empathetic copy → font-mplusrounded -->
                    <p class="font-mplusrounded text-base font-medium leading-relaxed
                               text-platinum-600 dark:text-platinum-400">
                        {{ currentDate }} &bull; {{ motivationalMessage }}
                    </p>
                </div>

                <!-- Level + Streak chips -->
                <div class="flex gap-3 flex-wrap shrink-0">
                    <!-- Level chip -->
                    <div class="stat-chip">
                        <div class="p-2 rounded-xl
                                    bg-amber-100 dark:bg-amber-500/20
                                    text-amber-600 dark:text-amber-400">
                            <ZapIcon class="h-4 w-4" />
                        </div>
                        <div class="flex flex-col leading-none">
                            <!-- Chip label: technical micro-UI → font-dosis -->
                            <span class="font-dosis text-xs font-semibold uppercase tracking-wide mb-0.5
                                          text-platinum-600 dark:text-platinum-400">Level</span>
                            <!-- Chip value: gamified number → font-madimione -->
                            <span class="font-madimione text-xl text-abyss-800 dark:text-platinum-100">
                                {{ auth.user?.gamification?.level || 1 }}
                            </span>
                        </div>
                    </div>
                    <!-- Streak chip -->
                    <div class="stat-chip">
                        <div class="p-2 rounded-xl
                                    bg-orange-100 dark:bg-orange-500/20
                                    text-orange-600 dark:text-orange-400">
                            <FlameIcon class="h-4 w-4" />
                        </div>
                        <div class="flex flex-col leading-none">
                            <span class="font-dosis text-xs font-semibold uppercase tracking-wide mb-0.5
                                          text-platinum-600 dark:text-platinum-400">Streak</span>
                            <span class="font-madimione text-xl text-abyss-800 dark:text-platinum-100">
                                {{ auth.user?.gamification?.streak || 0 }}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <!-- ════════════════════════════════════════
                 ANNOUNCEMENTS
                 Amber-tinted panel — signals importance
            ════════════════════════════════════════ -->
            <section class="announcements-panel">
                <div class="flex items-center gap-4 mb-6">
                    <div class="p-2.5 rounded-xl
                                bg-amber-100 dark:bg-amber-500/20
                                border-2 border-amber-200 dark:border-amber-500/30
                                text-amber-600 dark:text-amber-400">
                        <BellRingIcon class="w-5 h-5" />
                    </div>
                    <h2 class="font-madimione text-xl text-abyss-800 dark:text-platinum-100">
                        Latest <span class="text-amber-600 dark:text-amber-400">Updates</span>
                    </h2>
                </div>

                <div v-if="visibleAnnouncements.length > 0"
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div v-for="ann in visibleAnnouncements" :key="ann.id"
                        class="item-card !p-5 group cursor-pointer hover:-translate-y-0.5 transition-transform duration-200">

                        <!-- Priority badge -->
                        <div class="flex items-center gap-3 mb-4">
                            <span :class="[
                                'badge text-xs capitalize',
                                ann.priority === 'urgent' ? 'badge-red' :
                                    ann.priority === 'high' ? 'badge-orange' :
                                        'badge-muted'
                            ]">{{ ann.priority || 'Normal' }}</span>
                        </div>

                        <!-- Announcement title: gamified heading → font-madimione -->
                        <h4 class="font-madimione text-base
                                    text-abyss-800 dark:text-platinum-100
                                    leading-snug mb-2.5
                                    group-hover:text-calm-lavender-600 dark:group-hover:text-calm-lavender-400
                                    transition-colors">
                            {{ ann.title }}
                        </h4>

                        <!-- Announcement body: GAD/VAWC-safe empathetic copy → font-mplusrounded + leading-relaxed -->
                        <p class="font-mplusrounded text-sm leading-relaxed line-clamp-2 mb-4
                                   text-platinum-600 dark:text-platinum-400">
                            {{ ann.content }}
                        </p>

                        <!-- Date meta footer -->
                        <div class="ann-meta-footer">
                            <div class="flex items-center gap-1.5">
                                <CalendarDaysIcon class="h-3 w-3 shrink-0" />
                                <span>
                                    {{ ann.updatedAt && ann.updatedAt !== ann.createdAt
                                        ? 'Updated: ' + formatFullDate(ann.updatedAt)
                                        : 'Posted: ' + formatFullDate(ann.createdAt) }}
                                </span>
                            </div>
                            <div v-if="ann.expires_at" class="flex items-center gap-1.5 ann-expiry">
                                <ClockIcon class="h-3 w-3 shrink-0" />
                                <span>Expires: {{ formatFullDate(ann.expires_at) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Empty announcements -->
                <div v-else class="text-center py-8">
                    <p class="font-mplusrounded text-base font-medium leading-relaxed
                               text-platinum-500 dark:text-platinum-500">
                        No new announcements at this time.
                    </p>
                </div>
            </section>

            <!-- ════════════════════════════════════════
                 DAILY FACT BANNER
                 GAD/VAWC context — empathetic typography mandatory
            ════════════════════════════════════════ -->
            <div class="fact-banner">
                <div class="p-2.5 rounded-xl shrink-0 mt-0.5
                            bg-calm-lavender-100 dark:bg-calm-lavender-900/30
                            border-2 border-calm-lavender-200 dark:border-calm-lavender-700/40
                            text-calm-lavender-600 dark:text-calm-lavender-400">
                    <GraduationCapIcon class="h-6 w-6" />
                </div>
                <div class="flex-1">
                    <!-- Label: technical micro-UI → font-dosis -->
                    <span class="font-dosis text-xs font-semibold uppercase tracking-widest mb-1.5 block
                                  text-calm-lavender-600 dark:text-calm-lavender-400">
                        Daily Fact
                    </span>
                    <!-- Fact body: GAD/VAWC-safe → font-mplusrounded + leading-relaxed + italic -->
                    <p class="font-mplusrounded text-base font-medium leading-relaxed italic
                               text-abyss-700 dark:text-platinum-100">
                        "{{ currentFact }}"
                    </p>
                </div>
            </div>

            <!-- ════════════════════════════════════════
                 QUICK ACTIONS
            ════════════════════════════════════════ -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <router-link v-for="action in userQuickActions" :key="action.label"
                    :to="{ name: action.name }"
                    class="quick-action-card group">
                    <div :class="`quick-action-icon ${action.bg}`">
                        <component :is="action.icon" class="h-5 w-5 text-white" />
                    </div>
                    <!-- Action label: technical nav → font-dosis -->
                    <span class="font-dosis text-sm font-bold uppercase tracking-wide
                                  text-abyss-800 dark:text-platinum-100
                                  group-hover:text-calm-lavender-600 dark:group-hover:text-calm-lavender-400
                                  transition-colors">
                        {{ action.label }}
                    </span>
                </router-link>
            </div>

            <!-- ════════════════════════════════════════
                 MAIN GRID  (XP Progress + Leaderboard + Videos)
            ════════════════════════════════════════ -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                <!-- ── XP Progress + Stats (col 8) ── -->
                <div class="lg:col-span-8 space-y-6">

                    <!-- XP Progress card -->
                    <div class="card">
                        <div class="flex items-center gap-3 mb-6">
                            <div class="h-6 w-1.5 rounded-full shrink-0
                                         bg-calm-lavender-600 dark:bg-calm-lavender-500"></div>
                            <h3 class="font-madimione text-xl text-abyss-800 dark:text-platinum-100">
                                Your Progress
                            </h3>
                        </div>

                        <div class="space-y-5">
                            <div class="flex flex-col md:flex-row md:justify-between md:items-end gap-3">
                                <div>
                                    <!-- XP label: technical → font-dosis -->
                                    <p class="font-dosis text-xs font-semibold uppercase tracking-widest mb-1
                                               text-platinum-600 dark:text-platinum-400">
                                        Total Experience
                                    </p>
                                    <!-- XP value: gamified hero number → font-madimione -->
                                    <p class="font-madimione text-5xl tracking-tight
                                               text-abyss-900 dark:text-platinum-50">
                                        {{ auth.user?.gamification?.experience_points?.toLocaleString() || 0 }}
                                        <span class="text-2xl text-calm-lavender-600 dark:text-calm-lavender-400">XP</span>
                                    </p>
                                </div>
                                <div class="text-left md:text-right">
                                    <!-- Level label: technical → font-dosis -->
                                    <p class="font-dosis text-xs font-semibold uppercase tracking-widest mb-1
                                               text-calm-lavender-600 dark:text-calm-lavender-400">
                                        Level {{ auth.user?.gamification?.level || 1 }}
                                    </p>
                                    <!-- Percent: gamified stat → font-madimione -->
                                    <p class="font-madimione text-2xl text-platinum-500 dark:text-platinum-500">
                                        {{ xpProgressPercent }}%
                                    </p>
                                </div>
                            </div>

                            <!-- XP bar -->
                            <div class="progress-track">
                                <div class="progress-fill"
                                    :style="{ width: xpProgressPercent + '%' }">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Stats grid -->
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div v-for="stat in mainStats" :key="stat.label" class="item-card !p-6 text-center">
                            <div class="flex justify-center mb-4">
                                <div class="p-2.5 rounded-xl
                                            bg-calm-lavender-100 dark:bg-calm-lavender-900/30
                                            border border-calm-lavender-200 dark:border-calm-lavender-800/40
                                            text-calm-lavender-600 dark:text-calm-lavender-400">
                                    <component :is="stat.icon" class="h-5 w-5" />
                                </div>
                            </div>
                            <!-- Stat value: gamified → font-madimione -->
                            <p class="font-madimione text-3xl text-abyss-900 dark:text-platinum-50 mb-1">
                                {{ stat.val }}
                            </p>
                            <!-- Stat label: technical micro-UI → font-dosis -->
                            <p class="font-dosis text-xs font-semibold uppercase tracking-wide
                                       text-platinum-600 dark:text-platinum-400">
                                {{ stat.label }}
                            </p>
                            <!-- Stat sub: empathetic helper text → font-mplusrounded -->
                            <p class="font-mplusrounded text-sm font-medium mt-0.5
                                       text-platinum-500 dark:text-platinum-500">
                                {{ stat.sub }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- ── Leaderboard (col 4) ── -->
                <div class="lg:col-span-4 lg:sticky lg:top-8">
                    <div class="card">
                        <div class="flex items-center gap-3 mb-6">
                            <div class="p-2 rounded-xl
                                        bg-amber-100 dark:bg-amber-500/20
                                        border border-amber-200 dark:border-amber-500/30
                                        text-amber-500 dark:text-amber-400">
                                <TrophyIcon class="h-5 w-5" />
                            </div>
                            <h3 class="font-madimione text-xl text-abyss-800 dark:text-platinum-100">
                                Top <span class="text-amber-600 dark:text-amber-400">Learners</span>
                            </h3>
                        </div>

                        <div class="space-y-2">
                            <div v-for="(player, index) in leaderboard.slice(0, 5)" :key="index"
                                class="leaderboard-row group"
                                :class="player.id === auth.user?.id ? 'leaderboard-row--me' : ''">
                                <div class="flex items-center gap-3">
                                    <div class="rank-badge"
                                        :class="index === 0 ? 'rank-badge--gold' : index === 1 ? 'rank-badge--silver' : index === 2 ? 'rank-badge--bronze' : ''">
                                        {{ index + 1 }}
                                    </div>
                                    <!-- Player name: technical nav → font-dosis -->
                                    <span class="font-dosis text-sm font-semibold truncate max-w-[100px]
                                                  text-abyss-700 dark:text-platinum-200
                                                  group-hover:text-calm-lavender-600 dark:group-hover:text-calm-lavender-400
                                                  transition-colors">
                                        {{ player.name }}
                                    </span>
                                </div>
                                <span class="xp-badge">{{ formatXP(player.points) }} XP</span>
                            </div>
                        </div>

                        <button @click="isLeaderboardOpen = true" class="btn-primary w-full justify-center mt-6">
                            <span class="main-button-text">View Global Rankings</span>
                        </button>
                    </div>
                </div>

                <!-- ── Educational Videos — full width ── -->
                <div class="lg:col-span-12">
                    <section class="space-y-5">
                        <div class="flex items-center gap-3">
                            <div class="h-6 w-1.5 bg-neon-pink-500 rounded-full shrink-0"></div>
                            <h3 class="font-madimione text-xl text-abyss-800 dark:text-platinum-100">
                                Featured Learning
                            </h3>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                            <a v-for="video in educationalVideos" :key="video.id"
                                :href="video.link" target="_blank"
                                class="video-card group">

                                <!-- Thumbnail -->
                                <div class="relative h-44 w-full
                                             bg-platinum-200 dark:bg-abyss-700 overflow-hidden">
                                    <img :src="video.thumbnail" :alt="video.title"
                                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div class="absolute inset-0 flex items-center justify-center
                                                 bg-abyss-900/40 group-hover:bg-abyss-900/20 transition-colors">
                                        <div class="play-btn">
                                            <PlayIcon class="w-5 h-5 text-white fill-white ml-0.5" />
                                        </div>
                                    </div>
                                    <!-- Duration chip: technical label → font-dosis -->
                                    <span class="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg
                                                  font-dosis text-xs font-bold uppercase
                                                  bg-abyss-900/80 text-white">
                                        {{ video.duration }}
                                    </span>
                                    <!-- Category chip: badge-lavender pattern → font-dosis -->
                                    <span class="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-lg
                                                  font-dosis text-xs font-bold uppercase
                                                  bg-calm-lavender-600 text-white">
                                        {{ video.category }}
                                    </span>
                                </div>

                                <!-- Video body -->
                                <div class="p-4">
                                    <!-- Video title: gamified heading → font-madimione -->
                                    <h4 class="font-madimione text-base leading-snug line-clamp-2 mb-1.5
                                                text-abyss-800 dark:text-platinum-100
                                                group-hover:text-calm-lavender-600 dark:group-hover:text-calm-lavender-400
                                                transition-colors">
                                        {{ video.title }}
                                    </h4>
                                    <!-- Description: GAD/VAWC-safe body → font-mplusrounded + leading-relaxed -->
                                    <p class="font-mplusrounded text-sm leading-relaxed line-clamp-2 mb-3
                                               text-platinum-600 dark:text-platinum-400">
                                        {{ video.description }}
                                    </p>
                                    <!-- CTA micro-link: technical → font-dosis -->
                                    <span class="font-dosis text-xs font-semibold uppercase tracking-widest
                                                  text-calm-lavender-600 dark:text-calm-lavender-400
                                                  group-hover:underline">
                                        Watch Now →
                                    </span>
                                </div>
                            </a>
                        </div>
                    </section>
                </div>

            </div><!-- /main grid -->

            <LeaderboardModal :isOpen="isLeaderboardOpen" @close="isLeaderboardOpen = false" />

        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useModuleStore } from '@/stores/module'
import api from '@/utils/api'
import LeaderboardModal from '@/components/ui/LeaderboardModal.vue'
import {
    Play as PlayIcon, ShieldCheck as ShieldCheckIcon, Trophy as TrophyIcon,
    BellRing as BellRingIcon, Flame as FlameIcon, ChevronRight as ChevronRightIcon,
    CheckCircle as CheckCircleIcon, Library as LibraryIcon,
    Zap as ZapIcon, GraduationCapIcon, ClipboardListIcon, ActivityIcon, BookOpenIcon, UserIcon,
    Clock as ClockIcon, CalendarDays as CalendarDaysIcon
} from 'lucide-vue-next'

const router = useRouter()
const auth = useAuthStore()
const moduleStore = useModuleStore()

// State
const leaderboard = ref([])
const isLeaderboardOpen = ref(false)
const announcements = ref([])
const userBadgesCount = ref(0)
const now = ref(new Date())
let refreshTimer = null

// Only show non-expired, active announcements — re-evaluated every minute via `now`
const visibleAnnouncements = computed(() =>
    announcements.value.filter(ann => {
        if (!ann.expires_at) return true
        return new Date(ann.expires_at) > now.value
    })
)

const educationalVideos = ref([
    {
        id: 1,
        title: 'Understanding Gender and Development (GAD)',
        description: 'An introductory guide to basic concepts of GAD and its importance in society.',
        thumbnail: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800',
        duration: '12:45',
        category: 'GAD Awareness',
        link: 'https://www.youtube.com/watch?v=QAJ20WnJ8wQ'
    },
    {
        id: 2,
        title: 'VAWC: Know Your Rights',
        description: 'Detailed explanation of the Anti-Violence Against Women and Their Children Act.',
        thumbnail: 'https://images.unsplash.com/photo-1555819306-291771143632?auto=format&fit=crop&q=80&w=800',
        duration: '18:20',
        category: 'Legal Rights',
        link: 'https://www.youtube.com/watch?v=33K19O-Nl-s'
    },
    {
        id: 3,
        title: 'Sexual Education: Safe Relationships',
        description: 'Building healthy relationships and understanding consent.',
        thumbnail: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800',
        duration: '15:10',
        category: 'Sex Ed',
        link: 'https://www.youtube.com/watch?v=gT8B2h5jT5M'
    },
    {
        id: 4,
        title: 'Community Support Systems',
        description: 'How to access support services for victims of abuse and harassment.',
        thumbnail: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2dc?auto=format&fit=crop&q=80&w=800',
        duration: '08:55',
        category: 'Support',
        link: 'https://www.youtube.com/watch?v=18c397e59iI'
    }
])

const dailyFacts = [
    "The Magna Carta of Women (RA 9710) is a comprehensive women's human rights law that seeks to eliminate discrimination through the recognition, protection, fulfillment and promotion of the rights of Filipino women.",
    "VAWC stands for Violence Against Women and Their Children, covering any act of gender-based violence that results in physical, sexual, or psychological harm.",
    "Consent is a clear, voluntary, and enthusiastic agreement to engage in specific sexual activity. It can be withdrawn at any time.",
    "The Safe Spaces Act (RA 11313) defines and penalizes gender-based sexual harassment in streets, public spaces, online, workplaces, and educational/training institutions.",
    "Gender sensitivity refers to the ability to recognize gender issues and especially the ability to recognize women's different perceptions and interests arising from their different social location and different gender roles."
]
const currentFact = ref(dailyFacts[Math.floor(Math.random() * dailyFacts.length)])

const formatTimeAgo = (dateStr) => {
    if (!dateStr) return "Unknown time";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Invalid date";
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    const minute = 60;
    const hour = 3600;
    const day = 86400;
    if (diffInSeconds < 30) return "Just now";
    if (diffInSeconds < minute) return `${diffInSeconds}s ago`;
    if (diffInSeconds < hour) return `${Math.floor(diffInSeconds / minute)}m ago`;
    if (diffInSeconds < day) return `${Math.floor(diffInSeconds / hour)}h ago`;
    return date.toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit', hour12: true
    });
};

const formatFullDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit', hour12: true
    })
}

const mainStats = computed(() => [
    { label: 'Course Progress', val: `${latestModule.value?.progress || 0}%`, sub: 'Current', icon: ActivityIcon },
    { label: 'Modules Finished', val: completedModulesCount.value, sub: 'Total', icon: CheckCircleIcon },
    { label: 'Inventory', val: userBadgesCount.value, sub: 'Items Earned', icon: TrophyIcon },
    { label: 'Leaderboard', val: `#${userRank.value}`, sub: 'Global Rank', icon: ZapIcon }
])

const userQuickActions = [
    { name: 'user.modules', icon: BookOpenIcon, label: 'Modules', bg: 'bg-calm-lavender-600 dark:bg-calm-lavender-700' },
    { name: 'user.rewards-shop', icon: LibraryIcon, label: 'Rewards', bg: 'bg-neon-pink-600 dark:bg-neon-pink-700' },
    { name: 'classrooms.index', icon: GraduationCapIcon, label: 'Classes', bg: 'bg-safety-teal-600 dark:bg-safety-teal-700' },
    { name: 'profile', icon: UserIcon, label: 'Profile', bg: 'bg-abyss-600 dark:bg-abyss-700' }
]

const userFirstName = computed(() => auth.user?.name?.split(' ')[0] || 'Player')
const currentDate = computed(() => new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }))
const completedModulesCount = computed(() => moduleStore.modules.filter(m => m.progress >= 100).length)
const latestModule = computed(() => moduleStore.modules.find(m => m.progress > 0 && m.progress < 100) || moduleStore.modules[0])

const userRank = computed(() => {
    if (!leaderboard.value.length) return '?'
    const rank = leaderboard.value.findIndex(p => p.id === auth.user?.id)
    return rank !== -1 ? rank + 1 : '?'
})

const currentGreeting = computed(() => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 18) return "Good Afternoon"
    return "Good Evening"
})

const motivationalMessage = computed(() => {
    const streak = auth.user?.gamification?.streak || 0
    return streak >= 7 ? "Unstoppable streak! Keep it up!" : "Every module counts toward mastery."
})

const xpProgressPercent = computed(() => {
    const xp = auth.user?.gamification?.experience_points || 0
    const level = auth.user?.gamification?.level || 1
    const nextLevelXP = level * 500
    const prevLevelXP = (level - 1) * 500
    const progress = ((xp - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100
    return Math.min(Math.max(Math.round(progress), 0), 100)
})

const formatXP = (xp) => xp >= 1000 ? (xp / 1000).toFixed(1) + 'k' : xp
const goModule = (id) => router.push({ name: 'user.module', params: { id } })

const fetchAnalytics = async () => {
    try {
        const annRes = await api.get('/api/v1/notifications/announcements')
        announcements.value = annRes.data.announcements || []
    } catch (error) {
        console.error('Failed to fetch announcements:', error)
    }
    const [lbRes, badgeRes] = await Promise.allSettled([
        api.get('/api/v1/quizzes/gamification/leaderboard'),
        api.get('/api/v1/badges/my-inventory')
    ])
    if (lbRes.status === 'fulfilled') leaderboard.value = lbRes.value.data.learners || []
    else console.error('Leaderboard fetch error:', lbRes.reason)
    if (badgeRes.status === 'fulfilled') userBadgesCount.value = badgeRes.value.data?.inventory?.length || 0
    else console.error('Badge inventory fetch error:', badgeRes.reason)
}

onMounted(() => {
    moduleStore.fetchModules()
    fetchAnalytics()
    // Tick `now` every 60s so visibleAnnouncements re-evaluates without a page reload
    refreshTimer = setInterval(() => { now.value = new Date() }, 60_000)
})

onUnmounted(() => {
    clearInterval(refreshTimer)
})
</script>

<style scoped>
@reference "@/style.css";

/* ═══════════════════════════════════════════════════════════
   PAGE WRAPPER  —  bg-platinum-50 / abyss-800 foundation
═══════════════════════════════════════════════════════════ */
.page-wrapper {
    @apply min-h-screen p-6 md:p-10;
    @apply bg-platinum-50 dark:bg-abyss-800;
}

/* ═══════════════════════════════════════════════════════════
   ANNOUNCEMENTS PANEL
   Amber-tinted L1 — signals importance
═══════════════════════════════════════════════════════════ */
.announcements-panel {
    @apply rounded-2xl p-6;
    @apply bg-amber-50 dark:bg-abyss-800;
    @apply border-2 border-amber-200 dark:border-amber-500/30;
}

/* ═══════════════════════════════════════════════════════════
   DAILY FACT BANNER
   Lavender L1 with left accent border
═══════════════════════════════════════════════════════════ */
.fact-banner {
    @apply flex items-start gap-5 p-5 rounded-2xl;
    @apply bg-calm-lavender-50 dark:bg-abyss-700;
    @apply border-2 border-calm-lavender-200 dark:border-calm-lavender-700/40;
    border-left-width: 5px;
    border-left-color: theme('colors.calm-lavender.600');
}

.dark .fact-banner {
    border-left-color: theme('colors.calm-lavender.500');
}

/* ═══════════════════════════════════════════════════════════
   STAT CHIP
═══════════════════════════════════════════════════════════ */
.stat-chip {
    @apply flex items-center gap-3 px-4 py-3 rounded-2xl;
    @apply bg-platinum-100 dark:bg-abyss-700;
    @apply border-2 border-platinum-300 dark:border-abyss-500;
    @apply hover:border-calm-lavender-300 dark:hover:border-calm-lavender-700;
    @apply transition-colors duration-150;
}

/* ═══════════════════════════════════════════════════════════
   QUICK ACTION CARD
   Flat-3D depth via border-bottom
═══════════════════════════════════════════════════════════ */
.quick-action-card {
    @apply flex items-center gap-4 px-4 py-4 rounded-2xl no-underline transition-all duration-150;
    @apply bg-platinum-100 dark:bg-abyss-700;
    @apply border-2 border-platinum-300 dark:border-abyss-500;
    border-bottom-width: 4px;
    border-bottom-color: theme('colors.platinum.400');
    @apply hover:border-calm-lavender-300 dark:hover:border-calm-lavender-700;
    @apply hover:-translate-y-0.5;
}

.dark .quick-action-card {
    border-bottom-color: theme('colors.abyss.900');
}

.quick-action-icon {
    @apply p-2.5 rounded-xl shrink-0;
    box-shadow: 0 3px 0 rgba(0, 0, 0, 0.18);
}

/* ═══════════════════════════════════════════════════════════
   LEADERBOARD ROW
═══════════════════════════════════════════════════════════ */
.leaderboard-row {
    @apply flex items-center justify-between px-3.5 py-2.5 rounded-xl;
    @apply bg-platinum-200 dark:bg-abyss-800;
    @apply border-2 border-platinum-300 dark:border-abyss-500;
    @apply hover:border-calm-lavender-300 dark:hover:border-calm-lavender-700;
    @apply transition-colors duration-150;
}

.leaderboard-row--me {
    background-color: theme('colors.calm-lavender.50') !important;
    border-color: theme('colors.calm-lavender.400') !important;
}

.dark .leaderboard-row--me {
    background-color: rgba(92, 68, 168, 0.12) !important;
    border-color: theme('colors.calm-lavender.600') !important;
}

/* ═══════════════════════════════════════════════════════════
   RANK BADGE
═══════════════════════════════════════════════════════════ */
.rank-badge {
    @apply w-7 h-7 flex items-center justify-center rounded-full shrink-0;
    @apply bg-platinum-300 dark:bg-abyss-600;
    @apply font-dosis text-xs font-bold text-abyss-600 dark:text-platinum-400;
}

.rank-badge--gold   { background: #fef3c7; color: #d97706; border: 1.5px solid #fbbf24; }
.rank-badge--silver { background: #f3f4f6; color: #6b7280; border: 1.5px solid #d1d5db; }
.rank-badge--bronze { background: #fdf4ed; color: #b45309; border: 1.5px solid #f59e0b; }

/* ═══════════════════════════════════════════════════════════
   XP BADGE
═══════════════════════════════════════════════════════════ */
.xp-badge {
    @apply font-dosis text-xs font-bold px-2 py-0.5 rounded-lg;
    @apply bg-calm-lavender-100 dark:bg-calm-lavender-900/20;
    @apply text-calm-lavender-700 dark:text-calm-lavender-300;
    border: 1.5px solid theme('colors.calm-lavender.200');
}

.dark .xp-badge {
    border-color: rgba(92, 68, 168, 0.35);
}

/* ═══════════════════════════════════════════════════════════
   VIDEO CARD
═══════════════════════════════════════════════════════════ */
.video-card {
    @apply rounded-2xl overflow-hidden no-underline block;
    @apply bg-platinum-100 dark:bg-abyss-700;
    @apply border-2 border-platinum-300 dark:border-abyss-500;
    @apply hover:border-calm-lavender-300 dark:hover:border-calm-lavender-700;
    @apply hover:-translate-y-0.5 transition-all duration-200;
}

/* ═══════════════════════════════════════════════════════════
   PLAY BUTTON OVERLAY
═══════════════════════════════════════════════════════════ */
.play-btn {
    @apply w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200;
    background: rgba(255, 255, 255, 0.25);
    border: 2px solid rgba(255, 255, 255, 0.5);
}

.group:hover .play-btn {
    transform: scale(1.1);
    background: rgba(255, 255, 255, 0.35);
}

/* ═══════════════════════════════════════════════════════════
   ENTRY ANIMATION
═══════════════════════════════════════════════════════════ */
.animate-in {
    animation: fadeSlideUp 0.5s ease-out both;
}

@keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
}

/* ═══════════════════════════════════════════════════════════
   ANNOUNCEMENT META FOOTER
═══════════════════════════════════════════════════════════ */
.ann-meta-footer {
    @apply flex flex-col gap-1 pt-3;
    @apply border-t border-amber-200 dark:border-amber-500/20;
    @apply font-dosis text-xs font-medium text-platinum-500 dark:text-platinum-500;
}

.ann-expiry {
    @apply text-vawc-orange-500 dark:text-vawc-orange-400;
}
</style>