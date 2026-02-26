<template>
    <div class="space-y-10 font-['Poppins'] animate-in fade-in duration-700 text-white">
        
        <header class="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
            <div class="space-y-2">
                <div class="flex items-center gap-3">
                    <div class="h-1 w-10 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)]"></div>
                    <span class="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Authorized Vault</span>
                </div>
                <h1 class="text-5xl font-black text-white uppercase tracking-tighter leading-none">
                    Learning <span class="bg-gradient-to-r from-blue-400 via-indigo-400 to-pink-500 bg-clip-text text-transparent">Modules</span>
                </h1>
                <p class="text-sm text-gray-400 font-medium italic">Explore our collection of educational lessons and guides.</p>
            </div>
            
            <button v-if="canManageModules" @click="showCreateModal = true"
                class="group flex items-center gap-3 px-8 py-4 bg-gradient-to-br from-blue-600 via-indigo-600 to-pink-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-[0_10px_30px_-5px_rgba(236,72,153,0.5)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-500">
                <PlusIcon class="w-4 h-4" /> Create Module
            </button>
        </header>

        <section v-if="canManageModules && stats" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="p-[1.5px] rounded-[2rem] bg-gradient-to-br from-blue-500/50 to-transparent shadow-lg group">
                <div class="bg-[#0d0d12] rounded-[1.9rem] p-6 group-hover:bg-[#121218] transition-all h-full">
                    <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Total Modules</p>
                    <div class="flex items-end justify-between">
                        <p class="text-3xl font-black text-white tracking-tighter">{{ stats.total_modules || 0 }}</p>
                        <div class="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            <BookOpenIcon class="h-5 w-5" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="p-[1.5px] rounded-[2rem] bg-gradient-to-br from-pink-500/50 to-transparent shadow-lg group">
                <div class="bg-[#0d0d12] rounded-[1.9rem] p-6 group-hover:bg-[#121218] transition-all h-full">
                    <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Total Views</p>
                    <div class="flex items-end justify-between">
                        <p class="text-3xl font-black text-white tracking-tighter">{{ stats.total_views || 0 }}</p>
                        <div class="p-3 rounded-2xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
                            <EyeIcon class="h-5 w-5" />
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section v-if="featuredModules?.length > 0" class="space-y-8">
            <div class="flex items-center gap-4 px-2">
                <div class="h-8 w-1 bg-gradient-to-b from-blue-500 to-pink-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.6)]"></div>
                <h2 class="text-2xl font-black text-white uppercase tracking-tighter">
                    Featured <span class="text-pink-500 italic underline decoration-blue-500 decoration-4 underline-offset-8">Picks</span>
                </h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div v-for="module in featuredModules" :key="module.id" 
                    class="p-[2px] rounded-[2.8rem] bg-gradient-to-br from-blue-600 via-indigo-500 to-pink-600 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)] transition-all duration-500 group">
                    <ModuleCard 
                        :module="module" 
                        @view="viewModule" 
                        class="bg-[#0d0d12] rounded-[2.7rem] overflow-hidden" 
                    />
                </div>
            </div>
        </section>

        <section class="space-y-6 pt-10 border-t border-white/5 relative">
            <div class="absolute -top-10 -right-10 w-40 h-40 bg-pink-600/10 rounded-full blur-[80px]"></div>
            
            <div class="flex items-center justify-between px-2">
                <h2 class="text-2xl font-black text-white uppercase tracking-tighter">All <span class="text-blue-500">Modules</span></h2>
                <span class="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] bg-white/5 px-4 py-1.5 rounded-full border border-white/5">Database Sync Active</span>
            </div>

            <div class="p-[2px] rounded-[3.5rem] bg-gradient-to-tr from-white/5 via-blue-500/20 to-pink-500/20 shadow-2xl">
                <div class="bg-[#08080a] rounded-[3.4rem] p-6 lg:p-10 shadow-inner">
                    <ModuleList />
                </div>
            </div>
        </section>

        <CreateModuleModal 
            v-if="showCreateModal" 
            @saved="handleModuleCreated" 
            @cancel="showCreateModal = false" 
        />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useModuleStore } from '@/stores/module';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/utils/useToast';
import { PlusIcon, BookOpenIcon, EyeIcon } from 'lucide-vue-next';
import ModuleCard from '@/components/modules/ModuleCard.vue';
import ModuleList from '@/components/modules/ModuleList.vue';
import CreateModuleModal from '@/components/modules/CreateModuleModal.vue';

const router = useRouter();
const moduleStore = useModuleStore();
const authStore = useAuthStore();
const toast = useToast();

const showCreateModal = ref(false);

const featuredModules = computed(() => moduleStore.featuredModules);
const stats = computed(() => moduleStore.stats);

// Inayos ang permission check base sa roles
const canManageModules = computed(() => {
    return ['admin', 'educator', 'moderator'].includes(authStore.user?.role);
});

const viewModule = (id) => {
    router.push({ name: 'user.module', params: { id } });
};

const handleModuleCreated = async () => {
    showCreateModal.value = false;
    toast.success('Module successfully added to the vault!');
    
    // Refresh data
    await moduleStore.fetchModules();
    await moduleStore.fetchFeaturedModules();
    if (canManageModules.value) {
        await moduleStore.fetchStats();
    }
};

onMounted(async () => {
    // Sabay na i-fetch para mas mabilis
    const promises = [moduleStore.fetchFeaturedModules()];
    
    if (canManageModules.value) {
        promises.push(moduleStore.fetchStats());
    }
    
    await Promise.all(promises).catch(err => {
        console.error("Initialization error:", err);
    });
});
</script>

<style scoped>
.animate-in {
    animation: dashboardEntry 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes dashboardEntry {
    from { opacity: 0; transform: translateY(15px) scale(0.99); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}

::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.2); border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: #ec4899; }
</style>