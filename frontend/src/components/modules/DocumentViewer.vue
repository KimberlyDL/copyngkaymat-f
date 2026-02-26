<template>
    <div ref="viewerContainer" class="space-y-4 font-['Poppins'] animate-in fade-in duration-500 bg-transparent">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-3xl backdrop-blur-md">
            <div class="flex items-center gap-4">
                <div class="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400 shadow-lg shadow-blue-900/20">
                    <FileTextIcon class="w-5 h-5" />
                </div>
                <div class="min-w-0">
                    <h3 class="text-sm font-black text-white uppercase tracking-tight truncate">{{ fileName || 'Resource_Node' }}</h3>
                    <p class="text-[9px] font-black text-gray-500 uppercase tracking-widest italic leading-none mt-1">{{ formatFileType(fileType) }}</p>
                </div>
            </div>

            <div class="flex items-center gap-2">
                <button @click="toggleFullScreen"
                    class="p-2.5 bg-white/5 border border-white/10 text-gray-400 hover:text-pink-500 hover:border-pink-500/30 rounded-xl transition-all"
                    title="Toggle Full Screen">
                    <MaximizeIcon v-if="!isFullScreen" class="w-4 h-4" />
                    <MinimizeIcon v-else class="w-4 h-4" />
                </button>

                <button v-if="canPreview && isPDF" @click="viewMode = viewMode === 'preview' ? 'download' : 'preview'"
                    class="p-2.5 bg-white/5 border border-white/10 text-gray-400 hover:text-blue-400 hover:border-blue-500/30 rounded-xl transition-all">
                    <EyeIcon v-if="viewMode !== 'preview'" class="w-4 h-4" />
                    <DownloadIcon v-else class="w-4 h-4" />
                </button>

                <a :href="fileUrl" :download="fileName" target="_blank"
                    class="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-pink-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-blue-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                    <DownloadIcon class="w-3.5 h-3.5" />
                    <span>Download</span>
                </a>
            </div>
        </div>

        <div :class="['relative group p-[1px] rounded-[2.5rem] transition-all duration-500', isFullScreen ? 'bg-transparent' : 'bg-gradient-to-b from-white/10 to-transparent shadow-2xl']">
            <div :class="['rounded-[2.45rem] overflow-hidden bg-[#0d0d12] border border-white/5', isFullScreen ? 'h-screen rounded-none border-none' : '']">
                
                <div v-if="canPreview && viewMode === 'preview'" class="relative h-full">
                    <iframe :src="isPDF ? fileUrl + '#toolbar=1' : getGoogleDocsViewerUrl()" 
                        :class="['w-full transition-all duration-500 custom-iframe', isFullScreen ? 'h-screen' : 'h-[600px] md:h-[800px]']" 
                        frameborder="0"
                        @load="previewLoaded = true" 
                        @error="previewError = true">
                    </iframe>

                    <div v-if="!previewLoaded && !previewError"
                        class="absolute inset-0 flex flex-col items-center justify-center bg-[#0d0d12] space-y-4">
                        <div class="h-10 w-10 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                        <p class="text-[9px] font-black uppercase tracking-[0.4em] text-gray-600 animate-pulse">Syncing Preview...</p>
                    </div>
                </div>

                <div v-else class="flex flex-col items-center justify-center py-24 px-8 text-center bg-[#0d0d12]">
                    <FileIcon class="w-16 h-16 text-pink-500 opacity-50 mb-6" />
                    <h3 class="text-lg font-black text-white uppercase tracking-tighter mb-8">{{ fileName }}</h3>
                    <a :href="fileUrl" :download="fileName" 
                        class="px-10 py-4 bg-gradient-to-r from-pink-600 to-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl">
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
    AlertCircle as AlertCircleIcon, File as FileIcon, Lightbulb as LightbulbIcon 
} from 'lucide-vue-next';

const props = defineProps({
    fileUrl: { type: String, required: true },
    fileName: { type: String, default: 'Document_Node' },
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
            console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
};

const handleFullScreenChange = () => {
    isFullScreen.value = !!document.fullscreenElement;
};

const formatFileType = (t) => {
    const map = { 'application/pdf': 'Portable Document (PDF)', 'application/msword': 'Word (.doc)' };
    return map[t] || 'RESOURCE NODE';
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
.custom-iframe {
    filter: invert(0.9) hue-rotate(180deg) brightness(1.1) contrast(1.1);
    mix-blend-mode: lighten;
}

/* Entry Animation */
.animate-in {
    animation: viewerEntry 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes viewerEntry {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Fullscreen Specific Styles */
:fullscreen .custom-iframe {
    height: 100vh !important;
}
:fullscreen .bg-white\/\[0\.02\] {
    background: #060606;
    border-radius: 0;
    border-bottom: 1px solid rgba(255,255,255,0.1);
}
</style>