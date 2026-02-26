<template>
    <div class="module-list space-y-8 font-['Poppins']">
        
        <div class="bg-white/[0.03] border border-white/10 p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div class="absolute -top-10 -left-10 w-40 h-40 bg-blue-600/5 rounded-full blur-[80px]"></div>
            
            <div class="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="relative group/input">
                    <input
                        v-model="localFilters.search"
                        type="text"
                        placeholder="Search Registry..."
                        class="w-full bg-[#0d0d12] border border-white/10 rounded-2xl px-5 py-3.5 pl-11 text-white text-xs outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-gray-600 font-medium shadow-inner"
                        @input="debouncedSearch"
                    />
                    <svg class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                </div>

                <div class="relative">
                    <select 
                        v-model="localFilters.category"
                        class="w-full bg-[#0d0d12] border border-white/10 rounded-2xl px-5 py-3.5 text-white text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer shadow-inner"
                        @change="applyFilters"
                    >
                        <option :value="null" class="bg-[#0d0d12] text-white">All Protocols</option>
                        <option value="gad" class="bg-[#0d0d12] text-white">GAD</option>
                        <option value="sexual_health" class="bg-[#0d0d12] text-white">Sexual Health</option>
                        <option value="vawc" class="bg-[#0d0d12] text-white">VAWC</option>
                        <option value="general" class="bg-[#0d0d12] text-white">General</option>
                    </select>
                    <div class="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-blue-500 text-[10px]">▼</div>
                </div>

                <div class="relative">
                    <select 
                        v-model="localFilters.difficulty_level"
                        class="w-full bg-[#0d0d12] border border-white/10 rounded-2xl px-5 py-3.5 text-white text-xs font-bold outline-none focus:ring-2 focus:ring-pink-500/50 appearance-none cursor-pointer shadow-inner"
                        @change="applyFilters"
                    >
                        <option :value="null" class="bg-[#0d0d12] text-white">All Difficulty</option>
                        <option value="beginner" class="bg-[#0d0d12] text-white">Beginner</option>
                        <option value="intermediate" class="bg-[#0d0d12] text-white">Intermediate</option>
                        <option value="advanced" class="bg-[#0d0d12] text-white">Advanced</option>
                    </select>
                    <div class="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-pink-500 text-[10px]">▼</div>
                </div>

                <button 
                    v-if="hasActiveFilters"
                    @click="resetFilters"
                    class="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-2xl px-6 py-3.5 text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-blue-900/20"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    Reset Registry
                </button>
            </div>

            <div v-if="hasActiveFilters" class="mt-6 flex flex-wrap gap-2 animate-in slide-in-from-top-2">
                <span 
                    v-for="(value, key) in activeFiltersDisplay" 
                    :key="key"
                    class="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-[9px] font-black uppercase tracking-widest"
                >
                    <span>{{ value }}</span>
                    <button @click="removeFilter(key)" class="hover:text-white transition-colors">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </span>
            </div>
        </div>

        <div v-if="moduleStore.loading && modules.length === 0" class="flex flex-col items-center justify-center py-24 space-y-4">
            <div class="relative h-12 w-12">
                <div class="absolute inset-0 rounded-full border-2 border-blue-500/10"></div>
                <div class="absolute inset-0 rounded-full border-2 border-t-blue-500 animate-spin"></div>
            </div>
            <p class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 animate-pulse">Syncing Registry...</p>
        </div>

        <div 
            v-else-if="modules.length > 0" 
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
            <ModuleCard 
                v-for="module in modules" 
                :key="module.id"
                :module="module"
                @view="viewModule"
            />
        </div>

        <div v-else class="text-center py-20 bg-white/[0.01] border border-dashed border-white/5 rounded-[3rem]">
            <div class="mb-6 relative inline-block">
                <div class="absolute inset-0 bg-pink-500/20 blur-2xl rounded-full"></div>
                <svg class="w-16 h-16 text-gray-700 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
            </div>
            <p class="text-xl font-black text-gray-500 uppercase tracking-tighter mb-4">No Signals Detected</p>
            <button 
                @click="resetFilters"
                class="text-[10px] font-black text-blue-500 hover:text-pink-500 uppercase tracking-widest transition-colors"
            >
                [ Clear Filters ]
            </button>
        </div>

        <div v-if="moduleStore.hasMorePages || moduleStore.loading" class="text-center pt-10">
            <button 
                v-if="!moduleStore.loading"
                @click="loadMore"
                class="px-10 py-4 bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-blue-500/50 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all group"
            >
                <span class="group-hover:tracking-[0.3em] transition-all duration-500">Fetch More Nodes</span>
            </button>
            <div v-else class="inline-block h-6 w-6 border-2 border-pink-500/20 border-t-pink-500 rounded-full animate-spin"></div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useModuleStore } from '@/stores/module';
import ModuleCard from './ModuleCard.vue';

const router = useRouter();
const moduleStore = useModuleStore();

const localFilters = ref({
    search: '',
    category: null,
    difficulty_level: null
});

const modules = computed(() => moduleStore.modules);

const hasActiveFilters = computed(() => {
    return Object.values(localFilters.value).some(v => v !== null && v !== '');
});

const activeFiltersDisplay = computed(() => {
    const display = {};
    if (localFilters.value.search) display.search = `S_QUERY: "${localFilters.value.search}"`;
    if (localFilters.value.category) display.category = `P_TYPE: ${formatLabel(localFilters.value.category)}`;
    if (localFilters.value.difficulty_level) display.difficulty_level = `D_LVL: ${formatLabel(localFilters.value.difficulty_level)}`;
    return display;
});

let searchTimeout;

const debouncedSearch = () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        applyFilters();
    }, 500);
};

const applyFilters = async () => {
    await moduleStore.setFilters(localFilters.value);
};

const removeFilter = async (key) => {
    localFilters.value[key] = key === 'search' ? '' : null;
    await applyFilters();
};

const resetFilters = async () => {
    localFilters.value = {
        search: '',
        category: null,
        difficulty_level: null
    };
    moduleStore.resetFilters();
    await moduleStore.fetchModules();
};

const loadMore = async () => {
    await moduleStore.loadNextPage();
};

const viewModule = (id) => {
    router.push({ name: 'facilitator.modules.detail', params: { id } });
};

const formatLabel = (value) => {
    return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

onMounted(async () => {
    await moduleStore.fetchModules();
});
</script>

<style scoped>
.animate-in {
    animation: slideIn 0.5s ease-out forwards;
}

@keyframes slideIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

select option {
    background-color: #0d0d12;
    color: white;
    font-family: 'Poppins', sans-serif;
}
</style>