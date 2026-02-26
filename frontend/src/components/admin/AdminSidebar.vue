<template>
    <Transition enter-active-class="transition-opacity duration-300" leave-active-class="transition-opacity duration-200" enter-from-class="opacity-0" leave-to-class="opacity-0">
        <div v-if="sidebarStore.isMobileOpen" class="fixed inset-0 z-40 md:hidden bg-[#020203]/90 backdrop-blur-md" @click="sidebarStore.closeMobile" />
    </Transition>

    <aside 
        class="fixed top-0 left-0 z-50 h-screen transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] font-['Poppins'] select-none" 
        :class="[
            sidebarStore.isExpanded ? 'w-72' : 'w-24',
            sidebarStore.isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        ]">
        <div class="h-full flex flex-col bg-[#060608] border-r border-white/5 shadow-2xl transition-all duration-500 overflow-hidden relative text-white">
            
            <div class="absolute -top-20 -left-20 w-40 h-40 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none"></div>
            <div class="absolute bottom-1/2 -right-20 w-40 h-40 bg-pink-600/5 rounded-full blur-[80px] pointer-events-none"></div>

            <div class="flex items-center h-28 px-6 flex-shrink-0 overflow-hidden relative z-10 transition-all duration-500" :class="!sidebarStore.isExpanded && 'justify-center px-0'">
                <router-link to="/admin/dashboard" class="flex items-center gap-4 group min-w-max">
                    <div class="relative flex-shrink-0 transition-transform duration-500" :class="!sidebarStore.isExpanded && 'scale-90'">
                        <div class="relative w-12 h-12 bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600 rounded-[1.2rem] flex items-center justify-center shadow-[0_0_25px_rgba(236,72,153,0.3)] group-hover:scale-105 transition-transform duration-500">
                            <ShieldCheckIcon class="w-7 h-7 text-white" />
                        </div>
                    </div>
                    
                    <div v-if="sidebarStore.isExpanded" class="flex flex-col whitespace-nowrap overflow-hidden animate-in fade-in slide-in-from-left-4 duration-500">
                        <span class="font-black text-2xl tracking-tighter text-white leading-none uppercase">
                            Protect<span class="bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">Ed</span>
                        </span>
                        <span class="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500 mt-1 italic">
                            Admin System
                        </span>
                    </div>
                </router-link>
            </div>

            <div :class="['flex items-center py-4 relative z-10 transition-all duration-500', sidebarStore.isExpanded ? 'justify-between px-6' : 'justify-center px-0']">
                <transition name="fade">
                    <span v-if="sidebarStore.isExpanded" class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 italic">Main Menu</span>
                </transition>
                
                <button @click="sidebarStore.toggleExpanded"
                    class="flex items-center justify-center w-8 h-8 rounded-full bg-white/[0.03] border border-white/10 hover:border-blue-500/40 text-blue-400 transition-all active:scale-90 shadow-inner group/toggle">
                    <ChevronLeftIcon v-if="sidebarStore.isExpanded" class="h-4 w-4 group-hover/toggle:-translate-x-0.5 transition-transform" />
                    <ChevronRightIcon v-else class="h-4 w-4 group-hover/toggle:translate-x-0.5 transition-transform" />
                </button>
            </div>

            <nav class="flex-1 overflow-y-auto py-4 space-y-8 custom-scrollbar overflow-x-hidden relative z-10 transition-all duration-500" 
                :class="sidebarStore.isExpanded ? 'px-4' : 'px-0 side-nav-collapsed'">
                
                <section class="space-y-1">
                    <div v-if="sidebarStore.isExpanded" class="px-3 mb-4 text-[10px] font-black uppercase tracking-[0.25em] text-blue-500 italic opacity-80 flex items-center gap-2">
                        Main Registry
                    </div>

                    <div class="space-y-1">
                        <SidebarNavItem to="/admin/dashboard" :exact="true" title="Home" class="nav-node">
                            <template #icon><LayoutDashboardIcon class="h-5 w-5" /></template>
                        </SidebarNavItem>

                        <SidebarNavItem to="/admin/facilitators" title="Facilitators" class="nav-node">
                            <template #icon><UsersIcon class="h-5 w-5" /></template>
                        </SidebarNavItem>

                        <SidebarNavDropdown label="Lessons" :match-paths="['/admin/content']" class="nav-node">
                            <template #icon><BookOpenIcon class="h-5 w-5" /></template>
                            <SidebarNavItem to="/admin/content" title="Library" />
                            <SidebarNavItem to="/admin/content/modules" title="Modules" />
                        </SidebarNavDropdown>
                    </div>
                </section>

                <section class="space-y-1">
                    <div v-if="sidebarStore.isExpanded" class="px-3 mb-4 text-[10px] font-black uppercase tracking-[0.25em] text-pink-500 italic opacity-80 flex items-center gap-2">
                        Performance
                    </div>

                    <div class="space-y-1 text-left">
                        <SidebarNavItem to="/admin/reports" title="Analytics" class="nav-node text-left">
                            <template #icon><LineChartIcon class="h-5 w-5" /></template>
                        </SidebarNavItem>

                        <SidebarNavItem to="/admin/activity" title="Checking" class="nav-node relative text-left">
                            <template #icon><ClipboardCheckIcon class="h-5 w-5" /></template>
                            <template #badge>
                                <div v-if="true" 
                                    :class="['bg-gradient-to-r from-pink-600 to-indigo-600 text-white font-black rounded-md shadow-lg shadow-pink-900/40 flex items-center justify-center transition-all',
                                        sidebarStore.isExpanded ? 'px-1.5 py-0.5 text-[9px]' : 'absolute top-1 right-3 w-4 h-4 text-[8px]']">
                                    3
                                </div>
                            </template>
                        </SidebarNavItem>

                        <SidebarNavItem to="/admin/settings" title="Files" class="nav-node text-left">
                            <template #icon><FolderIcon class="h-5 w-5" /></template>
                        </SidebarNavItem>
                    </div>
                </section>
            </nav>

            <div class="mt-auto border-t border-white/5 p-4 relative z-10 transition-all duration-500">
                <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="transform scale-95 opacity-0 -translate-y-2" enter-to-class="transform scale-100 opacity-100 translate-y-0" leave-active-class="transition duration-150 ease-in" leave-from-class="transform scale-100 opacity-100 translate-y-0" leave-to-class="transform scale-95 opacity-0 -translate-y-2">
                    <div v-if="isUserMenuOpen" 
                         class="absolute bottom-20 left-4 right-4 bg-[#0d0d12] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[60] py-2"
                         :class="!sidebarStore.isExpanded && 'w-48 left-20'">
                        <button @click="navigate('/profile')" class="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 text-gray-400 hover:text-white transition-colors text-left">
                            <UserIcon class="w-4 h-4 text-blue-400" />
                            <span class="text-[10px] font-black uppercase tracking-widest">Profile</span>
                        </button>
                        <button @click="navigate('/settings')" class="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 text-gray-400 hover:text-white transition-colors text-left">
                            <SettingsIcon class="w-4 h-4 text-pink-400" />
                            <span class="text-[10px] font-black uppercase tracking-widest">Settings</span>
                        </button>
                        <div class="h-px bg-white/5 my-1"></div>
                        <button @click="isLogoutModalOpen = true; isUserMenuOpen = false" class="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-500/10 text-red-500 transition-colors text-left">
                            <LogOutIcon class="w-4 h-4" />
                            <span class="text-[10px] font-black uppercase tracking-widest">Sign Out</span>
                        </button>
                    </div>
                </Transition>

                <div :class="[
                    'flex items-center bg-[#0d0d12] border border-white/5 rounded-2xl transition-all duration-500 hover:border-blue-500/20 shadow-xl overflow-hidden', 
                    sidebarStore.isExpanded ? 'w-full p-2.5 justify-between' : 'w-14 h-14 p-0 justify-center mx-auto'
                ]">
                    
                    <div class="flex items-center gap-3 min-w-0" v-if="sidebarStore.isExpanded">
                        <div class="relative group/avatar cursor-pointer">
                            <div class="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-pink-600 rounded-full blur opacity-20 group-hover/avatar:opacity-60 transition duration-500"></div>
                            <div class="relative w-9 h-9 rounded-full bg-[#060608] border border-white/10 flex items-center justify-center text-[11px] font-black text-white shadow-xl uppercase overflow-hidden">
                                <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-pink-500/10"></div>
                                {{ userInitials }}
                            </div>
                        </div>
                        
                        <div class="flex-1 min-w-0 text-left">
                            <p class="text-[10px] font-black uppercase tracking-tight text-white leading-none">WELCOME,</p>
                            <p class="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] leading-none mt-1 truncate">{{ userName }}</p>
                        </div>
                    </div>

                    <button @click="isUserMenuOpen = !isUserMenuOpen" 
                        :class="['flex items-center justify-center transition-all duration-300 rounded-xl overflow-hidden group/btn', 
                            sidebarStore.isExpanded ? 'w-8 h-8 hover:bg-white/5 text-gray-500 hover:text-white' : 'w-full h-full']">
                        <MoreVerticalIcon v-if="sidebarStore.isExpanded" class="h-4 w-4" />
                        <div v-else class="w-full h-full bg-gradient-to-br from-blue-600 to-pink-600 flex items-center justify-center text-[12px] font-black text-white shadow-inner group-hover/btn:scale-110 transition-transform">
                            {{ userInitials }}
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </aside>

    <div v-if="isLogoutModalOpen" class="fixed inset-0 z-[300] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-[#020203]/95 backdrop-blur-md" @click="isLogoutModalOpen = false"></div>
        <div class="relative bg-[#0d0d12] border border-white/10 rounded-[2.5rem] p-10 max-w-sm w-full text-center z-[310] flex flex-col items-center">
             <div class="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-[1.5rem] flex items-center justify-center mb-6 text-red-500">
                <LogOutIcon class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-black uppercase tracking-tighter italic text-white mb-2">Log Out?</h3>
            <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed mb-8">System session will be terminated.</p>
            <div class="grid grid-cols-2 gap-4 w-full">
                <button @click="isLogoutModalOpen = false" class="px-6 py-3.5 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-white/5">Cancel</button>
                <button @click="handleLogout" :disabled="isLoggingOut" class="px-6 py-3.5 bg-gradient-to-r from-red-600 to-pink-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                    {{ isLoggingOut ? '...' : 'Confirm' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
// FIXED: Inimport ang useAuthStore mula sa tamang file
import { useSidebarStore } from '@/stores/stores';
import { useAuthStore } from '@/stores/auth'; 
import {
    ShieldCheck as ShieldCheckIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    LayoutDashboard as LayoutDashboardIcon,
    Users as UsersIcon,
    BookOpen as BookOpenIcon,
    LineChart as LineChartIcon,
    ClipboardCheck as ClipboardCheckIcon,
    Folder as FolderIcon,
    MoreVertical as MoreVerticalIcon,
    LogOut as LogOutIcon,
    User as UserIcon,
    Settings as SettingsIcon
} from 'lucide-vue-next';
import SidebarNavItem from '@/components/sidebar/user_sidebar_nav_item.vue';
import SidebarNavDropdown from '@/components/sidebar/user_sidebar_nav_dropdown.vue';

const router = useRouter();
const sidebarStore = useSidebarStore();
const authStore = useAuthStore();

const isUserMenuOpen = ref(false);
const isLogoutModalOpen = ref(false);
const isLoggingOut = ref(false);

// Dynamic user information mula sa AuthStore
const userName = computed(() => authStore.user?.first_name || 'ADMIN');
const userInitials = computed(() => {
    const f = authStore.user?.first_name?.[0] || 'A';
    const l = authStore.user?.last_name?.[0] || 'S';
    return (f + l).toUpperCase();
});

const navigate = (path) => {
    isUserMenuOpen.value = false;
    router.push(path);
};

const handleLogout = async () => {
    isLoggingOut.value = true;
    try {
        await authStore.logout(); // Tawagin ang logout function mula sa store
        router.push({ name: 'login' });
    } catch (e) {
        console.error("Logout failed", e);
    } finally {
        isLoggingOut.value = false;
        isLogoutModalOpen.value = false;
    }
};
</script>

<style scoped>
@reference "@/style.css";

aside * {
    white-space: nowrap;
}

.custom-scrollbar::-webkit-scrollbar { width: 3px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { 
    background: linear-gradient(to bottom, #3b82f6, #ec4899); 
    border-radius: 10px; 
}

:deep(.nav-node) {
    @apply transition-all duration-500 rounded-2xl mb-1;
}

:deep(.router-link-active) {
    @apply bg-white/[0.05] shadow-lg shadow-blue-900/10 scale-[1.02];
}

.side-nav-collapsed :deep(.flex),
.side-nav-collapsed :deep(div) {
    @apply justify-center px-0;
}

.side-nav-collapsed :deep(span),
.side-nav-collapsed :deep(p),
.side-nav-collapsed :deep(.text-xs) {
    @apply hidden opacity-0 pointer-events-none;
}

.side-nav-collapsed :deep(.nav-node) {
    @apply flex justify-center w-full px-0;
}

.side-nav-collapsed :deep(svg:not(:first-child)) {
    @apply hidden;
}

:deep(.nav-node span) {
    @apply text-[11px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white transition-all duration-300;
}

.animate-in { animation-fill-mode: forwards; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>