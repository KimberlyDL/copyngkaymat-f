<template>
    <div class="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <div class="fixed inset-0 bg-slate-900/60 dark:bg-[#020203]/90 backdrop-blur-md transition-opacity" @click="$emit('cancel')"></div>

        <div class="relative w-full max-w-4xl bg-white dark:bg-[#0d0d12] border border-slate-200 dark:border-white/10 rounded-[3rem] shadow-2xl overflow-hidden animate-in font-['Poppins'] text-black dark:text-white flex flex-col max-h-[95vh]">
            
            <header class="px-8 py-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-white/[0.01]">
                <div class="flex items-center gap-5">
                    <div class="h-10 w-1 bg-purple-600 rounded-full"></div>
                    <div class="space-y-0.5">
                        <h2 class="text-xl font-black uppercase tracking-tighter italic leading-none">
                            Update <span class="text-purple-600">Modules</span>
                        </h2>
                        <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Edit Lesson Details</p>
                    </div>
                </div>
                <button @click="$emit('cancel')" class="p-2 text-slate-400 hover:text-purple-600 transition-all text-2xl leading-none">&times;</button>
            </header>

            <form @submit.prevent="handleSubmit" class="p-8 md:p-10 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                
                <div class="grid grid-cols-1 gap-5">
                    <div class="space-y-2">
                        <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Lesson Title</label>
                        <input v-model="form.title" type="text" required placeholder="Enter title"
                            class="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-black dark:text-white text-sm outline-none focus:ring-2 focus:ring-purple-500/30 transition-all shadow-inner font-bold" />
                    </div>

                    <div class="space-y-2">
                        <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Description</label>
                        <textarea v-model="form.description" rows="2" placeholder="Brief lesson overview"
                            class="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-black dark:text-white text-sm outline-none focus:ring-2 focus:ring-purple-500/30 transition-all resize-none shadow-inner font-bold"></textarea>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div class="space-y-2">
                        <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Type</label>
                        <div class="relative">
                            <select v-model="form.category" required
                                class="w-full px-6 py-4 rounded-2xl bg-slate-100 dark:bg-[#0d0d12] border border-slate-200 dark:border-white/10 text-black dark:text-white text-xs font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-purple-500/30 appearance-none cursor-pointer">
                                <option value="gad">Institutional</option>
                                <option value="sexual_health">Health</option>
                                <option value="vawc">Safety</option>
                                <option value="general">Standard</option>
                            </select>
                            <div class="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-purple-600 text-[10px]">▼</div>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Level</label>
                        <div class="relative">
                            <select v-model="form.difficulty_level"
                                class="w-full px-6 py-4 rounded-2xl bg-slate-100 dark:bg-[#0d0d12] border border-slate-200 dark:border-white/10 text-black dark:text-white text-xs font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-purple-500/30 appearance-none cursor-pointer">
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                            <div class="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-purple-600 text-[10px]">▼</div>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Sort Order</label>
                        <input v-model.number="form.order" type="number" min="0"
                            class="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-black dark:text-white text-sm outline-none focus:ring-2 focus:ring-purple-500/30 transition-all font-bold" />
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    <div class="p-6 bg-slate-50 dark:bg-[#0b0b0f] border border-slate-100 dark:border-white/5 rounded-[2rem] space-y-4">
                        <label class="text-[9px] font-black uppercase tracking-widest text-purple-600 flex items-center gap-2">
                            <FileIcon class="w-3 h-3" /> Lesson Document
                        </label>
                        <input type="file" accept=".pdf,.doc,.docx" @change="handleFileSelect" ref="fileInput"
                            class="w-full text-[10px] text-slate-500 file:bg-purple-600/10 file:text-purple-600 file:border-none file:px-4 file:py-1.5 file:rounded-lg file:mr-4 file:font-black file:uppercase file:text-[8px] cursor-pointer" />
                        <div v-if="module.file_name" class="p-3 bg-white dark:bg-black/40 rounded-xl border border-slate-100 dark:border-white/5 flex justify-between items-center shadow-sm">
                            <span class="text-[9px] text-slate-500 truncate max-w-[150px] italic font-bold">{{ module.file_name }}</span>
                            <button v-if="newFile" @click="clearFile" type="button" class="text-[8px] font-black text-red-500 uppercase tracking-widest">Remove</button>
                        </div>
                    </div>

                    <div class="p-6 bg-slate-50 dark:bg-[#0b0b0f] border border-slate-100 dark:border-white/5 rounded-[2rem] space-y-4">
                        <label class="text-[9px] font-black uppercase tracking-widest text-purple-600 flex items-center gap-2">
                            <ImageIcon class="w-3 h-3" /> Thumbnail Asset
                        </label>
                        <div class="flex items-center gap-4">
                            <div v-if="module.thumbnail_url && !newThumbnail" class="shrink-0">
                                <img :src="module.thumbnail_url" class="w-12 h-8 object-cover rounded-lg border border-slate-200 dark:border-white/10" />
                            </div>
                            <div class="flex-1 space-y-2">
                                <input type="file" accept="image/*" @change="handleThumbnailSelect" ref="thumbnailInput"
                                    class="w-full text-[10px] text-slate-500 file:bg-purple-600/10 file:text-purple-600 file:border-none file:px-4 file:py-1.5 file:rounded-lg file:mr-4 file:font-black file:uppercase file:text-[8px] cursor-pointer" />
                                <button v-if="newThumbnail" @click="clearThumbnail" type="button" class="text-[8px] font-black text-red-500 uppercase tracking-widest">Cancel New</button>
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
                <button type="button" @click="handleSubmit" :disabled="saving"
                    class="btn-3d-purple flex-1 max-w-[240px] py-4 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3">
                    <span v-if="!saving">Save Changes</span>
                    <div v-else class="animate-spin h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full"></div>
                </button>
            </footer>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useModuleStore } from '@/stores/module';
import { FileIcon, ImageIcon } from 'lucide-vue-next';

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
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(124, 58, 237, 0.2); border-radius: 10px; }

.btn-3d-purple {
  background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
  box-shadow: 
    0 10px 20px -5px rgba(124, 58, 237, 0.3), 
    inset 0 2px 4px rgba(255, 255, 255, 0.3);
}

@keyframes modalEntry {
    from { opacity: 0; transform: scale(0.98) translateY(20px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
}
.animate-in { animation: modalEntry 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

input, select, textarea { transition: all 0.3s ease; }

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