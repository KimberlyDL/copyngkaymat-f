<template>
    <div class="flex flex-col items-center justify-center">
        <div class="logo-container mb-6 transform transition-all duration-700" :class="[animationClass, statusColorClass]">
            <img src="@/assets/LogongPrototeced.svg" alt="ProtectEd Logo"
  class="w-12 h-12 group-hover/logo:rotate-6 transition-all" />
        </div>
        
        <div class="flex flex-col items-center gap-1">
            <span class="text-2xl md:text-3xl font-[900] uppercase italic tracking-tighter text-slate-900 dark:text-white leading-none">
                Protect<span class="text-purple-600 dark:text-purple-500">Ed</span>
            </span>
            <div class="h-1 w-8 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-full shadow-[0_2px_10px_rgba(139,92,246,0.4)]"></div>
            <p v-if="status === 'loading'" class="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-gray-600 mt-3 animate-pulse italic">
                Synchronizing Registry...
            </p>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    status: {
        type: String,
        default: 'loading' // 'loading', 'success', 'error'
    }
});

const animationClass = computed(() => {
    return props.status === 'loading' ? 'animate-neural-pulse' : 'scale-100 opacity-100';
});

const statusColorClass = computed(() => {
    if (props.status === 'error') {
        return 'text-rose-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]';
    }
    if (props.status === 'success') {
        return 'text-violet-500 drop-shadow-[0_0_15px_rgba(139,92,246,0.4)]';
    }
    // Default Institutional Purple
    return 'text-purple-600 dark:text-purple-500';
});
</script>

<style scoped>
@reference "@/style.css";

/* Institutional Neural Pulse Animation */
@keyframes neural-pulse {
    0%, 100% {
        transform: scale(1);
        filter: drop-shadow(0 0 5px rgba(124, 58, 237, 0.3));
    }
    50% {
        transform: scale(1.08);
        filter: drop-shadow(0 0 20px rgba(124, 58, 237, 0.6)) drop-shadow(0 0 40px rgba(139, 92, 246, 0.2));
    }
}

.animate-neural-pulse {
    animation: neural-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* SVG currentColor ensures it works with tailwind text colors */
svg {
    fill: currentColor;
    transition: all 0.5s ease-in-out;
}
</style>