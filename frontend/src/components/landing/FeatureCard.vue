<template>
  <div class="group relative card border-2 border-slate-200 dark:border-abyss-500 border-b-[6px] p-8 rounded-3xl hover:-translate-y-2 transition-all duration-500 overflow-hidden cursor-pointer">

    <!-- Icon badge -->
    <div class="relative w-14 h-14 mb-6 rounded-2xl flex items-center justify-center bg-calm-lavender-500 border-2 border-calm-lavender-700 border-b-[4px] transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-105 shrink-0">
      <svg
        class="w-7 h-7 text-white"
        fill="none"
        stroke="currentColor"
        :viewBox="viewBox"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" :d="icon" />
      </svg>
    </div>

    <h3 class="font-madimione text-xl text-slate-800 dark:text-white mb-3 group-hover:text-calm-lavender-600 dark:group-hover:text-calm-lavender-400 transition-colors">
      {{ title }}
    </h3>

    <p class="font-mplusrounded text-sm font-medium text-slate-500 dark:text-platinum-400 leading-relaxed">
      {{ description }}
    </p>

    <!-- Hover CTA row -->
    <div class="mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400">
      <div class="w-1.5 h-1.5 rounded-full bg-calm-lavender-500 animate-pulse"></div>
      <span class="font-dosis font-700 text-xs uppercase tracking-[0.2em] text-calm-lavender-600 dark:text-calm-lavender-400">
        Open Module
      </span>
    </div>

    <!-- Bottom accent line -->
    <div class="absolute bottom-0 left-0 h-[3px] w-0 group-hover:w-full bg-calm-lavender-400 dark:bg-calm-lavender-600 rounded-b-3xl transition-all duration-500"></div>
  </div>
</template>

<script setup>
const props = defineProps({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  icon:        { type: String, required: true },
  viewBox:     { type: String, default: '0 0 24 24' }
})
</script>