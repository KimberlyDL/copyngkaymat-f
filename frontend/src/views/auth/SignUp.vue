<template>
    <div class="min-h-screen w-full flex items-center justify-center bg-[#060606] font-['Poppins'] relative overflow-hidden p-4">
        
        <div class="absolute top-[-15%] right-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[130px] animate-pulse pointer-events-none"></div>
        <div class="absolute bottom-[-15%] left-[-10%] w-[600px] h-[600px] bg-pink-600/20 rounded-full blur-[130px] animate-pulse delay-1000 pointer-events-none"></div>

        <div class="w-full max-w-[550px] relative z-10 animate-in fade-in zoom-in duration-700">
            <div class="bg-white/5 backdrop-blur-3xl border border-white/10 p-8 sm:p-12 rounded-[3rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)]">
                
                <div class="text-center mb-10">
                    <h1 class="text-4xl font-black text-white uppercase tracking-tighter mb-2">
                        Create <span class="bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">Account</span>
                    </h1>
                    <p class="text-gray-400 text-sm font-medium">Join ProtectEd and start your learning journey.</p>
                </div>

                <form @submit.prevent="handleSignUp" class="space-y-5">
                    <div class="space-y-1.5">
                        <label class="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Email Address</label>
                        <input v-model.trim="form.email" type="email" required placeholder="you@example.com"
                            class="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
                            :class="{ 'border-red-500/50 focus:ring-red-500/30': errors.email }" />
                        <p v-if="errors.email" class="text-[10px] text-red-500 font-bold ml-1 uppercase">{{ errors.email }}</p>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="space-y-1.5">
                            <label class="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Password</label>
                            <input v-model="form.password" type="password" required placeholder="••••••••"
                                class="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
                                :class="{ 'border-red-500/50 focus:ring-red-500/30': errors.password }" />
                        </div>
                        <div class="space-y-1.5">
                            <label class="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Confirm</label>
                            <input v-model="form.confirmPassword" type="password" required placeholder="••••••••"
                                class="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
                                :class="{ 'border-red-500/50 focus:ring-red-500/30': errors.confirmPassword }" />
                        </div>
                    </div>
                    <p v-if="errors.password || errors.confirmPassword" class="text-[10px] text-red-500 font-bold ml-1 uppercase">
                        {{ errors.password || errors.confirmPassword }}
                    </p>

                    <div class="flex items-center gap-3 px-1 py-2">
                        <input id="terms" type="checkbox" v-model="form.agreeToTerms" 
                            class="w-5 h-5 rounded-lg bg-white/5 border-white/10 text-blue-600 focus:ring-blue-500/40 transition cursor-pointer" />
                        <label for="terms" class="text-[11px] text-gray-400 font-medium">
                            I accept the <a class="text-blue-400 hover:text-pink-400 cursor-pointer transition-colors">Terms</a> and 
                            <a class="text-pink-400 hover:text-blue-400 cursor-pointer transition-colors">Privacy Policy</a>
                        </label>
                    </div>

                    <button type="submit" :disabled="isLoading" 
                        class="w-full py-4 bg-gradient-to-r from-blue-600 to-pink-600 text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:shadow-[0_15px_30px_rgba(37,99,235,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-50">
                        <span v-if="!isLoading">Register Now</span>
                        <div v-else class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    </button>
                </form>

                <div class="flex items-center my-8 gap-4">
                    <div class="h-[1px] flex-1 bg-white/10"></div>
                    <span class="text-[10px] font-black text-gray-600 uppercase tracking-widest text-center px-2">Express Join</span>
                    <div class="h-[1px] flex-1 bg-white/10"></div>
                </div>

                <button @click="signUpWithGoogle" :disabled="isGoogleLoading" class="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-3">
                    <svg class="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google Signup
                </button>
            </div>

            <div class="mt-8 text-center">
                <p class="text-xs font-bold text-gray-500 uppercase tracking-widest inline-block">
                    Already part of us? 
                </p>
                <router-link :to="{ name: 'login' }" class="text-white font-black uppercase tracking-widest text-xs hover:text-blue-400 transition-colors ml-2 underline underline-offset-4">Sign In</router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@stores/auth";
import api from '@/utils/api';
import { useToast } from '@/utils/useToast';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const form = ref({ email: "", password: "", confirmPassword: "", agreeToTerms: false });
const errors = ref({ email: "", password: "", confirmPassword: "" });
const isLoading = ref(false);
const isGoogleLoading = ref(false);

const signUpWithGoogle = async () => {
    isGoogleLoading.value = true;
    try {
        const { data } = await api.get('/api/auth/google/redirect');
        window.location.href = data.authUrl;
    } catch (error) {
        isGoogleLoading.value = false;
        toast.error("Failed to connect to Google. Please try again.");
    }
}

const handleSignUp = async () => {
    errors.value = { email: "", password: "", confirmPassword: "" };

    if (!form.value.email) { errors.value.email = "Email is required"; return; }
    if (!form.value.password || form.value.password.length < 8) { errors.value.password = "Password must be at least 8 characters"; return; }
    if (form.value.password !== form.value.confirmPassword) { errors.value.confirmPassword = "Passwords do not match"; return; }
    if (!form.value.agreeToTerms) {
        toast.error("You must agree to the Terms of Service to continue.");
        return;
    }

    isLoading.value = true;
    try {
        const { success, email, message } = await authStore.signup({
            email: form.value.email,
            password: form.value.password,
            password_confirmation: form.value.confirmPassword,
        });

        if (success) {
            authStore.setPendingEmail(email || form.value.email);
            toast.success("Account created successfully!");
            router.push({ name: "verify-notice", query: { email: email || form.value.email } });
        } else {
            toast.error(message || "Sign up failed. Please try again.");
        }
    } catch (err) {
        if (err.details) {
            errors.value.email = err.details?.email;
            errors.value.password = err.details?.password;
            toast.error("Please fix the errors in the form.");
        } else {
            toast.error(err.message || "Sign up failed due to an unexpected error.");
        }
    } finally {
        isLoading.value = false;
    }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');

.animate-in {
    animation: fadeInScale 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeInScale {
    from { opacity: 0; transform: scale(0.95) translateY(20px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
}
</style>