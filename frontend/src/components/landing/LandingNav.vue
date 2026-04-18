<template>
  <nav class="fixed top-5 left-0 right-0 z-[100] flex justify-center px-4">
    <div
      class="w-full max-w-5xl bg-white/95 dark:bg-abyss-800/95 backdrop-blur-md border-2 border-slate-200 dark:border-abyss-600 border-b-[4px] rounded-2xl px-5 py-2.5 transition-all duration-300">
      <div class="flex items-center justify-between w-full gap-4">

        <!-- Logo + App name -->
        <router-link :to="{ name: 'home' }" class="flex items-center gap-2.5 group flex-shrink-0">
          <img src="@/assets/LogongPrototeced.svg" alt="ProtectEd"
            class="h-9 w-auto transition-transform duration-300 group-hover:-translate-y-0.5" />
          <!-- App name shown on md+ screens -->
          <span
            class="hidden md:block font-madimione text-xl text-slate-900 dark:text-white leading-none tracking-tight">
            Protect<span class="text-calm-lavender-500">Ed</span>
          </span>
        </router-link>

        <!-- Nav Links — MPLUSRounded for the friendly rounded UI feel -->
        <div class="hidden md:flex items-center gap-8">
          <a href="#home"
            class="font-averta text-base font-sm text-slate-500 dark:text-platinum-400 hover:text-calm-lavender-600 dark:hover:text-calm-lavender-400 transition-colors">
            Home
          </a>
          <a href="#modes"
            class="font-averta text-base font-sm text-slate-500 dark:text-platinum-400 hover:text-calm-lavender-600 dark:hover:text-calm-lavender-400 transition-colors">
            Games
          </a>
          <a href="#modules"
            class="font-averta text-base font-sm text-slate-500 dark:text-platinum-400 hover:text-calm-lavender-600 dark:hover:text-calm-lavender-400 transition-colors">
            Learn
          </a>
        </div>

        <!-- Auth actions -->
        <div class="flex items-center gap-2 flex-shrink-0">

          <template v-if="!isAuthenticated">
            <router-link :to="{ name: 'facilitator.login' }"
              class="hidden md:block font-averta text-sm text-slate-400 dark:text-platinum-500 hover:text-safety-teal-500 px-3 py-1.5 transition-colors">
              Educator
            </router-link>
            <router-link :to="{ name: 'login' }"
              class="font-averta text-sm font-medium text-slate-600 dark:text-platinum-300 hover:text-calm-lavender-600 px-3 py-1.5 transition-colors">
              Log In
            </router-link>
            <router-link :to="{ name: 'signup' }"
              class="bg-neon-pink-500 text-white font-mplusrounded text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl border-2 border-neon-pink-700 border-b-[4px] hover:bg-neon-pink-400 active:border-b-[2px] active:translate-y-[2px] transition-all">
              Sign Up
            </router-link>
          </template>

          <template v-else>
            <router-link :to="dashboardRoute"
              class="flex items-center gap-2.5 bg-calm-lavender-50 dark:bg-calm-lavender-900/30 px-3 py-1.5 rounded-xl border-2 border-calm-lavender-200 dark:border-calm-lavender-700/50 hover:bg-calm-lavender-100 transition-colors">
              <img v-if="profileStore.avatarUrl()" :src="profileStore.avatarUrl(40)"
                class="w-7 h-7 rounded-full border-2 border-calm-lavender-500" alt="Avatar">
              <div v-else
                class="w-7 h-7 rounded-full bg-calm-lavender-500 flex items-center justify-center text-white font-bold text-xs">
                {{ authStore.user?.name?.charAt(0) || 'U' }}
              </div>
              <span
                class="font-averta text-sm font-semibold text-calm-lavender-600 dark:text-calm-lavender-400">Dashboard</span>
            </router-link>
          </template>

        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import { useProfileStore } from '@/stores/profile';

const authStore = useAuthStore();
const profileStore = useProfileStore();
const { isAuthenticated, user } = storeToRefs(authStore);

const dashboardRoute = computed(() => {
  if (!user.value) return { name: 'login' };
  const role = user.value.role;
  if (role === 'admin') return { name: 'admin.dashboard' };
  if (['educator', 'moderator'].includes(role)) return { name: 'facilitator.dashboard' };
  return { name: 'user.dashboard' };
});
</script>