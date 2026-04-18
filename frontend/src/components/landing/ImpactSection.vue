<template>
  <section id="dashboard" class="bg-white dark:bg-abyss-900 py-20 px-6 border-t-2 border-slate-100 dark:border-abyss-700">
    <div class="max-w-6xl mx-auto space-y-16">

      <div class="grid lg:grid-cols-2 gap-10 items-center">

        <!-- Left column -->
        <div class="space-y-6">
          <div>
            <p class="font-dosis font-700 text-xs uppercase tracking-[0.25em] text-calm-lavender-600 dark:text-calm-lavender-400 mb-2">Your Progress</p>
            <h2 class="font-madimione text-3xl md:text-5xl text-slate-900 dark:text-white tracking-tight">Your Advocacy Hub</h2>
          </div>

          <!-- Daily Fact card — GAD/VAWC body content uses font-mplusrounded + leading-relaxed -->
          <div class="bg-calm-lavender-600 dark:bg-calm-lavender-700 text-white border-2 border-calm-lavender-800 border-b-[6px] p-6 rounded-3xl relative">
            <div class="absolute -top-3 -left-3 bg-neon-pink-500 border-2 border-white rounded-full p-2 text-xl">💡</div>
            <p class="font-mplusrounded text-base font-medium leading-relaxed ml-4">
              "Consent is a clear, voluntary, and enthusiastic agreement... It can be withdrawn at any time."
            </p>
            <p class="font-dosis font-700 text-xs uppercase tracking-[0.2em] mt-4 opacity-80 ml-4">Daily Fact</p>
          </div>

          <!-- Stat pills -->
          <div class="flex gap-4">
            <div class="flex-1 card border-2 border-slate-200 dark:border-abyss-500 border-b-[6px] p-4 rounded-2xl text-center">
              <span class="block font-madimione text-3xl text-calm-lavender-600 dark:text-calm-lavender-400">Lvl 5</span>
              <span class="font-dosis font-700 text-xs uppercase tracking-widest text-slate-400 dark:text-platinum-500 mt-1 block">Progress</span>
            </div>
            <div class="flex-1 card border-2 border-slate-200 dark:border-abyss-500 border-b-[6px] p-4 rounded-2xl text-center">
              <span class="block font-madimione text-3xl text-vawc-orange-500">12</span>
              <span class="font-dosis font-700 text-xs uppercase tracking-widest text-slate-400 dark:text-platinum-500 mt-1 block">Badges</span>
            </div>
          </div>
        </div>

        <!-- Right column — Leaderboard -->
        <div class="container-bg border-2 border-slate-200 dark:border-abyss-500 border-b-[8px] rounded-3xl p-6 md:p-8">
          <div class="flex justify-between items-end mb-6">
            <h3 class="font-madimione text-2xl text-slate-800 dark:text-white tracking-wide">Global Rank</h3>
            <span class="font-madimione text-3xl text-calm-lavender-500">#42</span>
          </div>

          <div class="space-y-3">
            <div class="flex justify-between card border-2 border-calm-lavender-300 dark:border-calm-lavender-700/60 border-b-[4px] p-4 rounded-2xl">
              <span class="font-dosis font-semibold text-slate-800 dark:text-white">1. Jordan_CCS</span>
              <span class="font-dosis font-bold text-calm-lavender-600 dark:text-calm-lavender-400">12,450 XP</span>
            </div>
            <div class="flex justify-between bg-slate-50 dark:bg-abyss-600 border-2 border-slate-200 dark:border-abyss-500 border-b-[4px] p-4 rounded-2xl">
              <span class="font-dosis font-semibold text-slate-500 dark:text-platinum-400">2. Advocate_Aron</span>
              <span class="font-dosis font-semibold text-slate-400 dark:text-platinum-500">11,200 XP</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Lumina CTA banner -->
      <div class="bg-safety-teal-500 dark:bg-safety-teal-600 border-2 border-safety-teal-700 border-b-[8px] rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-white relative overflow-hidden">
        <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-white opacity-[0.08] rounded-full pointer-events-none"></div>
        <div class="absolute right-24 top-6 w-16 h-16 bg-white opacity-[0.05] rounded-full pointer-events-none"></div>

        <div class="max-w-xl relative z-10">
          <h2 class="font-madimione text-3xl md:text-5xl mb-4 tracking-tight">Have a question? <br/> Ask Lumina!</h2>
          <p class="font-mplusrounded text-base md:text-lg font-medium leading-relaxed opacity-95">
            Your private AI companion for GAD, VAWC, and Sex Ed questions. Secure, encrypted, and always online to help you understand your rights.
          </p>
        </div>

        <button
          @click="chatbotRef?.openChat()"
          class="shrink-0 bg-white border-2 border-slate-200 border-b-[6px] active:border-b-[2px] active:translate-y-[4px] text-safety-teal-600 font-madimione text-xl uppercase tracking-wider px-8 py-4 rounded-2xl transition-all relative z-10 hover:-translate-y-0.5">
          Chat Now
        </button>
      </div>

    </div>
  </section>

  <!-- Lumina chatbot mounted here so openChat() is accessible via ref -->
  <AIChatbot ref="chatbotRef" />
</template>

<script setup>
import { ref } from 'vue';
import AIChatbot from '@/components/ui/AIChatbot.vue';

const chatbotRef = ref(null);

const backgroundOrbs = ref([
  { size: 500, left: -10, top:  10, delay: 0, opacity: 0.6, blur: 0  },
  { size: 350, left:  85, top:  40, delay: 2, opacity: 0.5, blur: 0  },
  { size: 220, left:  70, top:  -5, delay: 4, opacity: 0.4, blur: 10 },
  { size: 160, left:  10, top:  75, delay: 1, opacity: 0.6, blur: 0  },
  { size: 280, left:  45, top:  85, delay: 3, opacity: 0.2, blur: 30 },
  { size: 140, left:  90, top:   5, delay: 2, opacity: 0.3, blur: 2  },
  { size: 120, left:  30, top:  15, delay: 5, opacity: 0.2, blur: 5  },
]);
</script>