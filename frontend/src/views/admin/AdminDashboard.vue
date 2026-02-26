<template>
    <div class="space-y-6 font-['Poppins'] animate-in fade-in duration-1000">
        
        <header class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
            <div class="space-y-1">
                <div class="flex items-center gap-2">
                    <div class="h-1 w-8 bg-gradient-to-r from-blue-600 to-pink-600 rounded-full"></div>
                    <span class="text-[8px] font-black uppercase tracking-[0.4em] text-blue-500/80">Main Control</span>
                </div>
                <h1 class="text-4xl font-black text-white uppercase tracking-tighter leading-none">
                    Admin <span class="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Dashboard</span>
                </h1>
                <p class="text-[11px] text-gray-500 font-medium italic">Welcome! A simple look at how your community is doing.</p>
            </div>
            
            <div class="flex gap-2">
                <button class="group flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300">
                    <DownloadIcon class="h-4 w-4 text-gray-500 group-hover:text-blue-400 transition-all" />
                    <span class="text-[9px] font-black tracking-widest text-gray-300 uppercase">Save Report</span>
                </button>
            </div>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="relative overflow-hidden bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 transition-all duration-500 hover:border-blue-500/30 group">
                <div class="absolute -top-10 -right-10 w-24 h-24 bg-blue-600/5 rounded-full blur-3xl"></div>
                <div class="relative z-10 flex flex-col justify-between h-full">
                    <div class="flex justify-between items-start mb-4">
                        <div class="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shadow-inner">
                            <UsersIcon class="h-4 w-4" />
                        </div>
                        <span class="px-2.5 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[7px] font-black uppercase tracking-widest rounded-full italic">+{{ stats.newUsersThisMonth }} New</span>
                    </div>
                    <p class="text-[9px] font-black text-gray-600 uppercase tracking-widest leading-none">Total People</p>
                    <p class="text-4xl font-black text-white mt-2 tracking-tighter">{{ stats.totalUsers }}</p>
                </div>
            </div>

            <div class="relative overflow-hidden bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 transition-all duration-500 hover:border-pink-500/30 group">
                <div class="absolute -top-10 -right-10 w-24 h-24 bg-pink-600/5 rounded-full blur-3xl"></div>
                <div class="relative z-10 flex flex-col justify-between h-full">
                    <div class="flex justify-between items-start mb-4">
                        <div class="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 shadow-inner">
                            <UserCogIcon class="h-4 w-4" />
                        </div>
                        <span class="px-2.5 py-0.5 bg-pink-500/10 border border-pink-500/20 text-pink-400 text-[7px] font-black uppercase tracking-widest rounded-full italic">{{ stats.facilitatorGrowth }}% Growth</span>
                    </div>
                    <p class="text-[9px] font-black text-gray-600 uppercase tracking-widest leading-none">Our Teachers</p>
                    <p class="text-4xl font-black text-white mt-2 tracking-tighter">{{ stats.activeFacilitators }}</p>
                </div>
            </div>

            <div class="relative overflow-hidden bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 transition-all duration-500 hover:border-purple-500/30 group">
                <div class="absolute -top-10 -right-10 w-24 h-24 bg-purple-600/5 rounded-full blur-3xl"></div>
                <div class="relative z-10 flex flex-col h-full justify-between">
                    <div class="flex justify-between items-start mb-4">
                        <div class="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shadow-inner">
                            <BookOpenIcon class="h-4 w-4" />
                        </div>
                        <span class="px-2.5 py-0.5 bg-white/5 border border-white/10 text-gray-500 text-[7px] font-black uppercase tracking-widest rounded-full italic">{{ stats.publishedModules }} Shared</span>
                    </div>
                    <p class="text-[9px] font-black text-gray-600 uppercase tracking-widest leading-none">Lessons</p>
                    <p class="text-4xl font-black text-white mt-2 tracking-tighter">{{ stats.totalModules }}</p>
                </div>
            </div>

            <div class="relative overflow-hidden bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 transition-all duration-500 hover:border-emerald-500/30 group">
                <div class="absolute -top-10 -right-10 w-24 h-24 bg-emerald-600/5 rounded-full blur-3xl"></div>
                <div class="relative z-10 flex flex-col h-full justify-between">
                    <div class="flex justify-between items-start mb-4">
                        <div class="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-inner">
                            <ActivityIcon class="h-4 w-4" />
                        </div>
                        <div class="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[6px] font-black uppercase tracking-widest rounded-full">
                            <span class="h-1 w-1 bg-emerald-500 rounded-full animate-pulse"></span> ALL GOOD
                        </div>
                    </div>
                    <p class="text-[9px] font-black text-gray-600 uppercase tracking-widest leading-none">System Status</p>
                    <p class="text-4xl font-black text-white mt-2 tracking-tighter">{{ stats.healthScore }}%</p>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            <div class="lg:col-span-7 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden">
                <div class="flex items-center justify-between mb-6 px-2">
                    <h3 class="text-lg font-black text-white uppercase tracking-tighter italic">Recent News</h3>
                    <button class="text-[8px] font-black text-blue-500 hover:text-pink-500 transition-colors uppercase tracking-[0.2em]">Show All</button>
                </div>
                
                <div class="space-y-2">
                    <div v-for="activity in recentActivity" :key="activity.id"
                        class="flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 hover:bg-white/5 border border-transparent hover:border-white/5 group">
                        <div class="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-500 group-hover:text-blue-400 group-hover:border-blue-500/30 transition-all duration-500 shadow-lg">
                            <component :is="activity.icon" class="h-4 w-4 transition-transform group-hover:rotate-12" />
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-xs font-bold text-gray-300 truncate leading-snug">{{ activity.title }}</p>
                            <p class="text-[8px] font-mono text-gray-600 uppercase mt-0.5 tracking-tighter">{{ activity.time }} // OK</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="lg:col-span-5 bg-[#0d0d12] border border-white/5 rounded-[2.5rem] p-8">
                <h3 class="text-lg font-black text-white uppercase tracking-tighter italic mb-6 px-2">Quick Tasks</h3>
                <div class="grid grid-cols-2 gap-3">
                    <router-link v-for="action in [
                        { to: '/admin/facilitators', icon: UserPlusIcon, label: 'Add User', color: 'hover:border-pink-500/30 text-pink-500' },
                        { to: '/admin/content', icon: FileTextIcon, label: 'Lessons', color: 'hover:border-blue-500/30 text-blue-500' },
                        { to: '/admin/reports', icon: BarChartIcon, label: 'Reports', color: 'hover:border-purple-500/30 text-purple-500' },
                        { to: '/admin/settings', icon: SettingsIcon, label: 'Settings', color: 'hover:border-gray-500/30 text-gray-400' }
                    ]" :key="action.label" :to="action.to"
                        class="flex flex-col items-center justify-center p-6 rounded-3xl bg-white/[0.02] border border-white/5 transition-all duration-300 group hover:bg-white/[0.04] shadow-md"
                        :class="action.color">
                        <component :is="action.icon" class="h-6 w-6 opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all mb-3" />
                        <span class="text-[9px] font-black group-hover:text-white uppercase tracking-widest text-center">{{ action.label }}</span>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import {
    UsersIcon,
    UserCogIcon,
    BookOpenIcon,
    ActivityIcon,
    DownloadIcon,
    UserPlusIcon,
    FileTextIcon,
    BarChartIcon,
    SettingsIcon
} from 'lucide-vue-next';

const stats = ref({
    totalUsers: 1284,
    newUsersThisMonth: 156,
    activeFacilitators: 47,
    facilitatorGrowth: 12,
    totalModules: 342,
    publishedModules: 298,
    healthScore: 98
});

const recentActivity = ref([
    { id: 1, icon: UserPlusIcon, title: 'New teacher joined the team', time: '5m' },
    { id: 2, icon: FileTextIcon, title: 'New lesson was posted', time: '1h' },
    { id: 3, icon: UsersIcon, title: '25 new students started', time: '2h' },
    { id: 4, icon: SettingsIcon, title: 'Platform settings updated', time: '3h' }
]);
</script>

<style scoped>
/* Industrial Layout Entry */
.animate-in {
    animation: dashboardEntry 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes dashboardEntry {
    from { opacity: 0; transform: translateY(20px); filter: blur(5px); }
    to { opacity: 1; transform: translateY(0); filter: blur(0); }
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
</style>