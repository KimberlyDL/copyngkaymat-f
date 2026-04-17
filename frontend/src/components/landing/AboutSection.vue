<template>
  <section id="modules" class="bg-platinum-100 dark:bg-abyss-950 py-20 px-6 border-y-2 border-slate-100 dark:border-abyss-700">
    <div class="max-w-6xl mx-auto">

      <div class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p class="font-dosis font-700 text-xs uppercase tracking-[0.25em] text-calm-lavender-600 dark:text-calm-lavender-400 mb-2">Learning Modules</p>
          <h2 class="font-madimione text-3xl md:text-4xl text-slate-900 dark:text-white tracking-tight">
            Featured Learning
          </h2>
        </div>
        <router-link
          :to="{ name: 'user.modules' }"
          class="bg-white dark:bg-abyss-600 border-2 border-slate-200 dark:border-abyss-500 border-b-[4px] px-5 py-2.5 rounded-xl font-dosis font-700 text-sm uppercase tracking-widest text-slate-600 dark:text-platinum-200 hover:-translate-y-0.5 active:border-b-[2px] active:translate-y-[2px] transition-all w-fit"
        >
          View All Topics
        </router-link>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <div class="card border-b-[6px] border-slate-200 dark:border-abyss-500 p-6 rounded-2xl hover:border-calm-lavender-400 dark:hover:border-calm-lavender-600 hover:-translate-y-1 transition-all cursor-pointer group">
          <div class="w-10 h-10 rounded-xl bg-calm-lavender-100 dark:bg-calm-lavender-900/30 flex items-center justify-center mb-4 text-xl">📘</div>
          <h4 class="font-madimione text-xl text-calm-lavender-600 dark:text-calm-lavender-400 mb-2 group-hover:text-calm-lavender-500 transition-colors">GAD Awareness</h4>
          <p class="font-mplusrounded text-sm font-medium text-slate-500 dark:text-platinum-400 leading-relaxed">Understanding Gender and Development (GAD) basics.</p>
        </div>

        <div class="card border-b-[6px] border-slate-200 dark:border-abyss-500 p-6 rounded-2xl hover:border-vawc-orange-400 dark:hover:border-vawc-orange-600 hover:-translate-y-1 transition-all cursor-pointer group">
          <div class="w-10 h-10 rounded-xl bg-vawc-orange-100 dark:bg-vawc-orange-900/30 flex items-center justify-center mb-4 text-xl">⚖️</div>
          <h4 class="font-madimione text-xl text-vawc-orange-600 dark:text-vawc-orange-400 mb-2 group-hover:text-vawc-orange-500 transition-colors">Legal Rights</h4>
          <p class="font-mplusrounded text-sm font-medium text-slate-500 dark:text-platinum-400 leading-relaxed">VAWC: Know Your Rights and legal protections.</p>
        </div>

        <div class="card border-b-[6px] border-slate-200 dark:border-abyss-500 p-6 rounded-2xl hover:border-neon-pink-400 dark:hover:border-neon-pink-600 hover:-translate-y-1 transition-all cursor-pointer group">
          <div class="w-10 h-10 rounded-xl bg-neon-pink-100 dark:bg-neon-pink-900/30 flex items-center justify-center mb-4 text-xl">❤️</div>
          <h4 class="font-madimione text-xl text-neon-pink-600 dark:text-neon-pink-400 mb-2 group-hover:text-neon-pink-500 transition-colors">Sex Ed</h4>
          <p class="font-mplusrounded text-sm font-medium text-slate-500 dark:text-platinum-400 leading-relaxed">Safe Relationships and understanding consent.</p>
        </div>

        <div class="card border-b-[6px] border-slate-200 dark:border-abyss-500 p-6 rounded-2xl hover:border-safety-teal-400 dark:hover:border-safety-teal-600 hover:-translate-y-1 transition-all cursor-pointer group">
          <div class="w-10 h-10 rounded-xl bg-safety-teal-100 dark:bg-safety-teal-900/30 flex items-center justify-center mb-4 text-xl">🤝</div>
          <h4 class="font-madimione text-xl text-safety-teal-600 dark:text-safety-teal-400 mb-2 group-hover:text-safety-teal-500 transition-colors">Support Systems</h4>
          <p class="font-mplusrounded text-sm font-medium text-slate-500 dark:text-platinum-400 leading-relaxed">How to access community services for help.</p>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const backgroundOrbs = ref([
  { size: 450, left: -10, top: -15, delay: 0, opacity: 0.6, blur: 0  },
  { size: 380, left:  80, top:  40, delay: 2, opacity: 0.5, blur: 0  },
  { size: 300, left:  70, top:  75, delay: 4, opacity: 0.4, blur: 15 },
  { size: 180, left:   5, top:  70, delay: 1, opacity: 0.6, blur: 0  },
  { size: 250, left:  40, top:  90, delay: 3, opacity: 0.2, blur: 25 },
  { size: 140, left:  85, top:   5, delay: 2, opacity: 0.3, blur: 2  },
  { size: 110, left:  25, top:  10, delay: 5, opacity: 0.2, blur: 5  },
]);
</script>