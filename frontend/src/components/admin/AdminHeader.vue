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
                    <router-link to="/admin/dashboard"
                        class="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white font-medium tracking-tight transition-all duration-300">
                        ADMIN
                    </router-link>
                    <ChevronRightIcon class="h-4 w-4 text-gray-400 dark:text-gray-700" />
                    <span class="font-bold uppercase tracking-widest bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
                        {{ currentPageTitle }}
                    </span>
                </nav>
            </div>

            <div class="flex items-center gap-3">
                <div class="hidden md:block relative group">
                    <input type="text" placeholder="Search system..."
                        class="w-64 pl-11 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-[#111114] text-gray-900 dark:text-white text-sm font-light transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-pink-500/40 focus:border-blue-500/40 group-hover:border-gray-400 dark:group-hover:border-white/20 placeholder:text-gray-500" />
                    <SearchIcon class="absolute left-4 top-3 h-4.5 w-4.5 text-gray-400 group-focus-within:text-blue-500 group-hover:text-pink-500 transition-colors duration-500" />
                </div>

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

                <div class="h-8 w-[1px] bg-gray-200 dark:bg-white/10 mx-1"></div>
            </div>
        </div>
    </header>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useSidebarStore } from '@/stores/stores';
import {
    MenuIcon,
    ChevronRightIcon,
    SearchIcon,
    BellIcon,
    SunIcon,
    MoonIcon,
    LogOutIcon
} from 'lucide-vue-next';

const route = useRoute();
const sidebarStore = useSidebarStore();
const isDark = ref(false);

const currentPageTitle = computed(() => route.meta.title || 'Dashboard');

const toggleTheme = () => {
    isDark.value = !isDark.value;
    document.documentElement.classList.toggle('dark');
};

const handleLogout = () => {
    // Add your logout logic here (e.g., clearing tokens)
    console.log('User logging out...');
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');

/* Global header transitions */
header * {
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

/* Custom glow for breadcrumb gradient */
span {
    text-shadow: 0 0 15px rgba(236, 72, 153, 0.1);
}

/* Ensure placeholder uses Poppins */
::placeholder {
    font-family: 'Poppins', sans-serif;
    letter-spacing: 0.025em;
}
</style>