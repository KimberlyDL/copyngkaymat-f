<template>
  <div class="group relative card border-2 border-slate-200 dark:border-abyss-500 border-b-[6px] p-8 rounded-3xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">

    <!-- Title + accent line -->
    <div class="space-y-2 mb-6">
      <h3 :class="['font-madimione text-2xl tracking-tight transition-colors duration-300', titleClass]">
        {{ title }}
      </h3>
      <div :class="['h-[3px] w-10 rounded-full transition-all duration-500 group-hover:w-20', lineClass]"></div>
    </div>

    <!-- Items list — body content uses font-mplusrounded + leading-relaxed per GAD/VAWC ethics -->
    <ul class="space-y-4">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="flex items-start gap-3 group/item hover:translate-x-1 transition-transform duration-300"
      >
        <span :class="['flex-shrink-0 w-7 h-7 rounded-xl flex items-center justify-center text-white mt-0.5 border-2 border-b-[3px] transition-transform duration-300 group-hover/item:scale-110', badgeClass]">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <span class="font-mplusrounded text-sm font-medium text-slate-600 dark:text-platinum-300 leading-relaxed">{{ item }}</span>
      </li>
    </ul>

    <!-- Bottom sweep line -->
    <div :class="['absolute bottom-0 left-0 h-[3px] w-0 group-hover:w-full transition-all duration-500 rounded-b-3xl', lineClass]"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title:   { type: String, required: true },
  variant: {
    type: String,
    default: 'purple',
    validator: (v) => ['purple', 'fuchsia', 'teal'].includes(v)
  },
  items: { type: Array, required: true }
});

const titleClass = computed(() => ({
  purple:  'text-calm-lavender-600 dark:text-calm-lavender-400',
  fuchsia: 'text-neon-pink-600 dark:text-neon-pink-400',
  teal:    'text-safety-teal-600 dark:text-safety-teal-400',
}[props.variant] ?? 'text-calm-lavender-600 dark:text-calm-lavender-400'));

const lineClass = computed(() => ({
  purple:  'bg-calm-lavender-400 dark:bg-calm-lavender-600',
  fuchsia: 'bg-neon-pink-400 dark:bg-neon-pink-600',
  teal:    'bg-safety-teal-400 dark:bg-safety-teal-600',
}[props.variant] ?? 'bg-calm-lavender-400'));

const badgeClass = computed(() => ({
  purple:  'bg-calm-lavender-500 border-calm-lavender-700',
  fuchsia: 'bg-neon-pink-500 border-neon-pink-700',
  teal:    'bg-safety-teal-500 border-safety-teal-700',
}[props.variant] ?? 'bg-calm-lavender-500 border-calm-lavender-700'));
</script>