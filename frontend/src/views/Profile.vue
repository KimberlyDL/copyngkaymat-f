<template>
    <div class="min-h-screen bg-[#060606] font-['Poppins'] text-white selection:bg-blue-500/30">
        <div class="fixed top-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
        <div class="fixed bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[120px] animate-pulse delay-1000 pointer-events-none"></div>
        <div class="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>

        <div class="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 py-10 animate-in fade-in duration-1000">
            
            <header class="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10 mb-10">
                <div class="space-y-6">
                    <button @click="router.back()" 
                        class="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-all outline-none">
                        <div class="p-2 rounded-xl bg-white/5 border border-white/5 group-hover:border-blue-500/50 group-hover:bg-blue-500/10 transition-all shadow-sm">
                            <ArrowLeftIcon class="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                        </div>
                        <span>Return to Hub</span>
                    </button>

                    <div class="space-y-2">
                        <div class="flex items-center gap-3">
                            <div class="h-1 w-10 bg-gradient-to-r from-blue-600 to-pink-600 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                            <span class="text-[9px] font-black uppercase tracking-[0.5em] text-blue-500/80">Identity Terminal</span>
                        </div>
                        <h1 class="text-5xl font-black text-white uppercase tracking-tighter leading-none">
                            My <span class="bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent text-shadow-glow">Profile</span>
                        </h1>
                        <p class="text-xs text-gray-500 font-medium italic">Authorized overview of your platform presence and identity data.</p>
                    </div>
                </div>
                
                <router-link to="/settings"
                    class="group flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-500 h-fit">
                    <SettingsIcon class="h-4 w-4 text-gray-500 group-hover:text-blue-400 group-hover:rotate-90 transition-all duration-500" />
                    <span class="text-[10px] font-black tracking-widest text-gray-300 uppercase">System Settings</span>
                </router-link>
            </header>

            <div v-if="isLoading" class="flex flex-col items-center justify-center py-40 space-y-4">
                <div class="relative h-12 w-12 text-blue-500">
                    <div class="absolute inset-0 rounded-full border-2 border-current opacity-10"></div>
                    <div class="absolute inset-0 rounded-full border-2 border-t-transparent animate-spin"></div>
                </div>
                <p class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 animate-pulse">Fetching Profile Data...</p>
            </div>

            <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                <div class="lg:col-span-4">
                    <div class="bg-[#0d0d12] border border-white/10 rounded-[3.5rem] overflow-hidden shadow-2xl transition-all hover:border-blue-500/30 group">
                        <div class="h-32 bg-gradient-to-br from-blue-600 via-indigo-600 to-pink-600 relative overflow-hidden">
                            <div class="absolute top-0 right-0 p-4">
                                <span v-if="profile?.is_profile_public" 
                                      class="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-widest text-white">Public Node</span>
                            </div>
                        </div>

                        <div class="px-10 pb-10 text-center relative">
                            <div class="relative -mt-16 mb-6 inline-block">
                                <div class="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-pink-600 rounded-full blur opacity-30"></div>
                                <img :src="profile?.avatar_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'User') + '&background=0d0d12&color=fff'"
                                    class="relative w-32 h-32 rounded-full border-4 border-[#0d0d12] shadow-2xl object-cover" />
                            </div>

                            <h2 class="text-3xl font-black text-white uppercase tracking-tighter mb-2">{{ profile?.display_name || user?.name || 'User' }}</h2>
                            <p class="text-xs text-gray-600 font-medium italic mb-6 lowercase">{{ user?.email }}</p>
                            
                            <div class="flex justify-center mb-8">
                                <span :class="getRoleBadgeClass(user?.role)" class="px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-lg">
                                    {{ formatRole(user?.role) }}
                                </span>
                            </div>

                            <div v-if="profile?.bio" class="p-6 bg-white/[0.02] border border-white/5 rounded-3xl text-left italic mb-8">
                                <p class="text-[11px] text-gray-400 leading-relaxed font-medium">"{{ profile.bio }}"</p>
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div class="bg-blue-600/5 border border-blue-500/10 p-5 rounded-[2rem]">
                                    <p class="text-[20px] font-black text-blue-400 tracking-tighter">{{ profile?.achievements_count || 0 }}</p>
                                    <p class="text-[8px] font-black uppercase tracking-widest text-gray-600 mt-1">Badges</p>
                                </div>
                                <div class="bg-pink-600/5 border border-pink-500/10 p-5 rounded-[2rem]">
                                    <p class="text-[20px] font-black text-pink-400 tracking-tighter">{{ calculateDaysSinceJoined() }}</p>
                                    <p class="text-[8px] font-black uppercase tracking-widest text-gray-600 mt-1">Days Active</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="lg:col-span-8 space-y-8">
                    <div class="bg-white/[0.02] border border-white/5 rounded-[3.5rem] p-10 lg:p-12 relative overflow-hidden shadow-2xl">
                        <div class="absolute -top-20 -left-20 w-60 h-60 bg-blue-600/5 rounded-full blur-[100px]"></div>
                        <div class="flex items-center justify-between mb-10 relative z-10">
                            <h3 class="text-xl font-black text-white uppercase tracking-tighter italic">Personal <span class="text-blue-500">Registry</span></h3>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                            <div v-for="info in [
                                { label: 'Date of Birth', val: profile?.date_of_birth ? `${formatDate(profile.date_of_birth)} (${calculateAge(profile.date_of_birth)} Yrs)` : 'Not Set', icon: CalendarIcon, color: 'blue' },
                                { label: 'Sex', val: formatSex(profile?.sex), icon: UserIcon, color: 'pink' },
                                { label: 'Identity', val: profile?.gender_identity || 'Not Specified', icon: ShieldIcon, color: 'purple' },
                                { label: 'Phone', val: profile?.phone_number || 'None', icon: PhoneIcon, color: 'emerald' }
                            ]" :key="info.label" class="flex gap-5 group">
                                <div :class="`p-3.5 h-fit rounded-2xl bg-white/5 border border-white/10 text-gray-500 group-hover:text-${info.color}-400 group-hover:border-${info.color}-500/30 transition-all`">
                                    <component :is="info.icon" class="w-4 h-4" />
                                </div>
                                <div class="space-y-1">
                                    <p class="text-[8px] font-black text-gray-600 uppercase tracking-widest">{{ info.label }}</p>
                                    <p class="text-sm font-bold text-gray-200">{{ info.val }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div v-if="hasAddress" class="bg-[#0d0d12] border border-white/5 rounded-[3rem] p-10 shadow-2xl">
                            <h3 class="text-lg font-black text-white uppercase tracking-tighter mb-8 italic flex items-center gap-3">
                                <MapPinIcon class="w-4 h-4 text-pink-500" /> Location Node
                            </h3>
                            <div class="space-y-2 text-xs font-medium text-gray-400 italic">
                                <p>{{ profile?.address?.line1 }}</p>
                                <p>{{ [profile?.address?.city, profile?.address?.province].filter(Boolean).join(' // ') }}</p>
                                <p class="text-blue-500 font-black not-italic text-[10px]">{{ profile?.address?.country }}</p>
                            </div>
                        </div>

                        <div class="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 shadow-2xl">
                            <h3 class="text-lg font-black text-white uppercase tracking-tighter mb-8 italic flex items-center gap-3">
                                <LockIcon class="w-4 h-4 text-blue-400" /> System Access
                            </h3>
                            <div class="grid grid-cols-2 gap-4">
                                <div class="p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <p class="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Status</p>
                                    <p class="text-[10px] font-black text-emerald-400 uppercase">{{ formatStatus(profile?.account_status) }}</p>
                                </div>
                                <div class="p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <p class="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Email</p>
                                    <p class="text-[10px] font-black text-blue-400 uppercase">{{ user?.email_verified ? 'Verified' : 'Pending' }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <p class="mt-12 text-center text-[10px] font-black text-gray-700 uppercase tracking-[0.4em]">
                Secure Node // <span class="text-blue-500 italic">Nexus Identity v2.0</span>
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { 
    UserIcon, Settings as SettingsIcon, CalendarIcon, 
    ShieldIcon, PhoneIcon, MapPinIcon, LockIcon, 
    EyeIcon, ArrowLeftIcon, Settings
} from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/utils/useToast';
import api from '@/utils/api';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const user = ref(authStore.user);
const profile = ref(null);
const isLoading = ref(true);

const hasAddress = computed(() => profile.value?.address?.line1 || profile.value?.address?.city);

const fetchProfile = async () => {
    isLoading.value = true;
    try {
        const { data } = await api.get(`/api/v1/users/${user.value.id}/profile`);
        profile.value = data;
    } catch (error) {
        toast.error('Identity sync failure');
    } finally {
        isLoading.value = false;
    }
};

const getRoleBadgeClass = (role) => {
    const classes = {
        'admin': 'bg-purple-500/10 text-purple-400 border border-purple-500/30',
        'educator': 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
        'player': 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
    };
    return classes[role] || classes['player'];
};

const formatRole = (r) => ({ 'admin': 'Administrator', 'educator': 'Facilitator' }[r] || 'Student');
const formatStatus = (s) => s?.toUpperCase() || 'ACTIVE';
const formatSex = (s) => ({ 'male': 'Male', 'female': 'Female' }[s] || 'Undisclosed');
const formatDate = (ds) => ds ? new Date(ds).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not set';

const calculateAge = (ds) => {
    if (!ds) return 0;
    const birthDate = new Date(ds);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) age--;
    return age;
};

const calculateDaysSinceJoined = () => {
    const joinDate = new Date(profile.value?.created_at || user.value?.created_at);
    return Math.ceil(Math.abs(new Date() - joinDate) / (1000 * 60 * 60 * 24));
};

onMounted(() => fetchProfile());
</script>

<style scoped>
.text-shadow-glow { text-shadow: 0 0 20px rgba(59, 130, 246, 0.4); }
.animate-in { animation: nexusPop 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes nexusPop {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>