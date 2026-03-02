<template>
    <div class="module-list space-y-8 custom-font-poppins">
        
        <!-- Modern Toolbar -->
        <div class="sticky top-4 z-30 bg-white/90 dark:bg-[#1a1a24]/90 backdrop-blur-md border border-slate-200 dark:border-white/10 p-2 rounded-[1.5rem] shadow-xl flex flex-col md:flex-row items-stretch md:items-center gap-2 transition-all">
            
            <!-- Search Field -->
            <div class="relative flex-1 group/search">
                <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                     <svg class="h-4 w-4 text-slate-400 group-focus-within/search:text-purple-600 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                     </svg>
                </div>
                <input
                    v-model="localFilters.search"
                    type="text"
                    placeholder="Search modules by title..."
                    class="block w-full pl-12 pr-4 py-3.5 bg-transparent border-none text-black dark:text-white placeholder-slate-400 focus:ring-0 text-sm font-semibold rounded-2xl transition-all"
                    @input="debouncedSearch"
                />
            </div>

            <div class="h-8 w-px bg-slate-200 dark:bg-white/10 hidden md:block"></div>

            <!-- Filters Group -->
            <div class="flex gap-2 p-1 overflow-x-auto no-scrollbar">
                
                <!-- Category Filter -->
                <div class="relative min-w-[140px]">
                    <select 
                        v-model="localFilters.category"
                        class="w-full appearance-none bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-black dark:text-white text-[10px] font-black uppercase tracking-widest py-3 pl-4 pr-10 rounded-xl border-none focus:ring-2 focus:ring-purple-600 cursor-pointer transition-colors"
                        @change="applyFilters"
                    >
                        <option :value="null">All Types</option>
                        <option value="gad">Institutional</option>
                        <option value="sexual_health">Health</option>
                        <option value="vawc">Safety</option>
                        <option value="general">Standard</option>
                    </select>
                    <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>

                <!-- Difficulty Filter -->
                <div class="relative min-w-[140px]">
                    <select 
                        v-model="localFilters.difficulty_level"
                        class="w-full appearance-none bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-black dark:text-white text-[10px] font-black uppercase tracking-widest py-3 pl-4 pr-10 rounded-xl border-none focus:ring-2 focus:ring-purple-600 cursor-pointer transition-colors"
                        @change="applyFilters"
                    >
                        <option :value="null">All Levels</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                    <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>

                <!-- Reset Button -->
                 <button 
                    v-if="hasActiveFilters"
                    @click="resetFilters"
                    title="Reset Filters"
                    class="flex items-center justify-center w-10 h-10 bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 rounded-xl transition-colors shrink-0"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
        </div>

        <!-- Active Tags -->
        <div v-if="hasActiveFilters" class="flex flex-wrap gap-2 px-2 animate-in slide-in-from-top-2">
             <span 
                v-for="(value, key) in activeFiltersDisplay" 
                :key="key"
                class="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 rounded-lg text-[9px] font-bold uppercase tracking-wider"
            >
                <span class="text-purple-600 font-black">{{ key }}:</span> {{ value }}
            </span>
        </div>

        <!-- content -->
        <div v-if="moduleStore.loading && modules.length === 0" class="flex flex-col items-center justify-center py-32 space-y-5">
            <div class="h-10 w-10 border-4 border-purple-500/10 border-t-purple-600 rounded-full animate-spin"></div>
            <p class="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse">Syncing Registry...</p>
        </div>

        <div 
            v-else-if="modules.length > 0" 
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
            <ModuleCard 
                v-for="module in modules" 
                :key="module.id"
                :module="module"
                @view="viewModule"
                class="hover:-translate-y-1 transition-transform"
            />
        </div>

        <div v-else class="text-center py-24 bg-slate-50 dark:bg-white/[0.01] border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[3.5rem]">
            <svg class="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="text-xl font-black text-slate-400 uppercase tracking-tighter mb-4 italic">No Modules Available</p>
            <button @click="resetFilters" class="text-[10px] font-black text-purple-600 hover:underline uppercase tracking-widest transition-all">
                Clear Active Filters
            </button>
        </div>

        <div v-if="moduleStore.hasMorePages || moduleStore.loading" class="text-center pt-10">
            <button 
                v-if="!moduleStore.loading"
                @click="loadMore"
                class="px-10 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 hover:text-purple-600 hover:border-purple-500 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95"
            >
                Fetch More Data
            </button>
            <div v-else class="inline-block h-6 w-6 border-2 border-purple-500/20 border-t-purple-600 rounded-full animate-spin"></div>
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
    if (localFilters.value.search) display.search = `Query: "${localFilters.value.search}"`;
    if (localFilters.value.category) display.category = `Type: ${formatLabel(localFilters.value.category)}`;
    if (localFilters.value.difficulty_level) display.difficulty_level = `Level: ${formatLabel(localFilters.value.difficulty_level)}`;
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
.custom-font-poppins { font-family: 'Poppins', sans-serif !important; }

.btn-3d-purple {
  background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
  box-shadow: 0 10px 20px -5px rgba(124, 58, 237, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.35);
}

.animate-in {
    animation: slideIn 0.5s ease-out forwards;
}

@keyframes slideIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Fixes black options in Light Mode */
select option {
    background-color: white;
    color: black;
}

.dark select option {
    background-color: #0d0d12;
    color: white;
}
</style>