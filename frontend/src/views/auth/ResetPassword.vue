<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-[#fdfcff] dark:bg-[#04020a] font-['Poppins'] relative overflow-hidden px-4 py-8 transition-colors duration-700">
    
    <div class="absolute top-[-10%] left-[-10%] w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-purple-600/10 rounded-full blur-[80px] sm:blur-[130px] pointer-events-none animate-pulse"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-fuchsia-600/10 rounded-full blur-[80px] sm:blur-[130px] pointer-events-none animate-pulse delay-700"></div>

    <div class="w-full max-w-[1000px] relative z-10 animate-vessel">
      
      <div class="bg-white/40 dark:bg-white/[0.03] backdrop-blur-3xl border border-white dark:border-white/10 rounded-[3rem] sm:rounded-[3.5rem] 
        shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15),inset_0_1px_2px_rgba(255,255,255,1)] 
        dark:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] overflow-hidden">
        
        <div class="flex flex-col lg:flex-row">
          
          <div class="lg:w-[45%] p-8 sm:p-12 lg:p-16 flex flex-col justify-center items-center lg:items-start text-center lg:text-left bg-gradient-to-br from-purple-500/5 to-transparent border-b lg:border-b-0 lg:border-r border-white dark:border-white/5">
            <div class="h-20 w-20 rounded-3xl liquid-gem-logo shadow-2xl mb-8 rotate-3 relative overflow-hidden">
              <svg class="w-10 h-10 text-white drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
              </svg>
              <div class="absolute top-1 left-1 w-4 h-4 bg-white/40 blur-[2px] rounded-full"></div>
            </div>
            
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-[900] text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none mb-4">
              Reset <span class="text-transparent bg-clip-text bg-gradient-to-br from-purple-600 via-fuchsia-500 to-fuchsia-600">Access</span>
            </h1>
            <p class="text-slate-500 dark:text-slate-400 text-sm sm:text-base font-medium italic tracking-wide mb-6">
              Establish a high-strength security protocol to regain entry to your dashboard.
            </p>
            <div class="hidden lg:block h-2 w-24 liquid-3d-underline rounded-full shadow-[0_10px_20px_rgba(168,85,247,0.3)]"></div>
          </div>

          <div class="lg:w-[55%] p-8 sm:p-12 lg:p-16">
            <form @submit.prevent="submit" class="space-y-6">
              
              <div class="space-y-2">
                <label class="block text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 ml-2">Verified Identity</label>
                <div class="relative group">
                  <input v-model.trim="email" type="email" readonly
                    class="w-full px-6 py-4 rounded-[1.5rem] bg-slate-100/50 dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 text-slate-400 cursor-not-allowed outline-none italic font-medium" />
                  <Lock class="absolute right-6 top-4 w-4 h-4 text-slate-300 dark:text-slate-700" />
                </div>
              </div>

              <div class="space-y-4">
                <div class="space-y-2">
                  <label class="block text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 ml-2">New Password</label>
                  <input v-model="password" type="password" placeholder="••••••••" required @input="validatePassword"
                    class="w-full px-6 py-4 rounded-[1.5rem] bg-white/60 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 
                    focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-500 shadow-[inset_0_1px_3px_rgba(255,255,255,0.8)] dark:shadow-none"
                    :class="{ 'border-red-500/50': errors.password }" />
                </div>

                <div v-if="password" class="space-y-3 px-2 animate-in fade-in slide-in-from-top-2">
                  <div class="w-full bg-slate-100 dark:bg-white/5 rounded-full h-1.5 overflow-hidden shadow-inner">
                    <div class="h-full transition-all duration-700 ease-out relative" :class="strengthBarColor" :style="{ width: strengthWidth }">
                       <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-2">
                    <div v-for="(check, key) in passwordChecksDisplay" :key="key" 
                      class="flex items-center gap-2 text-[9px] font-black uppercase tracking-tighter transition-all duration-500"
                      :class="check.valid ? 'text-purple-500' : 'text-slate-300 dark:text-slate-600'">
                      <div class="w-1 h-1 rounded-full bg-current"></div> {{ check.label }}
                    </div>
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="block text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 ml-2">Repeat Password</label>
                  <input v-model="password_confirmation" type="password" placeholder="••••••••" required
                    class="w-full px-6 py-4 rounded-[1.5rem] bg-white/60 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 
                    focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-500 shadow-[inset_0_1px_3px_rgba(255,255,255,0.8)] dark:shadow-none" />
                </div>
              </div>

              <p v-if="errors.password" class="text-[10px] text-red-500 font-black ml-2 uppercase italic text-center">{{ errors.password }}</p>

              <button type="submit" :disabled="loading || !isPasswordValid" 
                class="btn-purple-liquid w-full py-5 text-white font-[900] uppercase tracking-[0.4em] rounded-[1.5rem] transition-all duration-500 flex items-center justify-center gap-4 relative overflow-hidden group hover:scale-[1.03] active:scale-95 shadow-2xl disabled:opacity-30">
                <span v-if="!loading" class="relative z-10 drop-shadow-xl">Finalize Update</span>
                <div v-else class="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                <div class="absolute top-[10%] left-[10%] w-full h-full bg-gradient-to-br from-white/30 to-transparent opacity-50 blur-[2px]"></div>
              </button>

              <div class="text-center pt-4 border-t border-slate-100 dark:border-white/5">
                <router-link :to="{ name: 'login' }"
                  class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 hover:text-purple-600 transition-all italic">
                  Cancel and return to login
                </router-link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from "@stores/auth";
import { useToast } from '@/utils/useToast';
import { Lock } from 'lucide-vue-next';

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore();
const toast = useToast();

const token = ref('')
const email = ref('')
const password = ref('')
const password_confirmation = ref('')

const loading = ref(false)
const errors = ref({ email: '', password: '' })

// Password validation logic
const passwordChecks = computed(() => ({
    length: password.value.length >= 8,
    uppercase: /[A-Z]/.test(password.value),
    number: /[0-9]/.test(password.value)
}));

const passwordChecksDisplay = computed(() => [
    { label: '8+ Characters', valid: passwordChecks.value.length },
    { label: 'Uppercase', valid: passwordChecks.value.uppercase },
    { label: 'Number', valid: passwordChecks.value.number },
    { label: 'Match', valid: password.value && password.value === password_confirmation.value }
]);

const strengthWidth = computed(() => {
    const count = Object.values(passwordChecks.value).filter(Boolean).length;
    return ['25%', '50%', '75%', '100%'][count - 1] || '0%';
});

const strengthBarColor = computed(() => {
    const count = Object.values(passwordChecks.value).filter(Boolean).length;
    return ['bg-rose-500', 'bg-fuchsia-500', 'bg-violet-500', 'bg-purple-500'][count - 1] || 'bg-slate-500';
});

const isPasswordValid = computed(() => {
    return Object.values(passwordChecks.value).every(Boolean) && 
           password.value === password_confirmation.value;
});

const validatePassword = () => { errors.value.password = ''; };

onMounted(() => {
    token.value = route.query.token?.toString() || ''
    email.value = route.query.email?.toString() || ''
})

async function submit() {
    errors.value = { email: '', password: '' }
    loading.value = true

    try {
        await authStore.performPasswordReset({
            token: token.value,
            email: email.value,
            password: password.value,
            password_confirmation: password_confirmation.value,
        })

        toast.success('System Updated. Re-authorizing...');
        setTimeout(() => router.push({ name: 'login' }), 1500)
    } catch (e) {
        const data = e?.response?.data
        if (data?.errors) {
            errors.value.email = data.errors.email?.[0] || ''
            errors.value.password = data.errors.password?.[0] || ''
        }
        toast.error(data?.message || 'Update rejected.');
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&display=swap');

.liquid-gem-logo {
  background: radial-gradient(circle at 35% 35%, #a855f7 0%, #6b21a8 55%, #2e1065 100%);
  box-shadow: inset -5px -5px 12px rgba(0,0,0,0.5), inset 5px 5px 10px rgba(255,255,255,0.3), 0 20px 40px rgba(107, 33, 168, 0.4);
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
}

.animate-vessel {
  animation: vesselSlideIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes vesselSlideIn {
  from { opacity: 0; transform: translateY(40px) scale(0.98); }
  to { opacity: 1; transform: translateY(0); }
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