<template>
    <div class="page-wrapper animate-in">

        <!-- Page Header -->
        <div class="page-header">
            <div class="space-y-1.5">
                <p class="section-eyebrow">Personal Collection</p>
                <h1 class="page-title">
                    My <span class="brand-gradient-text">Inventory</span>
                </h1>
            </div>

            <div class="flex items-center gap-3">
                <!-- Count -->
                <div class="stat-pill">
                    <div>
                        <p class="stat-pill-label">Total Items</p>
                        <p class="stat-pill-value text-calm-lavender-600 dark:text-calm-lavender-400">
                            {{ inventory.length }}
                        </p>
                    </div>
                    <CheckCircle class="w-5 h-5 text-safety-teal-500 shrink-0" />
                </div>

                <!-- Shop Link -->
                <router-link :to="{ name: 'user.rewards-shop' }" class="btn-primary group">
                    <span class="hidden sm:inline">Visit Shop</span>
                    <ArrowRight class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </router-link>
            </div>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-24 gap-3">
            <div class="spinner"></div>
            <p class="loading-text">Loading your inventory...</p>
        </div>

        <!-- Inventory Grid -->
        <div v-else-if="inventory.length > 0"
            class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
            <div v-for="item in inventory" :key="item.id" class="item-card group">
                <!-- Owned Badge -->
                <div class="absolute top-2 right-2 z-10">
                    <span
                        class="flex items-center gap-1 px-2 py-0.5 bg-safety-teal-500/90 text-white text-[10px] font-medium rounded-md">
                        <CheckCircle class="w-3 h-3" />
                        Owned
                    </span>
                </div>

                <!-- Image -->
                <div class="item-image-wrap">
                    <img v-if="item.reward?.image_url" :src="item.reward.image_url"
                        class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
                        @error="handleImageError" />
                    <div v-else class="w-full h-full flex items-center justify-center">
                        <Gift
                            class="w-7 h-7 text-platinum-400 dark:text-platinum-600 group-hover:text-calm-lavender-400 transition-colors" />
                    </div>
                </div>

                <!-- Content -->
                <div class="p-3 flex flex-col flex-1 gap-2">
                    <h3
                        class="text-xs font-semibold text-slate-700 dark:text-platinum-200 leading-snug line-clamp-2 group-hover:text-calm-lavender-600 dark:group-hover:text-calm-lavender-400 transition-colors">
                        {{ item.reward?.title || 'Unknown Reward' }}
                    </h3>

                    <div
                        class="mt-auto pt-2 border-t border-slate-100 dark:border-abyss-500 flex items-center justify-between gap-1">
                        <div>
                            <p class="text-[10px] text-platinum-500">Unlocked</p>
                            <p class="text-xs font-medium text-slate-600 dark:text-platinum-300">{{
                                formatDate(item.claimed_at) }}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-[10px] text-platinum-500">XP Value</p>
                            <p class="text-xs font-semibold text-calm-lavender-600 dark:text-calm-lavender-400">
                                {{ item.reward?.xp_cost?.toLocaleString() || 0 }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-20">
            <div
                class="inline-flex p-4 bg-slate-50 dark:bg-abyss-700 rounded-2xl border border-slate-100 dark:border-abyss-500 mb-4">
                <PackageOpen class="w-8 h-8 text-platinum-400 dark:text-platinum-600" />
            </div>
            <h3 class="text-base font-semibold text-slate-500 dark:text-platinum-500">Your inventory is empty</h3>
            <p class="text-sm text-platinum-500 dark:text-platinum-600 mt-1 mb-5">
                Visit the rewards shop to redeem your XP!
            </p>
            <router-link :to="{ name: 'user.rewards-shop' }" class="btn-primary inline-flex">
                <span>Browse Rewards</span>
                <ArrowRight class="w-4 h-4" />
            </router-link>
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
    if (!dateStr) return '—';
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

.btn-primary {
    @apply flex items-center gap-2 px-4 py-2.5 rounded-xl bg-calm-lavender-600 hover:bg-calm-lavender-700 dark:bg-calm-lavender-700 dark:hover:bg-calm-lavender-600 text-white font-medium text-sm border border-calm-lavender-700 dark:border-calm-lavender-600 transition-all shrink-0;
}

.item-card {
    @apply relative bg-white dark:bg-abyss-600 border border-slate-200 dark:border-abyss-500 rounded-2xl overflow-hidden flex flex-col hover:border-calm-lavender-200 dark:hover:border-calm-lavender-800/50 hover:-translate-y-0.5 transition-all duration-200;
}

.item-image-wrap {
    @apply h-28 lg:h-32 bg-slate-50 dark:bg-abyss-700 relative overflow-hidden shrink-0 group-hover:bg-calm-lavender-50 dark:group-hover:bg-calm-lavender-900/10 transition-colors;
}

.spinner {
    @apply w-7 h-7 border-2 border-slate-200 dark:border-abyss-500 border-t-calm-lavender-500 rounded-full animate-spin;
}

.loading-text {
    @apply font-mplusrounded text-sm text-platinum-500;
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