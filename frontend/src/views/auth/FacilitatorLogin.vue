<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-[#fdfcff] dark:bg-[#04020a] font-['Poppins'] relative overflow-hidden px-4 py-8 transition-colors duration-700">
    
    <div class="absolute top-[-10%] left-[-10%] w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-purple-600/10 rounded-full blur-[80px] sm:blur-[130px] pointer-events-none animate-pulse"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-fuchsia-600/10 rounded-full blur-[80px] sm:blur-[130px] pointer-events-none animate-pulse delay-700"></div>

    <div class="w-full max-w-[1000px] relative z-10 animate-vessel">
      
      <Transition name="slide-fade">
        <div v-if="showFirstTimeNotice" 
          class="mb-6 p-4 rounded-[1.8rem] bg-white/60 dark:bg-white/[0.05] backdrop-blur-3xl border border-purple-500/30 shadow-xl flex items-center justify-between gap-4 max-w-[600px] mx-auto">
          <div class="flex items-center gap-4">
            <div class="h-10 w-10 rounded-xl liquid-blue-gem flex items-center justify-center flex-shrink-0 shadow-lg">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 font-semibold italic">Temporary password from admin is required for first-time login.</p>
          </div>
          <button @click="showFirstTimeNotice = false" class="text-slate-400 hover:text-purple-600 p-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </Transition>

      <div class="bg-white/40 dark:bg-white/[0.03] backdrop-blur-3xl border border-white dark:border-white/10 rounded-[3rem] sm:rounded-[3.5rem] 
        shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15),inset_0_1px_2px_rgba(255,255,255,1)] 
        dark:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] overflow-hidden">
        
        <div class="flex flex-col lg:flex-row">
          
          <div class="lg:w-[45%] p-8 sm:p-12 lg:p-16 flex flex-col justify-center items-center lg:items-start text-center lg:text-left bg-gradient-to-br from-purple-500/5 to-transparent border-b lg:border-b-0 lg:border-r border-white dark:border-white/5">
            <div class="h-20 w-20 rounded-3xl liquid-gem-logo shadow-2xl mb-8 rotate-3 relative overflow-hidden">
              <svg class="w-10 h-10 text-white drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <div class="absolute top-1 left-1 w-4 h-4 bg-white/40 blur-[2px] rounded-full"></div>
            </div>
            
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-[900] text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none mb-4">
              Facilitator <span class="text-transparent bg-clip-text bg-gradient-to-br from-purple-600 via-fuchsia-500 to-purple-600">Portal</span>
            </h1>
            <p class="text-slate-500 dark:text-slate-400 text-sm sm:text-base font-medium italic tracking-wide mb-6">
              Manage education protocols and track real-time student analytics.
            </p>
            <div class="hidden lg:block h-2 w-24 liquid-3d-underline rounded-full shadow-[0_10px_20px_rgba(168,85,247,0.3)]"></div>
          </div>

          <div class="lg:w-[55%] p-8 sm:p-12 lg:p-16">
            <form @submit.prevent="handleLogin" class="space-y-6 sm:space-y-8">
              <div class="space-y-2">
                <label class="block text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 ml-2">Work Email</label>
                <input v-model.trim="form.email" type="email" placeholder="facilitator@school.edu" required
                  class="w-full px-6 py-4 sm:py-5 rounded-[1.5rem] bg-white/60 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 
                  focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-500 shadow-[inset_0_1px_3px_rgba(255,255,255,0.8)] dark:shadow-none" />
              </div>

              <div class="space-y-2">
                <div class="flex justify-between items-center px-2">
                  <label class="block text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Access Key</label>
                  <router-link :to="{ name: 'facilitator.forgotPassword' }" class="text-[10px] font-black uppercase tracking-widest text-fuchsia-600 dark:text-fuchsia-400 hover:text-purple-500 transition-colors">Reset Key?</router-link>
                </div>
                <input v-model="form.password" type="password" placeholder="••••••••" required
                  class="w-full px-6 py-4 sm:py-5 rounded-[1.5rem] bg-white/60 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all duration-500 shadow-[inset_0_1px_3px_rgba(255,255,255,0.8)] dark:shadow-none" />
              </div>

              <div class="flex items-center gap-4 px-2 py-1">
                <input id="remember" v-model="form.rememberMe" type="checkbox" 
                  class="w-5 h-5 rounded-lg bg-white/5 border-slate-300 dark:border-white/10 text-purple-600 focus:ring-purple-500/40 cursor-pointer transition-all" />
                <label for="remember" class="text-[11px] text-slate-500 font-[900] uppercase tracking-[0.1em] italic cursor-pointer">Trust device</label>
              </div>

              <button type="submit" :disabled="isLoading" 
                class="btn-purple-liquid w-full py-5 text-white font-[900] uppercase tracking-[0.4em] rounded-[1.5rem] transition-all duration-500 flex items-center justify-center gap-4 relative overflow-hidden group hover:scale-[1.03] active:scale-95 shadow-2xl">
                <span v-if="!isLoading" class="relative z-10 drop-shadow-xl">Enter Portal</span>
                <div v-else class="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                <div class="absolute top-[10%] left-[10%] w-full h-full bg-gradient-to-br from-white/30 to-transparent opacity-50 blur-[2px]"></div>
              </button>

              <div class="text-center pt-4">
                <a href="mailto:support@protected.edu" 
                  class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 hover:text-purple-600 transition-all italic inline-flex items-center gap-2">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Need Technical Support?
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="mt-8 text-center">
        <p class="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] italic inline-block">
          Switch to 
        </p>
        <router-link :to="{ name: 'login' }" class="text-purple-600 dark:text-fuchsia-400 font-black uppercase tracking-[0.2em] text-[11px] hover:text-purple-500 transition-all ml-3 underline underline-offset-8 decoration-2 decoration-fuchsia-500/50">Student Login</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/utils/useToast';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const form = ref({ email: '', password: '', rememberMe: false });
const isLoading = ref(false);
const showFirstTimeNotice = ref(true);

const handleLogin = async () => {
    isLoading.value = true;
    try {
        const result = await authStore.login({
            email: form.value.email,
            password: form.value.password
        });

        if (result.ok && result.user) {
            if (!['educator', 'admin'].includes(result.user.role)) {
                toast.error('Facilitator access only.');
                await authStore.logout();
                return;
            }
            toast.success('System Authorized.');
            if (result.user.requires_password_change) {
                router.push({ name: 'facilitator.changePassword', query: { firstLogin: true } });
            } else {
                router.push({ name: 'facilitator.dashboard' });
            }
        }
    } catch (error) {
        toast.error(error.message || 'Authentication Failed.');
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    if (authStore.isAuthenticated) authStore.logout();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&display=swap');

/* 3D Liquid Components */
.liquid-gem-logo {
  background: radial-gradient(circle at 35% 35%, #a855f7 0%, #6b21a8 55%, #2e1065 100%);
  box-shadow: inset -5px -5px 12px rgba(0,0,0,0.5), inset 5px 5px 10px rgba(255,255,255,0.3), 0 20px 40px rgba(107, 33, 168, 0.4);
}

.liquid-blue-gem {
  background: radial-gradient(circle at 35% 35%, #c084fc 0%, #9333ea 55%, #581c87 100%);
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
  background: radial-gradient(circle at 30% 30%, #e879f9 0%, #c026d3 55%, #701a75 100%);
}

/* Animations */
.animate-vessel {
  animation: vesselSlideIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes vesselSlideIn {
  from { opacity: 0; transform: translateY(40px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.slide-fade-enter-active, .slide-fade-leave-active { transition: all 0.4s ease; }
.slide-fade-enter-from, .slide-fade-leave-to { transform: translateY(-20px); opacity: 0; }

input {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  -webkit-appearance: none;
}
</style>