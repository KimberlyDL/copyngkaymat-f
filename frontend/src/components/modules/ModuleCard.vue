<template>
    <div class="p-[2px] rounded-[2.5rem] bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.5)] transition-all duration-500 group cursor-pointer"
        @click="$emit('view', module.id)">
        
        <div class="bg-[#0d0d12] rounded-[2.4rem] overflow-hidden h-full flex flex-col transition-colors group-hover:bg-[#121218]">
            
            <div class="relative h-44 bg-[#08080a] overflow-hidden">
                <img v-if="module.thumbnail_url" :src="module.thumbnail_url" :alt="module.title"
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div v-else class="w-full h-full flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
                    <span class="text-6xl">📚</span>
                </div>

                <div class="absolute top-4 right-4">
                    <span v-if="module.is_featured"
                        class="flex items-center gap-1.5 bg-gradient-to-r from-yellow-500 to-orange-600 text-black px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl">
                        <Star class="h-3 w-3 fill-current" /> 
                        Featured
                    </span>
                </div>

                <div class="absolute bottom-4 left-4">
                    <span class="bg-blue-600 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] shadow-lg">
                        {{ formatCategory(module.category) }}
                    </span>
                </div>
                
                <div class="absolute inset-0 bg-gradient-to-t from-[#0d0d12] via-transparent to-transparent opacity-60"></div>
            </div>

            <div class="p-6 flex-1 flex flex-col">
                <h3 class="text-lg font-black text-white mb-2 line-clamp-2 uppercase tracking-tighter leading-tight group-hover:text-blue-400 transition-colors">
                    {{ module.title }}
                </h3>

                <p class="text-xs text-gray-500 font-medium mb-6 line-clamp-3 leading-relaxed italic">
                    {{ module.description || 'No description available in the registry node.' }}
                </p>

                <div class="mt-auto space-y-4">
                    <div class="flex items-center justify-between pt-4 border-t border-white/5">
                        <span class="text-[9px] font-black text-pink-500 uppercase tracking-[0.3em] italic">
                            {{ module.difficulty_level }}
                        </span>
                        
                        <div class="flex items-center gap-1.5 text-gray-600">
                            <EyeIcon class="w-3 h-3" />
                            <span class="text-[10px] font-bold tracking-tighter">{{ module.view_count || 0 }} Views</span>
                        </div>
                    </div>

                    <button class="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-xl shadow-xl shadow-blue-900/20 group-hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                        <PlayIcon class="w-3 h-3 fill-current" />
                        <span>Start Learning</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Star, Eye as EyeIcon, Play as PlayIcon } from 'lucide-vue-next';

defineProps({
    module: {
        type: Object,
        required: true
    }
});

defineEmits(['view']);

const formatCategory = (category) => {
    const map = {
        'gad': 'GAD',
        'sexual_health': 'Sex_Edu',
        'vawc': 'VAWC',
        'general': 'General'
    };
    return map[category] || category;
};
</script>

<style scoped>
/* High-Density Clamp Fixes */
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>