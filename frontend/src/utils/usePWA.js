// src/utils/usePWA.js
import { ref, computed, onMounted } from 'vue'

// ─── Constants ────────────────────────────────────────────────────────────────
const LS_DISMISSED_AT = 'pwa_dismissed_at'
const LS_INSTALLED    = 'pwa_installed'
const TOAST_DURATION  = 3 * 60 * 1000            // 3 minutes auto-hide
// const COOLDOWN_MS     = 7 * 24 * 60 * 60 * 1000  // 7 days between re-prompts
const COOLDOWN_MS     = 1 * 60 * 1000  // 1minute between re-prompts
// ─── Singleton state ──────────────────────────────────────────────────────────
const deferredPrompt = ref(null)
const isInstalled    = ref(false)
const toastVisible   = ref(false)
let   toastTimer     = null

// ─── Helpers ──────────────────────────────────────────────────────────────────
function isStandalone() {
    return (
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true
    )
}

function markInstalled() {
    isInstalled.value  = true
    toastVisible.value = false
    localStorage.setItem(LS_INSTALLED, 'true')
    clearTimeout(toastTimer)
}

function maybeShowToast() {
    if (isInstalled.value)     return
    if (!deferredPrompt.value) return

    const dismissedAt = localStorage.getItem(LS_DISMISSED_AT)
    if (dismissedAt) {
        const elapsed = Date.now() - parseInt(dismissedAt, 10)
        if (elapsed < COOLDOWN_MS) return  // still within 7-day cooldown
    }

    toastVisible.value = true
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => {
        toastVisible.value = false
        localStorage.setItem(LS_DISMISSED_AT, Date.now().toString())
    }, TOAST_DURATION)
}


if (import.meta.env.DEV) {
    localStorage.removeItem(LS_DISMISSED_AT)
    localStorage.removeItem(LS_INSTALLED)
    console.info('[PWA] 🔧 Dev mode: PWA state auto-cleared on load')
}

// ─── CRITICAL FIX: Register listeners at MODULE LOAD TIME ─────────────────────
//
// WHY: `beforeinstallprompt` is fired by the browser during page load, often
// BEFORE any Vue component's onMounted() runs. If we only register the listener
// inside onMounted(), we always miss the event.
//
// By registering at module scope (executed the first time this file is imported,
// which happens when main.js loads), we are guaranteed to catch the event.
//
if (typeof window !== 'undefined') {
    if (isStandalone() || localStorage.getItem(LS_INSTALLED) === 'true') {
        // Already installed — mark immediately, no listeners needed
        markInstalled()
    } else {
        // { once: true } ensures we never register duplicate listeners
        // even if multiple components import this file simultaneously
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault()          // suppress the browser's own mini-bar
            deferredPrompt.value = e
            maybeShowToast()            // try to show toast right away
        }, { once: true })

        window.addEventListener('appinstalled', () => {
            markInstalled()
            deferredPrompt.value = null
        }, { once: true })
    }
}

// ─── Composable export ────────────────────────────────────────────────────────
export function usePWA() {

    onMounted(() => {
        // Safety net: if the module-level listener already captured the prompt
        // before this component mounted, try to show the toast now.
        if (!isInstalled.value && deferredPrompt.value) {
            maybeShowToast()
        }
    })

    async function installApp() {
        if (!deferredPrompt.value) return
        deferredPrompt.value.prompt()
        const { outcome } = await deferredPrompt.value.userChoice
        if (outcome === 'accepted') {
            markInstalled()
            deferredPrompt.value = null
        }
    }

    function dismissToast() {
        toastVisible.value = false
        localStorage.setItem(LS_DISMISSED_AT, Date.now().toString())
        clearTimeout(toastTimer)
    }

    /** Show in sidebar when: not installed + prompt is available */
    const showSidebarItem = computed(
        () => !isInstalled.value && !!deferredPrompt.value
    )

    /** Show toast when toastVisible is true */
    const showToast = computed(() => toastVisible.value)

    return {
        isInstalled,
        showToast,
        showSidebarItem,
        installApp,
        dismissToast,
        TOAST_DURATION,
    }
}