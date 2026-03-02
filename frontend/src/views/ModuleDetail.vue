<template>
  <div class="custom-font-poppins animate-in min-h-screen bg-slate-50 dark:bg-[#050507] text-black dark:text-white p-4 md:p-8 transition-all duration-500">
    
    <header class="max-w-[1500px] mx-auto mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-[#0d0d12] p-4 rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-sm">
      <button @click="handleBack" 
        class="group flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-purple-600 transition-all outline-none">
        <div class="p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 group-hover:border-purple-600 transition-all">
          <ArrowLeftIcon class="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
        </div>
        Back to Archive
      </button>

      <div class="flex items-center gap-2">
        <button v-if="canEdit" @click="showQuizModal = true"
          class="btn-3d-purple flex items-center gap-2 px-6 py-3 text-white rounded-xl transition-all font-black text-[9px] uppercase tracking-widest shadow-lg active:scale-95">
          <PlusIcon class="w-3.5 h-3.5" /> 
          <span>Add Quiz</span>
        </button>
        <button @click="toggleSidebar"
          class="hidden lg:flex items-center gap-2 px-6 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl transition-all font-black text-[9px] uppercase tracking-widest hover:border-purple-600 shadow-sm">
          <InfoIcon class="w-3.5 h-3.5 text-purple-600" />
          {{ sidebarOpen ? 'Hide' : 'View' }} Details
        </button>
      </div>
    </header>

    <div v-if="loading" class="flex flex-col items-center justify-center py-24 space-y-4">
      <div class="h-10 w-10 border-4 border-purple-500/10 border-t-purple-600 rounded-full animate-spin"></div>
      <p class="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse">Syncing Unit Content...</p>
    </div>

    <div v-else-if="error" class="max-w-xl mx-auto bg-white dark:bg-[#0d0d12] border border-red-500/20 rounded-[2.5rem] p-12 text-center space-y-6 shadow-2xl">
      <AlertCircleIcon class="w-12 h-12 text-red-500 mx-auto opacity-50" />
      <h3 class="text-xl font-black uppercase tracking-tighter italic leading-none">Registry Error</h3>
      <p class="text-slate-500 text-[11px] font-bold leading-relaxed italic">{{ error }}</p>
      <button @click="handleBack" class="px-8 py-3 bg-red-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg">Return to Safety</button>
    </div>

    <main v-else-if="module" class="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      <div class="lg:col-span-8 space-y-6">
        
        <div class="bg-white dark:bg-[#0d0d12] border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-6 md:p-10 shadow-xl relative overflow-hidden">
          <div class="relative z-10 flex flex-col md:flex-row justify-between items-start gap-6">
            <div class="flex-1 space-y-4">
              <div class="flex flex-wrap items-center gap-2">
                <span class="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 rounded-full text-[8px] font-black uppercase tracking-widest italic">
                  {{ formatCategory(module.category) }}
                </span>
                <span v-if="module.is_featured" class="px-3 py-1 bg-black dark:bg-white text-white dark:text-black rounded-full text-[8px] font-black uppercase tracking-widest">
                  Priority Unit
                </span>
              </div>
              <h1 class="text-3xl md:text-5xl font-[900] uppercase tracking-tighter leading-none italic">
                {{ module.title }}
              </h1>
              <p class="text-[11px] text-slate-500 font-bold leading-relaxed italic max-w-2xl border-l-2 border-purple-600 pl-6 opacity-80">
                {{ module.description }}
              </p>
            </div>

            <div v-if="canEdit" class="flex gap-2 shrink-0">
              <button @click="editModule" class="p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-400 hover:text-purple-600 transition-all">
                <Edit2Icon class="w-4 h-4" />
              </button>
              <button @click="confirmDelete" class="p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-400 hover:text-red-500 transition-all">
                <Trash2Icon class="w-4 h-4" />
              </button>
            </div>
          </div>

          <div class="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 flex flex-wrap items-center gap-8">
            <div v-for="meta in [{i: BarChart2Icon, l: 'Complexity', v: module.difficulty_level}, {i: EyeIcon, l: 'Total Reads', v: (module.view_count || 0)}]" :key="meta.l" 
              class="flex items-center gap-2.5">
              <component :is="meta.i" class="w-3.5 h-3.5 text-purple-600" />
              <div class="flex flex-col leading-none">
                <span class="text-[7px] font-black text-slate-400 uppercase tracking-widest">{{ meta.l }}</span>
                <span class="text-[10px] font-[900] uppercase italic tracking-tight mt-0.5">{{ meta.v }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white/50 dark:bg-[#0d0d12]/50 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-6 shadow-2xl overflow-hidden min-h-[400px]">
          <DocumentViewer v-if="module.file_url" :file-url="module.file_url" :file-name="module.file_name" :file-type="module.file_type" />
          <div v-else class="py-24 flex flex-col items-center justify-center opacity-20 italic font-black uppercase">
            <FileIcon class="w-10 h-10 mb-2 text-slate-400" />
            <p class="text-[9px] tracking-[0.3em]">No Document Payload</p>
          </div>
        </div>
      </div>

      <div class="lg:col-span-4 space-y-6">
        
        <section v-if="quizzes && quizzes.length > 0" class="space-y-4">
          <h2 class="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 px-2 italic">Unit Assessment</h2>
          <div class="grid grid-cols-1 gap-3">
            <div v-for="quiz in quizzes" :key="quiz.id" @click="handleQuizClick(quiz.id)"
              class="group bg-white dark:bg-[#0d0d12] border border-slate-200 dark:border-white/10 rounded-2xl p-4 flex justify-between items-center transition-all cursor-pointer hover:border-purple-600 shadow-sm">
              <div class="space-y-0.5">
                <h3 class="text-[10px] font-black uppercase tracking-widest group-hover:text-purple-600 transition-colors">{{ quiz.title }}</h3>
                <p class="text-[8px] font-bold uppercase text-slate-400 italic">Game Type: {{ quiz.quiz_type?.replace('_', ' ') }}</p>
              </div>
              <PlayIcon v-if="isPlayer" class="w-3 h-3 text-purple-600 fill-current group-hover:scale-110 transition-transform" />
              <EyeIcon v-else class="w-3.5 h-3.5 text-slate-300" />
            </div>
          </div>
        </section>

        <div v-if="module.content" class="bg-white dark:bg-[#0d0d12] border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 shadow-2xl">
          <h2 class="text-[10px] font-black uppercase tracking-widest italic mb-4 flex items-center gap-3">
            <div class="h-4 w-1 bg-purple-600 rounded-full"></div>
            Material Index
          </h2>
          <div class="prose prose-slate dark:prose-invert max-w-none prose-headings:text-[11px] prose-p:text-[10px] text-[10px] leading-relaxed italic font-medium opacity-80" v-html="module.content"></div>
        </div>

        <transition enter-active-class="transition-all duration-300" leave-active-class="transition-all duration-300" enter-from-class="opacity-0 translate-y-4" enter-to-class="opacity-100 translate-x-0">
          <aside v-if="sidebarOpen" class="bg-white dark:bg-[#0a0a0f] border border-slate-200 dark:border-white/10 rounded-[2.2rem] overflow-hidden shadow-2xl">
            <ModuleSidebar :module="module" @close="sidebarOpen = false" />
          </aside>
        </transition>
      </div>
    </main>

    <DeleteConfirmModal v-if="showDeleteModal" :module-title="module?.title" @confirm="handleDelete" @cancel="showDeleteModal = false" />
    <EditModuleModal v-if="showEditModal" :module="module" @saved="handleModuleUpdated" @cancel="showEditModal = false" />
    <CreateQuizModal :is-open="showQuizModal" :module-id="module?.id" @close="showQuizModal = false" @saved="refreshQuizzes" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { 
    ArrowLeftIcon, PlusIcon, InfoIcon, Edit2Icon, 
    Trash2Icon, EyeIcon, BarChart2Icon, PlayIcon, 
    FileIcon, AlertCircleIcon 
} from 'lucide-vue-next';

// Stores
import { useModuleStore } from '@/stores/module';
import { useQuizStore } from '@/stores/quiz';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/utils/useToast';

// Components
import DocumentViewer from '@/components/modules/DocumentViewer.vue';
import ModuleSidebar from '@/components/modules/ModuleSidebar.vue';
import DeleteConfirmModal from '@/components/modules/DeleteConfirmModal.vue';
import EditModuleModal from '@/components/modules/EditModuleModal.vue';
import CreateQuizModal from '@/components/modules/CreateQuizModal.vue';

const route = useRoute();
const router = useRouter();
const moduleStore = useModuleStore();
const quizStore = useQuizStore();
const authStore = useAuthStore();
const toast = useToast();

const sidebarOpen = ref(false);
const error = ref(null);
const loading = ref(true);
const showDeleteModal = ref(false);
const showEditModal = ref(false);
const showQuizModal = ref(false);
const quizzes = ref([]);

const module = computed(() => moduleStore.currentModule);
const canEdit = computed(() => ['admin', 'educator', 'moderator'].includes(authStore.user?.role));
const isPlayer = computed(() => authStore.user?.role === 'player');

const toggleSidebar = () => { sidebarOpen.value = !sidebarOpen.value; };

const formatCategory = (c) => {
    const map = { 'gad': 'Culture', 'sexual_health': 'Health', 'vawc': 'Safety', 'general': 'Standard' };
    return map[c] || c?.toUpperCase() || 'Other';
};

const refreshQuizzes = async () => {
    try {
        const result = await quizStore.fetchQuizzesByModule(route.params.id);
        quizzes.value = result || [];
    } catch (err) { console.error(err); }
};

const handleBack = () => {
    const name = route.path.startsWith('/facilitator') ? 'facilitator.modules' : 'user.modules';
    router.push({ name });
};

const handleQuizClick = (id) => {
    if (isPlayer.value) router.push({ name: 'quiz.player', params: { id } });
    else toast.info("Facilitator View: Preview only.");
};

const editModule = () => { showEditModal.value = true; };
const confirmDelete = () => { showDeleteModal.value = true; };

const handleDelete = async () => {
    try {
        await moduleStore.deleteModule(module.value.id);
        toast.success('Unit removed.');
        handleBack();
    } catch (err) { toast.error('Removal failed.'); }
    finally { showDeleteModal.value = false; }
};

const handleModuleUpdated = async () => {
    showEditModal.value = false;
    toast.success('Archive synced.');
    await moduleStore.fetchModuleById(route.params.id);
};

onMounted(async () => {
    loading.value = true;
    error.value = null;
    try {
        const moduleId = route.params.id;
        if (!moduleId) throw new Error("Invalid Node ID");
        await moduleStore.fetchModuleById(moduleId);
        if (!moduleStore.currentModule) throw new Error("Unit not found in archive.");
        await refreshQuizzes();
        if (window.innerWidth >= 1024) { sidebarOpen.value = true; }
    } catch (err) {
        error.value = err.response?.data?.message || err.message || 'Access Error';
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
.custom-font-poppins { font-family: 'Poppins', sans-serif !important; }

.btn-3d-purple {
  background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
  box-shadow: 0 8px 16px -4px rgba(124, 58, 237, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.3);
}

.animate-in { animation: compactEntry 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes compactEntry {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.dark ::-webkit-scrollbar-thumb { background: #1e1e2d; }
</style>