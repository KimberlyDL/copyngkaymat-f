<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-platinum-50 dark:bg-abyss-950 relative overflow-hidden p-4">

    <div class="w-full max-w-[500px] relative z-10 animate-in">
      <div class="card border-2 border-slate-200 dark:border-abyss-500 p-8 sm:p-10 rounded-3xl">

        <!-- Title -->
        <div class="text-center mb-8">
          <h1 class="form-title">
            Create <span class="brand-gradient-text">Account</span>
          </h1>
          <p class="form-subtitle mt-2">Join ProtectEd and start your learning journey.</p>
          <div class="h-1 w-20 mt-4 rounded-full bg-gradient-to-r from-calm-lavender-500 to-neon-pink-500 mx-auto"></div>
        </div>

        <form @submit.prevent="handleSignUp" class="space-y-5">

          <!-- Email -->
          <div class="space-y-1.5">
            <label class="field-label">Email Address <span class="text-red-400">*</span></label>
            <input
              v-model.trim="form.email"
              type="email"
              required
              placeholder="you@example.com"
              class="input-field"
              :class="errors.email ? 'input-field-error' : ''"
            />
            <p v-if="errors.email" class="field-subtext-error">{{ errors.email }}</p>
          </div>

          <!-- Password row -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="field-label">Password <span class="text-red-400">*</span></label>
              <input
                v-model="form.password"
                type="password"
                required
                placeholder="••••••••"
                class="input-field"
                :class="errors.password ? 'input-field-error' : ''"
              />
            </div>
            <div class="space-y-1.5">
              <label class="field-label">Confirm <span class="text-red-400">*</span></label>
              <input
                v-model="form.confirmPassword"
                type="password"
                required
                placeholder="••••••••"
                class="input-field"
                :class="errors.confirmPassword ? 'input-field-error' : ''"
              />
            </div>
          </div>
          <p v-if="errors.password || errors.confirmPassword" class="field-subtext-error">
            {{ errors.password || errors.confirmPassword }}
          </p>

          <!-- Terms -->
          <div class="flex items-center gap-3 px-1 py-1">
            <input
              id="terms"
              type="checkbox"
              v-model="form.agreeToTerms"
              class="w-4 h-4 rounded border-slate-300 dark:border-abyss-400 text-calm-lavender-600 focus:ring-calm-lavender-400/40 cursor-pointer"
            />
            <label for="terms" class="font-mplusrounded text-sm text-slate-500 dark:text-platinum-400 cursor-pointer">
              I accept the
              <span class="link-lavender cursor-pointer">Terms</span> and
              <span class="link-pink cursor-pointer">Privacy Policy</span>
            </label>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="isLoading"
            class="btn-primary btn-3d w-full justify-center py-3.5 disabled:opacity-50"
          >
            <span v-if="!isLoading" class="main-button-text">Create Account</span>
            <div v-else class="flex items-center gap-2">
              <div class="spinner !w-4 !h-4 !border-2 !border-white/30 !border-t-white"></div>
              <span class="main-button-text">Setting up…</span>
            </div>
          </button>
        </form>

        <!-- Divider -->
        <div class="flex items-center my-8 gap-4">
          <div class="h-px flex-1 bg-slate-200 dark:bg-abyss-500"></div>
          <span class="divider-label">Or sign up with</span>
          <div class="h-px flex-1 bg-slate-200 dark:bg-abyss-500"></div>
        </div>

        <!-- Google -->
        <button
          @click="signUpWithGoogle"
          :disabled="isGoogleLoading"
          class="button-gray-pink-hover"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <span class="font-dosis font-semibold text-sm">Continue with Google</span>
        </button>

      </div>

      <!-- Sign in link -->
      <p class="mt-6 text-center font-mplusrounded text-sm text-platinum-500 dark:text-platinum-400">
        Already have an account?
        <router-link :to="{ name: 'login' }" class="link-lavender font-bold ml-1">Sign In</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@stores/auth';
import api from '@/utils/api';
import { useToast } from '@/utils/useToast';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const form = ref({ email: '', password: '', confirmPassword: '', agreeToTerms: false });
const errors = ref({ email: '', password: '', confirmPassword: '' });
const isLoading = ref(false);
const isGoogleLoading = ref(false);

const signUpWithGoogle = async () => {
  isGoogleLoading.value = true;
  try {
    const { data } = await api.get('/api/auth/google/redirect');
    window.location.href = data.authUrl;
  } catch (error) {
    isGoogleLoading.value = false;
    toast.error('Failed to connect to Google. Please try again.');
  }
};

const handleSignUp = async () => {
  errors.value = { email: '', password: '', confirmPassword: '' };

  if (!form.value.email) { errors.value.email = 'Email address is required'; return; }
  if (!form.value.password || form.value.password.length < 8) { errors.value.password = 'Minimum 8 characters required'; return; }
  if (form.value.password !== form.value.confirmPassword) { errors.value.confirmPassword = 'Passwords do not match'; return; }
  if (!form.value.agreeToTerms) { toast.error('Please accept the terms to continue.'); return; }

  isLoading.value = true;
  try {
    const { success, email, message } = await authStore.signup({
      email: form.value.email,
      password: form.value.password,
      password_confirmation: form.value.confirmPassword,
    });
    if (success) {
      authStore.pendingEmail = email || form.value.email;
      toast.success('Account created successfully!');
      router.push({ name: 'verify-notice', query: { email: email || form.value.email } });
    } else {
      toast.error(message || 'Sign up failed.');
    }
  } catch (err) {
    if (err.details) {
      errors.value.email = err.details?.email;
      errors.value.password = err.details?.password;
      toast.error('Please review the errors and try again.');
    } else {
      toast.error(err.message || 'An unexpected error occurred.');
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
@reference "@/style.css";

.animate-in {
  animation: slideUpScale 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideUpScale {
  from { opacity: 0; transform: scale(0.97) translateY(24px); }
  to   { opacity: 1; transform: scale(1)    translateY(0); }
}

.btn-3d {
  @apply border-b-4 border-black/10 active:border-b active:translate-y-px;
}
</style>