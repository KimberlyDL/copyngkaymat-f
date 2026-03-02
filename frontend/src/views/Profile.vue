<template>
    <div class="min-h-screen bg-slate-50 dark:bg-[#0b0a12] font-sans transition-colors duration-300 pb-20 custom-font-poppins">
        
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <!-- Header with Back Button -->
            <header class="mb-8">
                <button 
                    @click="$router.back()" 
                    class="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-500/50 transition-all duration-300 shadow-sm hover:shadow-md group"
                >
                    <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span class="text-xs font-bold uppercase tracking-wider">Back</span>
                </button>
                <h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">My Profile</h1>
                <p class="mt-2 text-slate-500 dark:text-slate-400 text-sm">View and manage your public profile and personal information.</p>
            </header>

            <!-- Loading Skeleton -->
            <div v-if="profileStore.isLoading" class="animate-pulse space-y-8">
                <div class="flex items-center gap-6">
                    <div class="w-32 h-32 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                    <div class="space-y-4 flex-1">
                        <div class="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded"></div>
                        <div class="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded"></div>
                    </div>
                </div>
                <div class="h-96 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            </div>

            <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                <!-- Left Sidebar: Avatar & Quick Stats -->
                <div class="space-y-6">
                    <!-- Profile Card -->
                    <div class="profile-card bg-white dark:bg-[#151321] rounded-[2rem] border border-slate-200 dark:border-white/10 p-8 flex flex-col items-center text-center relative overflow-hidden">
                        <!-- Decorative glow -->
                        <div class="absolute -top-10 -right-10 w-32 h-32 bg-purple-600/10 rounded-full blur-[60px] pointer-events-none"></div>
                        
                        <div class="relative group mb-6">
                            <div class="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500/20 dark:border-purple-500/30 bg-slate-100 dark:bg-slate-800 shadow-[0_8px_30px_-4px_rgba(147,51,234,0.3)]">
                                <img 
                                    :src="profileStore.avatarUrl" 
                                    alt="Profile" 
                                    class="w-full h-full object-cover"
                                >
                                <div v-if="profileStore.isUploading" class="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                                    <Loader2 class="w-8 h-8 text-white animate-spin" />
                                </div>
                            </div>
                            <button 
                                @click="triggerFileInput"
                                class="absolute bottom-1 right-1 p-2.5 bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white rounded-full shadow-[0_4px_15px_-2px_rgba(147,51,234,0.5)] transition-all hover:scale-110 hover:shadow-[0_6px_20px_-2px_rgba(147,51,234,0.6)]"
                                title="Change Avatar"
                            >
                                <Camera class="w-4 h-4" />
                            </button>
                            <input 
                                type="file" 
                                ref="fileInput" 
                                class="hidden" 
                                accept="image/jpeg,image/png,image/webp"
                                @change="handleFileChange"
                            >
                        </div>

                        <h2 class="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                            {{ form.display_name || authStore.user?.name || 'Student' }}
                        </h2>
                        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-center gap-1">
                            <AtSign class="w-3 h-3" />
                            {{ authStore.user?.username || 'username' }}
                        </p>

                        <div class="flex flex-wrap gap-2 mt-5 justify-center">
                            <span class="pill-badge px-4 py-1.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-[0_4px_15px_-3px_rgba(147,51,234,0.5),inset_0_1px_2px_rgba(255,255,255,0.3)]">
                                {{ authStore.user?.role || 'Member' }}
                            </span>
                            <span v-if="profileStore.isProfileComplete" class="pill-badge px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-[0_4px_15px_-3px_rgba(16,185,129,0.5),inset_0_1px_2px_rgba(255,255,255,0.3)] flex items-center gap-1">
                                <CheckCircle class="w-3 h-3" /> Verified
                            </span>
                        </div>
                    </div>

                    <!-- Gamification Stats -->
                    <div v-if="profileStore.profile?.gamification" class="profile-card bg-white dark:bg-[#151321] rounded-[2rem] border border-slate-200 dark:border-white/10 p-6 relative overflow-hidden">
                        <div class="absolute -bottom-8 -left-8 w-24 h-24 bg-amber-500/10 rounded-full blur-[50px] pointer-events-none"></div>
                        <h3 class="text-[10px] font-black text-slate-900 dark:text-purple-400/60 mb-5 uppercase tracking-[0.2em]">Player Stats</h3>
                        <div class="space-y-3">
                            <div class="stat-card flex items-center p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 transition-all hover:border-purple-500/30 hover:shadow-md">
                                <div class="flex items-center gap-4">
                                    <div class="p-3 bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white rounded-xl shadow-[0_4px_15px_-3px_rgba(147,51,234,0.5)]">
                                        <Award class="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p class="text-[9px] text-slate-400 font-black uppercase tracking-widest">Current Rank</p>
                                        <p class="text-sm font-black text-slate-900 dark:text-white uppercase">{{ profileStore.profile.gamification.current_title || 'Novice' }}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="stat-card flex items-center p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 transition-all hover:border-amber-500/30 hover:shadow-md">
                                <div class="flex items-center gap-4">
                                    <div class="p-3 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-xl shadow-[0_4px_15px_-3px_rgba(245,158,11,0.5)]">
                                        <Star class="w-5 h-5 fill-current" />
                                    </div>
                                    <div>
                                        <p class="text-[9px] text-slate-400 font-black uppercase tracking-widest">XP Earned</p>
                                        <p class="text-sm font-black text-slate-900 dark:text-white tabular-nums">{{ (profileStore.profile.gamification.experience_points || 0).toLocaleString() }}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="stat-card flex items-center p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 transition-all hover:border-emerald-500/30 hover:shadow-md">
                                <div class="flex items-center gap-4">
                                    <div class="p-3 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-xl shadow-[0_4px_15px_-3px_rgba(16,185,129,0.5)]">
                                        <Trophy class="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p class="text-[9px] text-slate-400 font-black uppercase tracking-widest">Total Points</p>
                                        <p class="text-sm font-black text-slate-900 dark:text-white tabular-nums">{{ (profileStore.profile.gamification.total_points || 0).toLocaleString() }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Contact Card -->
                    <div class="profile-card bg-white dark:bg-[#151321] rounded-[2rem] border border-slate-200 dark:border-white/10 p-6 relative overflow-hidden">
                        <div class="absolute -top-6 -right-6 w-20 h-20 bg-blue-500/10 rounded-full blur-[40px] pointer-events-none"></div>
                        <h3 class="text-[10px] font-black text-slate-900 dark:text-purple-400/60 mb-5 uppercase tracking-[0.2em]">Contact Info</h3>
                        <div class="space-y-4">
                            <div class="flex items-start gap-4 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                <div class="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-lg shadow-[0_4px_12px_-3px_rgba(59,130,246,0.5)]">
                                    <Mail class="w-4 h-4" />
                                </div>
                                <div>
                                    <p class="text-[9px] text-slate-400 font-black uppercase tracking-widest">Email</p>
                                    <p class="text-sm font-semibold text-slate-900 dark:text-white break-all">{{ authStore.user?.email }}</p>
                                </div>
                            </div>
                            <div class="flex items-start gap-4 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                <div class="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-lg shadow-[0_4px_12px_-3px_rgba(16,185,129,0.5)]">
                                    <Phone class="w-4 h-4" />
                                </div>
                                <div>
                                    <p class="text-[9px] text-slate-400 font-black uppercase tracking-widest">Phone</p>
                                    <p class="text-sm font-semibold text-slate-900 dark:text-white">{{ form.phone_number || 'Not set' }}</p>
                                </div>
                            </div>
                            <div class="flex items-start gap-4 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                <div class="p-2 bg-gradient-to-br from-rose-500 to-pink-600 text-white rounded-lg shadow-[0_4px_12px_-3px_rgba(244,63,94,0.5)]">
                                    <MapPin class="w-4 h-4" />
                                </div>
                                <div>
                                    <p class="text-[9px] text-slate-400 font-black uppercase tracking-widest">Location</p>
                                    <p class="text-sm font-semibold text-slate-900 dark:text-white">
                                        {{ form.city ? `${form.city}, ${form.country}` : 'Not set' }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Main Content Area -->
                <div class="lg:col-span-2 space-y-6">
                    
                    <!-- Form Container -->
                    <div class="profile-card bg-white dark:bg-[#151321] rounded-[2rem] border border-slate-200 dark:border-white/10 overflow-hidden relative">
                        <!-- Decorative glow -->
                        <div class="absolute -top-20 -right-20 w-40 h-40 bg-purple-600/5 rounded-full blur-[80px] pointer-events-none"></div>
                        
                        <!-- Tabs -->
                        <div class="border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02]">
                            <nav class="flex overflow-x-auto px-4" aria-label="Tabs">
                                <button 
                                    v-for="tab in tabs" 
                                    :key="tab.id"
                                    @click="currentTab = tab.id"
                                    class="px-6 py-4 text-[11px] font-black uppercase tracking-widest whitespace-nowrap border-b-2 transition-all flex items-center gap-2"
                                    :class="[
                                        currentTab === tab.id 
                                            ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                                            : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:border-slate-300'
                                    ]"
                                >
                                    <component :is="tab.icon" class="w-4 h-4" />
                                    {{ tab.name }}
                                </button>
                            </nav>
                        </div>

                        <div class="p-6 md:p-8 space-y-8">
                            
                            <!-- General Settings -->
                            <div v-show="currentTab === 'general'" class="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                
                                <!-- Personal Info -->
                                <section class="space-y-6">
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <h3 class="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Personal Information</h3>
                                            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Basic identification details.</p>
                                        </div>
                                    </div>
                                    
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div class="space-y-2">
                                            <label class="block text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Display Name</label>
                                            <input v-model="form.display_name" type="text" 
                                                class="form-input-3d block w-full rounded-xl border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:border-purple-500 focus:ring-purple-500 sm:text-sm px-4 py-3 transition-all"
                                                placeholder="How should we call you?" />
                                        </div>
                                        <div class="space-y-2">
                                            <label class="block text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Date of Birth</label>
                                            <input v-model="form.date_of_birth" type="date" 
                                                class="form-input-3d block w-full rounded-xl border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:border-purple-500 focus:ring-purple-500 sm:text-sm px-4 py-3 transition-all" />
                                        </div>
                                        <div class="space-y-2">
                                            <label class="block text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Gender</label>
                                            <select v-model="form.sex" 
                                                class="form-input-3d block w-full rounded-xl border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:border-purple-500 focus:ring-purple-500 sm:text-sm px-4 py-3 transition-all">
                                                <option value="" disabled>Select Gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                         <div class="space-y-2">
                                            <label class="block text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Phone</label>
                                            <input v-model="form.phone_number" type="tel" 
                                                class="form-input-3d block w-full rounded-xl border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:border-purple-500 focus:ring-purple-500 sm:text-sm px-4 py-3 transition-all"
                                                placeholder="+63 900 000 0000" />
                                        </div>
                                    </div>
                                    
                                    <div class="space-y-2">
                                        <label class="block text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Bio</label>
                                        <textarea v-model="form.bio" rows="4" 
                                            class="form-input-3d block w-full rounded-xl border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:border-purple-500 focus:ring-purple-500 sm:text-sm px-4 py-3 resize-none transition-all"
                                            placeholder="Tell us a bit about yourself..."></textarea>
                                    </div>
                                </section>

                                <!-- Address Info -->
                                <section class="space-y-6 pt-8 border-t border-slate-200 dark:border-white/5">
                                    <div>
                                        <h3 class="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Address Details</h3>
                                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Where can we reach you?</p>
                                    </div>
                                    
                                    <div class="space-y-5">
                                        <div class="space-y-2">
                                            <label class="block text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Street Address</label>
                                            <input v-model="form.address_line1" type="text" 
                                                class="form-input-3d block w-full rounded-xl border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:border-purple-500 focus:ring-purple-500 sm:text-sm px-4 py-3 transition-all"
                                                placeholder="House number, Street name" />
                                        </div>
                                        
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                                             <div class="space-y-2">
                                                <label class="block text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">City</label>
                                                <input v-model="form.city" type="text" 
                                                    class="form-input-3d block w-full rounded-xl border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:border-purple-500 focus:ring-purple-500 sm:text-sm px-4 py-3 transition-all" />
                                            </div>
                                            <div class="space-y-2">
                                                <label class="block text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Province / State</label>
                                                <input v-model="form.province" type="text" 
                                                    class="form-input-3d block w-full rounded-xl border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:border-purple-500 focus:ring-purple-500 sm:text-sm px-4 py-3 transition-all" />
                                            </div>
                                            <div class="space-y-2">
                                                <label class="block text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Postal Code</label>
                                                <input v-model="form.postal_code" type="text" 
                                                    class="form-input-3d block w-full rounded-xl border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:border-purple-500 focus:ring-purple-500 sm:text-sm px-4 py-3 transition-all" />
                                            </div>
                                            <div class="space-y-2">
                                                <label class="block text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Country</label>
                                                <input v-model="form.country" type="text" 
                                                    class="form-input-3d block w-full rounded-xl border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:border-purple-500 focus:ring-purple-500 sm:text-sm px-4 py-3 transition-all" />
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            <!-- Account Settings -->
                            <div v-show="currentTab === 'account'" class="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <section class="space-y-6">
                                    <div class="p-5 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl flex gap-4">
                                        <div class="p-2 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-xl shadow-[0_4px_12px_-3px_rgba(245,158,11,0.5)]">
                                            <Info class="w-5 h-5" />
                                        </div>
                                        <div class="text-sm text-amber-800 dark:text-amber-200">
                                            <strong class="font-black">Note:</strong> Changing your username will change how you are identified across the platform.
                                        </div>
                                    </div>

                                    <div class="space-y-2">
                                        <label class="block text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Username</label>
                                        <div class="relative">
                                            <input v-model="form.username" type="text" 
                                                class="form-input-3d block w-full rounded-xl border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:border-purple-500 focus:ring-purple-500 sm:text-sm pl-11 pr-4 py-3 transition-all" />
                                            <AtSign class="w-4 h-4 text-purple-500 absolute left-4 top-3.5" />
                                        </div>
                                    </div>

                                    <div class="space-y-2">
                                        <label class="block text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Email Address</label>
                                        <div class="relative opacity-60">
                                            <input :value="authStore.user?.email" readonly type="email" 
                                                class="form-input-3d block w-full rounded-xl border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.02] text-slate-500 cursor-not-allowed sm:text-sm pl-11 pr-4 py-3" />
                                            <Mail class="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                                        </div>
                                    </div>
                                </section>
                            </div>

                            <!-- Save Button (Sticky Footer) -->
                            <div class="pt-8 border-t border-slate-200 dark:border-white/5 flex justify-end sticky bottom-0 bg-white dark:bg-[#151321] pb-2">
                                <button 
                                    @click="handleSave"
                                    :disabled="!hasChanges || profileStore.isLoading"
                                    class="save-btn px-8 py-3.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white text-[11px] font-black uppercase tracking-widest rounded-full shadow-[0_8px_25px_-5px_rgba(147,51,234,0.5),inset_0_2px_4px_rgba(255,255,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all hover:scale-105 hover:shadow-[0_12px_35px_-5px_rgba(147,51,234,0.6)] flex items-center gap-3"
                                >
                                    <Save class="w-4 h-4" />
                                    {{ profileStore.isLoading ? 'Saving...' : 'Save Changes' }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import { useProfileStore } from '@/stores/profile';
import { useAuthStore } from '@/stores/auth';
import { 
    User, MapPin, Camera, Save, 
    Mail, Phone, AtSign, CheckCircle,
    Loader2, Shield, Settings,
    Lock, Info, Trophy, Star, Award,
    ArrowLeft
} from 'lucide-vue-next';

const profileStore = useProfileStore();
const authStore = useAuthStore();
const fileInput = ref(null);

const currentTab = ref('general');
const tabs = [
    { id: 'general', name: 'General Information', icon: User },
    { id: 'account', name: 'Account Settings', icon: Settings },
];

const form = reactive({
    display_name: '',
    username: '',
    bio: '',
    date_of_birth: '',
    sex: '',
    gender_identity: '',
    phone_number: '',
    address_line1: '',
    address_line2: '',
    city: '',
    province: '',
    postal_code: '',
    country: 'Philippines',
    emergency_contact_name: '',
    emergency_contact_relationship: '',
    emergency_contact_phone: ''
});

// Original state to check for changes
const originalState = ref({});

const hasChanges = computed(() => {
    return JSON.stringify(form) !== JSON.stringify(originalState.value);
});

onMounted(async () => {
    if (authStore.user?.id) {
        await loadProfile();
    }
});

async function loadProfile() {
    try {
        const userId = authStore.user?.id || 'me';
        const profile = await profileStore.fetchProfile(userId);
        
        Object.assign(form, {
            display_name: profile.display_name || '',
            username: profile.name || authStore.user?.name || '',
            bio: profile.bio || '',
            date_of_birth: profile.date_of_birth ? new Date(profile.date_of_birth).toISOString().split('T')[0] : '',
            sex: profile.sex || '',
            gender_identity: profile.gender_identity || '',
            phone_number: profile.phone_number || '',
            address_line1: profile.address_line1 || '',
            address_line2: profile.address_line2 || '',
            city: profile.city || '',
            province: profile.province || '',
            postal_code: profile.postal_code || '',
            country: profile.country || 'Philippines',
            emergency_contact_name: profile.emergency_contact_name || '',
            emergency_contact_relationship: profile.emergency_contact_relationship || '',
            emergency_contact_phone: profile.emergency_contact_phone || ''
        });

        originalState.value = JSON.parse(JSON.stringify(form));
    } catch (e) {
        console.error('Failed to load profile', e);
    }
}

async function handleSave() {
    const success = await profileStore.updateProfile(form);
    if (success) {
        originalState.value = JSON.parse(JSON.stringify(form));
    }
}

function triggerFileInput() {
    fileInput.value.click();
}

async function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
        await profileStore.uploadAvatar(file);
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

.custom-font-poppins {
    font-family: 'Poppins', sans-serif !important;
}

/* Profile cards with 3D effect */
.profile-card {
    box-shadow: 
        0 4px 20px -5px rgba(0, 0, 0, 0.08),
        0 0 0 1px rgba(0, 0, 0, 0.02);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.profile-card:hover {
    box-shadow: 
        0 12px 40px -10px rgba(147, 51, 234, 0.15),
        0 0 0 1px rgba(147, 51, 234, 0.05);
    transform: translateY(-2px);
}

/* 3D form inputs */
.form-input-3d {
    box-shadow: 
        inset 0 2px 4px rgba(0, 0, 0, 0.02),
        0 1px 2px rgba(0, 0, 0, 0.02);
    transition: all 0.3s ease;
}

.form-input-3d:focus {
    box-shadow: 
        inset 0 2px 4px rgba(147, 51, 234, 0.05),
        0 0 0 3px rgba(147, 51, 234, 0.1),
        0 4px 12px -2px rgba(147, 51, 234, 0.15);
    transform: translateY(-1px);
}

/* Stat cards */
.stat-card {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.stat-card:hover {
    transform: translateX(4px);
}

/* Pill badges */
.pill-badge {
    transition: all 0.3s ease;
}

.pill-badge:hover {
    transform: scale(1.05);
}

/* Save button 3D effect */
.save-btn {
    position: relative;
    overflow: hidden;
}

.save-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, transparent 100%);
    pointer-events: none;
}

/* Standard transitions */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>