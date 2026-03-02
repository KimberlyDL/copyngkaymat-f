<template>
    <div class="min-h-screen bg-transparent custom-font-poppins text-slate-900 dark:text-white selection:bg-purple-500/30 overflow-x-hidden transition-colors duration-500">
        
        <div class="p-4 lg:p-8 space-y-6 animate-in relative z-10 max-w-[1920px] mx-auto">
            
            <!-- Compact Modern Header -->
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 dark:border-purple-500/10 pb-6">
                <div class="space-y-1">
                    <div class="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                        <div class="p-1 bg-purple-500/10 rounded-md shadow-inner">
                            <Trophy class="w-3.5 h-3.5 fill-current" />
                        </div>
                        <span class="text-[9px] font-[900] uppercase tracking-[0.3em] italic">Redemption Registry</span>
                    </div>
                    <h1 class="text-3xl lg:text-5xl font-[900] uppercase tracking-tighter italic leading-none">
                        GAD <span class="text-purple-600 italic">Rewards</span>
                    </h1>
                </div>

                <div class="flex items-center gap-4">
                    <!-- Balance Pill -->
                    <div class="bg-white dark:bg-[#0d0d12] border border-slate-200 dark:border-purple-500/20 px-5 py-2.5 rounded-xl shadow-sm hover:shadow-purple-500/10 transition-all flex items-center gap-3 group">
                        <div class="flex flex-col items-end leading-none">
                            <span class="text-[8px] font-[900] text-slate-400 uppercase tracking-widest italic">Available</span>
                            <span class="text-xl font-[900] text-purple-600 dark:text-purple-400 italic tabular-nums group-hover:scale-105 transition-transform">
                                {{ authStore.user?.gamification?.experience_points?.toLocaleString() || 0 }}
                            </span>
                        </div>
                        <Flame class="w-5 h-5 text-orange-500 animate-pulse drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]" />
                    </div>

                     <!-- Inventory Link -->
                    <router-link :to="{ name: 'user.my-inventory' }" 
                        class="px-5 py-3 bg-slate-100 dark:bg-white/5 hover:bg-purple-500/10 text-slate-500 hover:text-purple-600 rounded-xl border border-slate-200 dark:border-white/10 transition-all flex items-center gap-2 group">
                        <Package class="w-4 h-4 group-hover:rotate-12 transition-transform" />
                        <span class="text-[9px] font-[900] uppercase tracking-widest italic hidden md:inline">My Inventory</span>
                    </router-link>
                </div>
            </div>

            <!-- Ultra-Dense Grid Layout -->
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 lg:gap-4">
                <div v-for="item in rewards" :key="item.id" 
                    class="group relative bg-white dark:bg-[#0d0d12] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col">
                    
                    <!-- Stock Badge Overlay -->
                    <div class="absolute top-2 right-2 z-20 pointer-events-none">
                         <span v-if="item.stock_quantity > 0" class="px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-md border border-white/10 text-[8px] font-[900] text-white uppercase tracking-wider italic">
                            {{ item.stock_quantity }} Left
                        </span>
                        <span v-else class="px-2 py-0.5 bg-red-500/90 backdrop-blur-md rounded-md text-[8px] font-[900] text-white uppercase tracking-wider italic">
                            Sold Out
                        </span>
                    </div>

                    <!-- Image Area (Compact) -->
                    <div class="h-28 lg:h-32 bg-slate-50 dark:bg-white/[0.02] relative overflow-hidden group-hover:bg-purple-50 dark:group-hover:bg-purple-900/10 transition-colors shrink-0">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                        <img v-if="item.image_url" :src="item.image_url" class="object-cover w-full h-full opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-700 ease-out" />
                        <div v-else class="w-full h-full flex items-center justify-center">
                            <Gift class="w-8 h-8 text-slate-300 dark:text-gray-700 group-hover:text-purple-400 transition-colors" />
                        </div>
                    </div>

                    <!-- Content -->
                    <div class="p-3 flex flex-col flex-1 gap-2">
                        <div class="min-h-[2.5rem]">
                            <h3 class="text-xs lg:text-sm font-[900] text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none mb-1 line-clamp-2 group-hover:text-purple-600 transition-colors">
                                {{ item.title }}
                            </h3>
                        </div>

                        <div class="mt-auto pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2">
                            <div class="flex flex-col">
                                <span class="text-[8px] font-[900] text-slate-400 uppercase tracking-wider italic">XP Cost</span>
                                <span class="text-xs font-[900] italic tabular-nums leading-none" :class="canAfford(item) ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400'">
                                    {{ item.xp_required.toLocaleString() }}
                                </span>
                            </div>
                            
                            <button 
                                @click="claimReward(item)"
                                :disabled="!canAfford(item) || item.stock_quantity <= 0"
                                :class="['w-8 h-8 rounded-lg flex items-center justify-center transition-all shadow-lg',
                                    canAfford(item) && item.stock_quantity > 0
                                    ? 'bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white hover:scale-105 active:scale-95 shadow-purple-500/20' 
                                    : 'bg-slate-100 dark:bg-white/5 text-slate-300 dark:text-gray-700 cursor-not-allowed border border-slate-200 dark:border-white/5 shadow-none']"
                                :title="canAfford(item) ? 'Redeem Item' : 'Insufficient XP'">
                                <ArrowRight v-if="canAfford(item) && item.stock_quantity > 0" class="w-4 h-4" />
                                <Lock v-else class="w-3 h-3 opacity-50" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="rewards.length === 0" class="py-20 text-center animate-pulse">
                <div class="inline-flex p-4 bg-slate-100 dark:bg-white/5 rounded-2xl mb-4">
                    <Gift class="w-8 h-8 text-slate-300 dark:text-gray-600" />
                </div>
                <h3 class="text-lg font-[900] uppercase italic tracking-tighter text-slate-400">Registry Empty</h3>
                <p class="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1 italic">Synchronization pending...</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Gift, Trophy, Flame, ArrowRight, Lock, Package } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/utils/useToast';
import axios from '@/utils/api';

const authStore = useAuthStore();
const toast = useToast();
const rewards = ref([]);

const canAfford = (item) => (authStore.user?.gamification?.experience_points || 0) >= item.xp_required;

const loadRewards = async () => {
    try {
        const { data } = await axios.get('/api/rewards/available');
        rewards.value = data;
    } catch (err) { console.error("Asset Load Failure:", err); }
};

const claimReward = async (item) => {
    try {
        const { data } = await axios.post(`/api/rewards/claim/${item.id}`);
        toast.success(`Success! Visit the GAD Office to claim your item.`);
        
        // Update local XP display
        if (authStore.user?.gamification && data.remaining_xp !== undefined) {
            authStore.user.gamification.experience_points = data.remaining_xp;
        }
        
        loadRewards(); 
    } catch (err) {
        toast.error(err.response?.data?.message || 'Error executing redemption.');
    }
};

onMounted(loadRewards);
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
    from { opacity: 0; transform: translateY(10px) scale(0.99); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-thumb { background: rgba(147, 51, 234, 0.2); border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: #9333ea; }
</style>