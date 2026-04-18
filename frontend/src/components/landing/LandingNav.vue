<template>
  <nav class="fixed top-4 left-0 right-0 z-[100] flex justify-center px-4">
    <div class="w-full max-w-5xl bg-white dark:bg-abyss-700 border-2 border-slate-200 dark:border-abyss-500 border-b-[4px] rounded-2xl px-6 py-3 transition-all duration-300">
      <div class="flex items-center justify-between w-full">

        <router-link :to="{ name: 'home' }" class="flex items-center gap-3 group flex-shrink-0">
          <div class="w-10 h-10 rounded-xl bg-calm-lavender-500 border-2 border-calm-lavender-700 border-b-[4px] flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:-translate-y-1">
            <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
          </div>
          <span class="font-madimione text-2xl text-slate-900 dark:text-white leading-none tracking-tight">
            Protect<span class="text-calm-lavender-500">Ed</span>
          </span>
        </router-link>

        <div class="hidden md:flex items-center gap-8">
          <a href="#home" class="font-dosis font-semibold text-sm uppercase tracking-widest text-slate-500 dark:text-platinum-400 hover:text-calm-lavender-500 dark:hover:text-calm-lavender-400 transition-colors">Home</a>
          <a href="#modes" class="font-dosis font-semibold text-sm uppercase tracking-widest text-slate-500 dark:text-platinum-400 hover:text-calm-lavender-500 dark:hover:text-calm-lavender-400 transition-colors">Games</a>
          <a href="#modules" class="font-dosis font-semibold text-sm uppercase tracking-widest text-slate-500 dark:text-platinum-400 hover:text-calm-lavender-500 dark:hover:text-calm-lavender-400 transition-colors">Learn</a>
          <a href="#dashboard" class="font-dosis font-semibold text-sm uppercase tracking-widest text-slate-500 dark:text-platinum-400 hover:text-calm-lavender-500 dark:hover:text-calm-lavender-400 transition-colors">Dashboard</a>
        </div>

        <div class="flex items-center gap-2">
          <router-link :to="{ name: 'login' }" class="font-dosis font-semibold text-sm uppercase tracking-widest text-slate-500 dark:text-platinum-400 hover:text-calm-lavender-600 dark:hover:text-calm-lavender-400 px-3 py-2 transition-colors">
            Log In
          </router-link>

          <router-link :to="{ name: 'signup' }" class="bg-neon-pink-500 text-white font-madimione text-sm uppercase tracking-wider px-5 py-2.5 rounded-xl border-2 border-neon-pink-700 border-b-[4px] hover:bg-neon-pink-400 active:border-b-[2px] active:translate-y-[2px] transition-all">
            Sign Up
          </router-link>
        </div>

      </div>
    </div>
  </nav>
</template>

<style scoped>
nav {
  animation: nav-drop 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes nav-drop {
  from { transform: translateY(-80px); opacity: 0; }
  to   { transform: translateY(0);     opacity: 1; }
}
</style>