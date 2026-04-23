<template>
  <AuthShellSvg page-title="Login" :hero-image="hero" :artist="artist">

    <div class="w-full max-w-md mx-auto relative z-10 animate-in">

      <!-- Title block -->
      <div class="mb-10 text-center sm:text-left">
        <h1 class="form-title">
          Welcome <span class="brand-gradient-text">Back</span>
        </h1>
        <p class="form-subtitle mt-2">
          Sign in to access your interactive learning dashboard.
        </p>
        <div class="h-1 w-16 mt-4 rounded-full bg-gradient-to-r from-calm-lavender-500 to-neon-pink-500 mx-auto sm:mx-0"></div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-6">

        <!-- Email -->
        <div class="space-y-1.5">
          <label for="email" class="field-label">Email Address</label>
          <input
            id="email"
            v-model.trim="form.email"
            type="email"
            placeholder="you@example.com"
            required
            class="input-field"
            :class="errors.email ? 'input-field-error' : ''"
          />
          <p v-if="errors.email" class="field-subtext-error">{{ errors.email }}</p>
        </div>

        <!-- Password -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <label for="password" class="field-label">Password</label>
            <router-link :to="{ name: 'forgotPassword' }" class="link-lavender font-dosis text-xs font-semibold">
              Forgot password?
            </router-link>
          </div>
          <input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            required
            class="input-field"
            :class="errors.password ? 'input-field-error' : ''"
          />
          <p v-if="errors.password" class="field-subtext-error">{{ errors.password }}</p>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="isLoading || isGoogleLoading"
          class="btn-primary btn-3d w-full justify-center py-3.5 disabled:opacity-50"
        >
          <span v-if="!isLoading" class="main-button-text">Sign In</span>
          <div v-else class="flex items-center gap-2">
            <div class="spinner !w-4 !h-4 !border-2 !border-white/30 !border-t-white"></div>
            <span class="main-button-text">Initializing…</span>
          </div>
        </button>
      </form>

      <!-- Divider -->
      <div class="relative my-8">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-slate-200 dark:border-abyss-600"></div>
        </div>
        <div class="relative flex justify-center">
          <span class="divider-label bg-white dark:bg-abyss-800">Or continue with</span>
        </div>
      </div>

      <!-- Google -->
      <button
        @click="loginWithGoogle"
        :disabled="isLoading || isGoogleLoading"
        class="button-gray-pink-hover"
      >
        <div v-if="!isGoogleLoading" class="flex items-center gap-3">
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <span class="font-dosis font-semibold text-sm">Continue with Google</span>
        </div>
        <div v-else class="flex items-center gap-2">
          <div class="spinner !w-4 !h-4"></div>
          <span class="font-dosis font-semibold text-sm">Connecting…</span>
        </div>
      </button>

      <!-- Sign up link -->
      <p class="mt-10 text-center font-mplusrounded text-sm text-platinum-500 dark:text-platinum-400">
        First time here?
        <router-link :to="{ name: 'signup' }" class="link-pink font-bold ml-1">
          Create an account
        </router-link>
      </p>
    </div>

  </AuthShellSvg>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@stores/auth';
import AuthShellSvg from '@components/ui/auth_design.vue';
import api from '@/utils/api';
import { useToast } from '@/utils/useToast';

const hero = '/illustrations_1.jpg';
const artist = 'Charlie Davis';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const toast = useToast();

const form = ref({ email: '', password: '' });
const errors = ref({ email: '', password: '' });
const isLoading = ref(false);
const isGoogleLoading = ref(false);

const loginWithGoogle = async () => {
  isGoogleLoading.value = true;
  try {
    const { data } = await api.get('/api/auth/google/redirect');
    window.location.href = data.authUrl;
  } catch (error) {
    isGoogleLoading.value = false;
    toast.error('Failed to connect to Google. Please try again.');
  }
};

const handleLogin = async () => {
  errors.value = { email: '', password: '' };

  if (!form.value.email) { errors.value.email = 'Email address is required'; return; }
  if (!form.value.password) { errors.value.password = 'Password is required'; return; }

  isLoading.value = true;
  try {
    await authStore.login({ email: form.value.email, password: form.value.password });
    toast.success('Welcome back!');
    router.push(route.query.redirect || { name: 'user.dashboard' });
  } catch (error) {
    const unverified = error?.unverified;
    if (unverified) {
      const email = form.value.email;
      authStore.pendingEmail = email;
      toast.info('Please verify your email address.');
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
@reference "@/style.css";

.animate-in {
  animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideUpFade {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.btn-3d {
  @apply border-b-4 border-black/10 active:border-b active:translate-y-px;
}
</style>