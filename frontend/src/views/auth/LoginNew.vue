<template>
    <div class="min-h-screen w-full flex items-center justify-center bg-[#fdfcff] dark:bg-[#04020a] font-['Poppins'] relative overflow-hidden p-4 transition-colors duration-700">
        
        <div class="absolute top-[-5%] left-[-5%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div class="absolute bottom-[-5%] right-[-5%] w-[400px] h-[400px] bg-fuchsia-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div class="w-full max-w-[460px] relative z-10 animate-in">
            <div class="bg-white/40 dark:bg-white/[0.03] backdrop-blur-3xl border border-white dark:border-white/10 p-10 rounded-[3rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2),inset_0_1px_2px_rgba(255,255,255,1)] dark:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)]">
                
                <div class="text-center mb-10">
                    <div class="inline-flex items-center justify-center h-16 w-16 rounded-2xl liquid-gem-logo shadow-xl mb-6 rotate-3 hover:rotate-0 transition-all duration-500 relative overflow-hidden group">
                        <svg class="w-8 h-8 text-white drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                        </svg>
                        <div class="absolute top-1 left-1 w-3 h-3 bg-white/40 blur-[1px] rounded-full"></div>
                    </div>
                    
                    <h1 class="text-4xl font-[900] text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">
                        Welcome <span class="text-transparent bg-clip-text bg-gradient-to-br from-purple-600 via-fuchsia-500 to-fuchsia-600">Back</span>
                    </h1>
                </div>

                <form @submit.prevent="handleLogin" class="space-y-6">
                    <div class="space-y-3">
                        <label class="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2">Email Address</label>
                        <input v-model.trim="form.email" type="email" placeholder="you@example.com" required
                            class="w-full px-6 py-4 rounded-[1.5rem] bg-white/50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)] dark:shadow-none" />
                    </div>

                    <div class="space-y-3">
                        <div class="flex justify-between items-center ml-2">
                            <label class="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Password</label>
                            <router-link :to="{ name: 'forgotPassword' }" class="text-[10px] font-black uppercase tracking-widest text-purple-600 dark:text-fuchsia-400 hover:text-purple-500 transition-colors">Forgot Password?</router-link>
                        </div>
                        <input v-model="form.password" type="password" placeholder="••••••••" required
                            class="w-full px-6 py-4 rounded-[1.5rem] bg-white/50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)] dark:shadow-none" />
                    </div>

                    <button type="submit" :disabled="isLoading"
                        class="btn-purple-liquid w-full py-5 text-white font-[900] uppercase tracking-[0.3em] rounded-[1.5rem] transition-all duration-500 flex items-center justify-center gap-3 relative overflow-hidden group hover:scale-[1.03] active:scale-[0.97]">
                        <span v-if="!isLoading" class="relative z-10 drop-shadow-lg">Login</span>
                        <div v-else class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <div class="absolute top-[10%] left-[10%] w-full h-full bg-gradient-to-br from-white/30 to-transparent opacity-50 blur-[2px]"></div>
                    </button>
                </form>

                <div class="flex items-center my-10 gap-4">
                    <div class="h-[1px] flex-1 bg-slate-200 dark:bg-white/10"></div>
                    <span class="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] italic leading-none">Login with</span>
                    <div class="h-[1px] flex-1 bg-slate-200 dark:bg-white/10"></div>
                </div>

                <button @click="loginWithGoogle" class="w-full py-4 rounded-[1.5rem] bg-white/50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white dark:hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-3 shadow-sm">
                    <svg class="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google
                </button>
            </div>

            <p class="mt-8 text-center text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">
                New to the Academy? 
                <router-link :to="{ name: 'signup' }" class="text-purple-600 dark:text-fuchsia-400 hover:text-purple-500 transition-colors ml-2 underline underline-offset-4 decoration-fuchsia-500">Create Account</router-link>
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@stores/auth";
import api from '@/utils/api';
import { useToast } from '@/utils/useToast';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const toast = useToast();

const form = ref({ email: "", password: "" });
const isLoading = ref(false);

const handleLogin = async () => {
    isLoading.value = true;
    try {
        await authStore.login({
            email: form.value.email,
            password: form.value.password,
        })
        toast.success("Identity Verified.");
        router.push(route.query.redirect || { name: 'user.dashboard' });
    } catch (error) {
        toast.error(error?.response?.data?.message || "Identity Rejection.");
    } finally {
        isLoading.value = false;
    }
};

const loginWithGoogle = async () => {
    try {
        const { data } = await api.get('/api/v1/auth/google/redirect');
        window.location.href = data.authUrl;
    } catch (error) {
        toast.error("Protocol Sync Failed.");
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&display=swap');

/* --- LIQUID GEM PHYSICS --- */
.liquid-gem-logo {
    background: radial-gradient(circle at 35% 35%, #a855f7 0%, #6b21a8 55%, #2e1065 100%);
    box-shadow: 
        inset -4px -4px 10px rgba(0,0,0,0.5),
        inset 4px 4px 8px rgba(255,255,255,0.3),
        0 15px 30px rgba(107, 33, 168, 0.3);
}

.btn-purple-liquid {
    background: radial-gradient(circle at 30% 30%, #7c3aed 0%, #4c1d95 55%, #1e1b4b 100%);
    box-shadow: 
        inset -8px -8px 20px rgba(0,0,0,0.6),
        inset 8px 8px 15px rgba(255,255,255,0.2),
        0 20px 40px rgba(76, 29, 149, 0.3);
}

:where(.dark) .btn-purple-liquid {
    background: radial-gradient(circle at 30% 30%, #a855f7 0%, #6d28d9 55%, #2e1065 100%);
}

/* Entrance Animation */
.animate-in {
    animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideUpFade {
    from { opacity: 0; transform: translateY(40px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}

input {
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>