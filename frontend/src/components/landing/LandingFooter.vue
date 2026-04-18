<template>
  <footer class="bg-platinum-100 dark:bg-abyss-950 border-t-2 border-slate-200 dark:border-abyss-700">
    <div class="max-w-6xl mx-auto px-6 py-12 flex flex-col items-center text-center">

      <!-- Logo -->
      <div class="mb-8 opacity-70 hover:opacity-100 transition-opacity">
        <img src="@/assets/LogongPrototeced.svg" alt="ProtectEd" class="h-8 w-auto mx-auto" />
      </div>

      <div class="flex flex-wrap justify-center gap-6 mb-8">
        <router-link :to="{ name: 'login' }"             class="font-averta font-semibold text-sm text-slate-500 hover:text-calm-lavender-500 transition-colors">Student Login</router-link>
        <router-link :to="{ name: 'signup' }"            class="font-averta font-semibold text-sm text-slate-500 hover:text-neon-pink-500 transition-colors">Create Account</router-link>
        <router-link :to="{ name: 'facilitator.login' }" class="font-averta font-semibold text-sm text-slate-500 hover:text-safety-teal-500 transition-colors">Educator Portal</router-link>
      </div>

      <p class="font-averta text-sm text-slate-400 dark:text-abyss-400 max-w-lg mx-auto leading-relaxed">
        Developed by <strong class="text-slate-500 dark:text-abyss-300">ProtectED Team</strong><br>
        College of Computer Studies, Mindoro State University.
      </p>

    </div>
  </footer>
</template>

<script setup>
// static footer — no script needed
</script>