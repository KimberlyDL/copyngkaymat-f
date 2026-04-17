<template>
  <section id="modes" class="bg-platinum-50 dark:bg-abyss-900 py-20 px-6 border-y-2 border-slate-100 dark:border-abyss-700">
    <div class="max-w-6xl mx-auto">

      <div class="text-center mb-12">
        <p class="font-dosis font-700 text-xs uppercase tracking-[0.25em] text-calm-lavender-600 dark:text-calm-lavender-400 mb-3">Game Modes</p>
        <h2 class="font-madimione text-3xl md:text-5xl text-slate-900 dark:text-white tracking-tight">
          Choose Your Challenge
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div class="bg-neon-pink-50 dark:bg-abyss-600 border-2 border-neon-pink-200 dark:border-abyss-500 border-b-[8px] rounded-3xl p-6 hover:-translate-y-1 transition-transform cursor-pointer flex flex-col">
          <span class="bg-neon-pink-500 text-white font-dosis font-700 text-xs uppercase tracking-widest px-3 py-1.5 rounded-xl w-fit mb-4 border-2 border-neon-pink-700 border-b-[4px]">25s Timer</span>
          <h3 class="font-madimione text-2xl text-neon-pink-600 dark:text-neon-pink-400 mb-2">Time Attack</h3>
          <p class="font-mplusrounded text-slate-600 dark:text-platinum-300 font-medium leading-relaxed">
            Think fast! Answer correctly before the clock runs out.
          </p>
        </div>

        <div class="bg-vawc-orange-50 dark:bg-abyss-600 border-2 border-vawc-orange-200 dark:border-abyss-500 border-b-[8px] rounded-3xl p-6 hover:-translate-y-1 transition-transform cursor-pointer flex flex-col">
          <span class="bg-vawc-orange-500 text-white font-dosis font-700 text-xs uppercase tracking-widest px-3 py-1.5 rounded-xl w-fit mb-4 border-2 border-vawc-orange-700 border-b-[4px]">High Stakes</span>
          <h3 class="font-madimione text-2xl text-vawc-orange-600 dark:text-vawc-orange-400 mb-2">Boss Battle</h3>
          <p class="font-mplusrounded text-slate-600 dark:text-platinum-300 font-medium leading-relaxed">
            Face off against 'The Shadow Warden' by mastering core concepts.
          </p>
        </div>

        <div class="bg-safety-teal-50 dark:bg-abyss-600 border-2 border-safety-teal-200 dark:border-abyss-500 border-b-[8px] rounded-3xl p-6 hover:-translate-y-1 transition-transform cursor-pointer flex flex-col">
          <span class="bg-safety-teal-500 text-white font-dosis font-700 text-xs uppercase tracking-widest px-3 py-1.5 rounded-xl w-fit mb-4 border-2 border-safety-teal-700 border-b-[4px]">Point Multipliers</span>
          <h3 class="font-madimione text-2xl text-safety-teal-600 dark:text-safety-teal-400 mb-2">Momentum Chain</h3>
          <p class="font-mplusrounded text-slate-600 dark:text-platinum-300 font-medium leading-relaxed">
            Keep your streak alive to multiply your points!
          </p>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import FeatureCard from './FeatureCard.vue'

const backgroundOrbs = ref([
  { size: 500, left: -10, top:  10, delay: 0, opacity: 0.6, blur: 0  },
  { size: 400, left:  85, top:  60, delay: 2, opacity: 0.5, blur: 0  },
  { size: 250, left:  70, top:  -5, delay: 4, opacity: 0.4, blur: 10 },
  { size: 160, left:   5, top:  80, delay: 1, opacity: 0.6, blur: 0  },
  { size: 300, left:  45, top:  85, delay: 3, opacity: 0.2, blur: 30 },
  { size: 140, left:  90, top:   5, delay: 2, opacity: 0.3, blur: 2  },
  { size: 120, left:  30, top:  15, delay: 5, opacity: 0.2, blur: 5  },
  { size: 200, left:  -5, top:  50, delay: 6, opacity: 0.1, blur: 40 },
])
</script>