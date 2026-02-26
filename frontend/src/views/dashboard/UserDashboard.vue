<template>
    <div class="p-4 md:p-6 space-y-6 bg-[#060608] min-h-screen font-['Poppins'] text-white selection:bg-pink-500/30 transition-colors duration-500">
        <div class="max-w-[1600px] mx-auto grid lg:grid-cols-3 gap-6 items-start">

            <div class="lg:col-span-2 space-y-6">
                <div class="p-[1px] rounded-[1.5rem] bg-gradient-to-r from-blue-600/50 to-transparent shadow-2xl">
                    <div class="bg-[#0d0d12] rounded-[1.4rem] p-5 relative overflow-hidden group">
                        <div class="absolute -right-10 -top-10 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl"></div>
                        <div class="flex items-center gap-5 relative z-10">
                            <div class="flex-shrink-0 w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
                                <MegaphoneIcon class="w-5 h-5" />
                            </div>
                            <div class="flex-1 text-left">
                                <h4 class="font-black text-base uppercase tracking-[0.15em] text-blue-400 mb-0.5">Academy Notice</h4>
                                <p class="text-gray-400 text-xs uppercase font-bold leading-relaxed italic">
                                    Check the Classroom Hub for bagong announcements mula sa iyong mga facilitators.
                                    <span class="text-pink-500 ml-1 font-black text-[9px]">[ STATUS: LIVE ]</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid md:grid-cols-2 gap-6">
                    <div class="p-[1px] rounded-[2rem] bg-gradient-to-br from-blue-600/40 via-purple-600/40 to-pink-600/40 shadow-xl">
                        <div class="bg-[#0d0d12] rounded-[1.9rem] p-6 h-full flex flex-col justify-between group">
                            <div v-if="latestModule">
                                <h2 class="text-xs font-black text-gray-500 uppercase tracking-[0.3em] mb-4 italic flex items-center gap-2">
                                    <ActivityIcon class="w-3 h-3 text-blue-500" /> Active Quest
                                </h2>
                                <div class="space-y-4 text-left">
                                    <div class="p-5 rounded-2xl bg-white/[0.03] border border-white/5 group-hover:border-blue-500/20 transition-all">
                                        <div class="flex justify-between items-center mb-2">
                                            <h3 class="font-black text-white text-sm uppercase tracking-tight truncate pr-4">{{ latestModule.title }}</h3>
                                            <span class="text-[9px] font-black text-blue-400 italic">{{ latestModule.progress || 0 }}%</span>
                                        </div>
                                        <div class="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                            <div class="h-full bg-gradient-to-r from-blue-500 to-pink-500 transition-all duration-1000" :style="{ width: (latestModule.progress || 0) + '%' }"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="text-center py-10 opacity-30">
                                <p class="text-[10px] font-black uppercase tracking-widest">No Active Quests</p>
                            </div>
                            <button @click="goModule(latestModule?.id)" :disabled="!latestModule" class="w-full mt-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-blue-900/20">
                                <PlayIcon class="w-3 h-3 fill-current mr-2 inline" /> Resume Mission
                            </button>
                        </div>
                    </div>

                    <div class="bg-[#0d0d12] border border-white/5 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                        <div class="absolute -right-20 -bottom-20 w-40 h-40 bg-pink-600/5 rounded-full blur-[80px]"></div>
                        <div>
                            <div class="flex justify-between items-center mb-4 relative z-10">
                                <h2 class="text-xs font-black text-gray-500 uppercase tracking-[0.4em] italic">GAD Office Shop</h2>
                                <router-link :to="{ name: 'user.managebadges' }" class="text-[9px] font-black text-pink-500 hover:text-white uppercase tracking-widest transition-all italic">[ SHOP ]</router-link>
                            </div>
                            <p class="text-[10px] text-gray-400 uppercase font-medium mb-4 italic">Ipalit ang iyong XP para sa physical items sa GAD Office!</p>
                        </div>
                        <div class="space-y-2">
                             <div class="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <GiftIcon class="w-4 h-4 text-pink-500" />
                                    <span class="text-[10px] font-black uppercase">Tangible Rewards</span>
                                </div>
                                <span class="text-[8px] font-black bg-pink-500/20 text-pink-500 px-2 py-0.5 rounded-full">AVAILABLE</span>
                             </div>
                        </div>
                    </div>
                </div>

                <div class="bg-[#0d0d12] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                    <div class="flex items-center justify-between mb-8 relative z-10">
                        <h2 class="text-2xl font-black text-white uppercase tracking-tighter italic flex items-center gap-3">
                            <div class="h-5 w-1 bg-blue-500 rounded-full"></div>
                            Quest <span class="text-blue-500 italic">Library</span>
                        </h2>
                        <router-link :to="{ name: 'user.modules' }" class="text-[9px] font-black text-gray-600 hover:text-blue-400 uppercase tracking-widest transition-all">[ EXPLORE ALL ]</router-link>
                    </div>
                    
                    <div v-if="moduleStore.loading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        <div v-for="i in 3" :key="i" class="h-40 bg-white/5 rounded-[1.5rem] animate-pulse"></div>
                    </div>

                    <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 relative z-10">
                        <div v-for="mod in moduleStore.modules.slice(0, 6)" :key="mod.id" @click="goModule(mod.id)"
                            class="group bg-white/[0.02] border border-white/5 p-5 rounded-[1.5rem] hover:border-blue-500/30 hover:bg-blue-500/5 transition-all cursor-pointer">
                            <div class="w-10 h-10 rounded-lg bg-blue-500/5 border border-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-all">
                                <BookOpenIcon class="w-5 h-5 text-blue-500" />
                            </div>
                            <h3 class="font-black text-sm text-white uppercase tracking-tight mb-1.5 leading-tight line-clamp-1">{{ mod.title }}</h3>
                            <p class="text-xs text-gray-500 line-clamp-2 mb-5 h-8 italic font-medium tracking-tight">{{ mod.description }}</p>
                            <div class="flex justify-between items-center">
                                <span class="text-[8px] font-black text-blue-500 uppercase tracking-widest">Start Mission →</span>
                                <span v-if="mod.progress === 100" class="text-[8px] font-black text-emerald-400 italic">CLEARED</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="space-y-6 lg:sticky lg:top-20">
                <div class="p-[1px] rounded-[2.5rem] bg-gradient-to-tr from-blue-600/30 via-indigo-600/30 to-pink-600/30 shadow-2xl overflow-hidden">
                    <div class="bg-[#0d0d12] rounded-[2.4rem] overflow-hidden">
                        <div class="bg-gradient-to-br from-blue-700 via-indigo-700 to-pink-700 p-8 text-white text-center relative overflow-hidden">
                            <h1 class="text-4xl font-black uppercase tracking-tighter relative z-10">PLAYER: {{ userFirstName }}</h1>
                            <div class="flex justify-center items-center gap-2 mt-2 relative z-10">
                                <div class="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[9px] font-black tracking-widest">
                                    LEVEL {{ auth.user?.gamification?.level || 1 }}
                                </div>
                                <div class="flex items-center gap-1 text-orange-400">
                                    <FlameIcon class="w-3 h-3 fill-current" />
                                    <span class="text-[9px] font-black italic">{{ auth.user?.gamification?.streak || 0 }} STREAK</span>
                                </div>
                            </div>
                        </div>

                        <div class="p-8 text-center space-y-8">
                            <div>
                                <p class="text-[10px] text-gray-600 mb-1 font-black uppercase tracking-[0.3em] italic">Accumulated XP</p>
                                <div class="flex items-baseline justify-center gap-1.5">
                                    <span class="text-6xl font-black text-white tracking-tighter">{{ auth.user?.gamification?.experience_points?.toLocaleString() || 0 }}</span>
                                    <span class="text-xs font-black text-blue-500 uppercase">XP</span>
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-3">
                                <div class="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                    <TrophyIcon class="w-4 h-4 mx-auto mb-2 text-yellow-500" />
                                    <p class="text-[8px] text-gray-600 uppercase font-black mb-1">Rank</p>
                                    <p class="text-xs font-black italic text-white">#{{ userRank }}</p>
                                </div>
                                <div class="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                    <ShieldCheckIcon class="w-4 h-4 mx-auto mb-2 text-pink-500" />
                                    <p class="text-[8px] text-gray-600 uppercase font-black mb-1">Badges</p>
                                    <p class="text-xs font-black italic text-white">{{ auth.user?.badges?.length || 0 }} Earned</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-[#0d0d12] border border-white/5 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden">
                    <h3 class="text-xs font-black text-gray-600 uppercase tracking-[0.4em] mb-6 italic flex items-center gap-2">
                        <TrophyIcon class="w-3 h-3 text-yellow-500" /> Hall of Fame
                    </h3>
                    <div v-if="loadingLeaderboard" class="space-y-3">
                        <div v-for="i in 5" :key="i" class="h-12 bg-white/5 rounded-xl animate-pulse"></div>
                    </div>
                    <div v-else class="space-y-3">
                        <div v-for="(player, index) in leaderboard" :key="player.user_id"
                            class="flex items-center justify-between p-3.5 rounded-xl transition-all"
                            :class="player.user_id === auth.user?.id ? 'bg-blue-600/10 border border-blue-500/20' : 'bg-white/[0.02]'">
                            <div class="flex items-center gap-3">
                                <span class="text-[9px] font-black" :class="index < 3 ? 'text-pink-500' : 'text-gray-700'">{{ index + 1 }}</span>
                                <span class="text-xs font-black uppercase tracking-tight" :class="player.user_id === auth.user?.id ? 'text-white' : 'text-gray-400'">
                                    {{ player.user_id === auth.user?.id ? 'YOU' : (player.user?.name || 'Player') }}
                                </span>
                            </div>
                            <span class="text-[8px] font-black text-pink-500 italic">{{ player.experience_points?.toLocaleString() }} XP</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useModuleStore } from '@/stores/module'
import api from '@/utils/api'
import { 
    Megaphone as MegaphoneIcon, 
    Play as PlayIcon, 
    Activity as ActivityIcon, 
    ShieldCheck as ShieldCheckIcon, 
    Trophy as TrophyIcon,
    BookOpen as BookOpenIcon,
    Flame as FlameIcon,
    Gift as GiftIcon
} from 'lucide-vue-next'

const router = useRouter()
const auth = useAuthStore()
const moduleStore = useModuleStore()

// --- STATES ---
const leaderboard = ref([])
const loadingLeaderboard = ref(true)

// --- COMPUTED ---
const userFirstName = computed(() => auth.user?.name?.split(' ')[0] || 'Player')

const latestModule = computed(() => {
    if (!moduleStore.modules.length) return null
    const inProgress = moduleStore.modules.find(m => m.progress > 0 && m.progress < 100)
    return inProgress || moduleStore.modules[0]
})

const userRank = computed(() => {
    const rank = leaderboard.value.findIndex(p => p.user_id === auth.user?.id)
    return rank !== -1 ? rank + 1 : '?'
})

// --- METHODS ---
const fetchLeaderboard = async () => {
    loadingLeaderboard.value = true
    try {
        // Siguraduhing may endpoint ka para sa leaderboard (e.g., /api/v1/gamification/leaderboard)
        const res = await api.get('/api/v1/gamification/leaderboard')
        leaderboard.value = res.data.leaderboard || []
    } catch (err) {
        console.error("Failed to fetch leaderboard:", err)
    } finally {
        loadingLeaderboard.value = false
    }
}

const goModule = (id) => {
    if (id) router.push({ name: 'user.module', params: { id } })
}

onMounted(async () => {
    // I-refresh ang modules
    await moduleStore.fetchModules()
    
    // I-fetch ang leaderboard data
    await fetchLeaderboard()

    // I-refresh ang user session para sa pinakabagong XP mula sa database
    if (auth.restoreSession) {
        await auth.restoreSession()
    }
})
</script>

<style scoped>
.shadow-glow { filter: drop-shadow(0 0 12px rgba(59, 130, 246, 0.4)); }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: #3b82f6; }
</style>