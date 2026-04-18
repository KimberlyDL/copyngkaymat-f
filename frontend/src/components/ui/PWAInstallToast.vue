<template>
    <Teleport to="body">
        <Transition
            enter-active-class="transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            leave-active-class="transition-all duration-300 ease-in"
            enter-from-class="translate-y-4 opacity-0 scale-95"
            leave-to-class="translate-y-4 opacity-0 scale-95"
        >
            <div
                v-if="showToast"
                role="alert"
                aria-live="polite"
                class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100vw-2rem)] max-w-sm pointer-events-auto"
            >
                <!-- Card -->
                <div class="relative overflow-hidden rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-abyss-700">

                    <!-- Brand accent bar -->
                    <div class="absolute left-0 top-2 bottom-2 w-1.5 rounded-r-xl bg-gradient-to-b from-calm-lavender-500 to-neon-pink-500"></div>

                    <!-- Countdown progress bar at the top -->
                    <div class="absolute top-0 left-0 right-0 h-[3px] bg-slate-100 dark:bg-abyss-600 overflow-hidden rounded-t-2xl">
                        <div
                            class="h-full bg-gradient-to-r from-calm-lavender-500 to-neon-pink-500 transition-none origin-left"
                            :style="{ transform: `scaleX(${progressFraction})` }"
                        ></div>
                    </div>

                    <!-- Body -->
                    <div class="flex items-start gap-3 px-5 pt-5 pb-4 pl-6">
                        <!-- Icon -->
                        <div class="shrink-0 mt-0.5 w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-calm-lavender-100 to-neon-pink-50 dark:from-calm-lavender-900/40 dark:to-neon-pink-900/20 border border-calm-lavender-200 dark:border-calm-lavender-800/40">
                            <SmartphoneIcon class="w-5 h-5 text-calm-lavender-600 dark:text-calm-lavender-400" />
                        </div>

                        <!-- Text -->
                        <div class="flex-1 min-w-0">
                            <p class="font-dosis text-sm font-bold uppercase tracking-wide text-slate-800 dark:text-platinum-100 leading-tight">
                                Install App
                            </p>
                            <p class="font-mplusrounded text-xs font-medium text-platinum-600 dark:text-platinum-400 mt-0.5 leading-snug">
                                Add to your home screen for quick access — works offline too.
                            </p>

                            <!-- Actions -->
                            <div class="flex items-center gap-2 mt-3">
                                <button
                                    @click="handleInstall"
                                    :disabled="installing"
                                    class="btn-primary inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg disabled:opacity-60"
                                >
                                    <DownloadIcon v-if="!installing" class="w-3.5 h-3.5" />
                                    <div v-else class="spinner !w-3.5 !h-3.5 !border-[2px] !border-white/30 !border-t-white"></div>
                                    {{ installing ? 'Installing…' : 'Install' }}
                                </button>

                                <button
                                    @click="handleDismiss"
                                    class="font-dosis text-[11px] font-semibold uppercase tracking-wide text-platinum-500 hover:text-slate-700 dark:hover:text-platinum-300 transition-colors px-2 py-1.5"
                                >
                                    Not now
                                </button>
                            </div>
                        </div>

                        <!-- Close -->
                        <button
                            @click="handleDismiss"
                            class="shrink-0 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-abyss-500 transition-colors group/close"
                            aria-label="Dismiss"
                        >
                            <XIcon class="w-4 h-4 text-platinum-500 group-hover/close:text-calm-lavender-600 dark:group-hover/close:text-calm-lavender-400 transition-colors" />
                        </button>
                    </div>

                    <!-- Countdown hint -->
                    <div class="px-6 pb-3">
                        <p class="font-mplusrounded text-[10px] text-platinum-400 dark:text-platinum-500">
                            Auto-hides in {{ secondsLeft }}s
                        </p>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'
import { Smartphone as SmartphoneIcon, Download as DownloadIcon, X as XIcon } from 'lucide-vue-next'
import { usePWA } from '@/utils/usePWA'

const { showToast, installApp, dismissToast, TOAST_DURATION } = usePWA()

// ── Countdown state ────────────────────────────────────────────────────────────
const TICK_MS         = 250                    // update every 250 ms for smooth bar
const totalSeconds    = Math.floor(TOAST_DURATION / 1000)
const secondsLeft     = ref(totalSeconds)
const progressFraction = ref(1)               // 1 → full bar, 0 → empty
const installing      = ref(false)

let startedAt  = null
let rafHandle  = null

function tick() {
    if (!startedAt) return
    const elapsed  = Date.now() - startedAt
    const fraction = Math.max(0, 1 - elapsed / TOAST_DURATION)
    progressFraction.value = fraction
    secondsLeft.value = Math.max(0, Math.ceil(fraction * totalSeconds))
    if (fraction > 0) rafHandle = setTimeout(tick, TICK_MS)
}

// Start/stop countdown whenever the toast becomes visible
watch(showToast, (visible) => {
    if (visible) {
        startedAt = Date.now()
        clearTimeout(rafHandle)
        progressFraction.value = 1
        secondsLeft.value = totalSeconds
        tick()
    } else {
        clearTimeout(rafHandle)
    }
}, { immediate: true })

onUnmounted(() => clearTimeout(rafHandle))

// ── Actions ───────────────────────────────────────────────────────────────────
async function handleInstall() {
    installing.value = true
    await installApp()
    installing.value = false
}

function handleDismiss() {
    dismissToast()
}
</script>