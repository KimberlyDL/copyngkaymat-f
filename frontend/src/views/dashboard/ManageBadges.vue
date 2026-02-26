<template>
    <div class="p-4 md:p-8 space-y-8 bg-[#060608] min-h-screen font-['Poppins'] text-white selection:bg-pink-500/30">
        <div class="max-w-5xl mx-auto space-y-8">
            
            <!-- --- HEADER SECTION --- -->
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
                <div>
                    <h1 class="text-3xl font-black uppercase tracking-tighter italic font-heading">
                        Badge <span class="text-blue-500">Registry</span>
                    </h1>
                    <p class="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mt-1">Badges for Achievements</p>
                </div>
                
                <!-- UPLOAD TRIGGER NODE (Siksik Button) -->
                <button @click="$refs.fileInput.click()" 
                    class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-900/20 hover:scale-[1.02] active:scale-[0.98]">
                    <UploadCloudIcon class="w-4 h-4" /> Add new badge
                </button>
                <input type="file" @change="onFileSelect" ref="fileInput" class="hidden" accept="image/*" />
            </div>

            <!-- --- UPLOAD DROPZONE NODE --- -->
            <div @click="$refs.fileInput.click()" 
                class="group relative overflow-hidden bg-[#0d0d12] border border-white/5 rounded-[2.5rem] p-10 text-center cursor-pointer transition-all hover:border-blue-500/30 shadow-2xl">
                <div class="absolute -right-20 -top-20 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-blue-600/10 transition-all"></div>
                
                <div class="relative z-10 space-y-4">
                    <div class="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-3xl flex items-center justify-center mx-auto text-blue-400 group-hover:scale-110 transition-transform duration-500 shadow-glow-blue">
                        <PlusIcon class="w-8 h-8" />
                    </div>
                    <div>
                        <p class="text-xs font-black uppercase tracking-[0.2em] text-white">Upload New Badge</p>
                        <p class="text-[9px] font-bold text-gray-600 uppercase tracking-widest mt-1">Drag and drop here or upload a file.</p>
                    </div>
                </div>
            </div>

            <!-- --- BADGE GRID REGISTRY --- -->
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                <div v-for="badge in badges" :key="badge.id" 
                    class="group relative p-[1px] rounded-[2rem] bg-white/5 hover:bg-gradient-to-br hover:from-blue-600/40 hover:to-pink-600/40 transition-all duration-500 shadow-xl">
                    
                    <div class="bg-[#0d0d12] rounded-[1.9rem] p-6 aspect-square flex flex-col items-center justify-center relative overflow-hidden">
                        <!-- Badge Asset -->
                        <img :src="`http://localhost:3000${badge.iconPath}`" 
                            class="max-h-24 max-w-24 object-contain relative z-10 group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
                        
                        <!-- Background Signal -->
                        <div class="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                        <!-- PURGE ACTION (Delete) -->
                        <button @click="deleteBadge(badge.id)" 
                            class="absolute top-3 right-3 p-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white shadow-lg active:scale-90">
                            <Trash2Icon class="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <!-- Metadata Label -->
                    <div class="mt-3 px-2 text-center">
                        <p class="text-[8px] font-black text-gray-600 uppercase tracking-[0.2em] group-hover:text-blue-400 transition-colors">Badge ID // {{ badge.id }}</p>
                    </div>
                </div>
            </div>

            <!-- EMPTY STATE -->
            <div v-if="badges.length === 0" class="text-center py-32 bg-[#0d0d12] rounded-[3rem] border border-dashed border-white/5">
                <DatabaseIcon class="w-12 h-12 mx-auto text-gray-800 mb-4" />
                <p class="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em]">Vault is Empty</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { 
    UploadCloud as UploadCloudIcon, 
    Trash2 as Trash2Icon, 
    Plus as PlusIcon,
    Database as DatabaseIcon
} from 'lucide-vue-next';

const badges = ref([]);
const fileInput = ref(null);

const fetchBadges = async () => {
    try {
        const { data } = await axios.get('http://localhost:3000/api/badges');
        badges.value = data;
    } catch (err) {
        console.error("Registry fetch failed:", err);
    }
};

const onFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('badge', file);

    try {
        await axios.post('http://localhost:3000/api/v1/badges', formData);
        fetchBadges();
    } catch (err) {
        console.error("Link injection failed:", err.response?.data || err.message);
    }
};

const deleteBadge = async (id) => {
    // Note: confirm can be customized later to match bento look
    if (!confirm('Remove this badge?')) return;
    try {
        await axios.delete(`http://localhost:3000/api/badges/${id}`);
        fetchBadges();
    } catch (err) {
        console.error("Delete request failed:", err);
    }
};

onMounted(fetchBadges);
</script>

<style scoped>
@reference "@/style.css";

.shadow-glow-blue { filter: drop-shadow(0 0 12px rgba(59, 130, 246, 0.3)); }

.custom-scrollbar::-webkit-scrollbar { width: 3px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ec4899; }
</style>