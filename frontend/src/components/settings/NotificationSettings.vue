<template>
  <div class="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 font-['Poppins']">
    
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
      <div class="space-y-2">
        <h3 class="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
          <BellIcon class="w-6 h-6 text-blue-500" /> Notification <span class="bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">Preferences</span>
        </h3>
        <p class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 italic">Control how and when you receive updates from the platform.</p>
      </div>
    </div>

    <div v-if="isLoading" class="py-20 text-center">
      <div class="inline-block animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mb-4"></div>
      <p class="text-[10px] font-black uppercase tracking-widest text-gray-600 animate-pulse">Syncing Signal Nodes...</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <div class="group relative bg-blue-600/5 backdrop-blur-xl border border-blue-500/20 rounded-[2.5rem] p-8 transition-all duration-500 hover:bg-blue-600/10">
        <div class="flex justify-between items-start mb-6">
          <div class="h-12 w-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <ShieldAlertIcon class="h-6 w-6" />
          </div>
          <div class="h-6 w-11 bg-blue-600/20 rounded-full flex items-center px-1 opacity-50 cursor-not-allowed">
            <div class="h-4 w-4 bg-blue-400 rounded-full translate-x-5"></div>
          </div>
        </div>
        <h4 class="text-sm font-black text-white uppercase tracking-widest mb-2">Safety Alerts</h4>
        <p class="text-[11px] text-blue-400/70 font-medium leading-relaxed">
          Critical notifications for your protection. This setting cannot be disabled to ensure your safety.
        </p>
      </div>

      <div class="group relative bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 transition-all duration-500 hover:bg-white/[0.05] hover:border-blue-500/30">
        <div class="flex justify-between items-start mb-6">
          <div class="h-12 w-12 rounded-2xl bg-gradient-to-tr from-gray-800 to-gray-900 border border-white/5 flex items-center justify-center"
            :class="preferences.email_notifications ? 'text-blue-400' : 'text-gray-600'">
            <MailIcon class="h-6 w-6" />
          </div>
          <div @click="preferences.email_notifications = !preferences.email_notifications" 
            class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
            :class="preferences.email_notifications ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-white/10'">
            <span class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
              :class="preferences.email_notifications ? 'translate-x-5' : 'translate-x-0'"></span>
          </div>
        </div>
        <h4 class="text-sm font-black text-white uppercase tracking-widest mb-2">Email Notifications</h4>
        <p class="text-[11px] text-gray-500 font-medium leading-relaxed">Receive email summaries of your progress and achievement alerts.</p>
      </div>

      <div class="group relative bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 transition-all duration-500"
        :class="preferences.email_notifications ? 'opacity-100 hover:bg-white/[0.05] hover:border-pink-500/30' : 'opacity-30 cursor-not-allowed'">
        <div class="flex justify-between items-start mb-6">
          <div class="h-12 w-12 rounded-2xl bg-gradient-to-tr from-gray-800 to-gray-900 border border-white/5 flex items-center justify-center"
            :class="preferences.module_reminders ? 'text-pink-500' : 'text-gray-600'">
            <ActivityIcon class="h-6 w-6" />
          </div>
          <input type="checkbox" v-model="preferences.module_reminders" :disabled="!preferences.email_notifications"
            class="h-5 w-5 rounded-lg bg-white/5 border-white/10 text-pink-600 focus:ring-pink-500/40" />
        </div>
        <h4 class="text-sm font-black text-white uppercase tracking-widest mb-2">Learning Reminders</h4>
        <p class="text-[11px] text-gray-500 font-medium leading-relaxed">Get notified when it's time to continue your GAD modules.</p>
      </div>

      <div class="group relative bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 transition-all duration-500"
        :class="preferences.email_notifications ? 'opacity-100 hover:bg-white/[0.05] hover:border-yellow-500/30' : 'opacity-30 cursor-not-allowed'">
        <div class="flex justify-between items-start mb-6">
          <div class="h-12 w-12 rounded-2xl bg-gradient-to-tr from-gray-800 to-gray-900 border border-white/5 flex items-center justify-center"
            :class="preferences.achievement_alerts ? 'text-yellow-500' : 'text-gray-600'">
            <TrophyIcon class="h-6 w-6" />
          </div>
          <input type="checkbox" v-model="preferences.achievement_alerts" :disabled="!preferences.email_notifications"
            class="h-5 w-5 rounded-lg bg-white/5 border-white/10 text-yellow-500 focus:ring-yellow-500/40" />
        </div>
        <h4 class="text-sm font-black text-white uppercase tracking-widest mb-2">Achievement Alerts</h4>
        <p class="text-[11px] text-gray-500 font-medium leading-relaxed">Receive notifications when you earn badges and complete milestones.</p>
      </div>

      <div class="md:col-span-2 group relative bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 transition-all duration-500"
        :class="preferences.email_notifications ? 'opacity-100 hover:bg-white/[0.05] hover:border-blue-500/30' : 'opacity-30 cursor-not-allowed'">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-6">
            <div class="h-12 w-12 rounded-2xl bg-gradient-to-tr from-gray-800 to-gray-900 border border-white/5 flex items-center justify-center"
              :class="preferences.platform_updates ? 'text-blue-400' : 'text-gray-600'">
              <GlobeIcon class="h-6 w-6" />
            </div>
            <div>
              <h4 class="text-sm font-black text-white uppercase tracking-widest mb-1">Platform Updates</h4>
              <p class="text-[11px] text-gray-500 font-medium leading-relaxed">Receive occasional updates about new features and improvements.</p>
            </div>
          </div>
          <input type="checkbox" v-model="preferences.platform_updates" :disabled="!preferences.email_notifications"
            class="h-5 w-5 rounded-lg bg-white/5 border-white/10 text-blue-600 focus:ring-blue-500/40" />
        </div>
      </div>
    </div>

    <div class="bg-[#0d0d12] border border-white/5 p-8 rounded-[2.5rem] flex gap-6 items-start">
      <div class="p-3 rounded-2xl bg-white/5 text-gray-500">
        <BellIcon class="h-5 w-5" />
      </div>
      <div class="space-y-3">
        <h4 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Signal Policies</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-2">
          <p class="text-[10px] text-gray-600 font-medium uppercase tracking-tighter flex items-center gap-2">
            <span class="h-1 w-1 rounded-full bg-blue-500"></span> Safety alerts are mandatory
          </p>
          <p class="text-[10px] text-gray-600 font-medium uppercase tracking-tighter flex items-center gap-2">
            <span class="h-1 w-1 rounded-full bg-pink-500"></span> Email master switch required
          </p>
          <p class="text-[10px] text-gray-600 font-medium uppercase tracking-tighter flex items-center gap-2">
            <span class="h-1 w-1 rounded-full bg-blue-500"></span> Change preferences anytime
          </p>
        </div>
      </div>
    </div>

    <div class="pt-10 flex justify-end gap-4 border-t border-white/5">
      <button @click="savePreferences" :disabled="isSaving || isLoading"
        class="px-12 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 disabled:opacity-50 flex items-center gap-3">
        <span v-if="!isSaving">Update Preferences</span>
        <div v-else class="flex items-center gap-2">
          <div class="animate-spin h-3 w-3 border-2 border-white/30 border-t-white rounded-full"></div>
          Saving Signal...
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { 
  ShieldAlertIcon, 
  BellIcon, 
  MailIcon, 
  ActivityIcon, 
  TrophyIcon, 
  GlobeIcon 
} from 'lucide-vue-next';
import { useProfileStore } from '@/stores/profile';
import { useToast } from '@/utils/useToast';

const profileStore = useProfileStore();
const toast = useToast();

const isLoading = ref(false);
const isSaving = ref(false);

const preferences = ref({
  email_notifications: true,
  module_reminders: true,
  achievement_alerts: true,
  safety_alerts: true,
  platform_updates: false
});

const loadPreferences = async () => {
  isLoading.value = true;
  try {
    await profileStore.fetchNotificationSettings();
    if (profileStore.notificationSettings) {
      preferences.value = {
        ...profileStore.notificationSettings,
        safety_alerts: true 
      };
    }
  } catch (error) {
    toast.error('Signal database sync failed');
  } finally {
    isLoading.value = false;
  }
};

const savePreferences = async () => {
  isSaving.value = true;
  try {
    const dataToSave = { ...preferences.value, safety_alerts: true };
    const success = await profileStore.updateNotificationSettings(dataToSave);
    if (success) {
      toast.success('Signal preferences synchronized');
    }
  } catch (error) {
    console.error('Save preferences error:', error);
  } finally {
    isSaving.value = false;
  }
};

watch(() => preferences.value.email_notifications, (newValue) => {
  if (!newValue) {
    preferences.value.module_reminders = false;
    preferences.value.achievement_alerts = false;
    preferences.value.platform_updates = false;
  }
});

onMounted(() => loadPreferences());
</script>

<style scoped>
input[type="checkbox"] {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>