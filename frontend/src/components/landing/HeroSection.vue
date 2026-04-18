<template>
  <section id="home"
    class="relative min-h-[85vh] w-full flex flex-col items-center justify-center bg-platinum-50 dark:bg-abyss-950 px-6 pt-28 pb-16 overflow-hidden">

    <!-- ══════════════════════════════════════════════════ -->
    <!-- Organic background art (Quizizz-inspired)         -->
    <!-- ══════════════════════════════════════════════════ -->
    <div class="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">

      <!-- Soft ambient blobs -->
      <div
        class="absolute top-0 right-0 w-[480px] h-[480px] -translate-y-1/3 translate-x-1/4 rounded-full bg-calm-lavender-200 dark:bg-calm-lavender-900/30 opacity-40 dark:opacity-25"
        style="filter: blur(80px);"></div>
      <div
        class="absolute bottom-0 left-0 w-[360px] h-[360px] translate-y-1/4 -translate-x-1/4 rounded-full bg-neon-pink-200 dark:bg-neon-pink-900/30 opacity-30 dark:opacity-20"
        style="filter: blur(70px);"></div>
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-safety-teal-100 dark:bg-safety-teal-900/20 opacity-20 dark:opacity-10"
        style="filter: blur(90px);"></div>

      <!-- SVG organic flowing lines + accent shapes -->
      <svg class="absolute inset-0 w-full h-full" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg">
        <!-- Flowing organic curves (lavender) -->
        <path d="M -80 180 C 120 80, 320 260, 520 160 S 820 40, 1000 200 S 1200 300, 1380 180" stroke="#a855f7"
          stroke-width="2.5" fill="none" opacity="0.13" stroke-linecap="round" />
        <path d="M -80 240 C 150 140, 380 320, 600 220 S 900 80, 1100 260 S 1300 360, 1500 220" stroke="#a855f7"
          stroke-width="1.5" fill="none" opacity="0.08" stroke-linecap="round" />

        <!-- Flowing organic curves (pink) -->
        <path d="M -60 480 C 160 380, 360 520, 600 420 S 900 280, 1100 440 S 1300 520, 1480 400" stroke="#ec4899"
          stroke-width="2.5" fill="none" opacity="0.11" stroke-linecap="round" />
        <path d="M -60 540 C 200 440, 440 580, 680 480 S 960 340, 1160 500 S 1360 580, 1540 460" stroke="#ec4899"
          stroke-width="1.5" fill="none" opacity="0.07" stroke-linecap="round" />

        <!-- Subtle teal accent curve (bottom) -->
        <path d="M 200 660 C 400 580, 620 700, 840 620 S 1060 520, 1200 620" stroke="#14b8a6" stroke-width="2"
          fill="none" opacity="0.1" stroke-linecap="round" />

        <!-- Dashed ring accents (top-right) -->
        <circle cx="1080" cy="100" r="80" stroke="#a855f7" stroke-width="1.5" fill="none" stroke-dasharray="6 10"
          opacity="0.15" />
        <circle cx="1100" cy="90" r="50" stroke="#ec4899" stroke-width="1" fill="none" stroke-dasharray="4 8"
          opacity="0.12" />

        <!-- Dashed ring accents (bottom-left) -->
        <circle cx="100" cy="580" r="70" stroke="#ec4899" stroke-width="1.5" fill="none" stroke-dasharray="5 9"
          opacity="0.13" />
        <circle cx="90" cy="570" r="42" stroke="#a855f7" stroke-width="1" fill="none" stroke-dasharray="3 7"
          opacity="0.1" />

        <!-- Scattered small filled dots -->
        <circle cx="180" cy="140" r="4.5" fill="#a855f7" opacity="0.25" />
        <circle cx="240" cy="95" r="3" fill="#ec4899" opacity="0.2" />
        <circle cx="970" cy="520" r="5" fill="#ec4899" opacity="0.22" />
        <circle cx="1030" cy="470" r="3" fill="#a855f7" opacity="0.18" />
        <circle cx="80" cy="320" r="4" fill="#14b8a6" opacity="0.2" />
        <circle cx="1140" cy="330" r="3.5" fill="#14b8a6" opacity="0.18" />
        <circle cx="620" cy="640" r="4" fill="#a855f7" opacity="0.15" />
        <circle cx="340" cy="600" r="3" fill="#ec4899" opacity="0.15" />

        <!-- Small hollow diamond shapes -->
        <rect x="158" y="455" width="8" height="8" fill="none" stroke="#a855f7" stroke-width="1.5" opacity="0.2"
          transform="rotate(45 162 459)" />
        <rect x="1046" y="196" width="8" height="8" fill="none" stroke="#ec4899" stroke-width="1.5" opacity="0.18"
          transform="rotate(45 1050 200)" />
        <rect x="500" y="50" width="6" height="6" fill="none" stroke="#14b8a6" stroke-width="1.5" opacity="0.18"
          transform="rotate(45 503 53)" />
      </svg>
    </div>

    <!-- ══════════════════════════════════════════════════ -->
    <!-- Main content                                      -->
    <!-- ══════════════════════════════════════════════════ -->
    <div class="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center text-center">

      <h1 class="font-madimione text-4xl md:text-6xl text-slate-900 dark:text-white leading-tight mb-8 tracking-tight">
        Ready to Level Up <br />
        <span class="text-calm-lavender-600 dark:text-calm-lavender-400">Your Knowledge?</span>
      </h1>

      <form @submit.prevent="handleJoinClass"
        class="w-full bg-white dark:bg-abyss-700 border-2 border-slate-200 dark:border-abyss-600 border-b-[8px] rounded-3xl p-6 md:p-8 flex flex-col gap-5">
        <input v-model="classCode" type="text" placeholder="Enter Class Code" required
          class="w-full text-center font-madimione text-2xl md:text-3xl tracking-widest uppercase p-5 border-2 border-slate-200 dark:border-abyss-500 rounded-2xl bg-transparent focus:outline-none focus:border-calm-lavender-500 dark:text-white transition-colors" />

        <button type="submit" :disabled="isJoining"
          class="w-full py-5 rounded-2xl bg-calm-lavender-500 border-2 border-calm-lavender-700 border-b-[6px] hover:bg-calm-lavender-400 active:border-b-[2px] active:translate-y-[4px] text-white font-madimione text-2xl uppercase tracking-wider transition-all disabled:opacity-70 flex justify-center items-center gap-2">
          <span v-if="isJoining" class="animate-spin text-2xl">⏳</span>
          {{ isJoining ? 'Joining...' : 'Join Game' }}
        </button>

        <div
          class="mt-1 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 font-averta text-sm font-medium text-slate-500 dark:text-platinum-500">
          <template v-if="!authStore.isAuthenticated">
            <router-link :to="{ name: 'signup' }" class="hover:text-neon-pink-500 transition-colors">
              New here? <span class="font-semibold">Sign Up</span>
            </router-link>
            <span class="hidden sm:block opacity-30">•</span>
            <router-link :to="{ name: 'login' }" class="hover:text-calm-lavender-500 transition-colors">
              Already an advocate? <span class="font-semibold">Log In</span>
            </router-link>
          </template>
          <template v-else>
            <p class="text-safety-teal-500 font-semibold">You are logged in as {{ authStore.user?.name }}</p>
          </template>
        </div>
      </form>

    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useClassroomStore } from '@/stores/classroom';
import { useToast } from '@/utils/useToast';

const authStore = useAuthStore();
const classroomStore = useClassroomStore();
const router = useRouter();
const toast = useToast();

const classCode = ref('');
const isJoining = ref(false);

const handleJoinClass = async () => {
  if (!classCode.value) return;

  if (!authStore.isAuthenticated) {
    toast.info("Please log in to join the class.");
    router.push({ name: 'login', query: { join_code: classCode.value.toUpperCase() } });
    return;
  }

  try {
    isJoining.value = true;
    await classroomStore.joinClassroom({ join_code: classCode.value });
    toast.success("Successfully joined the classroom!");
    router.push({ name: 'classrooms.index' });
  } catch (error) {
    toast.error(classroomStore.error || "Invalid class code.");
  } finally {
    isJoining.value = false;
  }
};
</script>