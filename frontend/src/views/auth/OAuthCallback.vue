<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-[#fdfcff] dark:bg-[#04020a] font-['Poppins'] relative overflow-hidden p-6 transition-colors duration-700">
    
    <div class="absolute top-[-10%] left-[-10%] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-purple-600/10 rounded-full blur-[100px] sm:blur-[130px] pointer-events-none animate-pulse"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-fuchsia-600/10 rounded-full blur-[100px] sm:blur-[130px] pointer-events-none animate-pulse delay-700"></div>

    <div class="w-full max-w-[440px] relative z-10 animate-vessel">
      <div class="bg-white/40 dark:bg-white/[0.03] backdrop-blur-3xl border border-white dark:border-white/10 p-10 sm:p-14 rounded-[3.5rem] 
        shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15),inset_0_1px_2px_rgba(255,255,255,1)] 
        dark:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] text-center overflow-hidden">
        
        <div class="inline-flex items-center justify-center h-24 w-24 rounded-[2rem] liquid-gem-logo shadow-2xl mb-10 relative group overflow-hidden">
          <svg class="w-12 h-12 text-white relative z-10" :class="{ 'animate-pulse': !error }" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
          </svg>
          <div class="absolute top-2 left-2 w-5 h-5 bg-white/40 blur-[2px] rounded-full"></div>
          <div class="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-30 animate-pulse"></div>
        </div>

        <div v-if="!error" class="space-y-8">
          <div class="space-y-3">
            <h2 class="text-4xl font-[900] text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">
              Syncing <span class="text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-fuchsia-500">Account</span>
            </h2>
            <p class="text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em] italic">Connecting with Google Secure Auth</p>
          </div>
          
          <div class="relative h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden shadow-inner border border-white dark:border-white/5">
            <div class="absolute inset-0 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-fuchsia-600 animate-progress-liquid shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
          </div>
        </div>

        <div v-else class="space-y-8">
          <div class="space-y-3">
            <h2 class="text-4xl font-[900] text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">
              Sync <span class="text-fuchsia-600">Failed</span>
            </h2>
            <p class="text-slate-500 dark:text-slate-400 text-sm font-medium italic">{{ error }}</p>
          </div>

          <router-link :to="{ name: 'login' }"
            class="btn-purple-liquid block w-full py-5 text-white font-[900] uppercase tracking-[0.3em] rounded-[1.5rem] transition-all duration-500 hover:scale-[1.03] active:scale-95 shadow-2xl relative overflow-hidden">
            <span class="relative z-10 drop-shadow-md">Try Again</span>
            <div class="absolute top-[10%] left-[10%] w-full h-full bg-gradient-to-br from-white/30 to-transparent opacity-50 blur-[2px]"></div>
          </router-link>
        </div>

        <p class="mt-12 text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] italic">ProtectEd Security Protocol v2.6</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { setAuthToken } from '@/utils/api';
import { useToast } from '@/utils/useToast';
import api from '@/utils/api';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const toast = useToast();
const error = ref(null);

onMounted(async () => {
    const code = route.query.code;
    if (!code) {
        error.value = "Authorization code not found.";
        return;
    }

    try {
        const { data } = await api.post('/api/v1/auth/google/exchange', { code });
        setAuthToken(data.token);
        auth.user = data.user;
        toast.success(`Identity Verified. Welcome!`);
        router.replace({ name: 'user.dashboard' });
    } catch (err) {
        error.value = err.response?.data?.message || "Google synchronization failed.";
    }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&display=swap');

/* --- LIQUID GEM PHYSICS --- */
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

/* Entrance Animation */
.animate-vessel {
  animation: vesselSlideIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes vesselSlideIn {
  from { opacity: 0; transform: translateY(40px) scale(0.95); filter: blur(10px); }
  to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
}

/* Loading Flow Animation */
@keyframes progress-flow {
    0% { transform: translateX(-100%); }
    50% { transform: translateX(0%); }
    100% { transform: translateX(100%); }
}

.animate-progress-liquid {
    width: 60%; /* Visual trick for liquid flow */
    animation: progress-flow 2s infinite ease-in-out;
}
</style>