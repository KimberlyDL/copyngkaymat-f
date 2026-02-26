<template>
    <div class="relative profile-node font-['Poppins']" ref="dropdownRef">
        <!-- TRIGGER BUTTON (Match sa Login/Reg aesthetics: Dark, Bordered, Glow) -->
        <button @click.stop="isOpen = !isOpen" type="button" :aria-expanded="isOpen" 
            class="w-full flex items-center gap-3 p-1.5 pr-4 rounded-2xl bg-[#0d0d12] border border-white/5 hover:border-blue-500/30 transition-all active:scale-95 group shadow-xl">
            <div class="relative flex-shrink-0">
                <!-- Avatar Node na may glow signal -->
                <div class="relative w-9 h-9 rounded-xl overflow-hidden border border-white/10 group-hover:border-blue-500/50 transition-all">
                    <img :src="avatar" :alt="name" class="w-full h-full object-cover" />
                    <div class="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <!-- Online Status Signal -->
                <div class="absolute -bottom-1 -right-1 h-3 w-3 bg-blue-500 border-2 border-[#060608] rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
            </div>

            <transition name="fade">
                <div v-if="expanded" class="flex-1 text-left overflow-hidden">
                    <p class="text-[11px] font-black text-white uppercase tracking-tight truncate leading-none">
                        {{ name.split(' ')[0] }}
                    </p>
                    <p class="text-[8px] font-black text-blue-500/60 uppercase tracking-[0.2em] leading-none mt-1.5 italic">
                        Verified Teacher
                    </p>
                </div>
            </transition>

            <ChevronDown v-if="expanded" :class="['w-3.5 h-3.5 text-gray-600 transition-transform duration-500', isOpen ? 'rotate-180 text-pink-500' : '']" />
        </button>

        <!-- DROPDOWN MENU (Match sa industrial bento style) -->
        <Transition name="slide-up">
            <div v-if="isOpen" class="absolute bottom-full left-0 right-0 mb-3 w-64 bg-[#0d0d12]/95 backdrop-blur-2xl border border-white/10 rounded-[1.8rem] shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden z-[110]">
                <!-- User Info Header Node -->
                <div class="px-5 py-4 bg-white/[0.02] border-b border-white/5 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-full blur-2xl"></div>
                    <p class="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] relative z-10">Teacher</p>
                    <p class="text-xs font-black text-white truncate mt-2 uppercase tracking-tight relative z-10">{{ name }}</p>
                    <p class="text-[9px] font-bold text-blue-400/70 truncate tracking-wide mt-0.5 relative z-10">{{ email }}</p>
                </div>
                
                <!-- Menu Navigation Stream -->
                <div class="p-2 space-y-1">
                    <button @click="goProfile" class="menu-item group/m">
                        <div class="p-2 rounded-xl bg-blue-500/5 border border-blue-500/10 group-hover/m:bg-blue-500/10 transition-colors">
                            <UserIcon class="w-4 h-4 text-blue-400" />
                        </div>
                        <span class="flex-1 text-left text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover/m:text-white">My Profile</span>
                    </button>
                    
                    <button @click="goSettings" class="menu-item group/m">
                        <div class="p-2 rounded-xl bg-pink-500/5 border border-pink-500/10 group-hover/m:bg-pink-500/10 transition-colors">
                            <SettingsIcon class="w-4 h-4 text-pink-400" />
                        </div>
                        <span class="flex-1 text-left text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover/m:text-white">Settings</span>
                    </button>
                    
                    <div class="h-px bg-white/5 my-1.5 mx-2"></div>
                    
                    <!-- Logout Signal Button -->
                    <button @click="triggerLogout" class="menu-item border-none text-red-500 hover:bg-red-500/5 group/m">
                        <div class="p-2 rounded-xl bg-red-500/5 border border-red-500/10 group-hover/m:bg-red-500/20 transition-colors">
                            <LogOutIcon class="w-4 h-4" />
                        </div>
                        <span class="flex-1 text-left text-[10px] font-black uppercase tracking-widest">Log out</span>
                    </button>
                </div>
            </div>
        </Transition>

        <!-- LOGOUT VERIFICATION MODAL (Centered with Red Glow Signal) -->
        <Teleport to="body">
            <Transition name="fade">
                <div v-if="showModal" class="fixed inset-0 z-[300] flex items-center justify-center p-4 overflow-hidden font-['Poppins']">
                    <!-- Backdrop Blur -->
                    <div class="absolute inset-0 bg-[#020203]/95 backdrop-blur-md" @click="showModal = false"></div>
                    
                    <!-- Modal Card Node -->
                    <div class="relative bg-[#0d0d12] border border-white/10 rounded-[2.5rem] p-10 max-w-sm w-full shadow-[0_30px_80px_rgba(0,0,0,1)] overflow-hidden text-center flex flex-col items-center">
                        <div class="absolute -top-10 -right-10 w-40 h-40 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
                        
                        <div class="relative z-10 space-y-8 w-full flex flex-col items-center">
                            <!-- Alert Icon Node -->
                            <div class="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-[1.8rem] flex items-center justify-center text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                                <LogOutIcon class="w-10 h-10" />
                            </div>
                            
                            <div class="space-y-3">
                                <h3 class="text-2xl font-black uppercase tracking-tighter italic text-white">Log Out?</h3>
                                <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">You will be logged out in the app. Are you sure you want to proceed?</p>
                            </div>

                            <!-- Industrial Action Buttons -->
                            <div class="grid grid-cols-2 gap-4 w-full">
                                <button @click="showModal = false" 
                                    class="px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:bg-white/10 hover:text-white transition-all active:scale-95 outline-none">
                                    Cancel
                                </button>
                                <button @click="confirmLogout" 
                                    class="px-6 py-4 bg-gradient-to-r from-red-600 to-pink-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-red-900/30 hover:scale-105 active:scale-95 transition-all outline-none">
                                    Log Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useProfileStore } from '@/stores/profile';
import { 
    ChevronDown, 
    User as UserIcon, 
    Settings as SettingsIcon, 
    LogOut as LogOutIcon 
} from 'lucide-vue-next';

// Inisyalize ang mga props para sa sidebar expand/collapse state
const props = defineProps({
    expanded: Boolean
});

// UI states para sa dropdown at modal
const isOpen = ref(false);
const showModal = ref(false);
const dropdownRef = ref(null);
const router = useRouter();
const authStore = useAuthStore();
const profileStore = useProfileStore();

// Pagkuha ng user data mula sa global stores
const name = computed(() => profileStore.profile?.display_name || authStore.user?.name || 'Facilitator');
const email = computed(() => authStore.user?.email || 'Unauthorized');
const avatar = computed(() => profileStore.avatarUrl(80));

// Functions para sa navigation at logout
const goProfile = () => {
    isOpen.value = false;
    router.push({ name: 'profile-settings' });
};

const goSettings = () => {
    isOpen.value = false;
    router.push({ name: 'settings' });
};

const triggerLogout = () => {
    isOpen.value = false;
    showModal.value = true;
};

const confirmLogout = async () => {
    showModal.value = false;
    try {
        await authStore.logout();
        profileStore.$reset();
    } finally {
        router.push('/facilitator/login');
    }
};

// Logic para isara ang dropdown kapag nag-click sa labas
const handleClickOutside = (event) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        isOpen.value = false;
    }
};

onMounted(async () => {
    document.addEventListener('click', handleClickOutside);

    // I-load ang profile data kung kailangan
    if (authStore.isAuthenticated && !profileStore.profile) {
        try {
            await profileStore.fetchProfile(authStore.user.id);
        } catch (err) {
            console.error("Could not load profile", err);
        }
    }
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
@reference "@/style.css";

/* Industrial menu items with hover signals */
.menu-item {
    @apply w-full flex items-center gap-4 px-4 py-3 transition-all rounded-2xl border border-transparent;
}

.menu-item:hover {
    @apply bg-white/[0.03] border-white/5;
}

/* Entry animations for dropdown and modals */
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(12px) scale(0.98); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>