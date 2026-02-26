<template>
    <div :class="['relative p-10 rounded-[3rem] border transition-all duration-700 font-[\'Poppins\'] overflow-hidden group', bgClass, borderClass]">
        
        <div class="absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-br from-blue-600/20 to-pink-600/20 rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-1000"></div>
        <div class="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr from-pink-500/10 to-blue-500/10 rounded-full blur-[40px] animate-pulse"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-white/[0.02] dark:bg-white/[0.01] pointer-events-none"></div>

        <div class="relative z-10 space-y-8">
            <div class="space-y-2">
                <h3 :class="['text-3xl font-black uppercase tracking-tighter leading-none transition-colors duration-500', titleClass]">
                    {{ title }}
                </h3>
                <div :class="['h-1.5 w-16 rounded-full transition-all duration-500 group-hover:w-24', lineClass]"></div>
            </div>
            
            <ul class="space-y-5">
                <li v-for="(item, index) in items" :key="index" 
                    class="flex items-start gap-4 text-gray-700 dark:text-gray-200 font-semibold group/item transition-all duration-300 hover:translate-x-3">
                    <span :class="['flex-shrink-0 w-7 h-7 rounded-2xl flex items-center justify-center text-white text-xs font-black mt-0.5 shadow-lg group-hover/item:rotate-12 transition-all duration-300', badgeBgClass]">
                        ✓
                    </span>
                    <span class="leading-snug opacity-90 group-hover:opacity-100 transition-opacity">{{ item }}</span>
                </li>
            </ul>
        </div>

        <div :class="['absolute bottom-0 left-0 h-1.5 w-0 group-hover:w-full transition-all duration-700', lineClass]"></div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  variant: {
    type: String,
    default: 'blue',
    validator: (value) => {
      return ['blue', 'purple', 'pink', 'indigo', 'green', 'orange'].includes(value)
    }
  },
  items: {
    type: Array,
    required: true
  }
});

// Mapping ng styles base sa variant prop
const bgClass = computed(() => {
  const bgs = {
    blue: 'bg-blue-50/50 dark:bg-blue-900/10',
    purple: 'bg-purple-50/50 dark:bg-purple-900/10',
    pink: 'bg-pink-50/50 dark:bg-pink-900/10',
    green: 'bg-emerald-50/50 dark:bg-emerald-900/10',
    orange: 'bg-orange-50/50 dark:bg-orange-900/10'
  };
  return bgs[props.variant] || bgs.blue;
});

const borderClass = computed(() => {
  const borders = {
    blue: 'border-blue-100 dark:border-blue-500/20 group-hover:border-blue-400',
    purple: 'border-purple-100 dark:border-purple-500/20 group-hover:border-purple-400',
    pink: 'border-pink-100 dark:border-pink-500/20 group-hover:border-pink-400',
    green: 'border-emerald-100 dark:border-emerald-500/20 group-hover:border-emerald-400',
    orange: 'border-orange-100 dark:border-orange-500/20 group-hover:border-orange-400'
  };
  return borders[props.variant] || borders.blue;
});

const titleClass = computed(() => {
  const titles = {
    blue: 'text-blue-600 dark:text-blue-400',
    purple: 'text-purple-600 dark:text-purple-400',
    pink: 'text-pink-600 dark:text-pink-400',
    green: 'text-emerald-600 dark:text-emerald-400',
    orange: 'text-orange-600 dark:text-orange-400'
  };
  return titles[props.variant] || titles.blue;
});

const lineClass = computed(() => {
  const lines = {
    blue: 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]',
    purple: 'bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]',
    pink: 'bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)]',
    green: 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]',
    orange: 'bg-orange-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
  };
  return lines[props.variant] || lines.blue;
});

const badgeBgClass = computed(() => {
  const badges = {
    blue: 'bg-blue-600',
    purple: 'bg-purple-600',
    pink: 'bg-pink-600',
    green: 'bg-emerald-600',
    orange: 'bg-orange-600'
  };
  return badges[props.variant] || badges.blue;
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;900&display=swap');

div {
    transition: all 0.7s cubic-bezier(0.23, 1, 0.32, 1);
}

.animate-pulse {
    animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 0.1; }
    50% { opacity: 0.3; }
}
</style>