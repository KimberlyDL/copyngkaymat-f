<template>
    <div class="fixed inset-0 z-[200] flex items-center justify-center p-6">

        <!-- Scrim — no backdrop-blur -->
        <div
            class="fixed inset-0 bg-abyss-950/70 transition-opacity"
            @click="$emit('cancel')"
        ></div>

        <!-- Modal panel -->
        <div class="modal-shell animate-modal">

            <!-- Icon -->
            <div class="flex items-center justify-center mb-6">
                <div class="ds-icon-badge ds-icon-badge--red !p-4">
                    <AlertTriangleIcon class="w-7 h-7" />
                </div>
            </div>

            <!-- Copy -->
            <div class="text-center space-y-3 mb-8">
                <h3 class="font-madimione text-2xl text-slate-800 dark:text-platinum-100 leading-tight">
                    Delete <span class="text-red-500">Unit?</span>
                </h3>
                <p class="font-mplusrounded text-sm font-normal leading-relaxed text-platinum-600 dark:text-platinum-400 px-2">
                    You are about to permanently remove
                    <span class="font-medium text-calm-lavender-600 dark:text-calm-lavender-400">"{{ moduleTitle }}"</span>.
                    This action cannot be undone.
                </p>
            </div>

            <!-- Actions -->
            <div class="flex gap-3">
                <button
                    @click="$emit('cancel')"
                    class="btn-secondary btn-3d--secondary flex-1 justify-center"
                >
                    <span class="font-dosis font-semibold text-sm uppercase tracking-widest">Dismiss</span>
                </button>
                <button
                    @click="$emit('confirm')"
                    class="btn-danger flex-1 justify-center"
                >
                    <span class="font-dosis font-semibold text-sm uppercase tracking-widest">Confirm</span>
                </button>
            </div>

            <!-- Footer caption -->
            <p class="mt-6 text-center font-dosis text-[10px] font-semibold uppercase tracking-[0.3em]
                       text-platinum-400 dark:text-abyss-400">
                System Termination Protocol
            </p>

        </div>
    </div>
</template>

<script setup>
import { AlertTriangle as AlertTriangleIcon } from 'lucide-vue-next';

defineProps({
    moduleTitle: { type: String, required: true }
});

defineEmits(['confirm', 'cancel']);
</script>

<style scoped>
@reference "@/style.css";

.modal-shell {
    @apply relative w-full max-w-sm mx-auto p-8 rounded-2xl;
    @apply bg-white dark:bg-abyss-600;
    @apply border-2 border-slate-200 dark:border-abyss-500;
}

.ds-icon-badge {
    @apply p-2.5 rounded-xl border-2 flex items-center justify-center;
}

.ds-icon-badge--red {
    @apply bg-red-50 dark:bg-red-900/20;
    @apply border-red-200 dark:border-red-800/40;
    @apply text-red-500 dark:text-red-400;
}

.btn-3d--secondary {
    @apply border-b-4 border-platinum-400 dark:border-abyss-400 active:border-b active:translate-y-px;
}

.animate-modal {
    animation: modalEntry 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes modalEntry {
    from { opacity: 0; transform: scale(0.97) translateY(14px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
}
</style>