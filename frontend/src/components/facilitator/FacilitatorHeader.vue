<template>
    <header
        class="sticky top-0 z-30 bg-white dark:bg-[#0a0a0c] border-b border-gray-200 dark:border-white/5 shadow-sm dark:shadow-[0_4px_30px_rgba(0,0,0,0.7)] font-['Poppins'] transition-all duration-500"
    >
        <div class="h-[3px] w-full bg-gradient-to-r from-blue-600 via-pink-500 to-blue-600 animate-pulse"></div>

        <div class="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div class="flex items-center gap-4">
                <button @click="sidebarStore.toggleMobile"
                    class="lg:hidden p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-pink-600/20 text-gray-600 dark:text-blue-400 transition-all duration-500 active:scale-90">
                    <MenuIcon class="h-6 w-6" />
                </button>

                <nav class="hidden sm:flex items-center space-x-3 text-sm">
                    <router-link to="/facilitator/dashboard"
                        class="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white font-medium tracking-tight transition-all duration-300">
                        FACILITATOR
                    </router-link>
                    <ChevronRightIcon class="h-4 w-4 text-gray-400 dark:text-gray-700" />
                    <span class="font-bold uppercase tracking-widest bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
                        {{ currentPageTitle }}
                    </span>
                </nav>
            </div>

            <div class="flex items-center gap-3">
                <button @click="createModule"
                    class="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-pink-600 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] text-white rounded-xl text-sm font-bold tracking-wide transition-all duration-500 active:scale-95 group">
                    <PlusIcon class="h-4 w-4 group-hover:rotate-90 transition-transform duration-500" />
                    <span>CREATE MODULE</span>
                </button>

                <button class="relative p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-all duration-300 group active:scale-90">
                    <BellIcon class="h-5.5 w-5.5 text-gray-600 dark:text-gray-400 group-hover:text-pink-500 transition-colors" />
                    <span
                        class="absolute top-2.5 right-2.5 h-2 w-2 bg-pink-500 rounded-full ring-2 ring-white dark:ring-[#0a0a0c] animate-ping"></span>
                    <span
                        class="absolute top-2.5 right-2.5 h-2 w-2 bg-pink-500 rounded-full ring-2 ring-white dark:ring-[#0a0a0c]"></span>
                </button>

                <button @click="toggleTheme"
                    class="p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-transparent hover:border-blue-500/30 hover:bg-gray-200 dark:hover:bg-white/10 transition-all duration-500 group active:rotate-45">
                    <SunIcon v-if="isDark" class="h-5.5 w-5.5 text-yellow-500 group-hover:drop-shadow-[0_0_8px_#eab308]" />
                    <MoonIcon v-else class="h-5.5 w-5.5 text-blue-600 dark:text-blue-400 group-hover:drop-shadow-[0_0_8px_#60a5fa]" />
                </button>

                <button @click="showLogoutModal = true"
                    class="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 rounded-xl text-sm font-bold tracking-widest transition-all duration-500 border border-red-500/20 active:scale-95 group">
                    <LogOutIcon class="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    <span class="hidden sm:inline">LOGOUT</span>
                </button>
            </div>
        </div>

        <transition name="modal-fade">
            <div v-if="showLogoutModal" 
                class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0a0c]/80 backdrop-blur-md">
                <div class="bg-white dark:bg-[#0d0d12] border border-gray-200 dark:border-white/10 p-8 rounded-[2rem] max-w-sm w-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] scale-in-center">
                    <div class="w-20 h-20 bg-gradient-to-tr from-red-500/20 to-pink-500/20 rounded-3xl flex items-center justify-center mb-6 mx-auto border border-red-500/20 shadow-inner">
                        <LogOutIcon class="h-10 w-10 text-red-500" />
                    </div>
                    
                    <h3 class="text-2xl font-black text-center text-gray-900 dark:text-white mb-2 uppercase tracking-tight">Confirm Logout</h3>
                    <p class="text-gray-500 dark:text-gray-400 text-center mb-8 font-medium px-4">Are you sure you want to end your current session?</p>
                    
                    <div class="flex gap-3">
                        <button 
                            @click="showLogoutModal = false"
                            class="flex-1 py-4 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 rounded-2xl font-bold transition-all duration-300 active:scale-95"
                        >
                            CANCEL
                        </button>
                        <button 
                            @click="handleLogout"
                            class="flex-1 py-4 bg-gradient-to-r from-red-600 to-pink-600 hover:shadow-[0_10px_20px_rgba(220,38,38,0.3)] text-white rounded-2xl font-bold transition-all duration-500 active:scale-95"
                        >
                            LOGOUT
                        </button>
                    </div>
                </div>
            </div>
        </transition>
    </header>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSidebarStore } from '@/stores/stores';
import { useAuthStore } from '@/stores/auth';
import {
    MenuIcon,
    ChevronRightIcon,
    PlusIcon,
    BellIcon,
    SunIcon,
    MoonIcon,
    LogOutIcon
} from 'lucide-vue-next';

// Logic intact as requested
const route = useRoute();
const router = useRouter();
const sidebarStore = useSidebarStore();
const authStore = useAuthStore();
const isDark = ref(false);
const showLogoutModal = ref(false);

const currentPageTitle = computed(() => route.meta.title || 'Dashboard');

const toggleTheme = () => {
    isDark.value = !isDark.value;
    document.documentElement.classList.toggle('dark');
};

const createModule = () => {
    router.push('/facilitator/modules/create');
};

const handleLogout = async () => {
    try {
        await authStore.logout();
        router.push({ name: 'login' });
    } catch (error) {
        console.error("Logout process failed:", error);
        showLogoutModal.value = false;
    }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

/* Main Smooth Transitions */
header * {
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

/* Modal Animation */
.scale-in-center {
    animation: scale-in-center 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes scale-in-center {
    0% { transform: scale(0.7); opacity: 0; filter: blur(10px); }
    100% { transform: scale(1); opacity: 1; filter: blur(0); }
}

/* Modal Backdrop Transition */
.modal-fade-enter-active, .modal-fade-leave-active {
    transition: opacity 0.4s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
    opacity: 0;
}

/* Text glow for active title */
span {
    text-shadow: 0 0 15px rgba(236, 72, 153, 0.1);
}
</style>