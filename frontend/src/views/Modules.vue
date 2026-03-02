<template>
  <div class="custom-font-poppins animate-in min-h-screen p-4 md:p-10 text-black dark:text-white bg-slate-50 dark:bg-[#050507] transition-all duration-500 selection:bg-purple-500/30">
    
    <header class="max-w-[1600px] mx-auto mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
      <div class="space-y-2">
        <h1 class="text-3xl md:text-4xl font-[900] uppercase tracking-tighter italic leading-none text-black dark:text-white">
          Academy <span class="text-purple-600">Library</span>
        </h1>
        <p class="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Institutional Knowledge Base</p>
      </div>

      <div class="flex items-center gap-4">
        <div v-if="stats" class="hidden md:flex items-center gap-6 mr-6 border-r border-slate-200 dark:border-white/10 pr-6">
           <div class="text-right">
              <div class="text-[10px] uppercase font-black text-slate-400 tracking-widest">Total Units</div>
              <div class="text-2xl font-[900] italic leading-none text-black dark:text-white">{{ stats.total_modules || 0 }}</div>
           </div>
           <div class="text-right">
              <div class="text-[10px] uppercase font-black text-slate-400 tracking-widest">Total Reads</div>
              <div class="text-2xl font-[900] italic leading-none text-black dark:text-white">{{ stats.total_views || 0 }}</div>
           </div>
        </div>

        <button v-if="canManageModules" @click="showCreateModal = true"
          class="btn-3d-purple group flex items-center gap-3 px-6 py-3 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-95 hover:-translate-y-0.5">
          <PlusIcon class="w-4 h-4" />
          <span>New Entry</span>
        </button>
      </div>
    </header>

    <main class="max-w-[1600px] mx-auto space-y-12">
      
      <!-- Featured Section (Horizontal) -->
      <section v-if="featuredModules?.length > 0" class="space-y-4">
        <div class="flex items-center gap-4">
            <div class="h-8 w-1 bg-purple-600 rounded-full"></div>
            <h2 class="text-sm font-black uppercase tracking-[0.2em] text-slate-400 italic">Priority Units</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="module in featuredModules" :key="module.id" 
            @click="viewModule(module.id)"
            class="group bg-white dark:bg-[#0d0d12] border border-slate-200 dark:border-white/5 p-6 rounded-[2rem] hover:border-purple-600/50 transition-all cursor-pointer shadow-sm hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden">
            
            <!-- Decor -->
            <div class="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/5 rounded-full group-hover:bg-purple-500/10 transition-colors"></div>

            <div class="relative z-10 flex flex-col h-full justify-between gap-4">
              <div class="flex justify-between items-start">
                  <div class="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600">
                    <BookOpenIcon class="w-5 h-5" />
                  </div>
                  <span class="text-[9px] font-black uppercase tracking-widest text-purple-600 bg-purple-50 dark:bg-purple-500/10 px-2 py-1 rounded-lg">Featured</span>
              </div>
              
              <div>
                <h3 class="text-sm font-black uppercase italic tracking-tight leading-tight group-hover:text-purple-600 transition-colors line-clamp-2 mb-1">
                  {{ module.title }}
                </h3>
                <p class="text-[10px] font-medium text-slate-400 line-clamp-1 dark:text-slate-500">{{ module.category || 'Standard' }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Registry Interface -->
      <section class="space-y-6">
         <!-- Module List Container -->
        <div class="min-h-[600px]">
          <ModuleList />
        </div>
      </section>
    </main>

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
import { PlusIcon, BookOpenIcon, EyeIcon, ArrowRightIcon } from 'lucide-vue-next';
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

const canManageModules = computed(() => {
    return ['admin', 'educator', 'moderator'].includes(authStore.user?.role);
});

const viewModule = (id) => {
    router.push({ name: 'user.module', params: { id } });
};

const handleModuleCreated = async () => {
    showCreateModal.value = false;
    toast.success('Integrity Check: Lesson Successfully Uploaded');
    
    await moduleStore.fetchModules();
    await moduleStore.fetchFeaturedModules();
    if (canManageModules.value) {
        await moduleStore.fetchStats();
    }
};

onMounted(async () => {
    const promises = [moduleStore.fetchFeaturedModules()];
    if (canManageModules.value) {
        promises.push(moduleStore.fetchStats());
    }
    await Promise.all(promises).catch(err => {
        console.error("Archive Link Failure:", err);
    });
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700;1,900&display=swap');

.custom-font-poppins { font-family: 'Poppins', sans-serif !important; }

/* REFINED 3D BUTTON (Solid shadows, no glowing neon) */
.btn-3d-purple {
  background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
  box-shadow: 
    0 10px 20px -5px rgba(124, 58, 237, 0.4), 
    inset 0 2px 4px rgba(255, 255, 255, 0.35), 
    inset 0 -3px 6px rgba(0, 0, 0, 0.15);
}

.animate-in { 
  animation: portalEntry 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
}

@keyframes portalEntry {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Slim Custom Scrollbar */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.dark ::-webkit-scrollbar-thumb { background: #1e1e2d; }
</style>