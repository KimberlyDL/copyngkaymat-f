<template>
    <div class="min-h-screen bg-transparent custom-font-poppins text-slate-900 dark:text-white selection:bg-purple-500/30 overflow-x-hidden transition-colors duration-500">
        
        <div class="p-4 lg:p-8 space-y-6 animate-in relative z-10 max-w-[1920px] mx-auto">
            
            <!-- Compact Modern Header -->
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 dark:border-purple-500/10 pb-6">
                <div class="space-y-1">
                    <div class="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                        <div class="p-1 bg-purple-500/10 rounded-md shadow-inner">
                            <Package class="w-3.5 h-3.5" />
                        </div>
                        <span class="text-[9px] font-[900] uppercase tracking-[0.3em] italic">Personal Collection</span>
                    </div>
                    <h1 class="text-3xl lg:text-5xl font-[900] uppercase tracking-tighter italic leading-none">
                        My <span class="text-purple-600 italic">Inventory</span>
                    </h1>
                </div>

                <div class="flex items-center gap-4">
                     <!-- Count Pill -->
                    <div class="bg-white dark:bg-[#0d0d12] border border-slate-200 dark:border-purple-500/20 px-5 py-2.5 rounded-xl shadow-sm hover:shadow-purple-500/10 transition-all flex items-center gap-3 group">
                        <div class="flex flex-col items-end leading-none">
                            <span class="text-[8px] font-[900] text-slate-400 uppercase tracking-widest italic">Total Items</span>
                            <span class="text-xl font-[900] text-purple-600 dark:text-purple-400 italic tabular-nums group-hover:scale-105 transition-transform">
                                {{ inventory.length }}
                            </span>
                        </div>
                        <CheckCircle class="w-5 h-5 text-green-500" />
                    </div>

                    <!-- Shop Link -->
                    <router-link :to="{ name: 'user.rewards-shop' }" 
                        class="px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg shadow-purple-500/20 transition-all flex items-center gap-2 group">
                        <span class="text-[9px] font-[900] uppercase tracking-widest italic hidden md:inline">Visit Shop</span>
                        <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </router-link>
                </div>
            </div>

            <!-- Ultra-Dense Grid Layout -->
            <div v-if="!isLoading && inventory.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 lg:gap-4">
                <div v-for="item in inventory" :key="item.id" 
                    class="group relative bg-white dark:bg-[#0d0d12] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col">
                    
                    <!-- Owned Badge -->
                    <div class="absolute top-2 right-2 z-20 pointer-events-none">
                        <div class="px-2 py-0.5 bg-green-500/90 backdrop-blur-md rounded-md border border-white/10 text-[8px] font-[900] text-white uppercase tracking-wider italic flex items-center gap-1">
                            <CheckCircle class="w-3 h-3" />
                            <span>Owned</span>
                        </div>
                    </div>

                    <!-- Image Area (Compact) -->
                    <div class="h-28 lg:h-32 bg-slate-50 dark:bg-white/[0.02] relative overflow-hidden group-hover:bg-purple-50 dark:group-hover:bg-purple-900/10 transition-colors shrink-0">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                        <img v-if="item.reward?.image_url" 
                            :src="item.reward.image_url" 
                            class="object-cover w-full h-full opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-700 ease-out" 
                            @error="handleImageError" />
                        <div v-else class="w-full h-full flex items-center justify-center">
                            <Gift class="w-8 h-8 text-slate-300 dark:text-gray-700 group-hover:text-purple-400 transition-colors" />
                        </div>
                    </div>

                    <!-- Content -->
                    <div class="p-3 flex flex-col flex-1 gap-2">
                        <div class="min-h-[2.5rem]">
                            <h3 class="text-xs lg:text-sm font-[900] text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none mb-1 line-clamp-2 group-hover:text-purple-600 transition-colors">
                                {{ item.reward?.title || 'Unknown Reward' }}
                            </h3>
                        </div>

                        <div class="mt-auto pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2">
                            <div class="flex flex-col">
                                <span class="text-[8px] font-[900] text-slate-400 uppercase tracking-wider italic">Unlocked</span>
                                <span class="text-[10px] font-[900] text-slate-600 dark:text-gray-400 italic">
                                    {{ formatDate(item.claimed_at) }}
                                </span>
                            </div>
                            
                            <div class="flex flex-col items-end">
                                <span class="text-[8px] font-[900] text-slate-400 uppercase tracking-wider italic">XP Value</span>
                                <span class="text-[10px] font-[900] text-purple-600 dark:text-purple-400 italic">
                                    {{ item.reward?.xp_cost?.toLocaleString() || 0 }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="isLoading" class="py-20 text-center animate-pulse">
                <Loader2 class="w-8 h-8 text-purple-500 animate-spin mx-auto mb-2" />
                <h3 class="text-[10px] font-[900] uppercase italic tracking-widest text-slate-400">Syncing Inventory...</h3>
            </div>

            <!-- Empty State -->
            <div v-if="!isLoading && inventory.length === 0" class="py-20 text-center">
                <div class="inline-flex p-4 bg-slate-100 dark:bg-white/5 rounded-2xl mb-4">
                    <PackageOpen class="w-8 h-8 text-slate-300 dark:text-gray-700" />
                </div>
                <h3 class="text-lg font-[900] uppercase italic tracking-tighter text-slate-400">Empty Inventory</h3>
                <p class="text-[10px] font-bold text-slate-500 mt-1 mb-6 italic uppercase tracking-wider">No assets claimed yet.</p>
                <router-link :to="{ name: 'user.rewards-shop' }" 
                    class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-xl text-[9px] font-[900] uppercase tracking-[0.2em] italic hover:scale-105 active:scale-95 transition-all shadow-lg shadow-purple-900/20">
                    <span>Access Registry</span>
                    <ArrowRight class="w-3 h-3" />
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Package, Gift, CheckCircle, PackageOpen, ArrowRight, Loader2 } from 'lucide-vue-next';
import { useToast } from '@/utils/useToast';
import axios from '@/utils/api';

const toast = useToast();
const inventory = ref([]);
const isLoading = ref(true);

const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
};

const handleImageError = (event) => {
    event.target.style.display = 'none';
};

const loadInventory = async () => {
    isLoading.value = true;
    try {
        const { data } = await axios.get('/api/rewards/my-inventory');
        inventory.value = data.inventory || [];
    } catch (err) {
        console.error('Failed to load inventory:', err);
        toast.error('Failed to load your inventory');
    } finally {
        isLoading.value = false;
    }
};

onMounted(loadInventory);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700;1,900&display=swap');

.custom-font-poppins {
    font-family: 'Poppins', sans-serif !important;
}

.animate-in {
    animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-thumb { background: rgba(147, 51, 234, 0.2); border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: #9333ea; }
</style>