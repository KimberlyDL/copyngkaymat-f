<template>
    <div class="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <div class="fixed inset-0 bg-slate-900/60 dark:bg-[#020203]/90 backdrop-blur-md transition-opacity" @click="$emit('cancel')"></div>

        <div class="relative w-full max-w-3xl bg-white dark:bg-[#0d0d12] border border-slate-200 dark:border-white/10 rounded-[3rem] shadow-2xl overflow-hidden animate-in font-['Poppins'] text-black dark:text-white flex flex-col max-h-[95vh]">
            
            <header class="px-8 py-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-white/[0.01]">
                <div class="flex items-center gap-5">
                    <div class="h-10 w-1 bg-purple-600 rounded-full"></div>
                    <div class="space-y-0.5">
                        <h2 class="text-xl font-black uppercase tracking-tighter italic leading-none">
                            New <span class="text-purple-600">Unit</span>
                        </h2>
                        <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Initialize Registry Entry</p>
                    </div>
                </div>
                <button @click="$emit('cancel')" class="p-2 text-slate-400 hover:text-purple-600 transition-all text-2xl leading-none">&times;</button>
            </header>

            <form @submit.prevent="handleSubmit" class="p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                
                <div class="grid grid-cols-1 gap-5">
                    <div class="space-y-1.5">
                        <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1 italic">Destination Hub</label>
                        <div class="relative">
                            <select v-model="form.classroom_id"
                                class="w-full px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-[#0d0d12] border border-slate-200 dark:border-white/10 text-black dark:text-white text-xs font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-purple-500/30 appearance-none transition-all cursor-pointer shadow-inner">
                                <option :value="null">🌍 Public Access</option>
                                <option v-for="cls in classroomStore.classrooms" :key="cls.id" :value="cls.id">
                                    🔒 {{ cls.name }}
                                </option>
                            </select>
                            <div class="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-purple-600 text-[10px]">▼</div>
                        </div>
                    </div>

                    <div class="space-y-1.5">
                        <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Lesson Title</label>
                        <input v-model="form.title" type="text" required placeholder="Unit Name"
                            class="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-black dark:text-white text-sm outline-none focus:ring-2 focus:ring-purple-500/30 transition-all shadow-inner font-bold" />
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div class="space-y-1.5">
                            <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Category Type</label>
                            <div class="relative">
                                <select v-model="form.category" required
                                    class="w-full px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-[#0d0d12] border border-slate-200 dark:border-white/10 text-black dark:text-white text-xs font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-purple-500/30 appearance-none cursor-pointer">
                                    <option value="gad">Institutional</option>
                                    <option value="sexual_health">Health</option>
                                    <option value="vawc">Safety</option>
                                    <option value="general">Standard</option>
                                </select>
                                <div class="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-purple-600 text-[10px]">▼</div>
                            </div>
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Asset Level</label>
                            <div class="relative">
                                <select v-model="form.difficulty_level"
                                    class="w-full px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-[#0d0d12] border border-slate-200 dark:border-white/10 text-black dark:text-white text-xs font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-purple-500/30 appearance-none cursor-pointer">
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                                <div class="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-purple-600 text-[10px]">▼</div>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-1.5">
                        <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Summary</label>
                        <textarea v-model="form.description" rows="2" placeholder="Brief lesson overview"
                            class="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-black dark:text-white text-sm outline-none focus:ring-2 focus:ring-purple-500/30 transition-all resize-none shadow-inner font-bold"></textarea>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div class="p-5 bg-slate-50 dark:bg-[#0b0b0f] border border-slate-100 dark:border-white/5 rounded-3xl space-y-3">
                        <label class="text-[9px] font-black uppercase tracking-widest text-purple-600 flex items-center gap-2 italic">
                            <FileIcon class="w-3.5 h-3.5" /> Payload File
                        </label>
                        <div class="relative cursor-pointer">
                            <input type="file" accept=".pdf,.doc,.docx" @change="handleFileSelect" 
                                class="absolute inset-0 opacity-0 cursor-pointer z-10" />
                            <div class="flex items-center gap-3 p-3 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 group-hover:border-purple-600 transition-all shadow-sm">
                                <UploadIcon class="w-3.5 h-3.5 text-slate-400" />
                                <span class="text-[9px] text-slate-500 font-bold truncate italic">{{ moduleFile ? moduleFile.name : 'Select PDF/Word' }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="p-5 bg-slate-50 dark:bg-[#0b0b0f] border border-slate-100 dark:border-white/5 rounded-3xl space-y-3">
                        <label class="text-[9px] font-black uppercase tracking-widest text-purple-600 flex items-center gap-2 italic">
                            <ImageIcon class="w-3.5 h-3.5" /> Thumbnail
                        </label>
                        <div class="relative cursor-pointer">
                            <input type="file" accept="image/*" @change="handleThumbnailSelect" 
                                class="absolute inset-0 opacity-0 cursor-pointer z-10" />
                            <div class="flex items-center gap-3 p-3 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 group-hover:border-purple-600 transition-all shadow-sm">
                                <ImageIcon class="w-3.5 h-3.5 text-slate-400" />
                                <span class="text-[9px] text-slate-500 font-bold truncate italic">{{ thumbnail ? thumbnail.name : 'Select Cover' }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex items-center gap-10 p-6 bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 rounded-[2.2rem]">
                    <label class="flex items-center gap-3 cursor-pointer group">
                        <input v-model="form.is_published" type="checkbox" class="h-5 w-5 rounded-lg border-slate-200 dark:border-white/10 text-purple-600 focus:ring-purple-500/30" />
                        <span class="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-purple-600 transition-colors italic">Online</span>
                    </label>
                    <label class="flex items-center gap-3 cursor-pointer group">
                        <input v-model="form.is_featured" type="checkbox" class="h-5 w-5 rounded-lg border-slate-200 dark:border-white/10 text-purple-600 focus:ring-purple-500/30" />
                        <span class="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-purple-600 transition-colors italic">Priority</span>
                    </label>
                </div>
            </form>

            <footer class="px-8 py-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-end gap-5 bg-slate-50 dark:bg-white/[0.01]">
                <button type="button" @click="$emit('cancel')" 
                    class="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-black dark:hover:text-white transition-all italic">
                    Dismiss
                </button>
                <button type="button" @click="handleSubmit" :disabled="creating"
                    class="btn-3d-purple flex-1 max-w-[240px] py-4 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3">
                    <span v-if="!creating">Create Unit</span>
                    <div v-else class="animate-spin h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full"></div>
                </button>
            </footer>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { X as XIcon, Upload as UploadIcon, Image as ImageIcon, AlertCircle as AlertCircleIcon, FileIcon } from 'lucide-vue-next';
import { useModuleStore } from '@/stores/module';
import { useClassroomStore } from '@/stores/classroom';

const props = defineProps({
    defaultClassroomId: { type: Number, default: null }
});

const emit = defineEmits(['saved', 'cancel']);
const moduleStore = useModuleStore();
const classroomStore = useClassroomStore();

const form = reactive({
    title: '',
    description: '',
    content: '',
    category: 'general',
    difficulty_level: 'beginner',
    classroom_id: props.defaultClassroomId || null,
    order: 0,
    is_published: false,
    is_featured: false
});

const moduleFile = ref(null);
const thumbnail = ref(null);
const creating = ref(false);
const error = ref(null);

onMounted(async () => {
    if (classroomStore.classrooms.length === 0) {
        await classroomStore.fetchMyClassrooms();
    }
});

const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
            alert('PDF or Word docs only.');
            event.target.value = '';
            return;
        }
        if (file.size > 25 * 1024 * 1024) {
            alert('Limit: 25MB.');
            event.target.value = '';
            return;
        }
        moduleFile.value = file;
    }
};

const handleThumbnailSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
        if (!file.type.startsWith('image/')) {
            alert('Images only.');
            event.target.value = '';
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('Limit: 5MB.');
            event.target.value = '';
            return;
        }
        thumbnail.value = file;
    }
};

const handleSubmit = async () => {
    creating.value = true;
    error.value = null;
    try {
        const files = { moduleFile: moduleFile.value, thumbnail: thumbnail.value };
        await moduleStore.createModule(form, files);
        emit('saved');
    } catch (err) {
        error.value = err.response?.data?.message || 'Setup failed';
    } finally {
        creating.value = false;
    }
};
</script>

<style scoped>
.btn-3d-purple {
  background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
  box-shadow: 0 10px 20px -5px rgba(124, 58, 237, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.3);
}

@keyframes zoomIn {
    from { opacity: 0; transform: scale(0.97) translateY(20px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
}
.animate-in { animation: zoomIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(124, 58, 237, 0.2); border-radius: 10px; }

/* Fixed select option colors for Light Mode */
select option {
    background-color: white;
    color: black;
}
.dark select option {
    background-color: #0d0d12;
    color: white;
}
</style>