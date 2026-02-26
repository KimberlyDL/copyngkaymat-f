<template>
    <div class="space-y-8 font-['Poppins'] animate-in fade-in duration-700 text-white selection:bg-pink-500/30">
        
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
            <button @click="handleBack" 
                class="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-all outline-none">
                <div class="p-2 rounded-xl bg-white/5 border border-white/5 group-hover:border-blue-500/50 group-hover:bg-blue-500/10 transition-all shadow-sm">
                    <ArrowLeftIcon class="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                </div>
                Return to Library
            </button>

            <div class="flex items-center gap-3">
                <button v-if="canEdit" @click="showQuizModal = true"
                    class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600 text-white rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-900/20 hover:scale-[1.02] active:scale-[0.98]">
                    <PlusIcon class="w-4 h-4" /> Add Gamified Quiz
                </button>

                <button @click="toggleSidebar"
                    class="hidden lg:flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest hover:bg-white/10 shadow-sm">
                    <InfoIcon class="w-4 h-4 text-blue-400" />
                    {{ sidebarOpen ? 'Hide' : 'Show' }} Info
                </button>
            </div>
        </div>

        <div v-if="loading" class="flex flex-col items-center justify-center py-32 space-y-4">
            <div class="h-12 w-12 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            <p class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">Syncing Node Payload...</p>
        </div>

        <div v-else-if="error" class="bg-red-950/10 border border-red-500/20 rounded-[2.5rem] p-12 text-center space-y-6">
            <AlertCircleIcon class="w-16 h-16 mx-auto text-red-500 opacity-50" />
            <h3 class="text-xl font-black uppercase tracking-tighter text-white">Registry Error</h3>
            <p class="text-gray-400 text-sm max-w-md mx-auto">{{ error }}</p>
            <button @click="handleBack" class="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest underline decoration-red-500/30">Return to Library</button>
        </div>

        <div v-else-if="module" class="flex flex-col lg:flex-row gap-8 items-start">
            <div class="flex-1 space-y-8 w-full min-w-0">
                <div class="p-[2px] rounded-[3rem] bg-gradient-to-br from-blue-600/50 via-purple-600/50 to-pink-600/50 shadow-2xl">
                    <div class="bg-[#0d0d12] rounded-[2.9rem] p-8 lg:p-12 relative overflow-hidden group">
                        <div class="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/5 rounded-full blur-[80px]"></div>
                        <div class="relative z-10 flex flex-col md:flex-row justify-between items-start gap-6">
                            <div class="flex-1 space-y-5">
                                <div class="flex flex-wrap items-center gap-3">
                                    <span class="px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-[9px] font-black uppercase tracking-widest italic shadow-lg shadow-blue-900/20">
                                        {{ formatCategory(module.category) }}
                                    </span>
                                    <span v-if="module.is_featured" class="px-4 py-1.5 bg-gradient-to-r from-yellow-500 to-orange-600 text-black rounded-full text-[9px] font-black uppercase tracking-widest">⭐ Featured Node</span>
                                </div>
                                <h1 class="text-4xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-none group-hover:text-blue-400 transition-colors">
                                    {{ module.title }}
                                </h1>
                                <p class="text-xs text-gray-500 font-medium leading-relaxed italic max-w-2xl">{{ module.description }}</p>
                            </div>

                            <div v-if="canEdit" class="flex gap-2">
                                <button @click="editModule" class="p-3.5 bg-white/5 rounded-2xl text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 border border-white/5 hover:border-blue-500/30 transition-all shadow-sm">
                                    <Edit2Icon class="w-4 h-4" />
                                </button>
                                <button @click="confirmDelete" class="p-3.5 bg-white/5 rounded-2xl text-gray-500 hover:text-red-500 hover:bg-red-500/10 border border-white/5 hover:border-red-500/30 transition-all shadow-sm">
                                    <Trash2Icon class="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div class="relative z-10 flex flex-wrap items-center gap-8 mt-10 pt-10 border-t border-white/5">
                            <div class="flex items-center gap-2.5 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                <BarChart2Icon class="w-4 h-4 text-pink-500" />
                                Complexity // <span class="text-white ml-1 italic font-bold tracking-tight">{{ module.difficulty_level }}</span>
                            </div>
                            <div class="flex items-center gap-2.5 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                <EyeIcon class="w-4 h-4 text-blue-500" />
                                Engagement // <span class="text-white ml-1 italic font-bold tracking-tight">{{ module.view_count || 0 }} Views</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="quizzes && quizzes.length > 0" class="space-y-5">
                    <div class="flex items-center gap-4 px-2">
                        <h2 class="text-xl font-black text-white uppercase tracking-tighter italic">Gamified <span class="text-pink-500">Reviewers</span></h2>
                        <div class="h-px flex-1 bg-gradient-to-r from-pink-500/20 to-transparent"></div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div v-for="quiz in quizzes" :key="quiz.id" 
                            class="p-[1.5px] rounded-[2rem] bg-gradient-to-br from-pink-500/40 via-purple-600/40 to-blue-600/40 hover:scale-[1.02] transition-all duration-500 group cursor-pointer shadow-lg shadow-pink-950/10"
                            @click="handleQuizClick(quiz.id)">
                            <div class="bg-[#0d0d12] rounded-[1.9rem] p-6 flex justify-between items-center group-hover:bg-[#121218] transition-colors">
                                <div class="space-y-1">
                                    <h3 class="text-sm font-black text-white uppercase tracking-widest group-hover:text-pink-400 transition-colors">{{ quiz.title }}</h3>
                                    <span class="text-[8px] font-black uppercase tracking-[0.2em] text-gray-600 italic">
                                        GAME MODE // <span class="text-pink-500/80">{{ quiz.quiz_type?.replace('_', ' ') }}</span>
                                    </span>
                                </div>
                                <div class="w-11 h-11 rounded-2xl flex items-center justify-center transition-all shadow-lg"
                                    :class="isPlayer ? 'bg-pink-500/10 border border-pink-500/20 text-pink-500 group-hover:bg-pink-500 group-hover:text-white' : 'bg-white/5 border border-white/10 text-gray-500'">
                                    <PlayIcon v-if="isPlayer" class="w-4 h-4 fill-current" />
                                    <EyeIcon v-else class="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="p-[2px] rounded-[3.2rem] bg-gradient-to-tr from-blue-600/30 via-indigo-600/30 to-pink-600/30 shadow-2xl">
                    <div class="bg-[#08080a] rounded-[3.1rem] p-6 lg:p-10 min-h-[500px] overflow-hidden">
                        <DocumentViewer v-if="module.file_url" :file-url="module.file_url" :file-name="module.file_name" :file-type="module.file_type" />
                        <div v-else class="flex flex-col items-center justify-center py-32 text-center space-y-4 opacity-30 italic text-gray-500 font-black uppercase">
                            <FileIcon class="w-12 h-12" />
                            <p class="text-[10px] tracking-widest">No Document Payload Attached</p>
                        </div>
                    </div>
                </div>

                <div v-if="module.content" class="p-[2px] rounded-[3.2rem] bg-gradient-to-b from-white/10 via-white/5 to-transparent shadow-2xl">
                    <div class="bg-[#0d0d12] rounded-[3.1rem] p-10 lg:p-16">
                        <h2 class="text-2xl font-black text-white uppercase tracking-tighter italic mb-10 flex items-center gap-4">
                            <div class="h-8 w-1.5 bg-gradient-to-b from-blue-500 to-pink-500 rounded-full shadow-glow"></div>
                            Lesson <span class="bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">Material</span>
                        </h2>
                        <div class="prose prose-invert prose-sm max-w-none prose-headings:text-blue-400 prose-p:text-gray-400 prose-strong:text-white" v-html="module.content"></div>
                    </div>
                </div>
            </div>

            <transition enter-active-class="transition-all duration-500 ease-out" leave-active-class="transition-all duration-500 ease-in" enter-from-class="opacity-0 translate-x-12" enter-to-class="opacity-100 translate-x-0">
                <div v-if="sidebarOpen" class="w-full lg:w-80 xl:w-[420px] lg:sticky top-24 shrink-0">
                    <div class="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3.5rem] overflow-hidden shadow-2xl">
                        <ModuleSidebar :module="module" @close="sidebarOpen = false" />
                    </div>
                </div>
            </transition>
        </div>

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

// Stores & Utils
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

// Local States
const sidebarOpen = ref(false);
const error = ref(null);
const loading = ref(true);
const showDeleteModal = ref(false);
const showEditModal = ref(false);
const showQuizModal = ref(false);
const quizzes = ref([]);

// Computed
const module = computed(() => moduleStore.currentModule);
const canEdit = computed(() => ['admin', 'educator', 'moderator'].includes(authStore.user?.role));
const isPlayer = computed(() => authStore.user?.role === 'player');

const toggleSidebar = () => { sidebarOpen.value = !sidebarOpen.value; };

const formatCategory = (c) => {
    const map = { 'gad': 'GAD', 'sexual_health': 'SEXUAL EDUCATION', 'vawc': 'VAWC', 'general': 'GENERAL NODE' };
    return map[c] || c?.toUpperCase() || 'UNKNOWN';
};

const refreshQuizzes = async () => {
    try {
        const result = await quizStore.fetchQuizzesByModule(route.params.id);
        quizzes.value = result || [];
    } catch (err) { 
        console.error("Quiz Sync failed:", err); 
    }
};

const handleBack = () => {
    if (route.path.startsWith('/facilitator')) {
        router.push({ name: 'facilitator.modules' });
    } else {
        router.push({ name: 'user.modules' });
    }
};

const handleQuizClick = (id) => {
    if (isPlayer.value) {
        router.push({ name: 'quiz.player', params: { id } });
    } else {
        toast.info("Facilitator Mode: Preview is view-only.");
    }
};

const editModule = () => { showEditModal.value = true; };
const confirmDelete = () => { showDeleteModal.value = true; };

const handleDelete = async () => {
    try {
        await moduleStore.deleteModule(module.value.id);
        toast.success('Module deleted successfully');
        handleBack();
    } catch (err) { 
        toast.error('Delete request rejected'); 
    } finally { 
        showDeleteModal.value = false; 
    }
};

const handleModuleUpdated = async () => {
    showEditModal.value = false;
    toast.success('Registry synchronized');
    await moduleStore.fetchModuleById(route.params.id);
};

// INITIALIZATION LOGIC
onMounted(async () => {
    loading.value = true;
    error.value = null;
    
    try {
        const moduleId = route.params.id;
        if (!moduleId) throw new Error("Missing Node ID");

        // 1. Fetch Module Data
        await moduleStore.fetchModuleById(moduleId);
        
        // Double check kung nakuha ba talaga (para iwas 404 behavior sa frontend)
        if (!moduleStore.currentModule) {
            throw new Error("The node you are looking for has been moved or does not exist.");
        }

        // 2. Fetch Associated Quizzes
        await refreshQuizzes();

        // 3. UI adjustments
        if (window.innerWidth >= 1024) { sidebarOpen.value = true; }

    } catch (err) {
        console.error("Mount Error:", err);
        // Dito natin sinisigurado na ang "The node you are looking for..." error ay mahuhuli
        error.value = err.response?.data?.message || err.message || 'Node identity not found';
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
.shadow-glow { filter: drop-shadow(0 0 12px rgba(59, 130, 246, 0.4)); }
:deep(.prose h1), :deep(.prose h2), :deep(.prose h3) {
    color: #60a5fa; text-transform: uppercase; font-weight: 900;
    letter-spacing: -0.02em; margin-top: 2.5rem;
}
:deep(.prose p) { line-height: 1.8; margin-bottom: 1.25rem; }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: #3b82f6; }
</style>