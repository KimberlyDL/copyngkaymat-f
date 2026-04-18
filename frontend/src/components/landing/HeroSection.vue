<template>
  <section id="home" class="relative min-h-[88vh] w-full flex flex-col items-center justify-center overflow-hidden bg-platinum-50 dark:bg-abyss-950 px-6 pt-28 pb-16">

    <!-- Dot-grid texture -->
    <div
      class="absolute inset-0 opacity-[0.06] dark:opacity-[0.09] pointer-events-none"
      style="background-image: radial-gradient(var(--color-calm-lavender-500) 1.5px, transparent 1.5px); background-size: 32px 32px;"
    ></div>

    <!-- Subtle layered depth band -->
    <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-platinum-100 dark:from-abyss-900 to-transparent pointer-events-none"></div>

    <div class="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center text-center">

      <!-- Eyebrow label -->
      <span class="font-dosis font-700 text-xs uppercase tracking-[0.25em] text-calm-lavender-600 dark:text-calm-lavender-400 bg-calm-lavender-50 dark:bg-calm-lavender-900/20 border border-calm-lavender-200 dark:border-calm-lavender-800/40 px-4 py-1.5 rounded-full mb-6">
        Student Safety Platform
      </span>

      <h1 class="font-madimione text-4xl md:text-6xl text-slate-900 dark:text-white leading-tight mb-8 tracking-tight">
        Ready to Level Up <br />
        <span class="text-calm-lavender-600 dark:text-calm-lavender-400">Your Knowledge?</span>
      </h1>

      <!-- Card panel -->
      <div class="w-full bg-white dark:bg-abyss-700 border-2 border-slate-200 dark:border-abyss-500 border-b-[8px] rounded-3xl p-6 md:p-8 flex flex-col gap-5">

        <input
          type="text"
          placeholder="Enter Class Code"
          class="w-full text-center font-madimione text-2xl md:text-3xl tracking-widest uppercase p-5 border-2 border-slate-200 dark:border-abyss-500 rounded-2xl bg-slate-50 dark:bg-abyss-800 text-slate-800 dark:text-white placeholder-slate-300 dark:placeholder-abyss-400 focus:outline-none focus:border-calm-lavender-500 transition-colors"
        />

        <router-link
          :to="{ name: 'classrooms.index' }"
          class="w-full py-5 rounded-2xl bg-calm-lavender-500 border-2 border-calm-lavender-700 border-b-[6px] hover:bg-calm-lavender-400 active:border-b-[2px] active:translate-y-[4px] text-white font-madimione text-2xl uppercase tracking-wider transition-all text-center block"
        >
          Join Game
        </router-link>

        <div class="mt-2 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 font-mplusrounded text-sm font-bold text-slate-500 dark:text-platinum-400">
          <router-link :to="{ name: 'signup' }" class="hover:text-neon-pink-500 transition-colors">New here? Sign Up</router-link>
          <span class="hidden sm:block opacity-30">•</span> 
          <router-link :to="{ name: 'login' }" class="hover:text-calm-lavender-500 transition-colors">Already registered? Log In</router-link>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const orbs = ref([
  { size: 500, left: -5,  top: 10, delay: 0, opacity: 0.6, blur: 0  },
  { size: 400, left: 80,  top: 20, delay: 2, opacity: 0.5, blur: 0  },
  { size: 300, left: 70,  top: 60, delay: 4, opacity: 0.4, blur: 15 },
  { size: 150, left: 10,  top: 80, delay: 1, opacity: 0.6, blur: 0  },
]);

const steps = [
  {
    title: "The Foundation",
    desc: "Uncover the core principles of rights and equality. Explore guided modules that break down the laws protecting every student on campus.",
    tags: ["Knowledge", "Rights"]
  },
  {
    title: "Scenario Mastery",
    desc: "Test your judgment in gamified simulations. Navigate complex campus situations by applying legal standards to reach the best outcome.",
    tags: ["Gamified", "Scenarios"]
  },
  {
    title: "Empowered Action",
    desc: "Turn your knowledge into impact. Earn leadership badges as you champion a safer, more inclusive environment for your community.",
    tags: ["Advocacy", "Leadership"]
  }
];
</script>