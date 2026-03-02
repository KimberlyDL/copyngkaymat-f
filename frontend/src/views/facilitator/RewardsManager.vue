<template>
    <div class="min-h-screen bg-transparent custom-font-poppins text-slate-900 dark:text-white selection:bg-purple-500/30 overflow-x-hidden transition-colors duration-500">
        
        <div class="p-6 lg:p-12 space-y-10 animate-in relative z-10 max-w-[1600px] mx-auto">
            
            <!-- Header Section -->
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-200 dark:border-purple-500/10 pb-10">
                <div class="space-y-3">
                    <div class="flex items-center gap-3 text-purple-600 dark:text-purple-400">
                        <div class="p-2 bg-purple-500/10 rounded-lg shadow-inner">
                            <Gift class="w-5 h-5" />
                        </div>
                        <span class="text-[10px] font-[900] uppercase tracking-[0.4em] italic">Facilitator Panel</span>
                    </div>
                    <h1 class="text-5xl lg:text-6xl font-[900] uppercase tracking-tighter italic leading-none">
                        Rewards <span class="text-purple-600 italic">Manager</span>
                    </h1>
                    <p class="text-xs font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest italic">Create and manage claimable rewards for students.</p>
                </div>

                <button @click="openCreateModal" 
                    class="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-2xl transition-all font-[900] text-[10px] uppercase tracking-[0.2em] shadow-[0_10px_20px_-5px_rgba(124,58,237,0.4),inset_0_2px_4px_rgba(255,255,255,0.3)] hover:scale-[1.03] active:scale-[0.97] italic">
                    <Plus class="w-4 h-4 group-hover:rotate-90 transition-transform" /> 
                    Add New Reward
                </button>
            </div>

            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-white/70 dark:bg-[#0d0d12]/60 backdrop-blur-xl border border-slate-200 dark:border-purple-500/10 rounded-[2rem] p-6 shadow-xl">
                    <div class="flex items-center gap-4">
                        <div class="p-3 bg-purple-500/10 rounded-xl">
                            <Package class="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <p class="text-[10px] font-[900] text-slate-400 uppercase tracking-widest italic">Total Rewards</p>
                            <p class="text-3xl font-[900] text-slate-900 dark:text-white italic">{{ rewards.length }}</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white/70 dark:bg-[#0d0d12]/60 backdrop-blur-xl border border-slate-200 dark:border-purple-500/10 rounded-[2rem] p-6 shadow-xl">
                    <div class="flex items-center gap-4">
                        <div class="p-3 bg-violet-500/10 rounded-xl">
                            <CheckCircle class="w-6 h-6 text-violet-600" />
                        </div>
                        <div>
                            <p class="text-[10px] font-[900] text-slate-400 uppercase tracking-widest italic">Active Rewards</p>
                            <p class="text-3xl font-[900] text-slate-900 dark:text-white italic">{{ activeCount }}</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white/70 dark:bg-[#0d0d12]/60 backdrop-blur-xl border border-slate-200 dark:border-purple-500/10 rounded-[2rem] p-6 shadow-xl">
                    <div class="flex items-center gap-4">
                        <div class="p-3 bg-fuchsia-500/10 rounded-xl">
                            <Users class="w-6 h-6 text-fuchsia-600" />
                        </div>
                        <div>
                            <p class="text-[10px] font-[900] text-slate-400 uppercase tracking-widest italic">Total Claims</p>
                            <p class="text-3xl font-[900] text-slate-900 dark:text-white italic">{{ totalClaims }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Rewards Grid (Ultra-Dense Layout) -->
            <div v-if="!isLoading && rewards.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                <div v-for="reward in rewards" :key="reward.id" 
                    class="group relative bg-white dark:bg-[#0d0d12] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col">
                    
                    <!-- Status Badge Overlay -->
                    <div class="absolute top-2 right-2 z-20">
                         <span :class="['px-2 py-0.5 rounded-md text-[8px] font-[900] text-white uppercase tracking-wider italic backdrop-blur-md border border-white/10 shadow-sm',
                            reward.is_active ? 'bg-purple-600/90' : 'bg-slate-500/90']">
                            {{ reward.is_active ? 'Active' : 'Inactive' }}
                        </span>
                    </div>

                    <!-- Image Area (Compact) -->
                    <div class="h-28 bg-slate-50 dark:bg-white/[0.02] relative overflow-hidden group-hover:bg-purple-50 dark:group-hover:bg-purple-900/10 transition-colors shrink-0">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                        <img v-if="reward.image_url" :src="reward.image_url" class="object-cover w-full h-full opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-700 ease-out" @error="handleImageError" />
                        <div v-else class="w-full h-full flex items-center justify-center">
                            <Gift class="w-8 h-8 text-slate-300 dark:text-gray-700 group-hover:text-purple-400 transition-colors" />
                        </div>
                    </div>

                    <!-- Content -->
                    <div class="p-3 flex flex-col flex-1 gap-2">
                        <div class="min-h-[2.5rem]">
                            <h3 class="text-xs font-[900] text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none mb-1 line-clamp-2 group-hover:text-purple-600 transition-colors">
                                {{ reward.title || 'Unnamed' }}
                            </h3>
                            <div class="flex items-center justify-between text-[9px] font-[900] text-slate-400 uppercase tracking-wider italic">
                                <span>{{ reward.xp_required }} XP</span>
                                <span>{{ reward.stock_quantity > 900 ? '∞' : reward.stock_quantity }} Left</span>
                            </div>
                        </div>

                        <!-- Dense Actions -->
                        <div class="mt-auto pt-2 border-t border-slate-100 dark:border-white/5 grid grid-cols-3 gap-1">
                            <button @click="editReward(reward)" class="flex items-center justify-center py-1.5 bg-slate-100 dark:bg-white/5 hover:bg-purple-500/10 text-slate-500 hover:text-purple-600 rounded-lg transition-colors" title="Edit">
                                <span class="text-[8px] font-[900] uppercase">Edit</span>
                            </button>
                            <button @click="toggleActive(reward)" 
                                :class="['flex items-center justify-center py-1.5 rounded-lg transition-colors',
                                reward.is_active ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 hover:bg-purple-100' : 'bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-slate-600']" 
                                :title="reward.is_active ? 'Deactivate' : 'Activate'">
                                <CheckCircle v-if="reward.is_active" class="w-3 h-3" />
                                <span v-else class="text-[8px] font-[900] uppercase">On</span>
                            </button>
                            <button @click="deleteReward(reward)" class="flex items-center justify-center py-1.5 bg-red-50 dark:bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 rounded-lg transition-colors" title="Delete">
                                <Trash2 class="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="isLoading" class="py-32 text-center">
                <div class="inline-flex p-6 bg-slate-100 dark:bg-white/5 rounded-[2.5rem] mb-6 animate-pulse">
                    <Loader2 class="w-12 h-12 text-purple-500 animate-spin" />
                </div>
                <h3 class="text-2xl font-[900] uppercase tracking-tighter italic text-slate-400">Loading Rewards...</h3>
            </div>

            <!-- Empty State -->
            <div v-if="!isLoading && rewards.length === 0" class="py-32 text-center">
                <div class="inline-flex p-6 bg-slate-100 dark:bg-white/5 rounded-[2.5rem] mb-6 shadow-inner">
                    <Gift class="w-12 h-12 text-slate-300 dark:text-gray-700" />
                </div>
                <h3 class="text-2xl font-[900] uppercase tracking-tighter italic text-slate-400">No Rewards Yet</h3>
                <p class="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-2 italic mb-8">
                    Create your first reward for students to claim.
                </p>
                <button @click="openCreateModal" 
                    class="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-2xl text-[10px] font-[900] uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl italic">
                    <Plus class="w-4 h-4" />
                    Create First Reward
                </button>
            </div>
        </div>

        <!-- Create/Edit Modal -->
        <Teleport to="body">
            <Transition name="fade">
                <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div class="absolute inset-0 bg-black/60 backdrop-blur-md" @click="closeModal"></div>
                    <div class="relative bg-white dark:bg-[#12101c] border border-slate-200 dark:border-white/10 rounded-[3rem] p-10 max-w-lg w-full shadow-2xl custom-font-poppins max-h-[90vh] overflow-y-auto">
                        
                        <h3 class="text-2xl font-black text-black dark:text-white uppercase tracking-tighter mb-8">
                            {{ editingReward ? 'Edit Reward' : 'Create Reward' }}
                        </h3>

                        <form @submit.prevent="saveReward" class="space-y-6">
                            <!-- Name -->
                            <div>
                                <label class="block text-[10px] font-[900] text-slate-400 uppercase tracking-widest italic mb-2">Reward Name *</label>
                                <input v-model="form.name" type="text" required
                                    class="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white font-bold focus:border-purple-500 focus:outline-none transition-all"
                                    placeholder="e.g., Free Snack Voucher" />
                            </div>

                            <!-- Description -->
                            <div>
                                <label class="block text-[10px] font-[900] text-slate-400 uppercase tracking-widest italic mb-2">Description</label>
                                <textarea v-model="form.description" rows="3"
                                    class="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white font-bold focus:border-purple-500 focus:outline-none transition-all resize-none"
                                    placeholder="Describe the reward..."></textarea>
                            </div>

                            <!-- XP Cost -->
                            <div>
                                <label class="block text-[10px] font-[900] text-slate-400 uppercase tracking-widest italic mb-2">XP Cost *</label>
                                <input v-model.number="form.cost_xp" type="number" min="0" required
                                    class="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white font-bold focus:border-purple-500 focus:outline-none transition-all"
                                    placeholder="100" />
                            </div>

                            <!-- Total Slots -->
                            <div>
                                <label class="block text-[10px] font-[900] text-slate-400 uppercase tracking-widest italic mb-2">Total Slots (0 = Unlimited)</label>
                                <input v-model.number="form.total_slots" type="number" min="0"
                                    class="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white font-bold focus:border-purple-500 focus:outline-none transition-all"
                                    placeholder="10" />
                            </div>

                            <!-- Image URL -->
                            <div>
                                <label class="block text-[10px] font-[900] text-slate-400 uppercase tracking-widest italic mb-2">Image URL (Optional)</label>
                                <input v-model="form.iconPath" type="text"
                                    class="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white font-bold focus:border-purple-500 focus:outline-none transition-all"
                                    placeholder="/uploads/rewards/image.png" />
                            </div>

                            <!-- Active Toggle -->
                            <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-2xl">
                                <span class="text-sm font-[900] text-slate-600 dark:text-gray-400 uppercase italic">Active for Students</span>
                                <button type="button" @click="form.is_active = !form.is_active"
                                    :class="['relative w-14 h-8 rounded-full transition-all',
                                        form.is_active ? 'bg-purple-500' : 'bg-slate-300 dark:bg-white/20']">
                                    <span :class="['absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all',
                                        form.is_active ? 'left-7' : 'left-1']"></span>
                                </button>
                            </div>

                            <!-- Actions -->
                            <div class="flex gap-4 pt-4">
                                <button type="button" @click="closeModal"
                                    class="flex-1 py-4 bg-slate-100 dark:bg-white/5 rounded-2xl text-slate-600 dark:text-gray-400 text-[10px] font-[900] uppercase tracking-widest hover:bg-slate-200 transition-all italic">
                                    Cancel
                                </button>
                                <button type="submit" :disabled="isSaving"
                                    class="flex-1 py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-2xl text-[10px] font-[900] uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all italic disabled:opacity-50">
                                    {{ isSaving ? 'Saving...' : (editingReward ? 'Update' : 'Create') }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Gift, Plus, Package, CheckCircle, Users, Trash2, Loader2 } from 'lucide-vue-next';
import { useToast } from '@/utils/useToast';
import axios from '@/utils/api';

const toast = useToast();
const rewards = ref([]);
const isLoading = ref(true);
const isSaving = ref(false);
const showModal = ref(false);
const editingReward = ref(null);

const form = ref({
    name: '',
    description: '',
    cost_xp: 100,
    total_slots: 10,
    iconPath: '',
    is_active: true
});

const activeCount = computed(() => rewards.value.filter(r => r.is_active).length);
const totalClaims = computed(() => rewards.value.reduce((sum, r) => sum + (r.claimed_count || 0), 0));

const handleImageError = (event) => {
    event.target.style.display = 'none';
};

const loadRewards = async () => {
    isLoading.value = true;
    try {
        // Get ALL rewards (including inactive) for facilitator management
        const { data } = await axios.get('/api/rewards/all');
        rewards.value = data.rewards || [];
    } catch (err) {
        console.error('Failed to load rewards:', err);
        // Fallback to available rewards if all endpoint fails
        try {
            const { data } = await axios.get('/api/rewards/available');
            rewards.value = data || [];
        } catch {
            rewards.value = [];
        }
    } finally {
        isLoading.value = false;
    }
};

const openCreateModal = () => {
    editingReward.value = null;
    form.value = {
        name: '',
        description: '',
        cost_xp: 100,
        total_slots: 10,
        iconPath: '',
        is_active: true
    };
    showModal.value = true;
};

const editReward = (reward) => {
    editingReward.value = reward;
    form.value = {
        name: reward.title || reward.name || '',
        description: reward.description || '',
        cost_xp: reward.xp_required || reward.cost_xp || 0,
        total_slots: reward.total_slots || 0,
        iconPath: reward.iconPath || '',
        is_active: reward.is_active !== false
    };
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    editingReward.value = null;
};

const saveReward = async () => {
    isSaving.value = true;
    try {
        if (editingReward.value) {
            await axios.put(`/api/rewards/${editingReward.value.id}`, form.value);
            toast.success('Reward updated successfully!');
        } else {
            await axios.post('/api/rewards', form.value);
            toast.success('Reward created successfully!');
        }
        closeModal();
        loadRewards();
    } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to save reward');
    } finally {
        isSaving.value = false;
    }
};

const toggleActive = async (reward) => {
    try {
        await axios.put(`/api/rewards/${reward.id}`, {
            is_active: !reward.is_active
        });
        toast.success(reward.is_active ? 'Reward deactivated' : 'Reward activated');
        loadRewards();
    } catch (err) {
        toast.error('Failed to update reward status');
    }
};

const deleteReward = async (reward) => {
    if (!confirm(`Delete "${reward.title || reward.name}"? This will also remove it from all student inventories.`)) return;
    
    try {
        await axios.delete(`/api/rewards/${reward.id}`);
        toast.success('Reward deleted');
        loadRewards();
    } catch (err) {
        toast.error('Failed to delete reward');
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
    animation: slideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideIn {
    from { opacity: 0; transform: translateY(30px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}

.fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
    opacity: 0;
}
</style>
