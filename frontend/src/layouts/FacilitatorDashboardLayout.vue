<template>
    <div class="min-h-screen bg-[#060608] font-['Century_Gothic'] text-white relative selection:bg-blue-500/30">
        
        <div class="fixed top-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
        <div class="fixed bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-pink-600/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
        
        <FacilitatorSidebar />

        <div class="relative z-10 transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) min-h-screen flex flex-col" 
             :class="sidebarStore.isExpanded ? 'lg:pl-64' : 'lg:pl-20'">
            
            <FacilitatorHeader />

            <main class="flex-1 p-6 lg:p-10 relative">
                <div class="max-w-[1600px] mx-auto w-full">
                    <router-view v-slot="{ Component }">
                        <transition name="layout-shift" mode="out-in">
                            <component :is="Component" />
                        </transition>
                    </router-view>
                </div>
            </main>

            <footer class="px-10 py-6 opacity-40">
                <p class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                    Facilitator Node // <span class="text-blue-500">ProtectEd Systems</span>
                </p>
            </footer>
        </div>
    </div>
</template>

<script setup>
import { useSidebarStore } from '@/stores/stores'; 
import FacilitatorSidebar from '@/components/facilitator/FacilitatorSidebar.vue';
import FacilitatorHeader from '@/components/facilitator/FacilitatorHeader.vue';

const sidebarStore = useSidebarStore();
</script>