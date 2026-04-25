<template>
    <Teleport to="body">
    <div
        class="modal-overlay !z-[200] !bg-abyss-950/70"
        @click.self="$emit('close')"
    >
        <div class="modal-shell animate-modal">

            <!-- ── Header ─────────────────────────────────────── -->
            <div class="text-center mb-7">
                <div class="inline-flex p-3.5 rounded-2xl bg-calm-lavender-100 dark:bg-calm-lavender-900/30 border-2 border-calm-lavender-200 dark:border-calm-lavender-800/40 mb-4">
                    <DoorOpenIcon class="w-6 h-6 text-calm-lavender-600 dark:text-calm-lavender-400" />
                </div>
                <h2 class="font-madimione text-3xl text-abyss-800 dark:text-platinum-100 leading-tight">
                    Join a <span class="brand-gradient-text">Classroom</span>
                </h2>
                <p class="field-subtext mt-2 max-w-xs mx-auto">
                    Enter the 6-character code shared by your teacher to join their classroom.
                </p>
            </div>

            <!-- ── Divider ────────────────────────────────────── -->
            <div class="h-px bg-platinum-200 dark:bg-abyss-500 mb-6"></div>

            <!-- ── Code input (L2 inset tile) ────────────────── -->
            <div class="space-y-2 mb-6">
                <label class="field-label text-center block">Access Code</label>

                <div class="code-tile">
                    <input
                        v-model="joinCode"
                        type="text"
                        maxlength="6"
                        autocomplete="off"
                        autocorrect="off"
                        spellcheck="false"
                        placeholder="A1B2C3"
                        class="code-input"
                        @input="joinCode = joinCode.toUpperCase()"
                    />

                    <!-- Progress dots -->
                    <div class="flex items-center justify-center gap-2 mt-4">
                        <div
                            v-for="i in 6"
                            :key="i"
                            :class="[
                                'h-1.5 rounded-full transition-all duration-200',
                                i <= joinCode.length
                                    ? 'bg-calm-lavender-500 w-5'
                                    : 'dot-empty'
                            ]"
                        />
                    </div>
                </div>

                <!-- Validation hint -->
                <p
                    v-if="joinCode.length > 0 && joinCode.length < 6"
                    class="field-subtext text-center"
                >
                    {{ 6 - joinCode.length }} character{{ 6 - joinCode.length !== 1 ? 's' : '' }} remaining
                </p>
                <p
                    v-else-if="joinCode.length === 6"
                    class="field-subtext !text-safety-teal-600 dark:!text-safety-teal-400 text-center flex items-center justify-center gap-1.5"
                >
                    <CheckCircleIcon class="w-3.5 h-3.5 shrink-0" />
                    Code looks good — tap Join to continue
                </p>
            </div>

            <!-- ── Info notice ────────────────────────────────── -->
            <div class="info-notice mb-6">
                <div class="info-notice__icon">
                    <InfoIcon class="w-4 h-4" />
                </div>
                <p class="field-subtext !text-calm-lavender-700 dark:!text-calm-lavender-300">
                    Codes are case-insensitive. Ask your facilitator if you haven't received one yet.
                </p>
            </div>

            <!-- ── Actions ───────────────────────────────────── -->
            <div class="grid grid-cols-2 gap-3 pt-6 border-t-2 border-platinum-200 dark:border-abyss-500">
                <button
                    type="button"
                    @click="$emit('close')"
                    class="btn-secondary justify-center"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    @click="handleJoin"
                    :disabled="joinCode.length !== 6"
                    class="btn-primary justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <LogInIcon class="w-4 h-4 shrink-0" />
                    <span class="main-button-text">Join Now</span>
                </button>
            </div>

        </div>
    </div>
    </Teleport>
</template>

<script setup>
import { ref } from 'vue';
import {
    DoorOpen as DoorOpenIcon,
    Info as InfoIcon,
    LogIn as LogInIcon,
    CheckCircle as CheckCircleIcon
} from 'lucide-vue-next';

const emit = defineEmits(['close', 'join']);
const joinCode = ref('');

const handleJoin = () => {
    if (joinCode.value.trim().length === 6) {
        emit('join', joinCode.value.toUpperCase().trim());
    }
};
</script>

<style scoped>
@reference "@/style.css";

/* ── Modal shell (L1 surface) ───────────────────────────────
   Light: platinum-100 on abyss-950/70 scrim
   Dark:  abyss-700 — first depth step above abyss-950
──────────────────────────────────────────────────────────── */
.modal-shell {
    @apply relative w-full max-w-sm flex flex-col;
    @apply bg-platinum-100 dark:bg-abyss-700;
    @apply border-2 border-platinum-300 dark:border-abyss-500;
    @apply rounded-2xl p-7;
}

/* ── Code tile (L2 inset) ───────────────────────────────────
   platinum-200 → platinum-100: visible light depth step
   abyss-600   → abyss-700:    subtle dark depth step
──────────────────────────────────────────────────────────── */
.code-tile {
    @apply p-5 rounded-xl;
    @apply bg-platinum-200 dark:bg-abyss-600;
    @apply border-2 border-platinum-300 dark:border-abyss-400;
}

/* ── Large code input ───────────────────────────────────────
   Fixes:
   · dark placeholder: platinum-500 (#a6a5a7) — readable on abyss-600
   · letter-spacing adds per-character separation
──────────────────────────────────────────────────────────── */
.code-input {
    @apply w-full bg-transparent outline-none text-center;
    @apply font-mplusrounded text-4xl font-bold;
    @apply text-calm-lavender-700 dark:text-calm-lavender-300;
    @apply caret-calm-lavender-500;
    /* Light placeholder: platinum-400 — muted on platinum-200 tile */
    @apply placeholder-platinum-400;
    letter-spacing: 0.35em;
    text-transform: uppercase;
}

/*
  Dark placeholder override — platinum-500 (#a6a5a7) has enough
  contrast on abyss-600 (#171618) without looking like typed text.
  Tailwind's dark:placeholder-* v4 syntax applies here.
*/
.code-input::placeholder {
    color: var(--color-platinum-500); /* #a6a5a7 — visible on abyss-600 */
}

@media (prefers-color-scheme: dark) {
    .code-input::placeholder {
        color: var(--color-platinum-500);
    }
}

:global(.dark) .code-input::placeholder {
    color: var(--color-platinum-500);
}

/* ── Progress dots ──────────────────────────────────────────
   Empty dots: platinum-400 in light, platinum-600 in dark
   (abyss-500 was too dark — nearly invisible on abyss-600 tile)
──────────────────────────────────────────────────────────── */
.dot-empty {
    @apply w-2 bg-platinum-400 dark:bg-platinum-600;
}

/* ── Info notice (L2 inset tile) ────────────────────────────*/
.info-notice {
    @apply flex items-start gap-3 p-4 rounded-xl;
    @apply bg-platinum-200 dark:bg-abyss-600;
    @apply border-2 border-calm-lavender-200 dark:border-calm-lavender-800/40;
}

.info-notice__icon {
    @apply p-2 rounded-lg shrink-0 flex items-center justify-center;
    @apply bg-calm-lavender-100 dark:bg-calm-lavender-900/30;
    @apply border border-calm-lavender-200 dark:border-calm-lavender-800/40;
    @apply text-calm-lavender-600 dark:text-calm-lavender-400;
}

/* ── Modal entry — scale+fade, no blur ──────────────────────*/
.animate-modal {
    animation: modalEntry 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes modalEntry {
    from { opacity: 0; transform: scale(0.97) translateY(16px); }
    to   { opacity: 1; transform: scale(1)    translateY(0);    }
}
</style>