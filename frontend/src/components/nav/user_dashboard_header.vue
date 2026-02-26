<template>
    <div class="header-container">
        <header id="main-header" class="fixed top-0 left-0 right-0 z-[100] font-['Poppins'] border-b border-white/5 bg-[#060608]/80 backdrop-blur-xl transition-all duration-500">
            <div class="max-w-[1600px] mx-auto px-4 lg:px-8">
                <div class="h-16 flex items-center justify-between gap-6">
                    
                    <div class="flex items-center gap-6">
                        <button @click="$emit('toggle-mobile-sidebar')"
                            class="md:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-blue-400 hover:border-blue-500/30 transition-all active:scale-95" 
                            aria-label="Open menu">
                            <Menu class="h-5 w-5" />
                        </button>

                        <router-link :to="{ name: 'user.dashboard' }"
                            class="group flex items-center gap-3 outline-none">
                            <div class="relative flex items-center justify-center w-10 h-10 bg-[#0d0d12] border border-white/10 rounded-2xl group-hover:border-blue-500/50 transition-all shadow-lg overflow-hidden">
                                <div class="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <svg class="w-6 h-6 text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                                    <path d="M10 17l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" fill="white" />
                                </svg>
                            </div>
                            <span class="text-2xl font-black tracking-tighter text-white uppercase group-hover:text-blue-400 transition-colors">
                                Protect<span class="bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">Ed</span>
                            </span>
                        </router-link>

                        <div class="relative hidden lg:block group/search">
                            <input type="text" placeholder="Search for lessons…" 
                                class="w-80 pl-11 pr-4 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl outline-none
                                bg-[#0d0d12] border border-white/5 text-gray-300 placeholder:text-gray-600
                                focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 focus:w-96
                                transition-all duration-500 shadow-inner" />
                            <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within/search:text-blue-500 transition-colors" />
                        </div>
                    </div>

                    <div class="flex items-center gap-4">
                        <router-link :to="{ name: 'home' }" 
                            class="hidden md:flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                            <PlayIcon class="w-3.5 h-3.5 fill-current" />
                            Start Lesson
                        </router-link>

                        <div class="h-8 w-px bg-white/5 hidden md:block"></div>

                        <div class="relative">
                            <button @click="isDropdownOpen = !isDropdownOpen" 
                                class="flex items-center gap-2 p-1 pr-3 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all active:scale-95 group">
                                <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-pink-500 flex items-center justify-center text-[10px] font-black text-white shadow-lg group-hover:scale-105 transition-transform uppercase">
                                    {{ userInitials }}
                                </div>
                                <ChevronDown :class="['w-3.5 h-3.5 text-gray-500 transition-transform duration-300', isDropdownOpen ? 'rotate-180 text-blue-400' : '']" />
                            </button>

                            <Transition name="slide-up">
                                <div v-if="isDropdownOpen" class="absolute top-full right-0 mt-3 w-52 bg-[#0d0d12]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
                                    <div class="px-4 py-3 bg-white/[0.02] border-b border-white/5">
                                        <p class="text-[8px] font-black text-gray-600 uppercase tracking-[0.3em]">User Account</p>
                                        <p class="text-[10px] font-bold text-blue-400 truncate mt-1 uppercase">{{ auth.user?.name || 'Guest' }}</p>
                                    </div>
                                    <div class="p-1.5">
                                        <button @click="goProfile" class="menu-item group/m">
                                            <User class="w-3.5 h-3.5 text-blue-400 group-hover/m:scale-110 transition-transform" />
                                            <span class="flex-1 text-left">Profile</span>
                                        </button>
                                        <button @click="goSettings" class="menu-item group/m">
                                            <Settings class="w-3.5 h-3.5 text-pink-400 group-hover/m:scale-110 transition-transform" />
                                            <span class="flex-1 text-left">Settings</span>
                                        </button>
                                        <button @click="triggerLogout" class="menu-item border-none text-red-500 hover:bg-red-500/5 group/m">
                                            <LogOut class="w-3.5 h-3.5 group-hover/m:translate-x-1 transition-transform" />
                                            <span class="flex-1 text-left">Log Out</span>
                                        </button>
                                    </div>
                                </div>
                            </Transition>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <Transition name="fade">
            <div v-if="isLogoutModalOpen" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
                <div class="absolute inset-0 bg-[#020203]/90 backdrop-blur-md" @click="isLogoutModalOpen = false"></div>
                <div class="relative bg-[#0d0d12] border border-white/10 rounded-[2.5rem] p-10 max-w-sm w-full shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden text-center flex flex-col items-center">
                    <div class="absolute -top-10 -right-10 w-32 h-32 bg-red-600/5 rounded-full blur-3xl"></div>
                    <div class="relative z-10 space-y-6 flex flex-col items-center">
                        <div class="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-[1.5rem] flex items-center justify-center text-red-500">
                            <LogOut class="w-8 h-8" />
                        </div>
                        <div class="space-y-2">
                            <h3 class="text-xl font-black uppercase tracking-tighter italic text-white font-heading">Log Out?</h3>
                            <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">Sigurado ka bang gusto mong lumabas sa iyong account?</p>
                        </div>
                        <div class="grid grid-cols-2 gap-3 pt-4 w-full">
                            <button @click="isLogoutModalOpen = false" class="px-6 py-3.5 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:bg-white/10 hover:text-white transition-all active:scale-95">Cancel</button>
                            <button @click="handleLogout" class="px-6 py-3.5 bg-gradient-to-r from-red-600 to-pink-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-red-900/20 hover:scale-105 active:scale-95 transition-all">Log Out</button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Menu, Search, Play as PlayIcon, ChevronDown, User, Settings, LogOut } from 'lucide-vue-next'

/* --- Emits --- */
defineEmits(['toggle-mobile-sidebar'])

const router = useRouter()
const auth = useAuthStore()

/* --- State --- */
const isDropdownOpen = ref(false)
const isLogoutModalOpen = ref(false)

/* --- Logic --- */
const userInitials = computed(() => {
    const name = auth.user?.name || ''
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'U'
})

const goProfile = () => { isDropdownOpen.value = false; router.push({ name: 'profile' }) }
const goSettings = () => { isDropdownOpen.value = false; router.push({ name: 'settings' }) }
const triggerLogout = () => { isDropdownOpen.value = false; isLogoutModalOpen.value = true }

const handleLogout = async () => {
    isLogoutModalOpen.value = false
    try {
        await auth.logout()
        router.push({ name: 'login' })
    } catch (err) { console.error('Logout failed:', err) }
}

const closeDropdown = (e) => {
    if (!e.target.closest('.relative')) isDropdownOpen.value = false
}

onMounted(() => window.addEventListener('click', closeDropdown))
onUnmounted(() => window.removeEventListener('click', closeDropdown))
</script>

<style scoped>
@reference "@/style.css";
.menu-item { @apply w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 transition-all rounded-xl; }
#main-header { animation: headerEntry 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes headerEntry { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(10px) scale(0.95); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>