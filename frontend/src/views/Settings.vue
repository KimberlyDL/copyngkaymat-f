<template>
    <div class="min-h-screen bg-slate-50 dark:bg-[#050507] custom-font-poppins animate-in transition-colors duration-300 selection:bg-purple-500/30">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            
            <!-- Header -->
            <header class="mb-10">
                <button @click="router.back()" 
                    class="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-purple-600 transition-colors mb-6">
                    <ArrowLeftIcon class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    <span>Back</span>
                </button>
                
                <div class="flex items-center gap-4 mb-2">
                    <div class="h-8 w-1 bg-purple-600 rounded-full"></div>
                    <h1 class="text-3xl md:text-4xl font-[900] uppercase tracking-tighter italic text-black dark:text-white">
                        System <span class="text-purple-600">Settings</span>
                    </h1>
                </div>
                <p class="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 ml-6">
                    Account Configuration Panel
                </p>
            </header>

            <div class="flex flex-col lg:flex-row gap-8">
                
                <!-- Sidebar Navigation -->
                <aside class="w-full lg:w-72 shrink-0">
                    <nav class="bg-white dark:bg-[#0d0d12] border border-slate-200 dark:border-white/5 rounded-[2rem] p-4 space-y-2 shadow-sm">
                        <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
                            class="w-full flex items-center gap-3 px-5 py-4 text-xs font-black uppercase tracking-wider rounded-xl transition-all"
                            :class="[
                                activeTab === tab.id
                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                            ]">
                            <component :is="tab.icon" class="w-5 h-5" />
                            <span>{{ tab.name }}</span>
                        </button>
                    </nav>
                </aside>

                <!-- Main Content -->
                <main class="flex-1 min-w-0">
                    <div class="bg-white dark:bg-[#0d0d12] rounded-[2rem] shadow-sm border border-slate-200 dark:border-white/5 overflow-hidden">
                        <div class="p-6 sm:p-10">
                            <transition mode="out-in" name="fade">
                                <component :is="currentComponent" />
                            </transition>
                        </div>
                    </div>
                </main>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { 
    User, 
    Shield, 
    Bell, 
    Settings as SettingsIcon, 
    ArrowLeft as ArrowLeftIcon
} from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import { useProfileStore } from '@/stores/profile';

import ProfileSettings from '@/components/settings/ProfileSettings.vue';
import PrivacySettings from '@/components/settings/PrivacySettings.vue';
import NotificationSettings from '@/components/settings/NotificationSettings.vue';
import AccountManagement from '@/components/settings/AccountManagement.vue';

const router = useRouter();
const auth = useAuthStore();
const profileStore = useProfileStore();

const activeTab = ref('profile');

const tabs = [
    { id: 'profile', name: 'Profile', icon: User, component: ProfileSettings },
    { id: 'privacy', name: 'Privacy & Security', icon: Shield, component: PrivacySettings },
    { id: 'notifications', name: 'Notifications', icon: Bell, component: NotificationSettings },
    { id: 'account', name: 'Account', icon: SettingsIcon, component: AccountManagement },
];

const currentComponent = computed(() => {
    const tab = tabs.find(t => t.id === activeTab.value);
    return tab ? tab.component : ProfileSettings;
});

onMounted(async () => {
    if (auth.user) await profileStore.fetchProfile(auth.user.id);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>