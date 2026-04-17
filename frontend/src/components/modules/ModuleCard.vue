<template>
    <div
        class="item-card group cursor-pointer"
        @click="$emit('view', module.id)"
    >
        <!-- Thumbnail ─────────────────────────────────────────── -->
        <div class="item-image-wrap">
            <img
                v-if="module.thumbnail_url"
                :src="module.thumbnail_url"
                :alt="module.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
                <BookOpen class="w-10 h-10 text-platinum-300 dark:text-abyss-500" />
            </div>

            <!-- Category & Featured badges -->
            <div class="absolute top-3 left-3 flex gap-1.5">
                <span class="badge badge-lavender">{{ formatCategory(module.category) }}</span>
                <span v-if="module.is_featured" class="badge badge-pink">Featured</span>
            </div>
        </div>

        <!-- Card body ─────────────────────────────────────────── -->
        <div class="p-5 flex-1 flex flex-col justify-between gap-4">

            <!-- Title & description -->
            <div class="space-y-1.5">
                <h3 class="font-madimione text-lg text-slate-800 dark:text-platinum-100 line-clamp-2 leading-snug
                           group-hover:text-calm-lavender-600 dark:group-hover:text-calm-lavender-400 transition-colors">
                    {{ module.title }}
                </h3>
                <p class="body-subtext line-clamp-2">
                    {{ module.description || 'No description provided for this module.' }}
                </p>
            </div>

            <!-- Meta & CTA ──────────────────────────────────────── -->
            <div class="space-y-3 pt-3 border-t-2 border-platinum-100 dark:border-abyss-500">

                <!-- Meta row -->
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-1.5">
                        <BarChart2 class="w-3.5 h-3.5 text-calm-lavender-500 dark:text-calm-lavender-400 shrink-0" />
                        <span class="font-dosis text-xs font-semibold capitalize
                                     text-platinum-600 dark:text-platinum-400">
                            {{ module.difficulty_level || 'General' }}
                        </span>
                    </div>
                    <div class="flex items-center gap-1.5">
                        <EyeIcon class="w-3.5 h-3.5 text-platinum-400 dark:text-platinum-500 shrink-0" />
                        <span class="font-dosis text-xs font-semibold text-platinum-500 dark:text-platinum-400">
                            {{ module.view_count || 0 }} reads
                        </span>
                    </div>
                </div>

                <!-- CTA -->
                <button class="btn-primary w-full justify-center btn-3d">
                    <PlayIcon class="w-4 h-4 fill-current shrink-0" />
                    <span class="font-dosis font-semibold text-sm uppercase tracking-wider">Open Module</span>
                </button>
            </div>

        </div>
    </div>
</template>

<script setup>
import { Eye as EyeIcon, Play as PlayIcon, BookOpen, BarChart2 } from 'lucide-vue-next';

defineProps({
    module: { type: Object, required: true }
});

defineEmits(['view']);

const formatCategory = (category) => {
    const map = { 'gad': 'Institutional', 'sexual_health': 'Health', 'vawc': 'Safety', 'general': 'Standard' };
    return map[category] || 'General';
};
</script>

<style scoped>
@reference "@/style.css";

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.btn-3d {
    @apply border-b-4 border-black/10 active:border-b active:translate-y-px;
}
</style>