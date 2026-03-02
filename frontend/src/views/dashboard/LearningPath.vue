<template>
    <div class="min-h-screen bg-transparent custom-font-poppins text-slate-900 dark:text-white selection:bg-purple-500/30 overflow-x-hidden transition-colors duration-500">
        
        <div class="p-6 lg:p-12 space-y-10 animate-in relative z-10 max-w-[1400px] mx-auto">
            
            <!-- Header Section -->
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-200 dark:border-purple-500/10 pb-10">
                <div class="space-y-3">
                    <router-link :to="{ name: 'user.dashboard' }" 
                        class="group flex items-center gap-3 text-[10px] font-[900] uppercase tracking-[0.2em] text-slate-400 dark:text-gray-500 hover:text-purple-600 transition-all outline-none italic mb-4">
                        <div class="p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 group-hover:border-purple-500/50 group-hover:bg-purple-500/10 transition-all shadow-sm">
                            <ArrowLeftIcon class="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                        </div>
                        <span>Return to Dashboard</span>
                    </router-link>
                    <div class="flex items-center gap-3 text-purple-600 dark:text-purple-400">
                        <div class="p-2 bg-purple-500/10 rounded-lg shadow-inner">
                            <Route class="w-5 h-5" />
                        </div>
                        <span class="text-[10px] font-[900] uppercase tracking-[0.4em] italic">Learning Route</span>
                    </div>
                    <h1 class="text-4xl lg:text-5xl font-[900] uppercase tracking-tighter italic leading-none">
                        {{ pathTitle }}
                    </h1>
                    <p class="text-xs font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest italic">Complete all modules in this learning path to master the topic.</p>
                </div>
            </div>

            <!-- Overall Progress Card -->
            <div class="bg-white/80 dark:bg-[#0d0d12]/80 backdrop-blur-3xl border border-slate-200 dark:border-purple-500/20 rounded-[2.5rem] p-8 shadow-xl">
                <div class="flex items-center justify-between mb-4">
                    <span class="text-[10px] font-[900] uppercase tracking-[0.2em] text-slate-400 dark:text-gray-600 italic">Overall Progress</span>
                    <span class="text-2xl font-[900] text-purple-600 dark:text-purple-400 italic">{{ overallProgress }}%</span>
                </div>
                <div class="h-3 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden border border-slate-200 dark:border-white/10">
                    <div class="h-full bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(147,51,234,0.5)]" 
                        :style="{ width: overallProgress + '%' }"></div>
                </div>
            </div>

            <!-- Modules List -->
            <div class="bg-white/80 dark:bg-[#0d0d12]/80 backdrop-blur-3xl border border-slate-200 dark:border-white/10 rounded-[3rem] shadow-2xl overflow-hidden">
                
                <div v-if="isLoading" class="py-32 text-center">
                    <div class="relative h-12 w-12 text-purple-600 mx-auto mb-4">
                        <div class="absolute inset-0 rounded-full border-2 border-current opacity-10"></div>
                        <div class="absolute inset-0 rounded-full border-2 border-t-transparent animate-spin"></div>
                    </div>
                    <p class="text-[10px] font-[900] uppercase tracking-[0.4em] text-purple-500 animate-pulse italic">Loading Learning Path...</p>
                </div>
                
                <div v-else class="divide-y divide-slate-100 dark:divide-white/5">
                    <div v-for="(module, index) in modules" :key="module.id" 
                        class="flex items-center gap-6 p-6 transition-all hover:bg-purple-50/50 dark:hover:bg-purple-500/5 group">
                        
                        <div class="shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner border"
                            :class="module.status === 'completed' 
                                ? 'bg-violet-500/10 border-violet-500/20' 
                                : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10'">
                            {{ module.icon || '📚' }}
                        </div>
                        
                        <div class="flex-1 min-w-0">
                            <p class="text-lg font-[900] text-slate-900 dark:text-white uppercase tracking-tight italic truncate group-hover:text-purple-600 transition-colors">
                                {{ module.name }}
                            </p>
                            <p class="text-[10px] font-[900] text-slate-400 dark:text-gray-600 uppercase tracking-widest italic mt-1">
                                Module {{ index + 1 }} of {{ modules.length }}
                            </p>
                        </div>

                        <div class="shrink-0 flex items-center gap-4">
                            <span v-if="module.status === 'completed'" 
                                class="px-4 py-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-full text-[9px] font-[900] uppercase tracking-widest italic border border-violet-500/20">
                                Completed
                            </span>
                            
                            <button :class="['px-6 py-3 rounded-2xl font-[900] text-[10px] uppercase tracking-[0.15em] transition-all shadow-lg italic',
                                module.status === 'completed' 
                                    ? 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-white/10 hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:text-purple-600' 
                                    : 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white hover:scale-105 active:scale-95 shadow-purple-500/30']">
                                {{ module.status === 'completed' ? 'Review' : 'Start Module' }}
                            </button>
                        </div>
                    </div>
                </div>

                <div v-if="!isLoading && modules.length === 0" class="py-32 text-center">
                    <div class="inline-flex p-6 bg-slate-100 dark:bg-white/5 rounded-[2.5rem] mb-6 shadow-inner">
                        <Route class="w-12 h-12 text-slate-300 dark:text-gray-700" />
                    </div>
                    <h3 class="text-2xl font-[900] uppercase tracking-tighter italic text-slate-400">Path Empty</h3>
                    <p class="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-2 italic">No modules found in this learning path.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Route, ArrowLeft as ArrowLeftIcon } from 'lucide-vue-next'
import api from '@/utils/api'

const route = useRoute()
const pathTitle = ref('Learning Path')
const overallProgress = ref(0)
const modules = ref([])
const isLoading = ref(true)

onMounted(async () => {
    const pathId = route.params.id
    try {
        const res = await api.get(`/api/v1/learning-paths/${pathId}`)
        if (res.data) {
            pathTitle.value = res.data.name || 'Learning Path'
            overallProgress.value = res.data.progress || 0
            modules.value = res.data.modules || []
        }
    } catch (error) {
        console.error('[v0] Failed to load learning path:', error.message)
    } finally {
        isLoading.value = false
    }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700;1,900&display=swap');

.custom-font-poppins {
    font-family: 'Poppins', sans-serif !important;
}
</style>
