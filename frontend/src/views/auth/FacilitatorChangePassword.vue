<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-[#fdfcff] dark:bg-[#04020a] font-['Poppins'] relative overflow-hidden px-4 py-12 transition-colors duration-700">
    
    <div class="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
    <div class="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse delay-1000"></div>

    <div class="w-full max-w-[500px] relative z-10 animate-vessel">
      
      <div v-if="isFirstLogin" 
        class="mb-6 p-6 rounded-[2rem] bg-white/60 dark:bg-white/[0.05] backdrop-blur-3xl border border-purple-500/30 shadow-2xl animate-in relative overflow-hidden">
        <div class="flex gap-5 relative z-10">
          <div class="h-12 w-12 rounded-2xl liquid-blue-gem flex items-center justify-center flex-shrink-0 shadow-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-[11px] font-[900] text-slate-800 dark:text-white uppercase tracking-[0.2em] mb-1 italic">Security First</h3>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold italic">
              Protect student data by choosing a unique, high-strength password for your facilitator account.
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white/40 dark:bg-white/[0.03] backdrop-blur-3xl border border-white dark:border-white/10 p-10 sm:p-14 rounded-[3.5rem] 
        shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15),inset_0_1px_2px_rgba(255,255,255,1)] 
        dark:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)]">
        
        <div class="text-center mb-10">
          <div class="inline-flex items-center justify-center h-16 w-16 rounded-2xl liquid-gem-logo shadow-xl mb-6 rotate-3 relative overflow-hidden">
            <svg class="w-8 h-8 text-white drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div class="absolute top-1 left-1 w-3 h-3 bg-white/40 blur-[1px] rounded-full"></div>
          </div>

          <h1 class="text-4xl font-[900] text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">
            {{ isFirstLogin ? 'Set' : 'Update' }} <span class="text-transparent bg-clip-text bg-gradient-to-br from-purple-600 via-fuchsia-500 to-fuchsia-600">Access</span>
          </h1>
          <p class="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-3 font-medium italic">Configure your secure facilitator credentials.</p>
          <div class="h-1.5 w-20 liquid-3d-underline mt-5 rounded-full shadow-[0_10px_20px_rgba(168,85,247,0.3)] mx-auto"></div>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div v-if="!isFirstLogin" class="space-y-2">
            <label class="block text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 ml-2">Current Key</label>
            <input v-model="form.currentPassword" type="password" placeholder="••••••••" required
              class="w-full px-6 py-4 rounded-[1.5rem] bg-white/60 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 
              focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-500 shadow-[inset_0_1px_3px_rgba(255,255,255,0.8)] dark:shadow-none" />
            <p v-if="errors.currentPassword" class="text-[10px] text-red-500 font-black ml-2 uppercase italic">{{ errors.currentPassword }}</p>
          </div>

          <div class="space-y-2">
            <label class="block text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 ml-2">New Access Key</label>
            <input v-model="form.newPassword" type="password" placeholder="••••••••" required @input="validatePassword"
              class="w-full px-6 py-4 rounded-[1.5rem] bg-white/60 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 
              focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-500 shadow-[inset_0_1px_3px_rgba(255,255,255,0.8)] dark:shadow-none" />
            <p v-if="errors.newPassword" class="text-[10px] text-red-500 font-black ml-2 uppercase italic">{{ errors.newPassword }}</p>
          </div>

          <div v-if="form.newPassword" class="space-y-4 px-2 animate-in fade-in slide-in-from-top-2">
            <div class="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              <span>Security Strength: <span :class="strengthTextColor" class="italic">{{ strengthLabel }}</span></span>
            </div>
            
            <div class="w-full bg-slate-100 dark:bg-white/5 rounded-full h-2 overflow-hidden shadow-inner border border-white dark:border-white/5">
              <div class="h-full transition-all duration-700 ease-out relative" :class="strengthBarColor" :style="{ width: strengthWidth }">
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
              </div>
            </div>
            
            <div class="grid grid-cols-1 gap-2.5">
              <div v-for="(check, key) in passwordChecksDisplay" :key="key" 
                class="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.1em] transition-all duration-500"
                :class="check.valid ? 'text-purple-500' : 'text-slate-400 opacity-60'">
                <div class="h-3.5 w-3.5 rounded-lg flex items-center justify-center transition-all border-2" :class="check.valid ? 'bg-purple-500/10 border-purple-500/30' : 'bg-transparent border-slate-200 dark:border-white/10'">
                  <svg v-if="check.valid" class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7" /></svg>
                </div>
                {{ check.label }}
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <label class="block text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 ml-2">Repeat Key</label>
            <input v-model="form.confirmPassword" type="password" placeholder="••••••••" required
              class="w-full px-6 py-4 rounded-[1.5rem] bg-white/60 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 
              focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-500 shadow-[inset_0_1px_3px_rgba(255,255,255,0.8)] dark:shadow-none" />
            <p v-if="errors.confirmPassword" class="text-[10px] text-red-500 font-black ml-2 uppercase italic">{{ errors.confirmPassword }}</p>
          </div>

          <button type="submit" :disabled="isLoading || !isPasswordValid"
            class="btn-purple-liquid w-full py-5 text-white font-[900] uppercase tracking-[0.4em] rounded-[1.5rem] transition-all duration-500 flex items-center justify-center gap-4 relative overflow-hidden group hover:scale-[1.03] active:scale-95 shadow-2xl disabled:opacity-30">
            <span v-if="!isLoading" class="relative z-10 drop-shadow-xl">{{ isFirstLogin ? 'Set & Authorize' : 'Sync Credentials' }}</span>
            <div v-else class="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
            <div class="absolute top-[10%] left-[10%] w-full h-full bg-gradient-to-br from-white/30 to-transparent opacity-50 blur-[2px]"></div>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/utils/useToast';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const toast = useToast();

const isFirstLogin = computed(() => route.query.firstLogin === 'true');

const form = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
});

const errors = ref({});
const isLoading = ref(false);

// Password validation
const passwordChecks = computed(() => ({
    length: form.value.newPassword.length >= 8,
    uppercase: /[A-Z]/.test(form.value.newPassword),
    number: /[0-9]/.test(form.value.newPassword)
}));

const passwordChecksDisplay = computed(() => [
    { label: '8+ Characters', valid: passwordChecks.value.length },
    { label: 'Caps Letter', valid: passwordChecks.value.uppercase },
    { label: 'Number', valid: passwordChecks.value.number }
]);

const passwordStrength = computed(() => {
    if (!form.value.newPassword) return -1;
    return Object.values(passwordChecks.value).filter(Boolean).length;
});

const strengthLabel = computed(() => ['Weak', 'Fair', 'Good', 'Strong'][passwordStrength.value] || 'Analyzing...');
const strengthTextColor = computed(() => ['text-rose-500', 'text-fuchsia-500', 'text-violet-400', 'text-purple-500'][passwordStrength.value]);
const strengthBarColor = computed(() => ['bg-rose-500', 'bg-fuchsia-500', 'bg-violet-400', 'bg-purple-500'][passwordStrength.value]);
const strengthWidth = computed(() => ['25%', '50%', '75%', '100%'][passwordStrength.value] || '0%');

const isPasswordValid = computed(() => {
    return Object.values(passwordChecks.value).every(Boolean) && 
           form.value.newPassword === form.value.confirmPassword;
});

const validatePassword = () => {
    errors.value.newPassword = '';
};

const handleSubmit = async () => {
    errors.value = {};
    isLoading.value = true;

    try {
        const payload = {
            password: form.value.newPassword,
            password_confirmation: form.value.confirmPassword
        };

        if (!isFirstLogin.value) payload.current_password = form.value.currentPassword;

        const result = await authStore.changePassword(payload);

        if (result.ok) {
            toast.success('Access keys updated.');
            router.push({ name: 'facilitator.dashboard' });
        }
    } catch (error) {
        toast.error(error.message || 'Update rejected.');
        if (error.message.includes('Current password')) errors.value.currentPassword = error.message;
        else errors.value.newPassword = error.message;
    } finally {
        isLoading.value = false;
    }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&display=swap');

/* --- 3D LIQUID PHYSICS --- */
.liquid-gem-logo {
  background: radial-gradient(circle at 35% 35%, #a855f7 0%, #6b21a8 55%, #2e1065 100%);
  box-shadow: inset -5px -5px 12px rgba(0,0,0,0.5), inset 5px 5px 10px rgba(255,255,255,0.3), 0 20px 40px rgba(107, 33, 168, 0.4);
}

.liquid-blue-gem {
  background: radial-gradient(circle at 35% 35%, #60a5fa 0%, #2563eb 55%, #1e3a8a 100%);
  box-shadow: inset -3px -3px 8px rgba(0,0,0,0.4), inset 3px 3px 6px rgba(255,255,255,0.3);
}

.btn-purple-liquid {
  background: radial-gradient(circle at 30% 30%, #7c3aed 0%, #4c1d95 55%, #1e1b4b 100%);
  box-shadow: inset -8px -8px 25px rgba(0,0,0,0.6), inset 8px 8px 15px rgba(255,255,255,0.2), 0 30px 60px rgba(76, 29, 149, 0.4);
}

:where(.dark) .btn-purple-liquid {
  background: radial-gradient(circle at 30% 30%, #a855f7 0%, #6d28d9 55%, #2e1065 100%);
}

.liquid-3d-underline {
  background: radial-gradient(circle at 30% 30%, #f472b6 0%, #db2777 55%, #831843 100%);
  box-shadow: inset -2px -2px 5px rgba(0,0,0,0.4), inset 2px 2px 5px rgba(255,255,255,0.4);
}

/* Animations */
.animate-vessel {
  animation: vesselSlideIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes vesselSlideIn {
  from { opacity: 0; transform: translateY(40px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.animate-shimmer {
  animation: shimmer 2s infinite linear;
}

input {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  -webkit-appearance: none;
}
</style>