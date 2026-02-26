<template>
    <div class="min-h-screen w-full flex items-center justify-center bg-[#060606] font-['Poppins'] relative overflow-hidden p-4">
        
        <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[120px] animate-pulse delay-1000 pointer-events-none"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div class="w-full max-w-[480px] relative z-10 animate-in fade-in zoom-in duration-700">
            
            <div v-if="showFirstTimeNotice" 
                class="mb-6 p-5 rounded-3xl bg-white/5 backdrop-blur-xl border border-blue-500/20 shadow-2xl animate-in slide-in-from-top-4 duration-500">
                <div class="flex gap-4">
                    <div class="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div class="flex-1">
                        <h3 class="text-sm font-black text-white uppercase tracking-wider mb-1">First time here?</h3>
                        <p class="text-xs text-gray-400 leading-relaxed font-medium">
                            Use your temporary password provided by the administrator to set up your secure access.
                        </p>
                    </div>
                    <button @click="showFirstTimeNotice = false" class="text-gray-500 hover:text-white transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <div class="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
                
                <div class="text-center mb-10">
                    <div class="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-pink-600 shadow-lg mb-6 rotate-3 hover:rotate-0 transition-transform duration-500">
                        <svg class="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <h1 class="text-3xl font-black text-white uppercase tracking-tighter">
                        Facilitator <span class="bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">Portal</span>
                    </h1>
                    <p class="text-gray-400 text-sm mt-2 font-medium">Manage education and track student progress.</p>
                </div>

                <form @submit.prevent="handleLogin" class="space-y-6">
                    <div class="space-y-2">
                        <label class="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Work Email</label>
                        <input v-model.trim="form.email" type="email" placeholder="facilitator@school.edu" required
                            class="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300" />
                    </div>

                    <div class="space-y-2">
                        <div class="flex justify-between ml-1">
                            <label class="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Password</label>
                            <router-link :to="{ name: 'facilitator.forgotPassword' }" class="text-[10px] font-black uppercase tracking-widest text-pink-500 hover:text-blue-400 transition-colors">Forgot?</router-link>
                        </div>
                        <input v-model="form.password" type="password" placeholder="••••••••" required
                            class="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300" />
                    </div>

                    <div class="flex items-center gap-3 px-1">
                        <input id="remember" v-model="form.rememberMe" type="checkbox" 
                            class="w-5 h-5 rounded-lg bg-white/5 border-white/10 text-blue-600 focus:ring-blue-500/40 transition cursor-pointer" />
                        <label for="remember" class="text-[11px] text-gray-400 font-bold uppercase tracking-widest cursor-pointer">Trust this device</label>
                    </div>

                    <button type="submit" :disabled="isLoading"
                        class="w-full py-4 bg-gradient-to-r from-blue-600 to-pink-600 text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:shadow-[0_15px_30px_rgba(37,99,235,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 flex items-center justify-center gap-3">
                        <span v-if="!isLoading">Enter Portal</span>
                        <div v-else class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    </button>
                </form>

                <div class="mt-8 text-center border-t border-white/10 pt-6">
                    <a href="mailto:support@protected.edu" 
                        class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-blue-400 transition-all flex items-center justify-center gap-2">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        Need Technical Support?
                    </a>
                </div>
            </div>

            <p class="mt-8 text-center text-xs font-bold text-gray-500 uppercase tracking-widest">
                Are you a student? 
                <router-link :to="{ name: 'login' }" class="text-white hover:text-pink-500 transition-colors ml-2 underline underline-offset-4 decoration-pink-500/50">Switch to Student Login</router-link>
            </p>
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

const form = ref({
    email: '',
    password: '',
    rememberMe: false
});

const errors = ref({});
const isLoading = ref(false);
const showFirstTimeNotice = ref(true);

const handleLogin = async () => {
    errors.value = {};
    isLoading.value = true;

    try {
        const result = await authStore.login({
            email: form.value.email,
            password: form.value.password
        });

        if (result.ok && result.user) {
            if (!['educator', 'admin'].includes(result.user.role)) {
                toast.error('Facilitator access only. Use Student Login.');
                await authStore.logout();
                return;
            }

            toast.success('System Authorized. Welcome back.');

            if (result.user.requires_password_change) {
                router.push({ name: 'facilitator.changePassword', query: { firstLogin: true } });
            } else {
                router.push({ name: 'facilitator.dashboard' });
            }
        }
    } catch (error) {
        toast.error(error.message || 'Authentication Failed.');
        errors.value.email = error.message;
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    if (authStore.isAuthenticated) {
        authStore.logout();
    }
});
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

input {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>