<template>
    <Transition 
        enter-active-class="transition-opacity duration-300" 
        leave-active-class="transition-opacity duration-200" 
        enter-from-class="opacity-0" 
        leave-to-class="opacity-0"
    >
        <div v-if="isMobileShown" class="fixed inset-0 z-40 md:hidden bg-black/40 backdrop-blur-sm" @click="sidebarStore.closeMobile()" />
    </Transition>

    <aside :class="[
        'fixed top-0 left-0 bottom-0 z-[60] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] custom-font-poppins',
        'bg-white dark:bg-[#0b0a12] backdrop-blur-xl text-black dark:text-white border-r border-slate-200 dark:border-white/5 shadow-2xl',
        isHidden && 'hidden md:block translate-x-[-100%]',
        isIcon && 'w-22 md:block',
        isFull && 'w-72 md:block',
        isMobileShown && 'w-72 md:hidden shadow-purple-900/20'
    ]">
        <div class="h-full flex flex-col relative overflow-hidden">
            <div class="absolute -top-10 -left-10 w-40 h-40 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none"></div>

            <div :class="['flex items-center h-24 relative z-10 transition-all duration-500 border-b border-slate-100 dark:border-white/5', isFull ? 'px-6' : 'justify-center px-0']">
                <router-link :to="{ name: 'facilitator.dashboard' }" class="flex items-center gap-3 group/logo">
                    <div class="relative flex-shrink-0 transition-transform duration-500" :class="isIcon && 'scale-90'">
                        <div class="relative w-12 h-12 bg-gradient-to-br from-purple-600 via-fuchsia-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-[0_8px_20px_-4px_rgba(147,51,234,0.5),inset_0_2px_4px_rgba(255,255,255,0.3)] group-hover/logo:rotate-6 transition-all">
                            <ShieldCheckIcon class="w-7 h-7 text-white" />
                        </div>
                    </div>
                    
                    <transition name="fade">
                        <div v-if="isFull" class="flex flex-col">
                            <h1 class="text-xl font-black tracking-tighter text-black dark:text-white leading-none uppercase custom-font-poppins">
                                Protect<span class="bg-gradient-to-r from-purple-600 to-fuchsia-500 dark:from-purple-400 dark:to-fuchsia-400 bg-clip-text text-transparent custom-font-poppins">Ed</span>
                            </h1>
                            <span class="text-[9px] font-black text-black/60 dark:text-purple-300/40 uppercase tracking-[0.3em] mt-1 normal leading-none custom-font-poppins">Academy Hub</span>
                        </div>
                    </transition>
                </router-link>
            </div>

            <div :class="['flex items-center py-6 relative z-10', isFull ? 'justify-between px-8' : 'justify-center px-0']">
                <transition name="fade">
                    <span v-if="isFull" class="text-[10px] font-black uppercase tracking-[0.2em] text-black dark:text-slate-500 normal custom-font-poppins">Registry</span>
                </transition>
                <button @click="sidebarStore.toggleExpanded()"
                    class="p-2 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-purple-500/50 shadow-sm transition-all group">
                    <ChevronLeft v-if="isFull" class="h-4 w-4 text-black dark:text-purple-400 group-hover:-translate-x-0.5 transition-transform" />
                    <ChevronRight v-else class="h-4 w-4 text-black dark:text-purple-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
            </div>

            <nav class="flex-1 px-4 space-y-3 overflow-y-auto custom-scrollbar relative z-10 py-2">
                <button @click="router.push({ name: 'facilitator.dashboard' })" class="sidebar-btn group" :class="{ 'active-util': route.name === 'facilitator.dashboard' }">
                    <div :class="['flex items-center gap-4 w-full', isIcon ? 'justify-center' : '']">
                        <div class="icon-container">
                            <LayoutDashboard class="h-5 w-5" />
                        </div>
                        <span v-if="!isIcon" class="nav-text text-black dark:text-white/90">Dashboard</span>
                    </div>
                </button>

                <button @click="router.push({ name: 'facilitator.classrooms' })" class="sidebar-btn group" :class="{ 'active-util': route.name === 'facilitator.classrooms' }">
                    <div :class="['flex items-center gap-4 w-full', isIcon ? 'justify-center' : '']">
                        <div class="icon-container">
                            <School class="h-5 w-5" />
                        </div>
                        <span v-if="!isIcon" class="nav-text text-black dark:text-white/90">Classrooms</span>
                    </div>
                </button>

                <button @click="isLeaderboardOpen = true" class="sidebar-btn group">
                    <div :class="['flex items-center gap-4 w-full', isIcon ? 'justify-center' : '']">
                        <div class="icon-container">
                            <Trophy class="h-5 w-5" />
                        </div>
                        <span v-if="!isIcon" class="nav-text text-black dark:text-white/90">Leaderboards</span>
                    </div>
                </button>

                <button @click="router.push({ name: 'facilitator.modules' })" class="sidebar-btn group" :class="{ 'active-util': route.name === 'facilitator.modules' }">
                    <div :class="['flex items-center gap-4 w-full', isIcon ? 'justify-center' : '']">
                        <div class="icon-container">
                            <BookOpen class="h-5 w-5" />
                        </div>
                        <span v-if="!isIcon" class="nav-text text-black dark:text-white/90">Modules</span>
                    </div>
                </button>

                <button @click="router.push({ name: 'facilitator.rewards' })" class="sidebar-btn group" :class="{ 'active-util': route.name === 'facilitator.rewards' }">
                    <div :class="['flex items-center gap-4 w-full', isIcon ? 'justify-center' : '']">
                        <div class="icon-container">
                            <Gift class="h-5 w-5" />
                        </div>
                        <div v-if="!isIcon" class="flex-1 flex justify-between items-center">
                            <span class="nav-text text-black dark:text-white/90">Rewards</span>
                            <span class="text-[8px] bg-purple-500 text-white px-2 py-0.5 rounded-full font-black shadow-sm">MANAGE</span>
                        </div>
                    </div>
                </button>

                <div v-if="isFull" class="px-5 pt-6 pb-2 text-[10px] font-black uppercase tracking-[0.25em] text-black dark:text-purple-400/60 normal custom-font-poppins">
                    Performance
                </div>
                
                <button @click="router.push({ name: 'facilitator.analytics' })" class="sidebar-btn group" :class="{ 'active-util': route.name === 'facilitator.analytics' }">
                    <div :class="['flex items-center gap-4 w-full', isIcon ? 'justify-center' : '']">
                        <div class="icon-container">
                            <LineChart class="h-5 w-5" />
                        </div>
                        <span v-if="!isIcon" class="nav-text text-black dark:text-white/90">Analytics</span>
                    </div>
                </button>
            </nav>

            <div class="mt-auto p-4 relative border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02]">
                <div :class="['flex items-center bg-white dark:bg-[#151321] border border-slate-200 dark:border-white/10 p-2 rounded-[2rem] transition-all hover:border-purple-500/30 shadow-lg', isIcon ? 'w-14 h-14 justify-center p-0 mx-auto' : 'w-full justify-between gap-3']">
                    <div class="flex items-center gap-3 min-w-0" v-if="!isIcon">
                        <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-purple-600 flex items-center justify-center text-[11px] font-black text-white shadow-md uppercase border border-white/20 custom-font-poppins">
                            {{ initials }}
                        </div>
                        <div class="flex-1 min-w-0 text-left">
                            <p class="text-[12px] font-black text-black dark:text-white truncate uppercase tracking-tighter custom-font-poppins leading-none">{{ auth.user?.name || 'ADMIN' }}</p>
                            <p class="text-[9px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest normal leading-none mt-1 custom-font-poppins">Facilitator</p>
                        </div>
                    </div>
                    <button @click="profileMenuOpen = !profileMenuOpen" class="text-black dark:text-slate-400 hover:text-purple-600 transition-colors p-1 pr-2">
                        <MoreVertical v-if="!isIcon" class="h-4 w-4" />
                        <div v-else class="w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-[10px] font-black text-white uppercase shadow-md custom-font-poppins">{{ initials }}</div>
                    </button>
                </div>

                <Transition name="slide-up">
                    <div v-if="profileMenuOpen" :class="[isIcon ? 'absolute left-24 bottom-4' : 'absolute bottom-24 left-4 right-4']"
                        class="w-56 bg-white dark:bg-[#1a1729] border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden z-[70]">
                        <button @click="router.push({ name: 'profile' }); profileMenuOpen = false" class="menu-item text-black dark:text-slate-300 custom-font-poppins">
                            <UserIcon class="h-4 w-4 text-purple-600" /> Account
                        </button>
                        <button @click="router.push({ name: 'settings' }); profileMenuOpen = false" class="menu-item text-black dark:text-slate-300 custom-font-poppins">
                            <Settings class="h-4 w-4 text-purple-600" /> Settings
                        </button>
                        <button @click="isLogoutModalOpen = true; profileMenuOpen = false" class="menu-item text-red-600 border-none hover:bg-red-50 dark:hover:bg-red-500/5 custom-font-poppins">
                            <LogOut class="h-4 w-4" /> LogOut
                        </button>
                    </div>
                </Transition>
            </div>
        </div>
    </aside>

    <LeaderboardModal :is-open="isLeaderboardOpen" @close="isLeaderboardOpen = false" />

    <Teleport to="body">
        <Transition name="fade">
            <div v-if="isLogoutModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div class="absolute inset-0 bg-black/60 backdrop-blur-md" @click="isLogoutModalOpen = false"></div>
                <div class="relative bg-white dark:bg-[#12101c] border border-slate-200 dark:border-white/10 rounded-[3rem] p-10 max-w-sm w-full text-center shadow-2xl flex flex-col items-center">
                    <div class="w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-[2.5rem] flex items-center justify-center mb-6 transform -rotate-6 shadow-inner transition-transform hover:rotate-0 duration-500">
                        <LogOut class="w-10 h-10 text-red-600" />
                    </div>
                    <h3 class="text-2xl font-black text-black dark:text-white uppercase normal tracking-tighter custom-font-poppins">LogOut?</h3>
                    <p class="text-[10px] text-black/70 dark:text-slate-400 mt-2 mb-10 uppercase tracking-[0.2em] font-black leading-relaxed custom-font-poppins text-center">System session will be terminated. <br/> Do you want to continue?</p>
                    <div class="grid grid-cols-2 gap-4 w-full custom-font-poppins font-black">
                        <button @click="isLogoutModalOpen = false" class="px-6 py-4 bg-slate-100 dark:bg-white/5 rounded-full text-[10px] uppercase text-black/60 hover:bg-slate-200 transition-all">Cancel</button>
                        <button @click="logout" class="px-6 py-4 bg-red-600 rounded-full text-[10px] text-white uppercase shadow-lg shadow-red-900/40 hover:scale-105 transition-all">Confirm</button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSidebarStore } from '@/stores/stores'
import LeaderboardModal from '@/components/ui/LeaderboardModal.vue'
import {
    ChevronLeft, ChevronRight, Users, BookOpen, 
    MoreVertical, User as UserIcon, Settings, 
    LogOut, LayoutDashboard, School, LineChart,
    ShieldCheck as ShieldCheckIcon, Gift, Trophy
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const sidebarStore = useSidebarStore()

const isLeaderboardOpen = ref(false)
const profileMenuOpen = ref(false)
const isLogoutModalOpen = ref(false)
const width = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)

const logout = async () => {
    isLogoutModalOpen.value = false
    try { await auth.logout() } finally { router.push({ name: 'login' }) }
}

const initials = computed(() => {
    const name = auth.user?.name || 'Admin'
    return name.trim().split(/\s+/).map(p => p[0]).join('').toUpperCase().slice(0, 2)
})

const isFull = computed(() => sidebarStore.isExpanded && width.value >= 1024)
const isIcon = computed(() => !sidebarStore.isExpanded && width.value >= 1024)
const isMobileShown = computed(() => sidebarStore.isMobileOpen && width.value < 1024)
const isHidden = computed(() => !sidebarStore.isMobileOpen && width.value < 1024)

onMounted(() => {
    if (typeof window !== 'undefined') {
        window.addEventListener('resize', () => width.value = window.innerWidth)
    }
})
</script>

<style scoped>
/* Reference for Tailwind v4 engine */
@reference "../../style.css";

/* External Google Font */
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700;1,900&display=swap');

/* Font definition using standard CSS to avoid build errors */
.custom-font-poppins {
    font-family: 'Poppins', sans-serif !important;
}

/* Sidebar Button base styles */
.sidebar-btn { 
    @apply w-full rounded-full transition-all duration-300 px-4 py-3 text-left flex items-center text-black/70 dark:text-slate-500 hover:bg-purple-500/5 hover:text-purple-600; 
}

/* 3D Pill Active State */
.active-util { 
    @apply relative overflow-hidden scale-[1.03] !text-white;
    background: linear-gradient(135deg, #9333ea 0%, #c026d3 100%);
    box-shadow: 
        0 12px 24px -8px rgba(147, 51, 234, 0.6),
        inset 0 2px 4px rgba(255, 255, 255, 0.35),
        inset 0 -2px 4px rgba(0, 0, 0, 0.15);
}

/* Shine overlay for active state */
.active-util::before {
    content: '';
    @apply absolute inset-0 opacity-30 pointer-events-none;
    background: linear-gradient(to bottom, rgba(255,255,255,0.7) 0%, transparent 60%);
}

.icon-container {
    @apply p-2 rounded-full bg-slate-100 dark:bg-white/5 transition-all duration-300;
}

.active-util .icon-container { 
    @apply bg-white/20 shadow-none !text-white; 
}

.nav-text {
    @apply text-[11px] font-black uppercase tracking-[0.15em] relative z-10;
    font-family: 'Poppins', sans-serif !important;
}

.active-util .nav-text, 
.active-util svg { 
    @apply !text-white drop-shadow-md; 
}

/* Profile menu item styles */
.menu-item { 
    @apply w-full flex items-center gap-4 px-6 py-4 text-[10px] font-black uppercase hover:text-purple-600 hover:bg-purple-500/5 transition-all border-b border-slate-100 dark:border-white/5 last:border-none; 
    font-family: 'Poppins', sans-serif !important;
}

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { @apply bg-slate-200 dark:bg-white/10 rounded-full; }

/* Transitions */
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(15px) scale(0.95); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>