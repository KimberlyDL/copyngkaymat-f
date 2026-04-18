<template>
  <div class="landing-feature-card group">

    <!-- Icon -->
    <div class="landing-feature-icon-wrap mb-5">
      <svg class="w-6 h-6 text-calm-lavender-600 dark:text-calm-lavender-400" fill="none" stroke="currentColor" :viewBox="viewBox">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" :d="icon" />
      </svg>
    </div>

    <!-- Text -->
    <h3 class="font-madimione text-lg text-slate-800 dark:text-platinum-100 mb-2 leading-snug">
      {{ title }}
    </h3>
    <p class="font-averta text-sm text-slate-500 dark:text-platinum-500 leading-relaxed">
      {{ description }}
    </p>

    <!-- Hover bottom accent line -->
    <div class="mt-5 h-0.5 w-0 bg-gradient-to-r from-calm-lavender-500 to-neon-pink-500 rounded-full transition-all duration-500 group-hover:w-full"></div>
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