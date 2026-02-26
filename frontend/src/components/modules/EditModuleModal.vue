<template>
    <div class="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <div class="fixed inset-0 bg-[#020203]/90 backdrop-blur-md transition-opacity" @click="$emit('cancel')"></div>

        <div class="relative w-full max-w-4xl bg-[#0d0d12] border border-white/10 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] overflow-hidden animate-in zoom-in duration-300 font-['Poppins'] text-white flex flex-col max-h-[95vh]">
            
            <header class="px-10 py-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                <div class="flex items-center gap-6">
                    <div class="h-10 w-1.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)]"></div>
                    <div class="space-y-1">
                        <h2 class="text-2xl font-black uppercase tracking-tighter leading-none">
                            Edit <span class="bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">Module</span>
                        </h2>
                        <p class="text-[9px] font-black text-gray-600 uppercase tracking-[0.4em]">Edit or Update Module Details</p>
                    </div>
                </div>
                <button @click="$emit('cancel')" class="p-3 text-gray-600 hover:text-white transition-all text-3xl leading-none">&times;</button>
            </header>

            <form @submit.prevent="handleSubmit" class="p-10 space-y-6 overflow-y-auto custom-scrollbar flex-1 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent">
                
                <div class="grid grid-cols-1 gap-6">
                    <div class="space-y-2 group">
                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-600 ml-1 group-focus-within:text-blue-400">Title *</label>
                        <input v-model="form.title" type="text" required placeholder="Module title"
                            class="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-inner" />
                    </div>

                    <div class="space-y-2 group">
                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-600 ml-1 group-focus-within:text-pink-400">Description</label>
                        <textarea v-model="form.description" rows="2" placeholder="Module description"
                            class="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-sm outline-none focus:ring-2 focus:ring-pink-500/50 transition-all resize-none shadow-inner"></textarea>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="space-y-2 group">
                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-600 ml-1 group-focus-within:text-blue-400">Category *</label>
                        <div class="relative">
                            <select v-model="form.category" required
                                class="w-full px-6 py-4 rounded-2xl bg-[#0d0d12] border border-white/10 text-white text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer">
                                <option value="gad">GAD</option>
                                <option value="sexual_health">Sexual Health</option>
                                <option value="vawc">VAWC</option>
                                <option value="general">General</option>
                            </select>
                            <div class="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-blue-500 font-black text-[10px]">▼</div>
                        </div>
                    </div>
                    <div class="space-y-2 group">
                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-600 ml-1 group-focus-within:text-pink-400">Difficulty</label>
                        <div class="relative">
                            <select v-model="form.difficulty_level"
                                class="w-full px-6 py-4 rounded-2xl bg-[#0d0d12] border border-white/10 text-white text-xs font-bold outline-none focus:ring-2 focus:ring-pink-500/50 appearance-none cursor-pointer">
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                            <div class="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-pink-500 font-black text-[10px]">▼</div>
                        </div>
                    </div>
                    <div class="space-y-2 group">
                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-600 ml-1 group-focus-within:text-blue-400">Order</label>
                        <input v-model.number="form.order" type="number" min="0"
                            class="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div class="p-[1.5px] rounded-[2.5rem] bg-gradient-to-br from-blue-600/30 to-transparent">
                        <div class="bg-[#0b0b0f] rounded-[2.4rem] p-6 space-y-4 h-full">
                            <label class="text-[10px] font-black uppercase tracking-widest text-blue-400 flex items-center gap-2">
                                <div class="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></div> Module File (PDF/Word)
                            </label>
                            <input type="file" accept=".pdf,.doc,.docx" @change="handleFileSelect" ref="fileInput"
                                class="w-full text-[10px] text-gray-500 file:bg-blue-600/10 file:text-blue-400 file:border-none file:px-4 file:py-2 file:rounded-xl file:mr-4 file:font-black file:uppercase file:text-[8px] cursor-pointer" />
                            <div v-if="module.file_name" class="p-3 bg-black/40 rounded-xl border border-white/5 flex justify-between items-center">
                                <span class="text-[9px] text-gray-500 truncate max-w-[150px] italic">{{ module.file_name }}</span>
                                <button v-if="newFile" @click="clearFile" type="button" class="text-[8px] font-black text-red-500 uppercase tracking-widest hover:text-white transition-colors">Clear</button>
                            </div>
                        </div>
                    </div>

                    <div class="p-[1.5px] rounded-[2.5rem] bg-gradient-to-br from-pink-600/30 to-transparent">
                        <div class="bg-[#0b0b0f] rounded-[2.4rem] p-6 space-y-4 h-full">
                            <label class="text-[10px] font-black uppercase tracking-widest text-pink-400 flex items-center gap-2">
                                <div class="h-1.5 w-1.5 rounded-full bg-pink-500 animate-pulse"></div> Thumbnail Image
                            </label>
                            <div class="flex items-center gap-4">
                                <div v-if="module.thumbnail_url && !newThumbnail" class="shrink-0">
                                    <img :src="module.thumbnail_url" class="w-16 h-10 object-cover rounded-xl border border-pink-500/20 shadow-lg shadow-pink-900/20" />
                                </div>
                                <div class="flex-1 space-y-2">
                                    <input type="file" accept="image/*" @change="handleThumbnailSelect" ref="thumbnailInput"
                                        class="w-full text-[10px] text-gray-500 file:bg-pink-600/10 file:text-pink-400 file:border-none file:px-4 file:py-2 file:rounded-xl file:mr-4 file:font-black file:uppercase file:text-[8px] cursor-pointer" />
                                    <button v-if="newThumbnail" @click="clearThumbnail" type="button" class="text-[8px] font-black text-red-500 uppercase tracking-widest hover:underline">Cancel New</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex items-center gap-8 p-6 bg-white/[0.01] border border-white/5 rounded-[2.5rem]">
                    <label class="flex items-center gap-3 cursor-pointer group">
                        <input v-model="form.is_published" type="checkbox" class="h-5 w-5 rounded bg-[#0d0d12] border-white/10 text-blue-600 focus:ring-blue-500/40" />
                        <span class="text-[11px] font-black uppercase tracking-widest text-gray-500 group-hover:text-blue-400 transition-colors">Published</span>
                    </label>
                    <label class="flex items-center gap-3 cursor-pointer group">
                        <input v-model="form.is_featured" type="checkbox" class="h-5 w-5 rounded bg-[#0d0d12] border-white/10 text-pink-600 focus:ring-pink-500/40" />
                        <span class="text-[11px] font-black uppercase tracking-widest text-gray-500 group-hover:text-pink-400 transition-colors">Featured</span>
                    </label>
                </div>
            </form>

            <footer class="px-10 py-8 border-t border-white/5 flex items-center justify-end gap-6 bg-white/[0.01]">
                <button type="button" @click="$emit('cancel')" 
                    class="px-10 py-5 text-[11px] font-black uppercase tracking-[0.4em] text-gray-600 hover:text-white transition-all">
                    Cancel
                </button>
                <button type="button" @click="handleSubmit" :disabled="saving"
                    class="flex-1 max-w-[280px] py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600 text-white text-[11px] font-black uppercase tracking-[0.4em] rounded-[2rem] shadow-[0_20px_50px_-10px_rgba(59,130,246,0.4)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-500 disabled:opacity-50 flex items-center justify-center gap-4">
                    <span v-if="!saving">Save Changes</span>
                    <div v-else class="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></div>
                </button>
            </footer>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useModuleStore } from '@/stores/module';

const props = defineProps({
    module: { type: Object, required: true }
});

const emit = defineEmits(['saved', 'cancel']);
const moduleStore = useModuleStore();

const form = reactive({
    title: props.module.title,
    description: props.module.description,
    content: props.module.content,
    category: props.module.category,
    difficulty_level: props.module.difficulty_level,
    order: props.module.order,
    is_published: props.module.is_published,
    is_featured: props.module.is_featured
});

const newFile = ref(null);
const newThumbnail = ref(null);
const saving = ref(false);
const error = ref(null);

const fileInput = ref(null);
const thumbnailInput = ref(null);

const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
        if (file.size > 25 * 1024 * 1024) { alert('Limit 25MB.'); return; }
        newFile.value = file;
    }
};

const handleThumbnailSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
        if (file.size > 5 * 1024 * 1024) { alert('Limit 5MB.'); return; }
        newThumbnail.value = file;
    }
};

const clearFile = () => { newFile.value = null; if (fileInput.value) fileInput.value.value = ''; };
const clearThumbnail = () => { newThumbnail.value = null; if (thumbnailInput.value) thumbnailInput.value.value = ''; };

const handleSubmit = async () => {
    saving.value = true;
    try {
        await moduleStore.updateModule(props.module.id, form);
        if (newFile.value) await moduleStore.uploadModuleFile(props.module.id, newFile.value);
        if (newThumbnail.value) await moduleStore.uploadThumbnail(props.module.id, newThumbnail.value);
        emit('saved');
    } catch (err) {
        console.error(err);
    } finally {
        saving.value = false;
    }
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.2); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ec4899; }

@keyframes zoomIn {
    from { opacity: 0; transform: scale(0.97) translateY(20px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
}
.animate-in { animation: zoomIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

input, select, textarea { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
</style>