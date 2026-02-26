<template>
  <div class="group relative p-10 rounded-[2.5rem] transition-all duration-500 font-['Poppins'] overflow-hidden
    bg-white dark:bg-[#111118] border border-slate-100 dark:border-white/5
    shadow-[0_20px_40px_rgba(0,0,0,0.03),inset_0_2px_4px_rgba(255,255,255,1)]
    dark:shadow-[0_30px_60px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.05)]
    hover:-translate-y-3">
    
    <div class="relative w-16 h-16 mb-8 rounded-2xl flex items-center justify-center transition-all duration-500
      bg-slate-50 dark:bg-[#1a1a24] 
      shadow-[8px_8px_16px_rgba(0,0,0,0.05),inset_-2px_-2px_6px_rgba(0,0,0,0.02),inset_2px_2px_6px_rgba(255,255,255,0.8)]
      dark:shadow-[10px_10px_20px_rgba(0,0,0,0.3),inset_-1px_-1px_3px_rgba(255,255,255,0.05)]
      group-hover:bg-[#46178f] group-hover:shadow-[0_10px_20px_rgba(70,23,143,0.3)]">
      
      <svg class="w-8 h-8 text-slate-400 dark:text-slate-500 group-hover:text-white transition-colors duration-500" 
        fill="none" 
        stroke="currentColor" 
        :viewBox="viewBox">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" :d="icon" />
      </svg>
    </div>

    <h3 class="text-lg font-[900] text-slate-800 dark:text-white mb-4 uppercase tracking-[0.2em] italic transition-colors
      group-hover:text-[#46178f] dark:group-hover:text-[#d810ff]">
      {{ title }}
    </h3>
    
    <p class="text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed italic transition-colors
      group-hover:text-slate-700 dark:group-hover:text-slate-200">
      {{ description }}
    </p>

    <div class="mt-8 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      <div class="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></div>
      <span class="text-[9px] font-black uppercase tracking-[0.3em] text-purple-600 dark:text-purple-400">Initialize Module</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  viewBox: { type: String, default: '0 0 24 24' }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;900&display=swap');

/* Smooth Physics Transitions */
div, svg, h3, p {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>