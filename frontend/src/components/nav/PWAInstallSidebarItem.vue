<template>
    <!--
        PWAInstallSidebarItem.vue
        ─────────────────────────
        Drop this anywhere inside the sidebar <nav> section.
        It automatically hides once the app is installed.

        Props:
          isFull  – Boolean: sidebar is in expanded (label-visible) mode
          isIcon  – Boolean: sidebar is in collapsed (icon-only) mode
    -->
    <Transition
        enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-200 ease-in"
        enter-from-class="opacity-0 -translate-y-1"
        leave-to-class="opacity-0 -translate-y-1"
    >
        <div v-if="showSidebarItem">

            <!-- Divider (only in full mode) -->
            <div v-if="isFull || isMobileShown" class="px-8 pt-4 pb-1">
                <p class="text-[10px] font-black uppercase tracking-[0.2em] text-abyss-700 dark:text-platinum-400">
                    Get The App
                </p>
            </div>
            <div v-else class="my-2 mx-4 border-t border-platinum-200 dark:border-abyss-500"></div>

            <!-- Install button — matches existing sidebar button pattern exactly -->
            <button
                @click="handleInstall"
                :disabled="installing"
                :title="isIcon ? 'Install App' : undefined"
                :class="[
                    'group relative flex items-center transition-all duration-300 py-1.5 ml-4 w-[calc(100%-1rem+1px)] rounded-l-2xl z-10 outline-none',
                    'bg-transparent hover:bg-calm-lavender-50/60 dark:hover:bg-calm-lavender-900/20 hover:translate-x-1',
                    'disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-x-0'
                ]"
            >
                <div :class="['flex items-center gap-4 w-full h-full relative z-20', isIcon ? 'justify-center pr-2' : 'pl-3']">

                    <!-- Icon container -->
                    <div class="w-10 h-10 rounded-[1.1rem] flex items-center justify-center transition-all duration-300 flex-shrink-0
                                bg-gradient-to-br from-calm-lavender-100 to-neon-pink-50
                                dark:from-calm-lavender-900/30 dark:to-neon-pink-900/10
                                border border-calm-lavender-200 dark:border-calm-lavender-800/30
                                group-hover:from-calm-lavender-200 group-hover:to-neon-pink-100
                                dark:group-hover:from-calm-lavender-800/40 dark:group-hover:to-neon-pink-900/20">
                        <div v-if="installing" class="spinner !w-4 !h-4 !border-2 !border-calm-lavender-400/40 !border-t-calm-lavender-600"></div>
                        <DownloadIcon v-else class="w-5 h-5 text-calm-lavender-600 dark:text-calm-lavender-400 stroke-[2.5]" />
                    </div>

                    <!-- Label (only when sidebar is expanded) -->
                    <div v-if="isFull || isMobileShown" class="flex flex-col items-start pt-1">
                        <span class="sidebar-item-name sidebar-inactive-item-name sidebar-inactive-item-name-hover transition-colors duration-300 group-hover:!text-calm-lavender-600 dark:group-hover:!text-calm-lavender-400">
                            {{ installing ? 'Installing…' : 'Install App' }}
                        </span>
                        <span class="font-mplusrounded text-[10px] text-platinum-400 dark:text-platinum-500 leading-tight mt-0.5">
                            Add to home screen
                        </span>
                    </div>
                </div>
            </button>
        </div>
    </Transition>
</template>

<script setup>
import { ref } from 'vue'
import { Download as DownloadIcon } from 'lucide-vue-next'
import { usePWA } from '@/utils/usePWA'

defineProps({
    isFull:       { type: Boolean, default: false },
    isIcon:       { type: Boolean, default: false },
    isMobileShown:{ type: Boolean, default: false },
})

const { showSidebarItem, installApp } = usePWA()
const installing = ref(false)

async function handleInstall() {
    installing.value = true
    await installApp()
    installing.value = false
}
</script>