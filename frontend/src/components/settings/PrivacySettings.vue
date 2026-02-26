<template>
    <div class="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 font-['Poppins']">
        
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
            <div class="space-y-1">
                <h3 class="text-2xl font-black text-white uppercase tracking-tighter">
                    Privacy & <span class="bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">Visibility</span>
                </h3>
                <p class="text-xs text-gray-500 font-medium italic">Control how your data is shared with the ProtectEd community.</p>
            </div>
        </div>

        <div v-if="isLoading" class="py-20 text-center">
            <div class="inline-block animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mb-4"></div>
            <p class="text-[10px] font-black uppercase tracking-widest text-gray-600 animate-pulse">Loading privacy settings...</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div class="group relative bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 transition-all duration-500 hover:bg-white/[0.05] hover:border-blue-500/30">
                <div class="flex justify-between items-start mb-6">
                    <div class="h-12 w-12 rounded-2xl bg-gradient-to-tr from-gray-800 to-gray-900 border border-white/5 flex items-center justify-center text-blue-400">
                        <GlobeIcon v-if="settings.profile_visibility === 'public'" class="h-6 w-6" />
                        <LockIcon v-else class="h-6 w-6 opacity-50" />
                    </div>
                    <select v-model="settings.profile_visibility"
                        class="bg-[#0d0d12] border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none transition-all">
                        <option value="private">Private</option>
                        <option value="public">Public</option>
                    </select>
                </div>
                <h4 class="text-sm font-black text-white uppercase tracking-widest mb-2">Profile Visibility</h4>
                <p class="text-[11px] text-gray-500 font-medium leading-relaxed">
                    {{ settings.profile_visibility === 'public'
                        ? 'Your profile is visible to other ProtectEd users'
                        : 'Your profile is private and only visible to you'
                    }}
                </p>
            </div>

            <div class="group relative bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 transition-all duration-500 hover:bg-white/[0.05] hover:border-pink-500/30">
                <div class="flex justify-between items-start mb-6">
                    <div class="h-12 w-12 rounded-2xl bg-gradient-to-tr from-gray-800 to-gray-900 border border-white/5 flex items-center justify-center"
                        :class="settings.allow_messages ? 'text-pink-500' : 'text-gray-600'">
                        <MessageSquareIcon class="h-6 w-6" />
                    </div>
                    <div class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" v-model="settings.allow_messages" class="sr-only peer">
                        <div class="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r from-blue-600 to-pink-600"></div>
                    </div>
                </div>
                <h4 class="text-sm font-black text-white uppercase tracking-widest mb-2">Allow Direct Messages</h4>
                <p class="text-[11px] text-gray-500 font-medium leading-relaxed">Let other users send you messages through the platform.</p>
            </div>

            <div class="group relative bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 transition-all duration-500"
                :class="settings.profile_visibility === 'public' ? 'opacity-100 hover:bg-white/[0.05]' : 'opacity-30 cursor-not-allowed'">
                <div class="flex justify-between items-start mb-6">
                    <div class="h-12 w-12 rounded-2xl bg-gradient-to-tr from-gray-800 to-gray-900 border border-white/5 flex items-center justify-center"
                        :class="settings.show_achievements ? 'text-yellow-500' : 'text-gray-600'">
                        <TrophyIcon class="h-6 w-6" />
                    </div>
                    <input type="checkbox" v-model="settings.show_achievements" :disabled="settings.profile_visibility !== 'public'"
                        class="h-5 w-5 rounded-lg bg-white/5 border-white/10 text-blue-600 focus:ring-blue-500/40" />
                </div>
                <h4 class="text-sm font-black text-white uppercase tracking-widest mb-2">Show Achievements</h4>
                <p class="text-[11px] text-gray-500 font-medium leading-relaxed">Display your badges and completed modules on your public profile.</p>
                <p v-if="settings.profile_visibility !== 'public'" class="mt-4 text-[9px] font-black text-orange-500 uppercase tracking-widest">Public profile required</p>
            </div>

            <div class="group relative bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 transition-all duration-500"
                :class="settings.profile_visibility === 'public' ? 'opacity-100 hover:bg-white/[0.05]' : 'opacity-30 cursor-not-allowed'">
                <div class="flex justify-between items-start mb-6">
                    <div class="h-12 w-12 rounded-2xl bg-gradient-to-tr from-gray-800 to-gray-900 border border-white/5 flex items-center justify-center"
                        :class="settings.show_progress ? 'text-blue-500' : 'text-gray-600'">
                        <ActivityIcon class="h-6 w-6" />
                    </div>
                    <input type="checkbox" v-model="settings.show_progress" :disabled="settings.profile_visibility !== 'public'"
                        class="h-5 w-5 rounded-lg bg-white/5 border-white/10 text-blue-600 focus:ring-blue-500/40" />
                </div>
                <h4 class="text-sm font-black text-white uppercase tracking-widest mb-2">Show Learning Progress</h4>
                <p class="text-[11px] text-gray-500 font-medium leading-relaxed">Display your learning statistics and module completion status.</p>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-10 border-t border-white/5">
            <div class="bg-blue-600/5 border border-blue-500/20 p-8 rounded-[2.5rem] flex gap-5">
                <ShieldCheckIcon class="h-8 w-8 text-blue-500 shrink-0" />
                <div>
                    <h4 class="text-xs font-black text-white uppercase tracking-widest mb-2">Safety & Privacy Protection</h4>
                    <p class="text-[10px] text-gray-500 leading-relaxed font-medium">Your personal information (address, phone number, emergency contacts) is always kept private and never shared publicly.</p>
                </div>
            </div>

            <div class="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem]">
                <h4 class="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">What's Visible When Public?</h4>
                <div class="space-y-2">
                    <div v-for="item in [
                        { label: 'Always Visible', text: 'Display name, bio, profile picture', color: 'text-blue-400' },
                        { label: 'Optional', text: 'Achievements and learning progress', color: 'text-pink-400' },
                        { label: 'Never Visible', text: 'Email, phone, address, guardian information', color: 'text-red-400' }
                    ]" :key="item.label" class="flex gap-4">
                        <span :class="item.color" class="text-[9px] font-black uppercase tracking-widest w-24 shrink-0">{{ item.label }}</span>
                        <span class="text-[10px] text-gray-400 font-medium">{{ item.text }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="pt-10 flex justify-end gap-4 border-t border-white/5">
            <button @click="saveSettings" :disabled="isSaving || isLoading"
                class="px-12 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 disabled:opacity-50">
                <span v-if="!isSaving">Save Privacy Preferences</span>
                <div v-else class="flex items-center gap-2">
                    <div class="animate-spin h-3 w-3 border-2 border-white/30 border-t-white rounded-full"></div>
                    Saving...
                </div>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import {
    ShieldCheckIcon,
    GlobeIcon,
    LockIcon,
    TrophyIcon,
    ActivityIcon,
    MessageSquareIcon,
    EyeIcon
} from 'lucide-vue-next';
import { useProfileStore } from '@/stores/profile';
import { useToast } from '@/utils/useToast';

const profileStore = useProfileStore();
const toast = useToast();

const isLoading = ref(false);
const isSaving = ref(false);

const settings = ref({
    profile_visibility: 'private',
    show_achievements: true,
    show_progress: false,
    allow_messages: false
});

const loadSettings = async () => {
    isLoading.value = true;
    try {
        await profileStore.fetchPrivacySettings();
        if (profileStore.privacySettings) {
            settings.value = { ...profileStore.privacySettings };
        }
    } catch (error) {
        toast.error('Failed to load settings');
    } finally {
        isLoading.value = false;
    }
};

const saveSettings = async () => {
    isSaving.value = true;
    try {
        const success = await profileStore.updatePrivacySettings(settings.value);
        if (success) {
            toast.success('Privacy preferences updated');
        }
    } catch (error) {
        console.error('Save settings error:', error);
    } finally {
        isSaving.value = false;
    }
};

watch(() => settings.value.profile_visibility, (newValue) => {
    if (newValue !== 'public') {
        settings.value.show_achievements = false;
        settings.value.show_progress = false;
    }
});

onMounted(() => loadSettings());
</script>

<style scoped>
input[type="checkbox"] {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>