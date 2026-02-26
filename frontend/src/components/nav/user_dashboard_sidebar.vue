<template>
    <div class="sidebar-container">
        <Transition 
            enter-active-class="transition-opacity duration-300" 
            leave-active-class="transition-opacity duration-200" 
            enter-from-class="opacity-0" 
            leave-to-class="opacity-0"
        >
            <div v-if="isMobileShown" class="fixed inset-0 z-40 md:hidden bg-[#020203]/90 backdrop-blur-md" @click="$emit('close-mobile-sidebar')" />
        </Transition>

        <aside :class="[
            'fixed top-16 left-0 bottom-0 z-[60] font-[\'Century_Gothic\']',
            'bg-[#060608]/95 backdrop-blur-2xl text-white border-r border-white/5',
            'transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)',
            isHidden && 'hidden md:block translate-x-[-100%]',
            isIcon && 'w-20 md:block',
            isFull && 'w-64 md:block',
            isMobileShown && 'w-72 md:hidden shadow-[20px_0_50px_rgba(0,0,0,0.5)]'
        ]">
            <div class="h-full flex flex-col relative overflow-hidden">
                <div class="absolute -top-20 -left-20 w-40 h-40 bg-pink-600/10 rounded-full blur-[80px] pointer-events-none"></div>

                <div v-if="!isMobileShown" class="hidden md:flex items-center justify-between px-5 py-4 border-b border-white/5">
                    <span v-if="isFull" class="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600 italic">Academy Hub</span>
                    <button @click="expanded = !expanded"
                        class="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-pink-500/50 hover:bg-pink-500/10 transition-all group shadow-lg">
                        <ChevronLeft v-if="isFull" class="h-3.5 w-3.5 text-pink-400 group-hover:scale-110" />
                        <ChevronRight v-else class="h-3.5 w-3.5 text-blue-400 group-hover:scale-110" />
                    </button>
                </div>

                <nav class="flex-1 px-3 py-6 space-y-6 overflow-y-auto custom-scrollbar relative z-10">
                    <section v-if="isFull || isMobileShown" class="px-4 py-4 mb-4 bg-gradient-to-br from-blue-500/10 to-pink-500/10 rounded-[2rem] border border-white/5 shadow-inner">
                        <div class="flex items-center justify-between mb-3">
                            <div class="flex flex-col">
                                <span class="text-[8px] font-black text-blue-400 uppercase tracking-widest">Level</span>
                                <span class="text-xl font-black italic text-white">{{ auth.user?.gamification?.level || 1 }}</span>
                            </div>
                            <div class="flex items-center gap-1 text-orange-500 animate-pulse">
                                <Flame class="w-3.5 h-3.5 fill-current" />
                                <span class="text-[10px] font-black italic">{{ auth.user?.gamification?.streak || 0 }} DAY STREAK</span>
                            </div>
                        </div>
                        <div class="h-1.5 w-full bg-black/40 rounded-full overflow-hidden p-[1px] border border-white/5">
                            <div class="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000" 
                                 :style="{ width: calculateXpProgress + '%' }"></div>
                        </div>
                    </section>

                    <section class="space-y-1">
                        <button @click="router.push({ name: 'user.dashboard' })" class="sidebar-btn group" :class="{ 'active-util': route.name === 'user.dashboard' }">
                            <div :class="['flex items-center gap-3 w-full', isIcon ? 'justify-center' : '']">
                                <div class="p-2.5 rounded-xl bg-white/5 group-hover:bg-blue-500/10 transition-colors">
                                    <LayoutDashboard class="h-4.5 w-4.5 text-gray-500 group-hover:text-blue-400 transition-colors" />
                                </div>
                                <span v-if="!isIcon" class="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-200">Dashboard</span>
                            </div>
                        </button>

                        <button @click="router.push({ name: 'classrooms.index' })" class="sidebar-btn group" :class="{ 'active-util': route.name === 'classrooms.index' }">
                            <div :class="['flex items-center gap-3 w-full', isIcon ? 'justify-center' : '']">
                                <div class="p-2.5 rounded-xl bg-white/5 group-hover:bg-indigo-500/10 transition-colors">
                                    <School class="h-4.5 w-4.5 text-gray-500 group-hover:text-indigo-400 transition-colors" />
                                </div>
                                <span v-if="!isIcon" class="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-200">My Classrooms</span>
                            </div>
                        </button>

                        <button @click="router.push({ name: 'user.modules' })" class="sidebar-btn group" :class="{ 'active-util': route.name === 'user.modules' }">
                            <div :class="['flex items-center gap-3 w-full', isIcon ? 'justify-center' : '']">
                                <div class="p-2.5 rounded-xl bg-white/5 group-hover:bg-pink-500/10 transition-colors">
                                    <Library class="h-4.5 w-4.5 text-gray-500 group-hover:text-pink-400 transition-colors" />
                                </div>
                                <span v-if="!isIcon" class="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-200">Module Library</span>
                            </div>
                        </button>

                        <button @click="router.push({ name: 'user.managebadges' })" class="sidebar-btn group" :class="{ 'active-util': route.name === 'user.managebadges' }">
                            <div :class="['flex items-center gap-3 w-full', isIcon ? 'justify-center' : '']">
                                <div class="p-2.5 rounded-xl bg-white/5 group-hover:bg-yellow-500/10 transition-colors">
                                    <Gift class="h-4.5 w-4.5 text-gray-500 group-hover:text-yellow-400 transition-colors" />
                                </div>
                                <div v-if="!isIcon" class="flex-1 flex justify-between items-center">
                                    <span class="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-200">Rewards Shop</span>
                                    <span class="text-[8px] bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded-full font-black animate-bounce">CLAIM</span>
                                </div>
                            </div>
                        </button>
                    </section>

                    <section class="space-y-2">
                        <div v-if="isFull || isMobileShown" class="px-4 mb-4 text-[9px] font-black uppercase tracking-[0.25em] text-blue-500 italic opacity-80">
                            Current Quests
                        </div>
                        <div class="space-y-1">
                            <button v-for="module in moduleStore.modules" :key="module.id" @click="goModule(module.id)"
                                :class="['group w-full rounded-2xl transition-all duration-300 px-3 py-3 relative overflow-hidden flex items-center',
                                    isIcon ? 'justify-center' : 'gap-3',
                                    route.params.id == module.id ? 'bg-white/5 border border-white/10 shadow-lg' : 'border border-transparent hover:bg-white/[0.03]']">
                                
                                <div v-if="route.params.id == module.id" class="absolute left-0 top-3 bottom-3 w-1 bg-gradient-to-b from-pink-500 to-blue-500 rounded-r-full shadow-[0_0_15px_rgba(236,72,153,0.6)]"></div>
                                <div :class="['p-2 rounded-xl bg-white/5 transition-all group-hover:scale-110', route.params.id == module.id ? 'text-pink-500' : 'text-gray-600']">
                                    <BookOpen class="h-4 w-4" />
                                </div>

                                <div v-if="!isIcon" class="flex-1 min-w-0 text-left">
                                    <p :class="['truncate text-[10px] tracking-wide uppercase italic', route.params.id == module.id ? 'font-black text-white' : 'font-bold text-gray-500 group-hover:text-gray-300']">
                                        {{ module.title }}
                                    </p>
                                    <div class="h-1 w-full bg-white/5 rounded-full mt-2 overflow-hidden">
                                        <div class="h-full bg-gradient-to-r from-blue-500 to-pink-500" :style="{ width: (module.progress || 0) + '%' }"></div>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </section>
                </nav>

                <div class="mt-auto border-t border-white/5 bg-white/[0.01] p-4 relative">
                    <div :class="['flex items-center bg-[#0d0d12] border border-white/5 p-2 rounded-2xl transition-all hover:border-blue-500/30 shadow-2xl', isIcon ? 'w-12 h-12 justify-center p-0' : 'w-full justify-between gap-3']">
                        <div class="flex items-center gap-3 min-w-0" v-if="!isIcon">
                            <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-pink-600 flex items-center justify-center text-[10px] font-black text-white shadow-xl">
                                {{ initials }}
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-[14px] font-black uppercase text-white truncate leading-none">{{ auth.user?.name || 'TRAINEE' }}</p>
                                <p class="text-[8px] font-black text-blue-400 uppercase tracking-widest mt-1 truncate">Student</p>
                            </div>
                        </div>
                        <button @click="profileMenuOpen = !profileMenuOpen" class="text-gray-500 hover:text-white transition-colors">
                            <MoreVertical v-if="!isIcon" class="h-4 w-4" />
                            <div v-else class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-pink-500 flex items-center justify-center text-[10px] font-black text-white">{{ initials }}</div>
                        </button>
                    </div>

                    <Transition name="slide-up">
                        <div v-if="profileMenuOpen" :class="[isIcon ? 'absolute left-20 bottom-4' : 'absolute bottom-20 left-4 right-4']"
                            class="w-48 bg-[#0d0d12] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[70]">
                            <button @click="router.push({ name: 'profile' }); profileMenuOpen = false" class="menu-item"><UserIcon class="h-3.5 w-3.5 text-blue-400" />My Profile</button>
                            <button @click="router.push({ name: 'settings' }); profileMenuOpen = false" class="menu-item"><Settings class="h-3.5 w-3.5 text-pink-400" />Settings</button>
                            <button @click="isLogoutModalOpen = true" class="menu-item text-red-500 border-none"><LogOut class="h-3.5 w-3.5" />Log Out</button>
                        </div>
                    </Transition>
                </div>
            </div>
        </aside>

        <Transition name="fade">
            <div v-if="isLogoutModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div class="absolute inset-0 bg-[#020203]/90 backdrop-blur-md" @click="isLogoutModalOpen = false"></div>
                <div class="relative bg-[#0d0d12] border border-white/10 rounded-[2.5rem] p-8 max-w-sm w-full text-center">
                    <LogOut class="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 class="text-xl font-black text-white uppercase italic">Disconnect Link?</h3>
                    <p class="text-[10px] text-gray-500 uppercase tracking-widest mt-2 mb-6">Are you sure you want to sign out?</p>
                    <div class="grid grid-cols-2 gap-3">
                        <button @click="isLogoutModalOpen = false" class="px-6 py-3 bg-white/5 rounded-2xl text-[10px] font-black text-gray-400 uppercase">Cancel</button>
                        <button @click="logout" class="px-6 py-3 bg-red-600 rounded-2xl text-[10px] font-black text-white uppercase">Log Out</button>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useModuleStore } from '@/stores/module'
import {
    ChevronLeft, ChevronRight, Users, Library, Gift, 
    BookOpen, Flame, Trophy, MoreVertical, User as UserIcon, 
    Settings, LogOut, LayoutDashboard, School
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const moduleStore = useModuleStore()

/* --- State --- */
const expanded = ref(false)
const profileMenuOpen = ref(false)
const isLogoutModalOpen = ref(false)
const width = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)

/* --- Props & Emits --- */
// Idinagdag ang userId prop para mawala ang Extraneous Attributes warning
const props = defineProps({ 
    isMobileOpen: Boolean,
    userId: {
        type: [String, Number, null],
        default: null
    }
})
const emit = defineEmits(['close-mobile-sidebar', 'expanded-change'])

/* --- Computed --- */
const nextLevelXp = computed(() => (auth.user?.gamification?.level || 1) * 1000)
const calculateXpProgress = computed(() => {
    const currentXp = auth.user?.gamification?.experience_points || 0
    return Math.min((currentXp / nextLevelXp.value) * 100, 100)
})

const initials = computed(() => {
    const name = auth.user?.name || 'Player'
    return name.trim().split(/\s+/).map(p => p[0]).join('').toUpperCase().slice(0, 2)
})

const mode = computed(() => width.value < 768 ? (props.isMobileOpen ? 'mobile-full' : 'hidden') : (expanded.value ? 'full' : 'icon'))
const isHidden = computed(() => mode.value === 'hidden')
const isMobileShown = computed(() => mode.value === 'mobile-full')
const isIcon = computed(() => mode.value === 'icon')
const isFull = computed(() => mode.value === 'full')

/* --- Actions --- */
const goModule = (id) => router.push({ name: 'user.module', params: { id } })
const logout = async () => {
    isLogoutModalOpen.value = false
    try { await auth.logout() } finally { router.push({ name: 'login' }) }
}

/* --- Lifecycle --- */
onMounted(async () => {
    if (typeof window !== 'undefined') {
        window.addEventListener('resize', () => width.value = window.innerWidth)
        await moduleStore.fetchModules()
    }
})

watchEffect(() => emit('expanded-change', isFull.value))
</script>

<style scoped>
@reference "@/style.css";
.sidebar-btn { @apply w-full rounded-2xl transition-all duration-300 px-3 py-2 text-left border border-transparent; }
.active-util { @apply bg-white/5 border-white/10 shadow-lg; }
.menu-item { @apply w-full flex items-center gap-3 px-4 py-3 text-[9px] font-black uppercase text-gray-400 hover:text-white hover:bg-white/5 transition-all border-b border-white/5; }
.custom-scrollbar { scrollbar-width: none; }
.custom-scrollbar::-webkit-scrollbar { width: 3px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(15px) scale(0.95); }
</style>