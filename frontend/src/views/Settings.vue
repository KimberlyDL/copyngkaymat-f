<template>
    <div class="min-h-screen w-full flex items-center justify-center bg-[#060606] font-['Poppins'] relative overflow-hidden p-4 sm:p-8 selection:bg-blue-500/30">
        
        <div class="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-pink-600/15 rounded-full blur-[120px] animate-pulse delay-1000 pointer-events-none"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div class="w-full max-w-[1200px] relative z-10 animate-in fade-in zoom-in duration-700">
            
            <div class="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row h-full min-h-[750px]">
                
                <aside class="w-full md:w-72 bg-white/[0.02] border-b md:border-b-0 md:border-r border-white/5 p-8 flex flex-col">
                    
                    <div class="mb-10 space-y-6">
                        <button @click="router.back()" 
                            class="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-all duration-300 outline-none">
                            <div class="p-2 rounded-xl bg-white/5 border border-white/5 group-hover:border-blue-500/50 group-hover:bg-blue-500/10 transition-all shadow-sm">
                                <ArrowLeftIcon class="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                            </div>
                            <span>Return to Hub</span>
                        </button>

                        <div>
                            <div class="flex items-center gap-3 mb-2">
                                <div class="h-8 w-8 rounded-xl bg-gradient-to-tr from-blue-600 to-pink-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                    <SettingsIcon class="w-4 h-4 text-white" />
                                </div>
                                <span class="text-lg font-black tracking-tighter uppercase text-white">Nexus</span>
                            </div>
                            <p class="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600 italic ml-1">Configuration Deck</p>
                        </div>
                    </div>

                    <nav class="flex-1 space-y-2">
                        <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
                            class="group relative flex items-center px-6 py-4 rounded-2xl transition-all duration-500 outline-none w-full"
                            :class="[
                                activeTab === tab.id
                                    ? 'text-white'
                                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                            ]">
                            <div v-if="activeTab === tab.id" 
                                class="absolute inset-0 bg-gradient-to-r from-blue-600 to-pink-600 rounded-2xl shadow-xl animate-in fade-in duration-300"></div>
                            
                            <component :is="tab.icon" class="relative z-10 mr-4 h-4 w-4 transition-transform duration-500" 
                                :class="activeTab === tab.id ? 'scale-110' : 'group-hover:rotate-12 group-hover:text-blue-400'" />
                            
                            <span class="relative z-10 text-[10px] font-black uppercase tracking-widest">{{ tab.name }}</span>
                        </button>
                    </nav>

                    <div class="mt-auto pt-8 border-t border-white/5">
                        <div class="flex items-center gap-3 px-2">
                            <div class="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] animate-pulse"></div>
                            <span class="text-[9px] font-black uppercase tracking-widest text-gray-600">Auth Secured</span>
                        </div>
                    </div>
                </aside>

                <main class="flex-1 flex flex-col relative bg-black/20">
                    <div class="h-16 border-b border-white/5 flex items-center px-10 justify-between">
                        <div class="flex items-center gap-3">
                            <span class="text-[9px] font-mono text-gray-600 uppercase tracking-widest">nexus_core</span>
                            <span class="text-[9px] font-mono text-gray-800">/</span>
                            <span class="text-[9px] font-mono text-blue-400 uppercase tracking-widest">{{ activeTab }}</span>
                        </div>
                        <Shield class="w-3.5 h-3.5 text-gray-700" />
                    </div>

                    <div class="flex-1 overflow-y-auto p-10 lg:p-14 custom-scrollbar">
                        <transition mode="out-in" name="auth-slide">
                            <component :is="currentComponent" />
                        </transition>
                    </div>
                </main>
            </div>

            <p class="mt-8 text-center text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">
                System Synchronized // <span class="text-blue-500 italic">ProtectEd Platform v2.0</span>
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router'; // Para sa back functionality
import { 
    User, 
    Shield, 
    Bell, 
    Users, 
    Settings as SettingsIcon, 
    ArrowLeft as ArrowLeftIcon // Inimport ang back icon
} from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import { useProfileStore } from '@/stores/profile';

// Lazy load sub-components
import ProfileSettings from '@/components/settings/ProfileSettings.vue';
import PrivacySettings from '@/components/settings/PrivacySettings.vue';
import GuardianSettings from '@/components/settings/GuardianSettings.vue';
import NotificationSettings from '@/components/settings/NotificationSettings.vue';
import AccountManagement from '@/components/settings/AccountManagement.vue';

const router = useRouter(); // Initialize router
const auth = useAuthStore();
const profileStore = useProfileStore();

const activeTab = ref('profile');

const tabs = [
    { id: 'profile', name: 'Identity', icon: User, component: ProfileSettings },
    { id: 'guardians', name: 'Guardians', icon: Users, component: GuardianSettings },
    { id: 'privacy', name: 'Security', icon: Shield, component: PrivacySettings },
    { id: 'notifications', name: 'Alerts', icon: Bell, component: NotificationSettings },
    { id: 'account', name: 'System', icon: SettingsIcon, component: AccountManagement },
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
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');

/* High-Density Auth Style Animations */
.auth-slide-enter-active,
.auth-slide-leave-active {
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.auth-slide-enter-from {
    opacity: 0;
    transform: scale(0.98) translateY(10px);
}

.auth-slide-leave-to {
    opacity: 0;
    transform: scale(1.02) translateY(-10px);
}

.animate-in {
    animation: zoomIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes zoomIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
}

/* Scrollbar Refinement */
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
</style>