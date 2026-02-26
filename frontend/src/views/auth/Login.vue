<template>
    <AuthShellSvg page-title="Login" :hero-image="hero" :artist="artist">
        <div class="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-pink-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div class="w-full max-w-md mx-auto relative z-10 font-['Poppins'] animate-in fade-in duration-700">
            <div class="mb-8 text-center sm:text-left">
                <h1 class="text-4xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tighter">
                    Welcome <span class="bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">Back</span>
                </h1>
                <p class="text-gray-500 dark:text-gray-400 font-medium">
                    Sign in to access your interactive learning dashboard.
                </p>
            </div>

            <div class="bg-transparent">
                <form @submit.prevent="handleLogin" class="space-y-6">

                    <div class="space-y-2">
                        <label for="email" class="block text-xs font-black uppercase tracking-widest text-gray-400">
                            Email Address
                        </label>
                        <input id="email" v-model.trim="form.email" type="email" placeholder="you@example.com" required
                            class="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-white/5 
                                   bg-white dark:bg-[#0d0d12] text-gray-900 dark:text-white
                                   placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
                                   transition-all duration-300 shadow-sm"
                            :class="{ 'border-red-500 focus:ring-red-500/50 focus:border-red-500': errors.email }" />
                        <p v-if="errors.email" class="text-xs text-red-500 mt-1 font-bold">{{ errors.email }}</p>
                    </div>

                    <div class="space-y-2">
                        <div class="flex items-center justify-between">
                            <label for="password" class="block text-xs font-black uppercase tracking-widest text-gray-400">
                                Password
                            </label>
                            <router-link :to="{ name: 'forgotPassword' }"
                                class="text-xs font-black text-blue-600 dark:text-blue-400 hover:text-pink-500 uppercase tracking-tighter transition-colors">
                                Forgot password?
                            </router-link>
                        </div>
                        <input id="password" v-model="form.password" type="password" placeholder="••••••••" required
                            class="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-white/5 
                                   bg-white dark:bg-[#0d0d12] text-gray-900 dark:text-white
                                   placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
                                   transition-all duration-300 shadow-sm"
                            :class="{ 'border-red-500 focus:ring-red-500/50 focus:border-red-500': errors.password }" />
                        <p v-if="errors.password" class="text-xs text-red-500 mt-1 font-bold">{{ errors.password }}</p>
                    </div>

                    <button type="submit" :disabled="isLoading || isGoogleLoading"
                        class="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-pink-600 text-white font-black uppercase tracking-[0.2em] rounded-2xl 
                               hover:shadow-[0_15px_30px_rgba(37,99,235,0.3)] disabled:opacity-50 disabled:cursor-not-allowed
                               transition-all duration-500 transform active:scale-95 flex items-center justify-center gap-2">
                        <span v-if="!isLoading">Sign In</span>
                        <span v-else class="flex items-center gap-2">
                            <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Processing...
                        </span>
                    </button>
                </form>

                <div class="relative my-8">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-gray-100 dark:border-white/5"></div>
                    </div>
                    <div class="relative flex justify-center">
                        <span class="bg-white dark:bg-[#060606] px-4 text-[10px] text-gray-400 uppercase tracking-[0.3em] font-black">
                            Or Connect With
                        </span>
                    </div>
                </div>

                <button @click="loginWithGoogle" :disabled="isLoading || isGoogleLoading" 
                    class="w-full py-4 px-6 rounded-2xl border border-gray-200 dark:border-white/5
                           bg-white dark:bg-[#0d0d12] hover:border-blue-500/30 text-gray-700 dark:text-gray-300 font-black uppercase tracking-widest text-xs
                           transition-all duration-300 flex items-center justify-center gap-3
                           disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md">
                    <div v-if="!isGoogleLoading" class="flex items-center gap-3">
                        <svg class="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        <span>Google Account</span>
                    </div>
                    <div v-else class="flex items-center gap-2">
                        <svg class="w-5 h-5 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Syncing...</span>
                    </div>
                </button>
            </div>

            <p class="mt-10 text-center text-sm text-gray-500 font-medium">
                Don’t have an account?
                <router-link :to="{ name: 'signup' }"
                    class="text-pink-600 font-black uppercase tracking-tighter hover:text-blue-600 transition-all ml-1">
                    Create an account
                </router-link>
            </p>
        </div>
    </AuthShellSvg>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@stores/auth";
import AuthShellSvg from "@components/ui/auth_design.vue";
import api from '@/utils/api';
import { useToast } from '@/utils/useToast';

// Background Asset
const hero = "/illustrations_1.jpg";
const artist = "Charlie Davis";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const toast = useToast();

const form = ref({ email: "", password: "" });
const errors = ref({ email: "", password: "" });
const isLoading = ref(false);
const isGoogleLoading = ref(false);

const loginWithGoogle = async () => {
    isGoogleLoading.value = true;
    try {
        const { data } = await api.get('/api/auth/google/redirect');
        window.location.href = data.authUrl;
    } catch (error) {
        isGoogleLoading.value = false;
        toast.error("Failed to connect to Google. Please try again.");
    }
}

const handleLogin = async () => {
    errors.value = { email: "", password: "" };

    if (!form.value.email) {
        errors.value.email = "Email is required";
        return;
    }
    if (!form.value.password) {
        errors.value.password = "Password is required";
        return;
    }

    isLoading.value = true;

    try {
        await authStore.login({
            email: form.value.email,
            password: form.value.password,
        })

        toast.success("Welcome back!");
        router.push(route.query.redirect || { name: 'user.dashboard' });

    } catch (error) {
        const unverified = error?.unverified;

        if (unverified) {
            const email = form.value.email;
            authStore.setPendingEmail(email);
            toast.info("Please verify your email address.");
            router.push({ name: 'verify-notice', query: { email } });
            return;
        }

        const msg = error?.response?.data?.message || error?.message || 'Login failed. Please try again.';
        toast.error(msg);
    } finally {
        isLoading.value = false;
    }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

/* Smooth Entrance */
.animate-in {
    animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Button & Input Shadow Refinements */
button, input {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>