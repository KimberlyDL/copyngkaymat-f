<template>
    <div class="min-h-screen w-full flex items-center justify-center bg-[#060606] font-['Poppins'] relative overflow-hidden p-4">
        
        <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px]"></div>

        <div class="w-full max-w-[450px] relative z-10 animate-in fade-in zoom-in duration-700">
            <div class="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
                
                <div class="text-center mb-10">
                    <div class="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-pink-600 shadow-lg mb-6 rotate-3 hover:rotate-0 transition-transform duration-500">
                        <svg class="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                        </svg>
                    </div>
                    <h1 class="text-3xl font-black text-white uppercase tracking-tighter">
                        Welcome <span class="bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">Back</span>
                    </h1>
                    <p class="text-gray-400 text-sm mt-2 font-medium italic">"Secure your future with ProtectEd"</p>
                </div>

                <form @submit.prevent="handleLogin" class="space-y-6">
                    <div class="space-y-2">
                        <label class="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Email Address</label>
                        <input v-model.trim="form.email" type="email" placeholder="you@example.com" required
                            class="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300" />
                    </div>

                    <div class="space-y-2">
                        <div class="flex justify-between ml-1">
                            <label class="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Password</label>
                            <router-link :to="{ name: 'forgotPassword' }" class="text-[10px] font-black uppercase tracking-widest text-pink-500 hover:text-blue-400 transition-colors">Forgot?</router-link>
                        </div>
                        <input v-model="form.password" type="password" placeholder="••••••••" required
                            class="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300" />
                    </div>

                    <button type="submit" :disabled="isLoading"
                        class="w-full py-4 bg-gradient-to-r from-blue-600 to-pink-600 text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:shadow-[0_15px_30px_rgba(37,99,235,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 flex items-center justify-center gap-3">
                        <span v-if="!isLoading">Authorize</span>
                        <div v-else class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    </button>
                </form>

                <div class="flex items-center my-8 gap-4">
                    <div class="h-[1px] flex-1 bg-white/10"></div>
                    <span class="text-[10px] font-black text-gray-600 uppercase tracking-widest">Social Entry</span>
                    <div class="h-[1px] flex-1 bg-white/10"></div>
                </div>

                <button @click="loginWithGoogle" class="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-3">
                    <svg class="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google Sync
                </button>
            </div>

            <p class="mt-8 text-center text-xs font-bold text-gray-500 uppercase tracking-widest">
                New here? 
                <router-link :to="{ name: 'signup' }" class="text-white hover:text-pink-500 transition-colors ml-2 underline underline-offset-4">Create Account</router-link>
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
        toast.success("Access Granted.");
        router.push(route.query.redirect || { name: 'user.dashboard' });
    } catch (error) {
        toast.error(error?.response?.data?.message || "Access Denied.");
    } finally {
        isLoading.value = false;
    }
};

const loginWithGoogle = async () => {
    try {
        const { data } = await api.get('/api/v1/auth/google/redirect');
        window.location.href = data.authUrl;
    } catch (error) {
        toast.error("Google Sync Failed.");
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');

.animate-in {
    animation: fadeInScale 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeInScale {
    from { opacity: 0; transform: scale(0.9) translateY(20px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
}
</style>