<template>
  <div class="landing-impact-card group">

    <!-- Top accent bar -->
    <div :class="['h-1 w-full rounded-t-2xl mb-6 transition-all duration-500', accentBar]"></div>

    <!-- Title -->
    <h3 :class="['font-madimione text-2xl mb-5 leading-tight', titleColor]">
      {{ title }}
    </h3>

    <!-- List -->
    <ul class="space-y-3">
      <li
        v-for="(item, i) in items"
        :key="i"
        class="flex items-start gap-3 text-slate-600 dark:text-platinum-400 transition-colors group-hover:text-slate-800 dark:group-hover:text-platinum-200"
      >
        <span :class="['flex-shrink-0 mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center', checkBg]">
          <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <span class="font-averta text-sm leading-relaxed">{{ item }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title:   { type: String, required: true },
  variant: { type: String, default: 'lavender', validator: v => ['lavender', 'pink'].includes(v) },
  items:   { type: Array, required: true }
})

const accentBar = computed(() => ({
  lavender: 'bg-gradient-to-r from-calm-lavender-500 to-calm-lavender-300',
  pink:     'bg-gradient-to-r from-neon-pink-500 to-calm-lavender-400'
}[props.variant]))

const titleColor = computed(() => ({
  lavender: 'text-calm-lavender-700 dark:text-calm-lavender-400',
  pink:     'text-neon-pink-600 dark:text-neon-pink-400'
}[props.variant]))

const checkBg = computed(() => ({
  lavender: 'bg-calm-lavender-500 dark:bg-calm-lavender-600',
  pink:     'bg-neon-pink-500 dark:bg-neon-pink-600'
}[props.variant]))
</script>