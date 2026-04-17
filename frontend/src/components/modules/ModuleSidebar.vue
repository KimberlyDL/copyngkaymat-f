<template>
    <div class="h-full flex flex-col bg-platinum-50 dark:bg-abyss-800 border-r-2 border-platinum-200 dark:border-abyss-600">

        <!-- ── Header ─────────────────────────────────────────── -->
        <div class="flex items-center justify-between px-5 py-4 shrink-0
                    bg-platinum-100 dark:bg-abyss-700
                    border-b-2 border-platinum-200 dark:border-abyss-600">
            <div class="flex items-center gap-3">
                <div class="w-1 h-5 rounded-full bg-calm-lavender-500 dark:bg-calm-lavender-400 shrink-0"></div>
                <p class="section-eyebrow">Unit Summary</p>
            </div>
            <button
                @click="$emit('close')"
                class="p-2 rounded-xl transition-all duration-150 lg:hidden
                       text-platinum-500 dark:text-platinum-400
                       hover:bg-platinum-200 dark:hover:bg-abyss-600
                       hover:text-calm-lavender-600 dark:hover:text-calm-lavender-400"
            >
                <XIcon class="w-4 h-4" />
            </button>
        </div>

        <!-- ── Scrollable body ─────────────────────────────────── -->
        <div class="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">

            <!-- Topic Type ─────────────────────────────────────── -->
            <div class="info-row flex-col items-start gap-2">
                <span class="info-label">Topic Type</span>
                <span class="badge badge-lavender !text-xs capitalize">
                    {{ formatCategory(module.category) }}
                </span>
            </div>

            <!-- Difficulty ─────────────────────────────────────── -->
            <div class="info-row flex-col items-start gap-3">
                <span class="info-label">Difficulty</span>
                <div class="flex items-center gap-3 w-full">
                    <div class="flex gap-1.5">
                        <div
                            v-for="i in 3"
                            :key="i"
                            class="w-7 h-2 rounded-full transition-all duration-300"
                            :class="getDifficultyColor(i)"
                        ></div>
                    </div>
                    <span class="font-dosis text-xs font-semibold uppercase tracking-widest
                                 text-platinum-600 dark:text-platinum-400 capitalize">
                        {{ module.difficulty_level || '—' }}
                    </span>
                </div>
            </div>

            <!-- Asset Metrics ──────────────────────────────────── -->
            <div class="card !p-4 space-y-3">
                <span class="info-label block mb-1">Asset Metrics</span>
                <div class="stat-pill">
                    <div class="card-icon-wrap">
                        <EyeIcon class="w-4 h-4 text-calm-lavender-600 dark:text-calm-lavender-400" />
                    </div>
                    <div>
                        <p class="stat-pill-label">Reads</p>
                        <p class="stat-pill-value font-madimione text-calm-lavender-600 dark:text-calm-lavender-400">
                            {{ module.view_count || 0 }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Registry Tags ──────────────────────────────────── -->
            <div v-if="module.tags && module.tags.length > 0" class="card !p-4">
                <span class="info-label block mb-3">Registry Tags</span>
                <div class="flex flex-wrap gap-2">
                    <span
                        v-for="tag in module.tags"
                        :key="tag"
                        class="badge badge-muted capitalize"
                    >
                        {{ tag }}
                    </span>
                </div>
            </div>

            <!-- Authorized By ──────────────────────────────────── -->
            <div v-if="module.creator" class="card !p-4">
                <span class="info-label block mb-3">Authorized By</span>
                <div class="flex items-center gap-3">
                    <div class="avatar-md shrink-0
                                !bg-calm-lavender-100 dark:!bg-calm-lavender-900/30
                                !border-calm-lavender-200 dark:!border-calm-lavender-800/40
                                !text-calm-lavender-700 dark:!text-calm-lavender-300">
                        {{ getInitials(module.creator.name) }}
                    </div>
                    <div class="min-w-0">
                        <p class="font-dosis text-sm font-semibold uppercase tracking-wide truncate
                                   text-slate-800 dark:text-platinum-100">
                            {{ module.creator.name }}
                        </p>
                        <p class="font-mplusrounded text-xs font-normal truncate
                                   text-platinum-500 dark:text-platinum-400">
                            {{ module.creator.email }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Timestamps ─────────────────────────────────────── -->
            <div class="space-y-2 pt-4 border-t-2 border-platinum-200 dark:border-abyss-600">
                <template v-for="log in [
                    { label: 'Published', date: module.published_at },
                    { label: 'Created', date: module.created_at }
                ]" :key="log.label">
                    <div v-if="log.date" class="info-row">
                        <span class="info-label">{{ log.label }}</span>
                        <span class="font-dosis text-xs font-medium text-platinum-600 dark:text-platinum-400">
                            {{ formatDate(log.date) }}
                        </span>
                    </div>
                </template>
            </div>

        </div>
    </div>
</template>

<script setup>
import { X as XIcon, Eye as EyeIcon } from 'lucide-vue-next';

const props = defineProps({
    module: { type: Object, required: true }
});

defineEmits(['close']);

const formatCategory = (category) => {
    const map = {
        'gad': 'Institutional',
        'sexual_health': 'Health',
        'vawc': 'Safety',
        'general': 'Standard'
    };
    return map[category] || category.toUpperCase();
};

const getDifficultyColor = (level) => {
    const diff = props.module.difficulty_level?.toLowerCase();
    if (diff === 'beginner')     return level === 1 ? 'bg-calm-lavender-500' : 'bg-platinum-200 dark:bg-abyss-500';
    if (diff === 'intermediate') return level <= 2  ? 'bg-calm-lavender-500' : 'bg-platinum-200 dark:bg-abyss-500';
    if (diff === 'advanced')     return 'bg-calm-lavender-500';
    return 'bg-platinum-200 dark:bg-abyss-500';
};

const getInitials = (name) =>
    name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

const formatDate = (ds) => {
    if (!ds) return 'N/A';
    return new Date(ds).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    });
};
</script>

<style scoped>
@reference "@/style.css";

.custom-scrollbar::-webkit-scrollbar { width: 3px; }
.custom-scrollbar::-webkit-scrollbar-thumb {
    @apply rounded-full bg-platinum-300 dark:bg-abyss-500;
}
</style>