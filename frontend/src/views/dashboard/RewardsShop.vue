<template>
    <div class="p-6 lg:p-12 space-y-10 font-['Poppins'] text-white">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div class="space-y-2">
                <div class="flex items-center gap-3 text-yellow-500">
                    <Trophy class="w-5 h-5 fill-current" />
                    <span class="text-[10px] font-black uppercase tracking-[0.3em]">Redemption Center</span>
                </div>
                <h1 class="text-4xl lg:text-6xl font-black uppercase tracking-tighter italic">GAD <span class="text-pink-500">Rewards</span></h1>
            </div>
            <div class="bg-[#0d0d12] border border-white/5 p-6 rounded-[2rem] flex items-center gap-6 shadow-2xl">
                <div class="flex flex-col">
                    <span class="text-[9px] font-black text-gray-600 uppercase">Current Balance</span>
                    <span class="text-2xl font-black text-blue-400 italic">{{ authStore.user?.gamification?.experience_points || 0 }} XP</span>
                </div>
                <div class="h-10 w-px bg-white/5"></div>
                <Flame class="w-8 h-8 text-orange-500 animate-pulse" />
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <div v-for="item in rewards" :key="item.id" 
                class="relative group rounded-[3rem] p-[2px] transition-all duration-500 hover:scale-[1.02]"
                :class="canAfford(item) ? 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600' : 'bg-white/5'">
                
                <div class="bg-[#08080a] rounded-[2.9rem] p-8 h-full flex flex-col justify-between overflow-hidden relative">
                    <div class="absolute -top-10 -right-10 w-40 h-40 bg-pink-500/5 rounded-full blur-3xl group-hover:bg-pink-500/10 transition-all"></div>
                    
                    <div class="space-y-6 relative z-10">
                        <div class="h-48 bg-white/[0.02] rounded-[2rem] border border-white/5 flex items-center justify-center overflow-hidden">
                            <img v-if="item.image_url" :src="item.image_url" class="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-all" />
                            <Gift v-else class="w-16 h-16 text-gray-800" />
                        </div>

                        <div class="space-y-2">
                            <div class="flex justify-between items-start">
                                <h3 class="text-xl font-black uppercase tracking-tight">{{ item.title }}</h3>
                                <span class="text-[9px] font-black text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full uppercase italic">
                                    {{ item.stock_quantity }} In Stock
                                </span>
                            </div>
                            <p class="text-xs text-gray-500 leading-relaxed italic">{{ item.description }}</p>
                        </div>
                    </div>

                    <div class="mt-8 pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
                        <div class="flex flex-col">
                            <span class="text-[8px] font-black text-gray-600 uppercase">Required</span>
                            <span class="text-lg font-black italic">{{ item.xp_required }} XP</span>
                        </div>
                        
                        <button v-if="item.stock_quantity > 0" 
                            @click="claimReward(item)"
                            :disabled="!canAfford(item)"
                            :class="['px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all',
                                canAfford(item) ? 'bg-white text-black hover:bg-pink-500 hover:text-white shadow-xl shadow-pink-900/20' : 'bg-white/5 text-gray-600 cursor-not-allowed']">
                            {{ canAfford(item) ? 'Redeem Item' : 'Insufficent XP' }}
                        </button>
                        <span v-else class="text-red-500 text-[10px] font-black uppercase italic">Out of Stock</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Gift, Trophy, Flame } from 'lucide-vue-next';
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
    } catch (err) { console.error(err); }
};

const claimReward = async (item) => {
    try {
        await axios.post(`/api/rewards/claim/${item.id}`);
        toast.success(`Success! Visit the GAD Office to claim your ${item.title}`);
        loadRewards(); // Refresh stock
    } catch (err) {
        toast.error(err.response?.data?.message || 'Redemption Failed');
    }
};

onMounted(loadRewards);
</script>