<template>
    <div class="min-h-screen bg-[#fdfcff] dark:bg-[#04020a] font-['Poppins'] relative overflow-hidden transition-colors duration-700 selection:bg-purple-500/30">
        
        <!-- Animated Background Orbs -->
        <div class="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[130px] animate-pulse pointer-events-none"></div>
        <div class="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[130px] animate-pulse delay-700 pointer-events-none"></div>

        <div class="relative z-10 max-w-7xl mx-auto px-6 py-6 lg:py-10 animate-in">
            
            <!-- Header Section -->
            <header class="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10 relative">
                <div class="space-y-4">
                    <button @click="router.back()" 
                        class="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-gray-500 hover:text-purple-600 transition-all outline-none italic">
                        <div class="p-2.5 rounded-xl bg-white dark:bg-white/5 border-2 border-slate-200 dark:border-white/20 group-hover:border-purple-500 group-hover:bg-purple-500/10 transition-all shadow-md">
                            <ArrowLeftIcon class="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                        </div>
                        <span>Go Back</span>
                    </button>
                    
                    <div class="space-y-2">
                        <div class="flex items-center gap-3">
                            <div class="h-1.5 w-12 liquid-3d-underline rounded-full shadow-[0_5px_15px_rgba(244,114,182,0.4)]"></div>
                            <span class="text-[10px] font-black uppercase tracking-[0.4em] text-purple-600 dark:text-purple-400">Class Rankings</span>
                        </div>
                        <h1 class="text-3xl md:text-5xl font-[900] text-slate-900 dark:text-white uppercase tracking-tighter leading-none italic">
                            <span class="bg-gradient-to-br from-purple-600 via-fuchsia-500 to-fuchsia-600 bg-clip-text text-transparent italic">Leaderboards</span>
                        </h1>
                        <p class="text-xs font-medium text-slate-500 dark:text-gray-400 italic tracking-tight">Check where you stand and see who's leading the way!</p>
                    </div>
                </div>

                <div class="hidden lg:flex items-center gap-4 p-5 rounded-[2.5rem] bg-white dark:bg-white/[0.05] border-2 border-slate-200 dark:border-white/20 shadow-2xl">
                    <div class="p-4 rounded-2xl liquid-gem-logo shadow-2xl scale-90 border border-white/20">
                        <Trophy class="w-5 h-5 text-white" />
                    </div>
                    <div class="pr-6">
                        <p class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest italic leading-none mb-1">Top Learners</p>
                        <p class="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] italic">Updated Daily</p>
                    </div>
                </div>
            </header>

            <!-- Main Content Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                <!-- Leaderboard Table Area -->
                <main class="lg:col-span-8 order-2 lg:order-1">
                    <div class="bg-white/60 dark:bg-white/[0.05] backdrop-blur-3xl border-2 border-slate-200 dark:border-white/20 rounded-[3rem] shadow-2xl overflow-hidden relative min-h-[600px] transition-all duration-500 hover:border-purple-500/20">
                        
                        <!-- Content Breadcrumb -->
                        <div class="h-16 border-b-2 border-slate-200/50 dark:border-white/10 flex items-center px-10 justify-between bg-white/40 dark:bg-white/5">
                            <div class="flex items-center gap-4">
                                <span class="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-[0.4em] italic">Leaderboards</span>
                                <ChevronRightIcon class="h-4 w-4 text-slate-300 dark:text-slate-700" />
                                <span class="text-[10px] font-black text-purple-600 dark:text-fuchsia-400 uppercase tracking-[0.4em] italic">All Students</span>
                            </div>
                            <div class="p-2 rounded-full border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5">
                                <Users class="w-4 h-4 text-purple-500 dark:text-fuchsia-400" />
                            </div>
                        </div>

                        <!-- Content Body -->
                        <div class="p-6 lg:p-8">
                            <div v-if="isLoading" class="py-32 text-center">
                                <div class="relative h-10 w-10 text-purple-600 mx-auto mb-4 scale-125">
                                    <div class="absolute inset-0 rounded-full border-2 border-current opacity-10"></div>
                                    <div class="absolute inset-0 rounded-full border-2 border-t-transparent animate-spin"></div>
                                </div>
                                <p class="text-[10px] font-[900] uppercase tracking-[0.4em] text-purple-500 animate-pulse italic">Sorting Names...</p>
                            </div>
                            
                            <div v-else class="space-y-3">
                                <div v-for="(learner, index) in learners" :key="learner.id"
                                    @click="selectedStudent = learner"
                                    class="group relative flex items-center gap-4 p-4 rounded-[1.5rem] bg-white/40 dark:bg-white/[0.02] border-2 border-transparent hover:border-purple-500/30 hover:bg-white/60 dark:hover:bg-white/5 transition-all duration-500 cursor-pointer animate-vessel shadow-sm hover:shadow-xl"
                                    :style="{ animationDelay: `${index * 50}ms` }">
                                    
                                    <!-- Rank Number -->
                                    <div class="flex-shrink-0 w-12 text-center flex justify-center items-center">
                                        <div v-if="index < 3" class="transform group-hover:scale-110 transition-transform duration-500">
                                            <div v-if="index === 0" class="p-2 bg-yellow-400/10 rounded-xl border border-yellow-400/20">
                                                <Trophy class="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                            </div>
                                            <div v-else-if="index === 1" class="p-2 bg-slate-300/10 rounded-xl border border-slate-300/20">
                                                <Medal class="w-5 h-5 text-slate-400 fill-slate-300" />
                                            </div>
                                            <div v-else class="p-2 bg-amber-700/10 rounded-xl border border-amber-700/20">
                                                <Medal class="w-5 h-5 text-amber-700 fill-amber-700" />
                                            </div>
                                        </div>
                                        <span v-else class="text-sm font-black text-slate-300 dark:text-gray-700 italic">#{{ index + 1 }}</span>
                                    </div>

                                    <!-- Student Profile Info -->
                                    <div class="flex-1 flex items-center gap-4">
                                        <div class="relative">
                                            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center text-white text-sm font-black shadow-lg shadow-purple-500/20 group-hover:rotate-6 transition-transform">
                                                {{ learner.initials || learner.name?.charAt(0) || 'U' }}
                                            </div>
                                            <div v-if="index === 0" class="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-400 rounded-full border-2 border-white dark:border-[#0d0d12] flex items-center justify-center shadow-sm">
                                                <Star class="w-2 h-2 text-white fill-current" />
                                            </div>
                                        </div>
                                        <div class="space-y-0.5">
                                            <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight italic">{{ learner.name }}</h3>
                                            <div class="flex items-center gap-2">
                                                <span class="px-2 py-0.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-md text-[8px] font-black uppercase tracking-widest italic">Lvl {{ learner.level }}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Points Pill -->
                                    <div class="hidden sm:block px-4 py-2 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm group-hover:bg-purple-500 group-hover:text-white group-hover:border-purple-500 transition-colors">
                                        <div class="flex items-center gap-2">
                                            <Star class="w-3 h-3 text-amber-400 group-hover:text-white transition-colors" />
                                            <span class="text-xs font-black italic">{{ learner.points }} <span class="text-[8px] opacity-70 tracking-widest uppercase not-italic font-bold ml-1">XP</span></span>
                                        </div>
                                    </div>
                                    
                                    <!-- Mobile Points (shown only on small screens) -->
                                    <div class="sm:hidden text-xs font-black italic text-slate-900 dark:text-white">
                                        {{ learner.points }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <!-- Sticky Sidebar (Details) -->
                <aside class="lg:col-span-4 order-1 lg:order-2 lg:sticky lg:top-8 transition-all duration-500">
                    <div class="bg-white/60 dark:bg-white/[0.05] backdrop-blur-3xl border-2 border-slate-200 dark:border-white/20 rounded-[2.5rem] shadow-2xl p-6 min-h-[400px] hover:border-purple-500/20 transition-all relative overflow-hidden group">
                        
                        <!-- Selected Content -->
                        <div v-if="selectedStudent" class="space-y-6 animate-vessel">
                            <!-- Header Profile -->
                            <div class="text-center space-y-3">
                                <div class="relative w-20 h-20 mx-auto">
                                    <div class="w-full h-full rounded-[1.5rem] bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center text-white text-2xl font-black shadow-2xl shadow-purple-500/40 transform -rotate-3 transition-transform group-hover:rotate-0">
                                        {{ selectedStudent.initials || selectedStudent.name?.charAt(0) || 'U' }}
                                    </div>
                                    <div v-if="getRankIndex(selectedStudent) === 0" class="absolute -bottom-2 -right-2 w-8 h-8 bg-white dark:bg-[#1a1625] rounded-xl flex items-center justify-center shadow-lg border-2 border-slate-100 dark:border-white/10">
                                        <span class="text-sm">🔥</span> 
                                    </div>
                                </div>
                                <div>
                                    <h3 class="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight italic">{{ selectedStudent.name }}</h3>
                                    <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Class Champion</p>
                                </div>
                            </div>

                            <div class="h-px w-full bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent"></div>

                            <!-- Stat Grid -->
                            <div class="grid grid-cols-2 gap-3">
                                <div class="p-4 rounded-[1.5rem] bg-slate-50 dark:bg-white/[0.03] border-2 border-slate-100 dark:border-white/5 text-center shadow-inner group/stat hover:border-purple-500/30 transition-all">
                                    <div class="p-2 w-fit mx-auto rounded-xl bg-purple-500/10 text-purple-600 mb-2 transition-transform group-hover/stat:rotate-12">
                                        <Trophy class="w-3.5 h-3.5" />
                                    </div>
                                    <p class="text-base font-black text-slate-800 dark:text-white italic leading-none">{{ getRank(selectedStudent) }}</p>
                                    <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Class Rank</p>
                                </div>
                                <div class="p-4 rounded-[1.5rem] bg-slate-50 dark:bg-white/[0.03] border-2 border-slate-100 dark:border-white/5 text-center shadow-inner group/stat hover:border-fuchsia-500/30 transition-all">
                                    <div class="p-2 w-fit mx-auto rounded-xl bg-fuchsia-500/10 text-fuchsia-600 mb-2 transition-transform group-hover/stat:rotate-12">
                                        <Star class="w-3.5 h-3.5" />
                                    </div>
                                    <p class="text-base font-black text-slate-800 dark:text-white italic leading-none">{{ selectedStudent.points }}</p>
                                    <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Total XP</p>
                                </div>
                            </div>

                            <!-- Achievements Selection -->
                            <div class="space-y-3">
                                <h4 class="text-[9px] font-black text-slate-400 dark:text-gray-600 uppercase tracking-[0.3em] italic px-2">Top Skills</h4>
                                <div class="flex flex-wrap gap-2 px-1">
                                    <span v-for="skill in (selectedStudent.skills || ['Fast Reader', 'Quiz Master', 'Early Bird'])" :key="skill"
                                        class="px-3 py-1.5 bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[8px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider italic">
                                        {{ skill }}
                                    </span>
                                </div>
                            </div>

                            <!-- Close Button -->
                            <button @click="selectedStudent = null"
                                class="w-full py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-[9px] font-black uppercase tracking-[0.4em] rounded-xl shadow-xl hover:scale-[1.03] active:scale-[0.97] transition-all italic drop-shadow-lg">
                                Clear Select
                            </button>
                        </div>

                        <!-- Help Board (When no one is selected) -->
                        <div v-else class="h-[300px] flex flex-col items-center justify-center text-center space-y-4 animate-vessel">
                            <div class="p-4 rounded-[2rem] bg-slate-50 dark:bg-white/5 border-2 border-slate-100 dark:border-white/10 shadow-inner">
                                <MousePointer2 class="w-6 h-6 text-slate-300 dark:text-gray-700 animate-bounce" />
                            </div>
                            <div class="space-y-1">
                                <h3 class="text-base font-black text-slate-400 uppercase italic">Pick a Friend</h3>
                                <p class="text-[8px] font-bold text-slate-500 uppercase tracking-widest px-8 italic">Select any student in the list to see their card!</p>
                            </div>
                        </div>

                        <!-- Corner Decor -->
                        <div class="absolute -top-10 -left-10 w-20 h-20 bg-purple-600/5 rounded-full blur-[60px]"></div>
                    </div>
                </aside>
            </div>

            <!-- Footer Message -->
            <p class="mt-12 text-center text-[9px] font-black text-slate-400 dark:text-gray-600 uppercase tracking-[0.4em] italic leading-none">
                Safety First // <span class="text-purple-600 dark:text-fuchsia-500/50">Stay kind while studying with others</span>
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
    Trophy, Users, Star, 
    ArrowLeft as ArrowLeftIcon, 
    ChevronRight as ChevronRightIcon,
    MousePointer2,
    Medal
} from 'lucide-vue-next'
import api from '@/utils/api'

const router = useRouter()
const learners = ref([])
const selectedStudent = ref(null)
const isLoading = ref(true)

const getRank = (student) => {
    const index = learners.value.findIndex(l => l.id === student.id)
    return index !== -1 ? `#${index + 1}` : 'N/A'
}

const getRankIndex = (student) => {
    return learners.value.findIndex(l => l.id === student.id)
}

onMounted(async () => {
    try {
        const res = await api.get('/api/v1/quizzes/gamification/leaderboard')
        if (res.data?.learners) {
            learners.value = res.data.learners
            // Pre-select the top student
            if (learners.value.length > 0) {
                selectedStudent.value = learners.value[0]
            }
        }
    } catch (error) {
        console.error('[v0] Failed to load leaderboard:', error.message)
    } finally {
        isLoading.value = false
    }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,600;0,700;0,900;1,400;1,700;1,900&display=swap');

.animate-spin-slow { animation: spin 10s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

/* --- 3D LIQUID GEM PHYSICS --- */
.liquid-gem-logo {
    background: radial-gradient(circle at 35% 35%, #a855f7 0%, #6b21a8 55%, #2e1065 100%);
    box-shadow: inset -5px -5px 12px rgba(0,0,0,0.5), inset 5px 5px 10px rgba(255,255,255,0.3), 0 20px 40px rgba(107, 33, 168, 0.4);
}

.liquid-3d-underline {
    background: radial-gradient(circle at 30% 30%, #f472b6 0%, #db2777 55%, #831843 100%);
    box-shadow: inset -2px -2px 5px rgba(0,0,0,0.4), inset 2px 2px 5px rgba(255,255,255,0.4);
}

/* Animations */
.animate-in {
    animation: fadeSlideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-vessel {
    animation: vesselSlideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(40px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes vesselSlideIn {
    from { opacity: 0; transform: translateY(20px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}

.settings-slide-enter-active,
.settings-slide-leave-active {
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.settings-slide-enter-from { opacity: 0; transform: translateX(20px); }
.settings-slide-leave-to { opacity: 0; transform: translateX(-20px); }

/* Hide Scrollbar but keep scrolling */
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.custom-font-poppins {
    font-family: 'Poppins', sans-serif !important;
}
</style>
