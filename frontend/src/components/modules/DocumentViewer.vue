<template>
    <div ref="viewerContainer" class="space-y-6 custom-font-poppins animate-in bg-transparent text-black dark:text-white">
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white dark:bg-[#0d0d12] border border-slate-200 dark:border-white/10 p-5 rounded-[2rem] shadow-xl transition-colors duration-500">
            <div class="flex items-center gap-5">
                <div class="p-3.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-purple-600 shadow-inner">
                    <FileTextIcon class="w-6 h-6" />
                </div>
                <div class="min-w-0">
                    <h3 class="text-sm font-black uppercase tracking-tight truncate italic leading-none">{{ fileName || 'Document Asset' }}</h3>
                    <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5 italic">{{ formatFileType(fileType) }}</p>
                </div>
            </div>

            <div class="flex items-center gap-3">
                <div class="flex items-center p-1 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10">
                    <button @click="toggleFullScreen"
                        class="p-2.5 text-slate-400 hover:text-purple-600 transition-all"
                        title="Fullscreen">
                        <MaximizeIcon v-if="!isFullScreen" class="w-4 h-4" />
                        <MinimizeIcon v-else class="w-4 h-4" />
                    </button>

                    <button v-if="canPreview && isPDF" @click="viewMode = viewMode === 'preview' ? 'download' : 'preview'"
                        class="p-2.5 text-slate-400 hover:text-purple-600 transition-all">
                        <EyeIcon v-if="viewMode !== 'preview'" class="w-4 h-4" />
                        <DownloadIcon v-else class="w-4 h-4" />
                    </button>
                </div>

                <a :href="fileUrl" :download="fileName" target="_blank"
                    class="btn-3d-purple flex items-center justify-center gap-3 px-8 py-3.5 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl active:scale-95 transition-all shadow-lg border-t border-white/20">
                    <DownloadIcon class="w-4 h-4" />
                    <span>Download</span>
                </a>
            </div>
        </div>

        <div :class="['relative group transition-all duration-700', isFullScreen ? '' : 'p-[1px] rounded-[3.5rem] bg-slate-200 dark:bg-white/10 shadow-2xl']">
            <div :class="['overflow-hidden bg-slate-50 dark:bg-[#08080a]', isFullScreen ? 'h-screen' : 'rounded-[3.45rem] border border-slate-200 dark:border-white/5 shadow-inner']">
                
                <div v-if="canPreview && viewMode === 'preview'" class="relative h-full">
                    <iframe :src="isPDF ? fileUrl + '#toolbar=1' : getGoogleDocsViewerUrl()" 
                        :class="['w-full transition-all duration-700 dark:custom-iframe-dark', isFullScreen ? 'h-screen' : 'h-[600px] md:h-[850px]']" 
                        frameborder="0"
                        @load="previewLoaded = true" 
                        @error="previewError = true">
                    </iframe>

                    <div v-if="!previewLoaded && !previewError"
                        class="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-[#0d0d12] space-y-5">
                        <div class="h-12 w-12 border-4 border-purple-500/10 border-t-purple-600 rounded-full animate-spin"></div>
                        <p class="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse italic">Connecting Asset...</p>
                    </div>
                </div>

                <div v-else class="flex flex-col items-center justify-center py-40 px-10 text-center bg-white dark:bg-[#0d0d12]">
                    <div class="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-3xl flex items-center justify-center mb-8 border border-slate-100 dark:border-white/5 shadow-inner">
                        <FileIcon class="w-10 h-10 text-purple-600 opacity-50" />
                    </div>
                    <h3 class="text-xl font-black uppercase tracking-tighter mb-10 italic">{{ fileName }}</h3>
                    <a :href="fileUrl" :download="fileName" 
                        class="px-12 py-5 bg-black dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all">
                        Download Now
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { 
    FileText as FileTextIcon, Download as DownloadIcon, Eye as EyeIcon, 
    Maximize as MaximizeIcon, Minimize as MinimizeIcon, 
    File as FileIcon 
} from 'lucide-vue-next';

const props = defineProps({
    fileUrl: { type: String, required: true },
    fileName: { type: String, default: 'Document_Asset' },
    fileType: { type: String, default: 'application/pdf' }
});

const viewerContainer = ref(null);
const isFullScreen = ref(false);
const viewMode = ref('preview');
const previewLoaded = ref(false);
const previewError = ref(false);

const isPDF = computed(() => props.fileType === 'application/pdf' || props.fileName?.toLowerCase().endsWith('.pdf'));
const isWord = computed(() => props.fileType.includes('word') || props.fileName?.toLowerCase().match(/\.(doc|docx)$/));
const canPreview = computed(() => isPDF.value || isWord.value);

const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
        viewerContainer.value?.requestFullscreen().catch(err => {
            console.error(`Fullscreen Error: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
};

const handleFullScreenChange = () => {
    isFullScreen.value = !!document.fullscreenElement;
};

const formatFileType = (t) => {
    const map = { 'application/pdf': 'PDF Document', 'application/msword': 'Word Document' };
    return map[t] || 'Registry Asset';
};

const getGoogleDocsViewerUrl = () => `https://docs.google.com/viewer?url=${encodeURIComponent(props.fileUrl)}&embedded=true`;

onMounted(() => {
    document.addEventListener('fullscreenchange', handleFullScreenChange);
});

onUnmounted(() => {
    document.removeEventListener('fullscreenchange', handleFullScreenChange);
});
</script>

<style scoped>
.custom-font-poppins { font-family: 'Poppins', sans-serif !important; }

/* Invert PDF only in Dark Mode */
.dark .custom-iframe-dark {
    filter: invert(0.9) hue-rotate(180deg) brightness(1.1) contrast(1.1);
    mix-blend-mode: lighten;
}

.btn-3d-purple {
  background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
  box-shadow: 0 12px 24px -8px rgba(124, 58, 237, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.35);
}

.animate-in {
    animation: viewerEntry 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes viewerEntry {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Fullscreen Logic */
:fullscreen .h-screen { height: 100vh !important; }
:fullscreen .bg-white {
    background: #ffffff;
    border-radius: 0;
    border-bottom: 1px solid #e2e8f0;
}
.dark :fullscreen .dark\:bg-\[\#0d0d12\] {
    background: #060606;
    border-bottom: 1px solid rgba(255,255,255,0.05);
}
</style>