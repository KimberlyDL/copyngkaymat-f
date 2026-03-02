<template>
    <div class="min-h-screen bg-slate-50 dark:bg-[#06050a] custom-font-poppins text-black dark:text-white relative selection:bg-purple-500/30 transition-colors duration-500 overflow-x-hidden">
        
        <div class="fixed top-[-5%] left-[-2%] w-[500px] h-[500px] bg-purple-600/5 dark:bg-purple-600/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
        <div class="fixed bottom-[-5%] right-[-2%] w-[500px] h-[500px] bg-fuchsia-600/5 dark:bg-fuchsia-600/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
        
        <DashboardSidebar 
            :is-mobile-open="mobileOpen" 
            :user-id="$route.params.id || null"
            @close-mobile-sidebar="mobileOpen = false" 
            @expanded-change="isFull = $event" 
        />

        <div class="relative z-10 flex flex-col min-h-screen">
            
            <DashboardHeader 
                @toggle-mobile-sidebar="mobileOpen = !mobileOpen" 
                :class="[
                    'transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                    isFull ? 'lg:ml-72' : 'lg:ml-22'
                ]"
            />

            <main :class="[
                'flex-1 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                'p-4 md:p-8 lg:p-10',
                isFull ? 'lg:ml-72' : 'lg:ml-22'
            ]">
                <div class="max-w-[1600px] mx-auto w-full flex-1 animate-in">
                    <router-view v-slot="{ Component }">
                        <transition name="page-shift" mode="out-in">
                            <component :is="Component" />
                        </transition>
                    </router-view>
                </div>

                <footer class="mt-20 py-8 opacity-40">
                    <div class="flex items-center gap-3">
                        <div class="h-px w-6 bg-slate-300 dark:bg-white/10"></div>
                        <p class="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 italic">
                            Academic Console <span class="mx-2 text-slate-200 dark:text-white/10">|</span> 
                            <span class="text-purple-600 dark:text-purple-400">ProtectEd Registry System</span>
                        </p>
                    </div>
                </footer>
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import DashboardHeader from '@/components/nav/user_dashboard_header.vue'
import DashboardSidebar from '@/components/nav/user_dashboard_sidebar.vue'

const mobileOpen = ref(false)
const isFull = ref(false)
</script>

<style scoped>
.custom-font-poppins { font-family: 'Poppins', sans-serif !important; }

/* REFINED PAGE TRANSITIONS */
.page-shift-enter-active,
.page-shift-leave-active {
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.page-shift-enter-from {
    opacity: 0;
    transform: scale(0.99) translateY(10px);
}

.page-shift-leave-to {
    opacity: 0;
    transform: scale(1.01) translateY(-10px);
}

/* Optimization */
main {
    will-change: margin-left, transform, opacity;
}

.animate-in {
    animation: layoutEntry 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes layoutEntry {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>