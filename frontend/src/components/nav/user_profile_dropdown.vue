<template>
    <div class="relative profile-node font-['Poppins']">
        <!-- TRIGGER BUTTON -->
        <button @click.stop="open = !open" type="button" :aria-expanded="open" 
            class="flex items-center gap-2 p-1 pr-3 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-500/30 transition-all active:scale-95 group">
            <div class="relative w-8 h-8 rounded-xl overflow-hidden border border-white/10 shadow-lg group-hover:scale-105 transition-transform">
                <img :src="avatar" :alt="name" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-fuchsia-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <span class="hidden md:inline text-[10px] font-black uppercase tracking-widest text-gray-300 group-hover:text-white transition-colors">
                {{ name.split(' ')[0] }}
            </span>
            <ChevronDown :class="['w-3 h-3 text-gray-500 transition-transform duration-300', open ? 'rotate-180 text-purple-400' : '']" />
        </button>

        <!-- DROPDOWN MENU -->
        <Transition name="slide-up">
            <div v-if="open" class="absolute top-full right-0 mt-3 w-64 bg-[#0d0d12]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden z-[110]">
                <!-- User Info Header -->
                <div class="px-5 py-4 bg-white/[0.02] border-b border-white/5">
                    <p class="text-[8px] font-black text-gray-600 uppercase tracking-[0.3em]">Account Access</p>
                    <p class="text-[11px] font-black text-white truncate mt-1.5 uppercase tracking-tight">{{ name }}</p>
                    <p class="text-[9px] font-bold text-fuchsia-400/70 truncate tracking-wide">{{ email }}</p>
                </div>
                
                <!-- Menu Actions -->
                <div class="p-2 space-y-1">
                    <button @click="goProfile" class="menu-item group/m">
                        <div class="p-2 rounded-lg bg-purple-500/5 border border-purple-500/10 group-hover/m:bg-purple-500/10 transition-colors">
                            <UserIcon class="w-3.5 h-3.5 text-purple-400" />
                        </div>
                        <span class="flex-1 text-left">Profile Settings</span>
                    </button>
                    
                    <button @click="goSettings" class="menu-item group/m">
                        <div class="p-2 rounded-lg bg-fuchsia-500/5 border border-fuchsia-500/10 group-hover/m:bg-fuchsia-500/10 transition-colors">
                            <SettingsIcon class="w-3.5 h-3.5 text-fuchsia-400" />
                        </div>
                        <span class="flex-1 text-left">App Settings</span>
                    </button>
                    
                    <div class="h-px bg-white/5 mx-2 my-1"></div>
                    
                    <!-- Trigger Modal instead of direct logout -->
                    <button @click="triggerLogout" class="menu-item border-none text-red-500 hover:bg-red-500/5 group/m">
                        <div class="p-2 rounded-lg bg-red-500/5 border border-red-500/10 group-hover/m:bg-red-500/20 transition-colors">
                            <LogOutIcon class="w-3.5 h-3.5" />
                        </div>
                        <span class="flex-1 text-left">Log Out</span>
                    </button>
                </div>
            </div>
        </Transition>

        <!-- LOGOUT VERIFICATION MODAL (Centered on screen) -->
        <Teleport to="body">
            <Transition name="fade">
                <div v-if="showModal" class="fixed inset-0 z-[300] flex items-center justify-center p-4 overflow-hidden font-['Poppins']">
                    <!-- Backdrop -->
                    <div class="absolute inset-0 bg-[#020203]/95 backdrop-blur-md" @click="showModal = false"></div>
                    
                    <!-- Modal Card -->
                    <div class="relative bg-[#0d0d12] border border-white/10 rounded-[2.5rem] p-10 max-w-sm w-full shadow-[0_30px_70px_rgba(0,0,0,1)] overflow-hidden text-center flex flex-col items-center">
                        <div class="absolute -top-10 -right-10 w-40 h-40 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
                        
                        <div class="relative z-10 space-y-8 w-full flex flex-col items-center">
                            <!-- Icon Signal -->
                            <div class="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-[1.8rem] flex items-center justify-center text-red-500 shadow-lg">
                                <LogOutIcon class="w-10 h-10" />
                            </div>
                            
                            <div class="space-y-3">
                                <h3 class="text-2xl font-black uppercase tracking-tighter italic text-white">Log Out?</h3>
                                <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">Are you sure you want to sign out of your account?</p>
                            </div>

                            <!-- Actions -->
                            <div class="grid grid-cols-2 gap-4 w-full">
                                <button @click="showModal = false" 
                                    class="px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:bg-white/10 hover:text-white transition-all active:scale-95 outline-none">
                                    Cancel
                                </button>
                                <button @click="confirmLogout" 
                                    class="px-6 py-4 bg-gradient-to-r from-red-600 to-pink-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-red-900/20 hover:scale-105 active:scale-95 transition-all outline-none">
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useProfileStore } from '@/stores/profile'
import { 
    ChevronDown, 
    User as UserIcon, 
    Settings as SettingsIcon, 
    LogOut as LogOutIcon 
} from 'lucide-vue-next'

const open = ref(false)
const showModal = ref(false)
const router = useRouter()
const auth = useAuthStore()
const profileStore = useProfileStore()

// Profile Data
const name = computed(() => profileStore.profile?.display_name || auth.user?.name || 'User')
const email = computed(() => auth.user?.email || '—')
const avatar = computed(() => profileStore.avatarUrl(80))

// Actions
function goProfile() {
    open.value = false
    router.push({ name: 'profile-settings' })
}

function goSettings() {
    open.value = false
    router.push({ name: 'settings' })
}

function triggerLogout() {
    open.value = false
    showModal.value = true
}

async function confirmLogout() {
    showModal.value = false
    try {
        await auth.logout()
        profileStore.$reset()
    } finally {
        router.push({ name: 'login' })
    }
}

// Click Outside Logic
function onClickAway(e) {
    if (open.value && !e.target.closest('.profile-node')) {
        open.value = false
    }
}

onMounted(async () => {
    window.addEventListener('click', onClickAway)

    if (auth.isAuthenticated && !profileStore.profile) {
        try {
            await profileStore.fetchProfile(auth.user.id)
        } catch (err) {
            console.error("Could not load profile", err)
        }
    }
})

onUnmounted(() => window.removeEventListener('click', onClickAway))
</script>

<style scoped>
@reference "@/style.css";

.menu-item {
    @apply w-full flex items-center gap-4 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white hover:bg-white/[0.03] transition-all rounded-xl;
}

/* Transitions */
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(10px) scale(0.95); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>