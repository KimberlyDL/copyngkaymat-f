<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-[#fdfcff] dark:bg-[#04020a] font-['Poppins'] relative overflow-hidden px-4 py-8 transition-colors duration-700">
    
    <div class="absolute top-[-10%] left-[-10%] w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-purple-600/10 rounded-full blur-[80px] sm:blur-[130px] pointer-events-none animate-pulse"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-fuchsia-600/10 rounded-full blur-[80px] sm:blur-[130px] pointer-events-none animate-pulse delay-700"></div>

    <div class="w-full max-w-[500px] lg:max-w-[900px] relative z-10 animate-vessel">
      
      <div class="bg-white/40 dark:bg-white/[0.03] backdrop-blur-3xl border border-white dark:border-white/10 rounded-[3rem] sm:rounded-[3.5rem] 
        shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15),inset_0_1px_2px_rgba(255,255,255,1)] 
        dark:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] overflow-hidden">
        
        <div class="flex flex-col lg:flex-row">
          
          <div class="lg:w-[45%] p-10 lg:p-16 flex flex-col justify-center items-center text-center bg-gradient-to-br from-purple-500/5 to-transparent border-b lg:border-b-0 lg:border-r border-white dark:border-white/5">
            
            <div class="relative h-24 w-24 sm:h-32 sm:w-32 mb-8 group">
                <div v-if="status === 'loading'" class="absolute inset-0 rounded-[2.5rem] liquid-gem-logo animate-spin opacity-20"></div>
                
                <div class="absolute inset-2 rounded-[2rem] bg-white dark:bg-[#0d0d12] flex items-center justify-center border border-white dark:border-white/10 shadow-2xl transition-all">
                    <div v-if="status === 'loading'" class="h-3 w-3 bg-purple-500 rounded-full animate-ping"></div>
                    
                    <svg v-else-if="status === 'success'" class="w-10 h-10 sm:w-14 sm:h-14 text-violet-500 drop-shadow-glow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>

                    <svg v-else class="w-10 h-10 sm:w-14 sm:h-14 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
            </div>

            <div class="space-y-2">
                <h2 v-if="status === 'loading'" class="text-xs font-black uppercase tracking-[0.5em] text-slate-400 animate-pulse">Syncing Node...</h2>
                <h2 v-else-if="status === 'success'" class="text-xs font-black uppercase tracking-[0.5em] text-violet-500 italic">Identity Verified</h2>
                <h2 v-else class="text-xs font-black uppercase tracking-[0.5em] text-rose-500 italic">Signal Failed</h2>
            </div>
          </div>

          <div class="lg:w-[55%] p-10 lg:p-16 flex flex-col justify-center">
            
            <div v-if="status === 'loading'" class="space-y-6 text-center lg:text-left">
                <h1 class="text-4xl sm:text-5xl font-[900] text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">
                    Verifying <span class="text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-fuchsia-600">Identity</span>
                </h1>
                <p class="text-slate-500 dark:text-slate-400 text-sm font-medium italic leading-relaxed">Please wait while we secure your account node and authorize your access to the platform.</p>
                <div class="w-full bg-slate-100 dark:bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-purple-600 to-fuchsia-600 animate-progress-liquid w-full"></div>
                </div>
            </div>

            <div v-else-if="status === 'success'" class="space-y-8 text-center lg:text-left">
                <h1 class="text-4xl sm:text-5xl font-[900] text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">
                    Welcome <span class="text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-fuchsia-500">Confirmed</span>
                </h1>
                <p class="text-slate-500 dark:text-slate-400 text-sm font-medium italic leading-relaxed">Your account is now fully active. You can now proceed to initialize your dashboard.</p>
                
                <router-link :to="{ name: 'login' }"
                    class="btn-purple-liquid w-full py-5 text-white font-[900] uppercase tracking-[0.3em] rounded-[1.5rem] transition-all duration-500 flex items-center justify-center gap-4 relative overflow-hidden group hover:scale-[1.03] active:scale-95 shadow-2xl">
                    <span class="relative z-10 drop-shadow-xl">Enter Academy</span>
                    <div class="absolute top-[10%] left-[10%] w-full h-full bg-gradient-to-br from-white/30 to-transparent opacity-50 blur-[2px]"></div>
                </router-link>
            </div>

            <div v-else class="space-y-8 text-center lg:text-left">
                <h1 class="text-4xl sm:text-5xl font-[900] text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">
                    Verification <span class="text-red-500">Error</span>
                </h1>
                <p class="text-slate-500 dark:text-slate-400 text-sm font-medium italic leading-relaxed">{{ errorMessage }}</p>
                
                <div class="flex flex-col gap-4">
                    <router-link :to="{ name: 'verify-notice' }" 
                        class="w-full py-5 border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/[0.03] text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-[1.5rem] hover:bg-white dark:hover:bg-white/5 transition-all text-center">
                        Request New Link
                    </router-link>
                    <router-link :to="{ name: 'login' }" class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-purple-600 transition-all italic underline underline-offset-8 decoration-2 text-center">Return to Login</router-link>
                </div>
            </div>

          </div>
        </div>
      </div>

      <p class="mt-10 text-center text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.5em] italic">ProtectEd Node Authorization // v2.6</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/utils/api'

const route = useRoute()
const status = ref('loading') 
const errorMessage = ref('')

onMounted(async () => {
    const token = route.query.token

    if (!token) {
        status.value = 'error'
        errorMessage.value = 'The verification signal is missing. Please check your email link.'
        return
    }

    try {
        await api.get(`/api/v1/auth/verify-email?token=${token}`)
        status.value = 'success'
    } catch (error) {
        status.value = 'error'
        errorMessage.value = error.response?.data?.message || 'This link has expired or is no longer valid.'
    }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&display=swap');

/* --- 3D LIQUID PHYSICS --- */
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

.drop-shadow-glow {
    filter: drop-shadow(0 0 10px rgba(34, 197, 94, 0.5));
}

/* Entrance Physics */
.animate-vessel {
  animation: vesselSlideIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes vesselSlideIn {
  from { opacity: 0; transform: translateY(40px) scale(0.98); }
  to { opacity: 1; transform: translateY(0); }
}

/* Progress Animation */
@keyframes progress-flow {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}

.animate-progress-liquid {
    animation: progress-flow 2s infinite linear;
}
</style>