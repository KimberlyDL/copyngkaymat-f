<template>
    <div class="relative font-['Poppins']" ref="dropdownRef">
        <button @click="isOpen = !isOpen"
            class="w-full flex items-center gap-3 p-2.5 rounded-2xl bg-white/5 hover:bg-white/[0.08] transition-all duration-500 active:scale-95 group border border-white/5 hover:border-blue-500/30">
            
            <div class="relative flex-shrink-0">
                <div class="p-[2px] rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 group-hover:shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all duration-500">
                    <img :src="authStore.user?.avatar_url || defaultAvatar" alt="Admin Avatar"
                        class="h-10 w-10 rounded-full object-cover border-2 border-[#0a0a0c]" />
                </div>
                <div class="absolute bottom-0 right-0 h-3.5 w-3.5 bg-blue-500 border-2 border-[#0a0a0c] rounded-full shadow-[0_0_8px_#2563eb]">
                </div>
            </div>

            <transition name="fade">
                <div v-if="expanded" class="flex-1 text-left overflow-hidden">
                    <p class="text-sm font-bold text-white truncate group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-pink-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500">
                        {{ authStore.user?.name || 'Admin User' }}
                    </p>
                    <p class="text-[10px] text-gray-500 font-medium uppercase tracking-wider truncate">
                        {{ authStore.user?.email || 'Administrator' }}
                    </p>
                </div>
            </transition>

            <div v-if="expanded" class="transition-transform duration-500" :class="{ 'rotate-180': isOpen }">
                <ChevronDownIcon class="h-4 w-4 text-gray-600 group-hover:text-pink-400" />
            </div>
        </button>

        <transition name="dropdown">
            <div v-if="isOpen"
                class="absolute bottom-full left-0 right-0 mb-4 py-2 bg-[#0d0d12] rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] border border-white/10 overflow-hidden backdrop-blur-xl">
                
                <div class="px-4 py-2 mb-1 border-b border-white/5 lg:hidden">
                     <p class="text-xs font-bold text-gray-500 uppercase tracking-widest">Account</p>
                </div>

                <router-link to="/profile"
                    class="flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/10 hover:to-transparent transition-all duration-300 group">
                    <div class="p-1.5 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                        <UserIcon class="h-4 w-4 text-blue-400" />
                    </div>
                    <span class="font-semibold">My Profile</span>
                </router-link>

                <router-link to="/settings"
                    class="flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-pink-600/10 hover:to-transparent transition-all duration-300 group">
                    <div class="p-1.5 rounded-lg bg-pink-500/10 group-hover:bg-pink-500/20 transition-colors">
                        <SettingsIcon class="h-4 w-4 text-pink-400" />
                    </div>
                    <span class="font-semibold">Settings</span>
                </router-link>

                <div class="border-t border-white/5 my-2 mx-3"></div>

                <button @click="handleLogout"
                    class="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400/80 hover:text-red-400 hover:bg-red-500/5 transition-all duration-300 group">
                    <div class="p-1.5 rounded-lg bg-red-500/5 group-hover:bg-red-500/10 transition-colors">
                        <LogOutIcon class="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    </div>
                    <span class="font-bold tracking-tight">Logout</span>
                </button>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import {
    ChevronDownIcon,
    UserIcon,
    SettingsIcon,
    LogOutIcon
} from 'lucide-vue-next';

const props = defineProps({
    expanded: Boolean
});

const router = useRouter();
const authStore = useAuthStore();
const isOpen = ref(false);
const dropdownRef = ref(null);

const defaultAvatar = 'https://ui-avatars.com/api/?name=Admin&background=0d0d12&color=2563eb&bold=true';

const handleLogout = async () => {
    await authStore.logout();
    router.push('/facilitator/login');
};

const handleClickOutside = (event) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        isOpen.value = false;
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

/* Smooth Popping Transition for the dropdown */
.dropdown-enter-active {
    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
}
.dropdown-leave-active {
    transition: all 0.3s ease-in;
}

.dropdown-enter-from {
    opacity: 0;
    transform: translateY(20px) scale(0.9);
    filter: blur(10px);
}
.dropdown-leave-to {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
}

/* Fade transition for text */
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.4s ease;
}
.fade-enter-from, .fade-leave-to {
    opacity: 0;
}
</style>