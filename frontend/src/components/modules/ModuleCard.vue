<template>
    <div class="group relative bg-white dark:bg-[#0d0d12] border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer overflow-hidden flex flex-col h-[360px]"
        @click="$emit('view', module.id)">
        
        <div class="relative h-36 overflow-hidden bg-slate-100 dark:bg-[#08080a]">
            <img v-if="module.thumbnail_url" :src="module.thumbnail_url" :alt="module.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div v-else class="w-full h-full flex items-center justify-center opacity-30">
                <BookOpen class="w-8 h-8 text-slate-400" />
            </div>

            <div class="absolute top-3 left-3 flex gap-1.5">
                <span class="bg-purple-600 text-white px-2.5 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest">
                    {{ formatCategory(module.category) }}
                </span>
                <span v-if="module.is_featured" class="bg-black dark:bg-white text-white dark:text-black px-2.5 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest shadow-lg">
                    TOP
                </span>
            </div>
        </div>

        <div class="p-5 flex-1 flex flex-col justify-between">
            <div class="space-y-1">
                <h3 class="text-sm font-black text-black dark:text-white line-clamp-2 uppercase tracking-tighter leading-tight group-hover:text-purple-600 transition-colors italic">
                    {{ module.title }}
                </h3>
                <p class="text-[10px] text-slate-500 dark:text-slate-400 font-bold line-clamp-2 leading-tight italic opacity-70">
                    {{ module.description || 'Lesson description.' }}
                </p>
            </div>

            <div class="space-y-3 pt-3 border-t border-slate-100 dark:border-white/5">
                <div class="flex items-center justify-between text-slate-400">
                    <div class="flex items-center gap-1.5">
                        <BarChart2 class="w-3 h-3 text-purple-600" />
                        <span class="text-[7px] font-black uppercase italic tracking-widest">{{ module.difficulty_level }}</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                        <EyeIcon class="w-3 h-3" />
                        <span class="text-[7px] font-black tracking-widest uppercase">{{ module.view_count || 0 }} Reads</span>
                    </div>
                </div>

                <button class="btn-3d-purple w-full py-2.5 text-white text-[8px] font-black uppercase tracking-widest rounded-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                    <PlayIcon class="w-2.5 h-2.5 fill-current" />
                    <span>Open Unit</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Star, Eye as EyeIcon, Play as PlayIcon, BookOpen, BarChart2 } from 'lucide-vue-next';

defineProps({
    module: { type: Object, required: true }
});

defineEmits(['view']);

const formatCategory = (category) => {
    const map = { 'gad': 'Culture', 'sexual_health': 'Health', 'vawc': 'Safety', 'general': 'Standard' };
    return map[category] || 'General';
};
</script>

<style scoped>
.btn-3d-purple {
  background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
  box-shadow: 
    0 6px 12px -3px rgba(124, 58, 237, 0.3), 
    inset 0 1px 2px rgba(255, 255, 255, 0.3);
}

/* Tightening the text clamping */
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>