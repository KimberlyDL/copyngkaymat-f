<template>
    <Transition enter-active-class="transition-opacity duration-300" leave-active-class="transition-opacity duration-200" enter-from-class="opacity-0" leave-to-class="opacity-0">
        <div v-if="isMobileShown" class="fixed inset-0 z-40 md:hidden bg-[#020203]/90 backdrop-blur-md" @click="sidebarStore.closeMobile()" />
    </Transition>

    <aside :class="[
        'fixed top-0 left-0 bottom-0 z-[60] font-[\'Century_Gothic\'] transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)',
        'bg-[#060608]/95 backdrop-blur-2xl text-white border-r border-white/5',
        isHidden && 'hidden md:block translate-x-[-100%]',
        isIcon && 'w-20 md:block',
        isFull && 'w-64 md:block',
        isMobileShown && 'w-72 md:hidden shadow-[20px_0_50px_rgba(0,0,0,0.5)]'
    ]">
        <div class="h-full flex flex-col relative overflow-hidden">
            <div class="absolute -top-20 -left-20 w-40 h-40 bg-pink-600/10 rounded-full blur-[80px] pointer-events-none"></div>

            <div :class="['flex items-center h-28 relative z-10 transition-all duration-500 border-b border-white/5', isFull ? 'px-6' : 'justify-center px-0']">
                <router-link :to="{ name: 'facilitator.dashboard' }" class="flex items-center gap-3 overflow-hidden group/logo">
                    <div class="relative flex-shrink-0 transition-transform duration-500" :class="isIcon && 'scale-90'">
                        <div class="relative w-11 h-11 bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.3)] group-hover/logo:scale-105 transition-transform">
                            <ShieldCheckIcon class="w-6 h-6 text-white" />
                        </div>
                    </div>
                    
                    <transition name="fade">
                        <div v-if="isFull" class="flex flex-col">
                            <h1 class="text-[22px] font-black tracking-tighter text-white uppercase leading-none">
                                Protect<span class="bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">Ed</span>
                            </h1>
                            <span class="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] mt-1.5 leading-none italic">Academy Hub</span>
                        </div>
                    </transition>
                </router-link>
            </div>

            <div :class="['flex items-center py-4 relative z-10 transition-all duration-500', isFull ? 'justify-between px-6' : 'justify-center px-0']">
                <transition name="fade">
                    <span v-if="isFull" class="text-[9px] font-black uppercase tracking-[0.3em] text-gray-700 italic">Main Registry</span>
                </transition>
                <button @click="sidebarStore.toggleExpanded()"
                    class="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-pink-500/50 hover:bg-pink-500/10 transition-all group shadow-lg">
                    <ChevronLeft v-if="isFull" class="h-3.5 w-3.5 text-pink-400 group-hover:scale-110" />
                    <ChevronRight v-else class="h-3.5 w-3.5 text-blue-400 group-hover:scale-110" />
                </button>
            </div>

            <nav class="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar relative z-10 py-4">
                <button @click="router.push({ name: 'facilitator.dashboard' })" class="sidebar-btn group" :class="{ 'active-util': route.name === 'facilitator.dashboard' }">
                    <div :class="['flex items-center gap-3 w-full', isIcon ? 'justify-center' : '']">
                        <div class="p-2.5 rounded-xl bg-white/5 group-hover:bg-blue-500/10 transition-colors">
                            <LayoutDashboard class="h-4.5 w-4.5 text-gray-500 group-hover:text-blue-400 transition-colors" />
                        </div>
                        <span v-if="!isIcon" class="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-200">Dashboard</span>
                    </div>
                </button>

                <button @click="router.push({ name: 'facilitator.classrooms' })" class="sidebar-btn group" :class="{ 'active-util': route.name === 'facilitator.classrooms' }">
                    <div :class="['flex items-center gap-3 w-full', isIcon ? 'justify-center' : '']">
                        <div class="p-2.5 rounded-xl bg-white/5 group-hover:bg-indigo-500/10 transition-colors">
                            <School class="h-4.5 w-4.5 text-gray-500 group-hover:text-indigo-400 transition-colors" />
                        </div>
                        <span v-if="!isIcon" class="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-200">Classrooms</span>
                    </div>
                </button>

                <button @click="router.push({ name: 'facilitator.modules' })" class="sidebar-btn group" :class="{ 'active-util': route.name === 'facilitator.modules' }">
                    <div :class="['flex items-center gap-3 w-full', isIcon ? 'justify-center' : '']">
                        <div class="p-2.5 rounded-xl bg-white/5 group-hover:bg-pink-500/10 transition-colors">
                            <BookOpen class="h-4.5 w-4.5 text-gray-500 group-hover:text-pink-400 transition-colors" />
                        </div>
                        <span v-if="!isIcon" class="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-200">Modules</span>
                    </div>
                </button>

                <button @click="router.push({ name: 'facilitator.students' })" class="sidebar-btn group" :class="{ 'active-util': route.name === 'facilitator.students' }">
                    <div :class="['flex items-center gap-3 w-full', isIcon ? 'justify-center' : '']">
                        <div class="p-2.5 rounded-xl bg-white/5 group-hover:bg-green-500/10 transition-colors">
                            <Users class="h-4.5 w-4.5 text-gray-500 group-hover:text-green-400 transition-colors" />
                        </div>
                        <span v-if="!isIcon" class="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-200">Students</span>
                    </div>
                </button>

                <div v-if="isFull" class="px-4 py-4 text-[9px] font-black uppercase tracking-[0.25em] text-pink-500 italic opacity-80">
                    Performance
                </div>
                
                <button @click="router.push({ name: 'facilitator.analytics' })" class="sidebar-btn group" :class="{ 'active-util': route.name === 'facilitator.analytics' }">
                    <div :class="['flex items-center gap-3 w-full', isIcon ? 'justify-center' : '']">
                        <div class="p-2.5 rounded-xl bg-white/5 group-hover:bg-blue-500/10 transition-colors">
                            <LineChart class="h-4.5 w-4.5 text-gray-500 group-hover:text-blue-400 transition-colors" />
                        </div>
                        <span v-if="!isIcon" class="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-200">Analytics</span>
                    </div>
                </button>
            </nav>

            <div class="mt-auto border-t border-white/5 bg-white/[0.01] p-4 relative">
                <div :class="['flex items-center bg-[#0d0d12] border border-white/5 p-2 rounded-2xl transition-all hover:border-blue-500/30 shadow-2xl', isIcon ? 'w-12 h-12 justify-center p-0 mx-auto' : 'w-full justify-between gap-3']">
                    <div class="flex items-center gap-3 min-w-0" v-if="!isIcon">
                        <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-pink-600 flex items-center justify-center text-[10px] font-black text-white shadow-xl uppercase">
                            {{ initials }}
                        </div>
                        <div class="flex-1 min-w-0 text-left">
                            <p class="text-[13px] font-black uppercase text-white truncate leading-none">{{ auth.user?.name || 'ADMIN' }}</p>
                            <p class="text-[8px] font-black text-blue-400 uppercase tracking-widest mt-1 truncate italic">Facilitator</p>
                        </div>
                    </div>
                    <button @click="profileMenuOpen = !profileMenuOpen" class="text-gray-500 hover:text-white transition-colors">
                        <MoreVertical v-if="!isIcon" class="h-4 w-4" />
                        <div v-else class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-pink-500 flex items-center justify-center text-[10px] font-black text-white uppercase">{{ initials }}</div>
                    </button>
                </div>

                <Transition name="slide-up">
                    <div v-if="profileMenuOpen" :class="[isIcon ? 'absolute left-20 bottom-4' : 'absolute bottom-20 left-4 right-4']"
                        class="w-48 bg-[#0d0d12] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[70]">
                        <button @click="router.push({ name: 'profile' }); profileMenuOpen = false" class="menu-item"><UserIcon class="h-3.5 w-3.5 text-blue-400" />Profile</button>
                        <button @click="router.push({ name: 'settings' }); profileMenuOpen = false" class="menu-item"><Settings class="h-3.5 w-3.5 text-pink-400" />Settings</button>
                        <button @click="isLogoutModalOpen = true; profileMenuOpen = false" class="menu-item text-red-500 border-none"><LogOut class="h-3.5 w-3.5" />Log Out</button>
                    </div>
                </Transition>
            </div>
        </div>
    </aside>

    <Teleport to="body">
        <Transition name="fade">
            <div v-if="isLogoutModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div class="absolute inset-0 bg-[#020203]/90 backdrop-blur-md" @click="isLogoutModalOpen = false"></div>
                <div class="relative bg-[#0d0d12] border border-white/10 rounded-[2.5rem] p-10 max-w-sm w-full text-center shadow-[0_30px_80px_rgba(0,0,0,1)] flex flex-col items-center font-['Century_Gothic']">
                    <LogOut class="w-12 h-12 text-red-500 mb-4" />
                    <h3 class="text-xl font-black text-white uppercase italic">Disconnect Link?</h3>
                    <p class="text-[10px] text-gray-500 uppercase tracking-widest mt-2 mb-6">System session will be terminated. Do you wish to proceed?</p>
                    <div class="grid grid-cols-2 gap-3 w-full">
                        <button @click="isLogoutModalOpen = false" class="px-6 py-3 bg-white/5 rounded-2xl text-[10px] font-black uppercase text-gray-400 hover:bg-white/10 transition-all">Cancel</button>
                        <button @click="logout" class="px-6 py-3 bg-red-600 rounded-2xl text-[10px] font-black text-white uppercase shadow-lg shadow-red-900/30 hover:scale-105 transition-all">Log Out</button>
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
import {
    ChevronLeft, ChevronRight, Users, BookOpen, 
    MoreVertical, User as UserIcon, Settings, 
    LogOut, LayoutDashboard, School, LineChart,
    ShieldCheck as ShieldCheckIcon
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const sidebarStore = useSidebarStore()

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

// SYNC SA STORE
const isFull = computed(() => sidebarStore.isExpanded && width.value >= 1024)
const isIcon = computed(() => !sidebarStore.isExpanded && width.value >= 1024)
const isMobileShown = computed(() => sidebarStore.isMobileOpen && width.value < 1024)
const isHidden = computed(() => !sidebarStore.isMobileOpen && width.value < 1024)

const mode = computed(() => width.value < 1024 ? (sidebarStore.isMobileOpen ? 'mobile-full' : 'hidden') : (sidebarStore.isExpanded ? 'full' : 'icon'))

onMounted(() => {
    if (typeof window !== 'undefined') {
        window.addEventListener('resize', () => width.value = window.innerWidth)
    }
})

const props = defineProps({ isMobileOpen: Boolean })
</script>

<style scoped>
@reference "@/style.css";
.sidebar-btn { @apply w-full rounded-2xl transition-all duration-300 px-3 py-2 text-left border border-transparent hover:bg-white/[0.03]; }
.active-util { @apply bg-white/5 border-white/10 shadow-lg scale-105; }
.active-util span { @apply text-gray-200; }
.menu-item { @apply w-full flex items-center gap-3 px-4 py-3 text-[9px] font-black uppercase text-gray-400 hover:text-white hover:bg-white/5 transition-all border-b border-white/5; }
.custom-scrollbar::-webkit-scrollbar { width: 3px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(15px) scale(0.95); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>