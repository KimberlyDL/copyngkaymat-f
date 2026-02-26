<template>
    <div class="module-sidebar h-full flex flex-col font-['Poppins'] text-white">
        <div class="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.01]">
            <div class="flex items-center gap-3">
                <div class="h-4 w-1 bg-gradient-to-b from-blue-500 to-pink-500 rounded-full"></div>
                <h2 class="text-sm font-black uppercase tracking-[0.2em] text-gray-300">Module Information</h2>
            </div>
            <button 
                @click="$emit('close')"
                class="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all lg:hidden"
            >
                <XIcon class="w-5 h-5" />
            </button>
        </div>

        <div class="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            
            <div class="space-y-6">
                <div class="group">
                    <h3 class="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-3 group-hover:text-blue-400 transition-colors">Topic Category</h3>
                    <div class="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-2xl shadow-lg shadow-blue-900/10">
                        <div class="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                        <span class="text-[11px] font-black uppercase tracking-widest text-blue-400">
                            {{ formatCategory(module.category) }}
                        </span>
                    </div>
                </div>

                <div class="group">
                    <h3 class="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-3 group-hover:text-pink-400 transition-colors">Difficulty Level</h3>
                    <div class="flex items-center gap-4 bg-[#0d0d12] p-4 rounded-[1.5rem] border border-white/5">
                        <div class="flex gap-1.5">
                            <div 
                                v-for="i in 3" 
                                :key="i"
                                class="w-6 h-1.5 rounded-full transition-all duration-500"
                                :class="getDifficultyColor(i)"
                            ></div>
                        </div>
                        <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            {{ module.difficulty_level }}
                        </span>
                    </div>
                </div>
            </div>

            <div class="bg-white/[0.02] border border-white/10 rounded-[2rem] p-6 space-y-4 shadow-2xl relative overflow-hidden">
                <div class="absolute -right-4 -top-4 w-20 h-20 bg-blue-600/5 rounded-full blur-2xl"></div>
                <h3 class="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] italic">Analytics</h3>
                
                <div class="flex items-center justify-between p-4 bg-[#08080a] border border-white/5 rounded-2xl group transition-all hover:border-blue-500/30">
                    <div class="flex items-center gap-3">
                        <div class="p-2 bg-blue-500/10 rounded-lg text-blue-500 group-hover:scale-110 transition-transform">
                            <EyeIcon class="w-4 h-4" />
                        </div>
                        <span class="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">Total Views</span>
                    </div>
                    <span class="text-lg font-black text-white tracking-tighter">{{ module.view_count || 0 }}</span>
                </div>
            </div>

            <div v-if="module.tags && module.tags.length > 0" class="group">
                <h3 class="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-4">Metadata Tags</h3>
                <div class="flex flex-wrap gap-2">
                    <span 
                        v-for="tag in module.tags" 
                        :key="tag"
                        class="px-3 py-1.5 bg-[#0d0d12] border border-white/10 text-gray-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:border-pink-500/40 hover:text-pink-400 transition-all cursor-default"
                    >
                        #{{ tag }}
                    </span>
                </div>
            </div>

            <div v-if="module.creator" class="group">
                <h3 class="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-4">Topic Facilitator</h3>
                <div class="flex items-center gap-4 p-4 bg-gradient-to-br from-white/5 to-transparent border border-white/5 rounded-[2rem] group-hover:border-blue-500/20 transition-all">
                    <div class="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-xs font-black shadow-lg shadow-blue-900/20">
                        {{ getInitials(module.creator.name) }}
                    </div>
                    <div class="min-w-0">
                        
                        <p class="text-xs font-black text-white uppercase tracking-tight truncate">PROF. {{ module.creator.name }}</p>
                        <p class="text-[9px] font-medium text-gray-500 italic lowercase truncate">{{ module.creator.email }}</p>
                    </div>
                </div>
            </div>

            <div class="pt-6 border-t border-white/5 space-y-2">
                <div v-for="log in [
                    { label: 'Published', date: module.published_at, color: 'text-blue-500/60' },
                    { label: 'Initialized', date: module.created_at, color: 'text-gray-600' }
                ]" :key="log.label" class="flex items-center gap-3">
                    <span v-if="log.date" class="text-[8px] font-black uppercase tracking-[0.2em] text-gray-700 min-w-[70px]">{{ log.label }} //</span>
                    <span v-if="log.date" class="text-[9px] font-bold text-gray-500 italic">{{ formatDate(log.date) }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { X as XIcon, Eye as EyeIcon, CheckCircle2 as CheckIcon } from 'lucide-vue-next';

const props = defineProps({
    module: {
        type: Object,
        required: true
    }
});

defineEmits(['close']);

const formatCategory = (category) => {
    const map = {
        'gad': 'GAD Protocol',
        'sexual_health': 'Sex_Edu Signal',
        'vawc': 'VAWC Shield',
        'general': 'General Node'
    };
    return map[category] || category.toUpperCase();
};

const getDifficultyColor = (level) => {
    const diff = props.module.difficulty_level;
    const active = 'shadow-[0_0_8px_rgba(59,130,246,0.5)]';
    
    const states = {
        'beginner': [
            level === 1 ? 'bg-blue-500 ' + active : 'bg-white/5',
            'bg-white/5',
            'bg-white/5'
        ],
        'intermediate': [
            level <= 2 ? 'bg-purple-500 ' + active : 'bg-white/5',
            level <= 2 ? 'bg-purple-500 ' + active : 'bg-white/5',
            'bg-white/5'
        ],
        'advanced': [
            'bg-pink-500 ' + active,
            'bg-pink-500 ' + active,
            'bg-pink-500 ' + active
        ]
    };
    return states[diff]?.[level - 1] || 'bg-white/5';
};

const getInitials = (name) => {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
};

const formatDate = (ds) => {
    if (!ds) return 'N/A';
    return new Date(ds).toLocaleDateString('en-US', { 
        year: 'numeric', month: 'short', day: 'numeric' 
    });
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #3b82f6;
}
</style>