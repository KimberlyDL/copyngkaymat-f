<template>
    <div class="page-wrapper animate-in">

        <!-- Page Header -->
        <div class="page-header">
            <div class="space-y-1.5">
                <p class="section-eyebrow">Redemption Center</p>
                <h1 class="page-title">
                    GAD <span class="brand-gradient-text">Rewards</span>
                </h1>
            </div>

            <div class="flex items-center gap-3">
                <!-- XP Balance -->
                <div class="stat-pill">
                    <Flame class="w-5 h-5 text-vawc-orange-500 shrink-0" />
                    <div>
                        <p class="stat-pill-label">Available XP</p>
                        <p class="stat-pill-value text-calm-lavender-600 dark:text-calm-lavender-400">
                            {{ authStore.user?.gamification?.experience_points?.toLocaleString() || 0 }}
                        </p>
                    </div>
                </div>

                <!-- Inventory Link -->
                <router-link :to="{ name: 'user.my-inventory' }" class="btn-secondary group">
                    <Package class="w-4 h-4 group-hover:rotate-6 transition-transform" />
                    <span class="hidden sm:inline">My Inventory</span>
                </router-link>
            </div>
        </div>

        <!-- Rewards Grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
            <div v-for="item in rewards" :key="item.id" class="item-card group"
                :class="{ 'item-card-disabled': !canAfford(item) || item.stock_quantity <= 0 }">
                <!-- Stock Badge -->
                <div class="absolute top-2 right-2 z-10">
                    <span v-if="item.stock_quantity > 0"
                        class="px-2 py-0.5 bg-abyss-800/70 text-platinum-100 text-[10px] font-medium rounded-md">
                        {{ item.stock_quantity }} left
                    </span>
                    <span v-else class="px-2 py-0.5 bg-red-500/90 text-white text-[10px] font-medium rounded-md">
                        Sold out
                    </span>
                </div>

                <!-- Image -->
                <div class="item-image-wrap">
                    <img v-if="item.image_url" :src="item.image_url"
                        class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out" />
                    <div v-else class="w-full h-full flex items-center justify-center">
                        <Gift
                            class="w-7 h-7 text-platinum-400 dark:text-platinum-600 group-hover:text-calm-lavender-400 transition-colors" />
                    </div>
                </div>

                <!-- Content -->
                <div class="p-3 flex flex-col flex-1 gap-2">
                    <h3
                        class="text-xs font-semibold text-slate-700 dark:text-platinum-200 leading-snug line-clamp-2 group-hover:text-calm-lavender-600 dark:group-hover:text-calm-lavender-400 transition-colors">
                        {{ item.title }}
                    </h3>

                    <div
                        class="mt-auto pt-2 border-t border-slate-100 dark:border-abyss-500 flex items-center justify-between gap-2">
                        <div>
                            <p class="text-[10px] text-platinum-500">XP Cost</p>
                            <p class="text-xs font-semibold leading-none"
                                :class="canAfford(item) ? 'text-calm-lavender-600 dark:text-calm-lavender-400' : 'text-platinum-500'">
                                {{ item.xp_required.toLocaleString() }}
                            </p>
                        </div>

                        <button @click="claimReward(item)" :disabled="!canAfford(item) || item.stock_quantity <= 0"
                            :class="[
                                'redeem-btn',
                                canAfford(item) && item.stock_quantity > 0
                                    ? 'redeem-btn-active'
                                    : 'redeem-btn-disabled'
                            ]" :title="canAfford(item) ? 'Redeem Item' : 'Not enough XP'">
                            <ArrowRight v-if="canAfford(item) && item.stock_quantity > 0" class="w-3.5 h-3.5" />
                            <Lock v-else class="w-3 h-3 opacity-60" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-if="rewards.length === 0" class="text-center py-20">
            <div
                class="inline-flex p-4 bg-slate-50 dark:bg-abyss-700 rounded-2xl border border-slate-100 dark:border-abyss-500 mb-4">
                <Gift class="w-8 h-8 text-platinum-400 dark:text-platinum-600" />
            </div>
            <h3 class="text-base font-semibold text-slate-500 dark:text-platinum-500">No rewards available</h3>
            <p class="text-sm text-platinum-500 mt-1">Check back later for new items.</p>
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
@reference "@/style.css";

.page-wrapper {
    @apply space-y-6 text-slate-900 dark:text-white;
}

.page-header {
    @apply flex flex-col sm:flex-row sm:items-end justify-between gap-5 pb-5 border-b border-slate-200 dark:border-abyss-600;
}

.page-title {
    @apply font-madimione text-3xl text-slate-800 dark:text-platinum-100 leading-tight;
}

.section-eyebrow {
    @apply text-xs font-semibold uppercase tracking-widest text-calm-lavender-600 dark:text-calm-lavender-400;
}

.brand-gradient-text {
    @apply bg-gradient-to-r from-calm-lavender-600 to-neon-pink-500 bg-clip-text text-transparent;
}

.stat-pill {
    @apply flex items-center gap-3 bg-white dark:bg-abyss-600 border border-slate-200 dark:border-abyss-500 rounded-xl px-4 py-2.5;
}

.stat-pill-label {
    @apply text-[10px] font-medium text-platinum-500 uppercase tracking-wide;
}

.stat-pill-value {
    @apply text-lg font-bold leading-none mt-0.5;
}

.btn-secondary {
    @apply flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-abyss-600 hover:bg-slate-200 dark:hover:bg-abyss-500 text-slate-600 dark:text-platinum-300 font-medium text-sm border border-slate-200 dark:border-abyss-500 transition-all shrink-0;
}

.item-card {
    @apply relative bg-white dark:bg-abyss-600 border border-slate-200 dark:border-abyss-500 rounded-2xl overflow-hidden flex flex-col hover:border-calm-lavender-200 dark:hover:border-calm-lavender-800/50 hover:-translate-y-0.5 transition-all duration-200;
}

.item-card-disabled {
    @apply opacity-60;
}

.item-image-wrap {
    @apply h-28 lg:h-32 bg-slate-50 dark:bg-abyss-700 relative overflow-hidden shrink-0 group-hover:bg-calm-lavender-50 dark:group-hover:bg-calm-lavender-900/10 transition-colors;
}

.redeem-btn {
    @apply w-8 h-8 rounded-xl flex items-center justify-center transition-all shrink-0;
}

.redeem-btn-active {
    @apply bg-calm-lavender-600 hover:bg-calm-lavender-700 text-white border border-calm-lavender-700 active:scale-95;
}

.redeem-btn-disabled {
    @apply bg-slate-100 dark:bg-abyss-700 text-platinum-400 dark:text-platinum-600 border border-slate-200 dark:border-abyss-500 cursor-not-allowed;
}

.animate-in {
    animation: fadeSlideUp 0.4s ease-out forwards;
}

@keyframes fadeSlideUp {
    from {
        opacity: 0;
        transform: translateY(12px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>