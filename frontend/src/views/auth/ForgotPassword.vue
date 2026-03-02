<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-[#fdfcff] dark:bg-[#04020a] font-['Poppins'] relative overflow-hidden p-4 transition-colors duration-700">
    
    <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse delay-700"></div>

    <div class="w-full max-w-[480px] relative z-10 animate-vessel">
      <div class="bg-white/40 dark:bg-white/[0.03] backdrop-blur-3xl border border-white dark:border-white/10 p-10 sm:p-12 rounded-[3.5rem] 
        shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15),inset_0_1px_2px_rgba(255,255,255,1)] 
        dark:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.05)]">
        
        <div class="text-center mb-10">
          <div class="inline-flex items-center justify-center h-16 w-16 rounded-2xl liquid-gem-logo shadow-xl mb-6 rotate-3 hover:rotate-0 transition-all duration-500 relative overflow-hidden">
            <svg class="w-8 h-8 text-white drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
            </svg>
            <div class="absolute top-1 left-1 w-3 h-3 bg-white/40 blur-[1px] rounded-full"></div>
          </div>
          
          <h1 class="text-4xl font-[950] text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none mb-3">
            Forgot <span class="text-transparent bg-clip-text bg-gradient-to-br from-purple-600 via-fuchsia-500 to-fuchsia-600">Access?</span>
          </h1>
          <p class="text-slate-500 dark:text-slate-400 text-sm font-medium italic">Enter your email to reset your protocol.</p>
          <div class="h-1.5 w-20 liquid-3d-underline mt-4 rounded-full shadow-[0_10px_20px_rgba(168,85,247,0.3)] mx-auto"></div>
        </div>

        <form @submit.prevent="submit" class="space-y-7">
          <div class="space-y-3">
            <label class="block text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 ml-2">Email Address</label>
            <div class="relative group">
              <input v-model.trim="email" type="email" placeholder="name@email.com" required
                class="w-full px-7 py-5 rounded-[1.8rem] bg-white/60 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 
                focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-500 shadow-[inset_0_1px_3px_rgba(255,255,255,0.8)] dark:shadow-none"
                :class="{ 'border-red-500/50 focus:ring-red-500/30': fieldError }" />
            </div>
            <p v-if="fieldError" class="mt-1 text-[10px] font-black uppercase text-fuchsia-500 ml-2 italic">{{ fieldError }}</p>
          </div>

          <button type="submit" :disabled="loading"
            class="btn-purple-liquid w-full py-5 text-white font-[900] uppercase tracking-[0.3em] rounded-[1.5rem] transition-all duration-500 flex items-center justify-center gap-3 relative overflow-hidden group hover:scale-[1.03] active:scale-[0.97] shadow-2xl disabled:opacity-50">
            <span v-if="!loading" class="relative z-10 drop-shadow-lg">Send Reset Link</span>
            <div v-else class="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
            <div class="absolute top-[10%] left-[10%] w-full h-full bg-gradient-to-br from-white/30 to-transparent opacity-50 blur-[2px]"></div>
          </button>
        </form>

        <div class="mt-10 text-center border-t border-slate-200 dark:border-white/10 pt-8">
          <router-link :to="{ name: 'login' }"
            class="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 hover:text-purple-600 dark:hover:text-fuchsia-400 transition-all flex items-center justify-center gap-2 italic">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to secure login
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from "vue-router";
import { useAuthStore } from "@stores/auth";
import { useToast } from '@/utils/useToast';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const email = ref('')
const loading = ref(false)
const fieldError = ref('')

async function submit() {
    fieldError.value = ''
    loading.value = true

    try {
        await authStore.requestPasswordReset(email.value);
        toast.success('If that email exists, a reset link has been sent.');
        email.value = '';
    } catch (e) {
        const data = e?.response?.data;
        if (data?.errors?.email) {
            fieldError.value = data.errors.email[0];
        } else {
            toast.error(data?.message || 'Something went wrong. Please try again.');
        }
    } finally {
        loading.value = false;
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&display=swap');

/* --- 3D LIQUID PHYSICS --- */
.liquid-gem-logo {
  background: radial-gradient(circle at 35% 35%, #a855f7 0%, #6b21a8 55%, #2e1065 100%);
  box-shadow: inset -4px -4px 10px rgba(0,0,0,0.5), inset 4px 4px 8px rgba(255,255,255,0.3), 0 15px 30px rgba(107, 33, 168, 0.3);
}

.btn-purple-liquid {
  background: radial-gradient(circle at 30% 30%, #7c3aed 0%, #4c1d95 55%, #1e1b4b 100%);
  box-shadow: inset -8px -8px 20px rgba(0,0,0,0.6), inset 8px 8px 15px rgba(255,255,255,0.2), 0 20px 40px rgba(76, 29, 149, 0.3);
}

:where(.dark) .btn-purple-liquid {
  background: radial-gradient(circle at 30% 30%, #a855f7 0%, #6d28d9 55%, #2e1065 100%);
}

.liquid-3d-underline {
  background: radial-gradient(circle at 30% 30%, #f472b6 0%, #db2777 55%, #831843 100%);
  box-shadow: inset -2px -2px 5px rgba(0,0,0,0.4), inset 2px 2px 5px rgba(255,255,255,0.4);
}

/* Entrance Animation */
.animate-vessel {
  animation: vesselSlideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes vesselSlideIn {
  from { opacity: 0; transform: translateY(40px) scale(0.95); filter: blur(10px); }
  to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
}

input {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>