<template>
    <div class="min-h-screen relative overflow-hidden font-['Poppins'] text-slate-900 dark:text-white selection:bg-purple-500/30">
        
        <!-- Background Ambient Effects -->
        <div class="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen dark:mix-blend-lighten opacity-50 animate-pulse"></div>
            <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-fuchsia-600/20 rounded-full blur-[120px] mix-blend-screen dark:mix-blend-lighten opacity-50 animate-pulse delay-1000"></div>
        </div>

        <div class="relative z-10 space-y-10 p-6 md:p-10 animate-in fade-in duration-700">
            
            <header class="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2 border-b border-slate-200 dark:border-white/5 pb-8 relative">
                <div class="space-y-2">
                    <div class="flex items-center gap-2.5">
                        <div class="h-1 w-8 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-full shadow-[0_2px_10px_rgba(139,92,246,0.4)]"></div>
                        <span class="text-[10px] font-extrabold uppercase tracking-[0.3em] text-purple-600 dark:text-purple-400">Student Dashboard</span>
                    </div>
                    <h1 class="text-3xl md:text-4xl font-[900] text-black dark:text-white uppercase tracking-tighter leading-tight">
                        Hello, <span class="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-500 bg-clip-text text-transparent">{{ userFirstName }}</span>
                    </h1>
                     <p class="text-xs font-medium text-black/50 dark:text-slate-400 tracking-tight">{{ currentDate }} • {{ motivationalMessage }}</p>
                </div>
                
                <div class="flex gap-3">
                    <div class="flex items-center gap-3 px-5 py-2.5 bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm hover:shadow-purple-500/10 transition-all duration-300 group">
                        <div class="p-1.5 bg-amber-500/10 rounded-full group-hover:scale-110 transition-transform duration-300">
                            <ZapIcon class="h-4 w-4 text-amber-500" />
                        </div>
                        <div class="flex flex-col">
                            <span class="text-[8px] font-black uppercase text-slate-400 tracking-[0.2em] leading-none mb-0.5">Lv.</span>
                            <span class="text-lg font-[900] leading-none text-slate-800 dark:text-white">{{ auth.user?.gamification?.level || 1 }}</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 px-5 py-2.5 bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm hover:shadow-orange-500/10 transition-all duration-300 group">
                        <div class="p-1.5 bg-orange-500/10 rounded-full group-hover:scale-110 transition-transform duration-300">
                            <FlameIcon class="h-4 w-4 text-orange-500" />
                        </div>
                        <div class="flex flex-col">
                            <span class="text-[8px] font-black uppercase text-slate-400 tracking-[0.2em] leading-none mb-0.5">Streak</span>
                            <span class="text-lg font-[900] leading-none text-slate-800 dark:text-white">{{ auth.user?.gamification?.streak || 0 }}</span>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Announcements Section (Facilitator Style) -->
            <div class="relative overflow-hidden bg-amber-50/50 dark:bg-amber-500/[0.02] backdrop-blur-xl border border-amber-200/50 dark:border-amber-500/10 rounded-[2rem] p-6 shadow-sm mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
                 <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center gap-4">
                        <div class="p-2.5 bg-amber-100 dark:bg-amber-500/10 rounded-2xl text-amber-600 dark:text-amber-500 shadow-inner">
                            <BellRingIcon class="w-5 h-5" />
                        </div>
                        <h3 class="text-xl font-[900] text-black dark:text-white uppercase tracking-tighter italic">Latest <span class="text-amber-500">Updates</span></h3>
                    </div>
                 </div>
                 
                 <div v-if="announcements && announcements.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="ann in announcements" :key="ann.id" 
                        class="relative overflow-hidden p-6 bg-white/80 dark:bg-[#0d0d15]/60 backdrop-blur-md border border-amber-100 dark:border-amber-500/10 rounded-2xl hover:border-amber-400/30 hover:bg-white dark:hover:bg-[#0d0d15]/80 transition-all duration-300 group shadow-sm hover:shadow-xl hover:shadow-amber-500/5 cursor-pointer hover:-translate-y-1">
                        
                        <div class="absolute -top-4 -right-4 w-20 h-20 bg-amber-500/5 rounded-full blur-[20px] group-hover:bg-amber-500/10 transition-colors"></div>
                        
                        <div class="relative z-10">
                            <div class="flex items-center gap-3 mb-4">
                                <span :class="`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shadow-sm border ${
                                    ann.priority === 'urgent' ? 'bg-red-500/10 text-red-600 border-red-500/20' : 
                                    ann.priority === 'high' ? 'bg-orange-500/10 text-orange-600 border-orange-500/20' : 
                                    'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                                }`">
                                    {{ ann.priority || 'Normal' }}
                                </span>
                                <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{{ formatTimeAgo(ann.created_at) }}</span>
                            </div>
                            <h4 class="text-sm font-[800] text-black dark:text-white leading-tight mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                                {{ ann.title }}
                            </h4>
                            <p class="text-[11px] text-slate-500 font-medium line-clamp-2 leading-relaxed">
                                {{ ann.content }}
                            </p>
                        </div>
                    </div>
                 </div>
                 
                 <div v-else class="text-center py-10">
                    <p class="text-slate-400 text-sm font-medium">No new announcements at this time.</p>
                 </div>
            </div>

            <!-- Did You Know? Educational Card -->
            <div class="relative overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] p-8 text-white shadow-xl mb-8 group">
                <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-1000"></div>
                <div class="absolute bottom-0 left-0 w-40 h-40 bg-fuchsia-500/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3"></div>
                
                <div class="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div class="p-4 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 shadow-inner group-hover:rotate-6 transition-transform duration-500">
                        <GraduationCapIcon class="h-10 w-10 text-white" />
                    </div>
                    <div class="text-center md:text-left flex-1">
                        <div class="flex items-center justify-center md:justify-start gap-2 mb-3">
                            <span class="px-2 py-0.5 rounded-md bg-white/20 text-[10px] font-black uppercase tracking-widest border border-white/10">Daily Fact</span>
                        </div>
                        <p class="text-lg md:text-xl font-bold leading-relaxed italic">"{{ currentFact }}"</p>
                    </div>
                </div>
            </div>

            <!-- Horizontal Quick Actions -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <router-link v-for="action in userQuickActions" :key="action.label" :to="action.to"
                    class="relative overflow-hidden flex items-center gap-4 p-4 rounded-[1.5rem] bg-white/80 dark:bg-[#0d0d15]/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 transition-all duration-500 group hover:-translate-y-1 hover:shadow-lg hover:border-purple-500/30">
                    
                    <div :class="`p-2.5 rounded-xl ${action.bg} text-white shadow-lg ${action.shadow} group-hover:scale-110 transition-transform duration-500`">
                        <component :is="action.icon" class="h-4 w-4" />
                    </div>
                    <div>
                        <span class="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 uppercase tracking-wider transition-colors">{{ action.label }}</span>
                    </div>
                </router-link>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                <div class="lg:col-span-8 space-y-8">
                    <!-- XP Card -->
                    <div class="relative overflow-hidden bg-white/90 dark:bg-[#0d0d15]/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2rem] p-8 shadow-lg">
                        
                        <div class="relative z-10">
                            <div class="flex items-center gap-3 mb-6">
                                <div class="h-6 w-1 bg-purple-600 rounded-full"></div>
                                <h3 class="text-lg font-[900] text-black dark:text-white uppercase tracking-tighter">Your Progress</h3>
                            </div>

                            <div class="space-y-6">
                                <div class="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                                    <div>
                                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Experience</p>
                                        <p class="text-4xl md:text-5xl font-[900] text-black dark:text-white tracking-tighter">{{ auth.user?.gamification?.experience_points?.toLocaleString() || 0 }} <span class="text-xl text-purple-600 dark:text-purple-400 font-[800]">XP</span></p>
                                    </div>
                                    <div class="text-left md:text-right">
                                        <p class="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest mb-1">Level {{ auth.user?.gamification?.level || 1 }}</p>
                                        <p class="text-2xl font-[900] text-slate-300 dark:text-slate-600">{{ xpProgressPercent }}%</p>
                                    </div>
                                </div>

                                <div class="relative h-4 w-full bg-slate-100/50 dark:bg-black/40 rounded-full p-1 shadow-inner border border-slate-200/50 dark:border-white/5 overflow-hidden">
                                    <div class="h-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-500 rounded-full relative transition-all duration-1000 shadow-sm" :style="{ width: xpProgressPercent + '%' }">
                                        <div class="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-full bg-white/60 blur-[1px]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="lg:col-span-4 space-y-8 lg:sticky lg:top-8">
                    <!-- Leaderboard Widget -->
                    <div class="bg-white/90 dark:bg-[#0d0d15]/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 shadow-lg">
                        <div class="flex items-center justify-between mb-8 px-2">
                            <h3 class="text-lg font-[900] text-black dark:text-white uppercase tracking-tighter flex items-center gap-2">
                                <TrophyIcon class="h-5 w-5 text-amber-500 fill-amber-500/20" />
                                Top <span class="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-500">Learners</span>
                            </h3>
                        </div>
                        <div class="space-y-3">
                            <div v-for="(player, index) in leaderboard.slice(0, 5)" :key="index"
                                class="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/5 group"
                                :class="player.id === auth.user?.id ? 'border-purple-500/50 bg-purple-50 dark:bg-purple-500/10 ring-1 ring-purple-500/20' : ''">
                                <div class="flex items-center gap-4">
                                    <div class="w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/10 text-[10px] font-black italic text-slate-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                        {{ index + 1 }}
                                    </div>
                                    <span class="text-xs font-bold truncate max-w-[100px] text-slate-700 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{{ player.name }}</span>
                                </div>
                                <span class="text-[10px] font-black text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 px-2 py-1 rounded-md">{{ formatXP(player.points) }} XP</span>
                            </div>
                        </div>
                        <button @click="isLeaderboardOpen = true" class="w-full mt-6 py-3.5 bg-slate-100 dark:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white hover:bg-purple-600 transition-all duration-300 shadow-inner hover:shadow-lg hover:shadow-purple-500/30">View Global Rankings</button>
                    </div>
                </div>

                <!-- Educational Video Resources - Full Width -->
                <div class="lg:col-span-12 mt-4">
                    <section class="space-y-6">
                         <div class="flex items-center justify-between px-2">
                             <div class="flex items-center gap-3">
                                <div class="h-6 w-1 bg-fuchsia-600 rounded-full"></div>
                                <h3 class="text-lg font-[900] text-black dark:text-white uppercase tracking-tighter">Featured Learning</h3>
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <a v-for="video in educationalVideos" :key="video.id" :href="video.link" target="_blank" class="group relative bg-white dark:bg-[#0d0d15] border border-slate-200 dark:border-white/10 rounded-[1.5rem] overflow-hidden hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 block cursor-pointer">
                                <div class="relative h-48 w-full bg-slate-200 dark:bg-black overflow-hidden">
                                    <img :src="video.thumbnail" alt="Thumbnail" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 bg-slate-300" />
                                    <div class="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                         <div class="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 group-hover:scale-110 transition-transform">
                                            <PlayIcon class="w-5 h-5 text-white fill-current ml-1" />
                                        </div>
                                    </div>
                                    <span class="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-lg uppercase tracking-wider">{{ video.duration }}</span>
                                    <span class="absolute bottom-3 left-3 px-2 py-1 bg-purple-600/90 text-white text-[9px] font-black rounded-lg uppercase tracking-wider shadow-lg">{{ video.category }}</span>
                                </div>
                                <div class="p-5">
                                    <h4 class="font-bold text-lg text-black dark:text-white leading-tight mb-2 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{{ video.title }}</h4>
                                    <p class="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{{ video.description }}</p>
                                    <span class="text-[10px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-400 group-hover:underline">Watch Now</span>
                                </div>
                            </a>
                        </div>
                    </section>
                </div>
            </div>

            <LeaderboardModal :isOpen="isLeaderboardOpen" @close="isLeaderboardOpen = false" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useModuleStore } from '@/stores/module'
import api from '@/utils/api'
import LeaderboardModal from '@/components/ui/LeaderboardModal.vue'
import { 
    Play as PlayIcon, ShieldCheck as ShieldCheckIcon, Trophy as TrophyIcon,
    BellRing as BellRingIcon, Flame as FlameIcon, ChevronRight as ChevronRightIcon, 
    CheckCircle as CheckCircleIcon, Library as LibraryIcon, 
    Zap as ZapIcon, GraduationCapIcon, ClipboardListIcon, ActivityIcon, BookOpenIcon, UserIcon
} from 'lucide-vue-next'

const router = useRouter()
const auth = useAuthStore()
const moduleStore = useModuleStore()

// State
const leaderboard = ref([])
const isLeaderboardOpen = ref(false)
const announcements = ref([])
const userBadgesCount = ref(0)
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
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
}

// Matched Stats Grid Data
const mainStats = computed(() => [
    { label: 'Course Progress', val: `${latestModule.value?.progress || 0}%`, sub: 'Current', icon: ActivityIcon },
    { label: 'Modules Finished', val: completedModulesCount.value, sub: 'Total', icon: CheckCircleIcon },
    { label: 'Inventory', val: userBadgesCount.value, sub: 'Items Earned', icon: TrophyIcon },
    { label: 'Leaderboard', val: `#${userRank.value}`, sub: 'Global Rank', icon: ZapIcon }
])

const userQuickActions = [
    { to: '/dashboard/modules', icon: BookOpenIcon, label: 'Modules', bg: 'bg-purple-600', shadow: 'shadow-purple-500/20' },
    { to: '/dashboard/rewards-shop', icon: LibraryIcon, label: 'Rewards', bg: 'bg-fuchsia-600', shadow: 'shadow-fuchsia-500/20' },
    { to: '/dashboard/classrooms', icon: GraduationCapIcon, label: 'Classes', bg: 'bg-violet-600', shadow: 'shadow-violet-500/20' },
    { to: '/dashboard/settings', icon: UserIcon, label: 'Profile', bg: 'bg-slate-600', shadow: 'shadow-slate-500/20' }
]

// Logic
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

// Functions
const formatXP = (xp) => xp >= 1000 ? (xp / 1000).toFixed(1) + 'k' : xp
const goModule = (id) => router.push({ name: 'user.module', params: { id } })

const fetchAnalytics = async () => {
    // Announcements
    try {
        const annRes = await api.get('/api/v1/notifications/announcements')
        console.log('Announcements fetched:', annRes.data)
        announcements.value = annRes.data.announcements || []
    } catch (error) {
        console.error('Failed to fetch announcements:', error)
    }

    // Leaderboard & Badges
    try {
        const [lbRes, badgeRes] = await Promise.all([
            api.get('/api/v1/quizzes/gamification/leaderboard'),
            api.get('/api/v1/badges/my-inventory')
        ])
        leaderboard.value = lbRes.data.learners || []
        userBadgesCount.value = badgeRes.data?.inventory?.length || 0
    } catch (error) { console.error('Analytics fetch error:', error) }
}

onMounted(() => {
    moduleStore.fetchModules()
    fetchAnalytics()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700;1,900&display=swap');
.custom-font-poppins { font-family: 'Poppins', sans-serif !important; }
.animate-in { animation: fade-in 0.8s ease-out; }
@keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>