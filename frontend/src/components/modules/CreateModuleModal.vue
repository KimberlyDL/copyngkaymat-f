<template>
    <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" @click.self="$emit('cancel')">
        <div class="absolute inset-0 bg-[#020203]/80 backdrop-blur-md transition-opacity" @click="$emit('cancel')"></div>

        <div class="relative w-full max-w-3xl bg-[#0d0d12] border border-white/10 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] overflow-hidden animate-in zoom-in duration-500 font-['Poppins'] text-white">
            
            <div class="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                <div class="space-y-1">
                    <h2 class="text-xl font-black uppercase tracking-tighter">
                        Create <span class="bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">New Module</span>
                    </h2>
                    <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">Draft your next teaching lesson</p>
                </div>
                <button @click="$emit('cancel')" class="p-2 text-gray-600 hover:text-white transition-colors">
                    <XIcon class="w-5 h-5" />
                </button>
            </div>

            <form @submit.prevent="handleSubmit" class="p-8 space-y-5 max-h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar">
                
                <div class="grid grid-cols-1 gap-5">
                    <div class="space-y-1.5 group">
                        <label class="text-[9px] font-black uppercase tracking-widest text-gray-600 ml-1 group-focus-within:text-blue-400 transition-colors italic">Visibility / Destination</label>
                        <select v-model="form.classroom_id"
                            class="w-full px-5 py-3.5 rounded-2xl bg-[#0d0d12] border border-white/10 text-white text-xs outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none transition-all cursor-pointer shadow-sm">
                            <option :value="null">🌍 Public (Visible to Everyone)</option>
                            <option v-for="cls in classroomStore.classrooms" :key="cls.id" :value="cls.id">
                                🔒 {{ cls.name }} (Classroom Only)
                            </option>
                        </select>
                    </div>

                    <div class="space-y-1.5 group">
                        <label class="text-[9px] font-black uppercase tracking-widest text-gray-600 ml-1 group-focus-within:text-blue-400 transition-colors">Module Title *</label>
                        <input v-model="form.title" type="text" required placeholder="Enter lesson title"
                            class="w-full px-5 py-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-xs outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm" />
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div class="space-y-1.5 group">
                            <label class="text-[9px] font-black uppercase tracking-widest text-gray-600 ml-1 group-focus-within:text-pink-400 transition-colors">Category *</label>
                            <select v-model="form.category" required
                                class="w-full px-5 py-3.5 rounded-2xl bg-[#0d0d12] border border-white/10 text-white text-xs outline-none focus:ring-2 focus:ring-pink-500/50 appearance-none transition-all cursor-pointer shadow-sm">
                                <option value="gad">GAD</option>
                                <option value="sexual_health">Sexual Health</option>
                                <option value="vawc">VAWC</option>
                                <option value="general">General</option>
                            </select>
                        </div>
                        <div class="space-y-1.5 group">
                            <label class="text-[9px] font-black uppercase tracking-widest text-gray-600 ml-1 group-focus-within:text-blue-400 transition-colors">Difficulty</label>
                            <select v-model="form.difficulty_level"
                                class="w-full px-5 py-3.5 rounded-2xl bg-[#0d0d12] border border-white/10 text-white text-xs outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none transition-all cursor-pointer shadow-sm">
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>
                    </div>

                    <div class="space-y-1.5 group">
                        <label class="text-[9px] font-black uppercase tracking-widest text-gray-600 ml-1 group-focus-within:text-pink-400 transition-colors">Description</label>
                        <textarea v-model="form.description" rows="2" placeholder="Brief overview of the module"
                            class="w-full px-5 py-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-xs outline-none focus:ring-2 focus:ring-pink-500/50 transition-all resize-none shadow-sm"></textarea>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div class="p-5 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-blue-500/30 transition-all">
                        <label class="block text-[9px] font-black uppercase tracking-widest text-gray-500 mb-3 group-hover:text-blue-400">Lesson File (PDF/Word)</label>
                        <div class="relative cursor-pointer">
                            <input type="file" accept=".pdf,.doc,.docx" @change="handleFileSelect" 
                                class="absolute inset-0 opacity-0 cursor-pointer z-10" />
                            <div class="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 group-hover:bg-blue-500/5">
                                <UploadIcon class="w-4 h-4 text-gray-600 group-hover:text-blue-500" />
                                <span class="text-[10px] text-gray-400 truncate">{{ moduleFile ? moduleFile.name : 'Choose file...' }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="p-5 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-pink-500/30 transition-all">
                        <label class="block text-[9px] font-black uppercase tracking-widest text-gray-500 mb-3 group-hover:text-pink-400">Cover Photo</label>
                        <div class="relative cursor-pointer">
                            <input type="file" accept="image/*" @change="handleThumbnailSelect" 
                                class="absolute inset-0 opacity-0 cursor-pointer z-10" />
                            <div class="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 group-hover:bg-pink-500/5">
                                <ImageIcon class="w-4 h-4 text-gray-600 group-hover:text-pink-500" />
                                <span class="text-[10px] text-gray-400 truncate">{{ thumbnail ? thumbnail.name : 'Choose image...' }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex items-center gap-4 p-5 bg-white/[0.01] rounded-3xl border border-white/5">
                    <label class="flex items-center gap-3 cursor-pointer group">
                        <input v-model="form.is_published" type="checkbox" class="h-4 w-4 rounded bg-white/5 border-white/10 text-blue-600 focus:ring-blue-500/40" />
                        <span class="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-300 transition-colors">Publish Now</span>
                    </label>
                    <div class="w-px h-4 bg-white/5"></div>
                    <label class="flex items-center gap-3 cursor-pointer group">
                        <input v-model="form.is_featured" type="checkbox" class="h-4 w-4 rounded bg-white/5 border-white/10 text-pink-600 focus:ring-pink-500/40" />
                        <span class="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-300 transition-colors">Feature Item</span>
                    </label>
                </div>

                <div v-if="error" class="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 flex items-center gap-3">
                    <AlertCircleIcon class="w-4 h-4 text-red-500" />
                    <p class="text-[10px] font-bold text-red-400 uppercase tracking-widest">{{ error }}</p>
                </div>
            </form>

            <div class="px-8 py-6 border-t border-white/5 flex items-center justify-end gap-4 bg-white/[0.01]">
                <button type="button" @click="$emit('cancel')" 
                    class="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all bg-white/5 rounded-2xl border border-transparent hover:border-white/10">
                    Cancel
                </button>
                <button type="button" @click="handleSubmit" :disabled="creating"
                    class="flex-1 max-w-[240px] py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 disabled:opacity-50 flex items-center justify-center gap-3">
                    <span v-if="!creating">Create Module</span>
                    <div v-else class="flex items-center gap-2">
                        <div class="animate-spin h-3 w-3 border-2 border-white/30 border-t-white rounded-full"></div>
                        Processing...
                    </div>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { X as XIcon, Upload as UploadIcon, Image as ImageIcon, AlertCircle as AlertCircleIcon } from 'lucide-vue-next';
import { useModuleStore } from '@/stores/module';
import { useClassroomStore } from '@/stores/classroom'; // Import classroom store

const props = defineProps({
    defaultClassroomId: { type: Number, default: null } // Optional prop if opened from class page
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
    classroom_id: props.defaultClassroomId || null, // Pre-select if provided
    order: 0,
    is_published: false,
    is_featured: false
});

const moduleFile = ref(null);
const thumbnail = ref(null);
const creating = ref(false);
const error = ref(null);

onMounted(async () => {
    // Fetch classrooms to populate the dropdown
    if (classroomStore.classrooms.length === 0) {
        await classroomStore.fetchMyClassrooms();
    }
});

const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
            error.value = 'PDF or Word docs only.';
            event.target.value = '';
            return;
        }
        if (file.size > 25 * 1024 * 1024) {
            error.value = 'Limit: 25MB.';
            event.target.value = '';
            return;
        }
        moduleFile.value = file;
        error.value = null;
    }
};

const handleThumbnailSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
        if (!file.type.startsWith('image/')) {
            error.value = 'Images only.';
            event.target.value = '';
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            error.value = 'Limit: 5MB.';
            event.target.value = '';
            return;
        }
        thumbnail.value = file;
        error.value = null;
    }
};

const handleSubmit = async () => {
    creating.value = true;
    error.value = null;
    try {
        const files = { moduleFile: moduleFile.value, thumbnail: thumbnail.value };
        
        // Ensure data passed to store includes classroom_id
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
.animate-in {
    animation: zoomIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes zoomIn {
    from { opacity: 0; transform: scale(0.95) translateY(10px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
}

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }

input, select, textarea {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>