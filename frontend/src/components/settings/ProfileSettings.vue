<template>
    <div class="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 font-['Poppins']">
        
        <div class="flex flex-col xl:flex-row gap-12 items-start border-b border-white/5 pb-12">
            <div class="flex flex-col items-center gap-4 w-full xl:w-auto shrink-0">
                <div class="relative group">
                    <div class="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-pink-600 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                    <div class="relative w-44 h-44 rounded-[2.8rem] overflow-hidden bg-[#0d0d12] border border-white/10 shadow-2xl">
                        <img :src="avatarPreview || profileStore.avatarUrl(200)" alt="Profile Avatar"
                            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

                        <div v-if="profileStore.isUploading"
                            class="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 text-center">
                            <div class="space-y-3 w-full">
                                <div class="text-white text-[10px] font-black uppercase tracking-widest">{{ profileStore.uploadProgress }}%</div>
                                <div class="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div class="h-full bg-gradient-to-r from-blue-500 to-pink-500 transition-all duration-300"
                                        :style="{ width: profileStore.uploadProgress + '%' }"></div>
                                </div>
                            </div>
                        </div>

                        <label v-if="!pendingFile"
                            class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all duration-300">
                            <div class="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                                <CameraIcon class="h-6 w-6 text-white" />
                            </div>
                            <input type="file" class="hidden" accept="image/jpeg,image/png,image/webp"
                                @change="handleFileSelect" :disabled="profileStore.isUploading" />
                        </label>
                    </div>
                </div>

                <div v-if="pendingFile" class="flex gap-2 w-full">
                    <button @click="confirmAvatarUpload" class="flex-1 py-2 text-[9px] font-black text-white bg-blue-600 rounded-xl uppercase tracking-widest shadow-lg shadow-blue-900/20">Confirm</button>
                    <button @click="cancelAvatarSelection" class="flex-1 py-2 text-[9px] font-black text-gray-400 bg-white/5 border border-white/10 rounded-xl hover:text-white transition-all uppercase tracking-widest">Cancel</button>
                </div>
                <button v-else-if="hasCustomAvatar" @click="handleDeleteAvatar" class="text-[9px] font-black text-gray-600 hover:text-pink-500 uppercase tracking-widest transition-colors">Remove Avatar</button>
            </div>

            <div class="flex-1 space-y-8 w-full">
                <div class="space-y-1">
                    <h3 class="text-2xl font-black text-white uppercase tracking-tighter">Public <span class="bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">Profile</span></h3>
                    <p class="text-xs text-gray-500 font-medium italic">This information will be displayed publicly if your profile visibility is set to public.</p>
                </div>
                
                <div class="grid grid-cols-1 gap-6">
                    <div class="space-y-2 group">
                        <div class="flex justify-between items-end px-1">
                            <label class="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Display Name</label>
                            <span class="text-[9px] font-mono text-gray-700">{{ profileData.display_name?.length || 0 }}/100</span>
                        </div>
                        <input v-model="profileData.display_name" type="text" placeholder="How others see you" maxlength="100"
                            class="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 transition-all outline-none" />
                    </div>
                    
                    <div class="space-y-2 group">
                        <div class="flex justify-between items-end px-1">
                            <label class="text-[10px] font-black uppercase tracking-[0.3em] text-pink-500">Bio</label>
                            <span class="text-[9px] font-mono text-gray-700">{{ profileData.bio?.length || 0 }}/500</span>
                        </div>
                        <textarea v-model="profileData.bio" rows="3" placeholder="Tell us about yourself (max 500 characters)" maxlength="500"
                            class="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white focus:ring-2 focus:ring-pink-500/50 transition-all outline-none resize-none"></textarea>
                    </div>
                </div>
            </div>
        </div>

        <div class="space-y-10">
            <div class="flex flex-col gap-2">
                <h3 class="text-xl font-black text-white uppercase tracking-tighter">Personal <span class="text-blue-500">Information</span></h3>
                <p class="text-xs text-gray-500 font-medium">This data is private and only used for platform safety and verification.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                <div class="space-y-2 group">
                    <label class="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 group-focus-within:text-blue-400 transition-colors">Date of Birth</label>
                    <input v-model="profileData.date_of_birth" type="date" :max="maxBirthDate"
                        class="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" />
                    <p v-if="profileData.date_of_birth" class="text-[9px] font-mono text-gray-600 uppercase mt-1 ml-1">Age: {{ calculateAge(profileData.date_of_birth) }} years</p>
                </div>

                <div class="space-y-2 group">
                    <label class="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 group-focus-within:text-pink-400 transition-colors">Sex</label>
                    <select v-model="profileData.sex" 
                        class="w-full px-6 py-4 rounded-2xl bg-[#0d0d12] border border-white/10 text-white text-xs outline-none focus:ring-2 focus:ring-pink-500/50 appearance-none transition-all">
                        <option value="">Select...</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                </div>

                <div class="space-y-2 group">
                    <label class="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 group-focus-within:text-blue-400 transition-colors">Gender Identity (Optional)</label>
                    <input v-model="profileData.gender_identity" type="text" placeholder="How you identify"
                        class="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" />
                </div>

                <div class="space-y-2 group">
                    <label class="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 group-focus-within:text-pink-400 transition-colors">Phone Number</label>
                    <input v-model="profileData.phone_number" type="text" placeholder="+639XXXXXXXXX"
                        class="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white focus:ring-2 focus:ring-pink-500/50 outline-none transition-all" />
                </div>
            </div>
        </div>

        <div class="space-y-10 pt-4">
            <div class="flex flex-col gap-2">
                <h3 class="text-xl font-black text-white uppercase tracking-tighter">Address</h3>
                <p class="text-xs text-gray-500 font-medium">Optional - For emergency contact purposes only.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-6 gap-6">
                <div class="md:col-span-3 space-y-2">
                    <label class="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Address Line 1</label>
                    <input v-model="profileData.address_line1" type="text"
                        class="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" />
                </div>
                <div class="md:col-span-3 space-y-2">
                    <label class="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Address Line 2</label>
                    <input v-model="profileData.address_line2" type="text"
                        class="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" />
                </div>
                <div class="md:col-span-2 space-y-2">
                    <label class="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">City</label>
                    <input v-model="profileData.city" type="text"
                        class="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" />
                </div>
                <div class="md:col-span-2 space-y-2">
                    <label class="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Province</label>
                    <input v-model="profileData.province" type="text"
                        class="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" />
                </div>
                <div class="md:col-span-2 space-y-2">
                    <label class="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Postal Code</label>
                    <input v-model="profileData.postal_code" type="text"
                        class="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" />
                </div>
            </div>
        </div>

        <div class="pt-10 flex flex-col sm:flex-row justify-end gap-4 border-t border-white/5">
            <button type="button" @click="resetForm" 
                class="px-10 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all">Reset</button>
            <button @click="saveProfile" :disabled="isSaving"
                class="px-12 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 disabled:opacity-50">
                <span v-if="!isSaving">Save Changes</span>
                <span v-else class="flex items-center gap-2">
                    <svg class="animate-spin h-3 w-3" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Saving...
                </span>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { CameraIcon } from 'lucide-vue-next';
import { useProfileStore } from '@/stores/profile';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/utils/useToast';

const profileStore = useProfileStore();
const authStore = useAuthStore();
const toast = useToast();

const isSaving = ref(false);
const avatarPreview = ref(null);
const pendingFile = ref(null);

const profileData = ref({
    display_name: '',
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
    avatar_url: ''
});

// Helpers
const formatDateForInput = (isoDate) => isoDate ? isoDate.split('T')[0] : '';
const fillProfileData = (sourceData) => {
    if (!sourceData) return;
    profileData.value = { ...sourceData };
    if (sourceData.date_of_birth) profileData.value.date_of_birth = formatDateForInput(sourceData.date_of_birth);
};

const hasCustomAvatar = computed(() => profileStore.profile?.avatar_url && !profileStore.profile.avatar_url.includes('ui-avatars.com'));

const maxBirthDate = computed(() => {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
    return maxDate.toISOString().split('T')[0];
});

const calculateAge = (birthDate) => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
    return age;
};

const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    avatarPreview.value = URL.createObjectURL(file);
    pendingFile.value = file;
    event.target.value = '';
};

const confirmAvatarUpload = async () => {
    if (!pendingFile.value) return;
    const success = await profileStore.uploadAvatar(pendingFile.value);
    if (success) { pendingFile.value = null; avatarPreview.value = null; }
};

const cancelAvatarSelection = () => { pendingFile.value = null; avatarPreview.value = null; };
const handleDeleteAvatar = async () => { if (confirm('Are you sure you want to remove your avatar?')) await profileStore.deleteAvatar(); };

const saveProfile = async () => {
    if (profileData.value.date_of_birth && calculateAge(profileData.value.date_of_birth) < 13) {
        toast.error('You must be at least 13 years old to use ProtectED');
        return;
    }
    const phoneRegex = /^\+639\d{9}$/;
    if (profileData.value.phone_number && !phoneRegex.test(profileData.value.phone_number)) {
        toast.error('Please use the format +639XXXXXXXXX for phone number');
        return;
    }
    isSaving.value = true;
    await profileStore.updateProfile(profileData.value);
    isSaving.value = false;
};

const resetForm = () => { if (profileStore.profile) fillProfileData(profileStore.profile); avatarPreview.value = null; };

onMounted(async () => {
    if (!profileStore.profile && authStore.user) await profileStore.fetchProfile(authStore.user.id);
    if (profileStore.profile) fillProfileData(profileStore.profile);
});

watch(() => profileStore.profile, (newP) => { if (newP) fillProfileData(newP); }, { deep: true });
</script>

<style scoped>
input, select, textarea {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>