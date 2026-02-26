<template>
    <div class="space-y-6 font-['Poppins'] animate-in fade-in duration-1000">
        
        <header class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
            <div class="space-y-1">
                <div class="flex items-center gap-2">
                    <div class="h-1 w-8 bg-gradient-to-r from-blue-600 to-pink-600 rounded-full"></div>
                    <span class="text-[8px] font-black uppercase tracking-[0.4em] text-blue-500/80">Facilitator Console</span>
                </div>
                <h1 class="text-4xl font-black text-white uppercase tracking-tighter leading-none">
                    Welcome back, <span class="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">{{ facilitatorName }}!</span>
                </h1>
                <p class="text-[11px] text-gray-500 font-medium italic">Here is a quick look at your students' progress today.</p>
            </div>
            
            <router-link to="/facilitator/modules/create"
                class="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-500">
                <PlusIcon class="w-4 h-4" /> Create Module
            </router-link>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div v-for="stat in [
                { label: 'My Students', val: stats.totalStudents, sub: `${stats.activeStudents} active today`, icon: UsersIcon, color: 'blue' },
                { label: 'My Modules', val: stats.myModules, sub: `${stats.publishedModules} published`, icon: BookOpenIcon, color: 'pink' },
                { label: 'Completion Rate', val: stats.completionRate + '%', sub: `+${stats.completionGrowth}% this month`, icon: TrendingUpIcon, color: 'emerald' },
                { label: 'Pending Reviews', val: stats.pendingReviews, sub: 'Needs attention', icon: ClipboardCheckIcon, color: 'purple' }
            ]" :key="stat.label" 
            class="relative overflow-hidden bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 transition-all duration-500 hover:border-white/20 group">
                <div class="relative z-10 flex flex-col justify-between h-full">
                    <div class="flex justify-between items-start mb-4">
                        <div :class="`p-2.5 rounded-xl bg-${stat.color}-500/10 border border-${stat.color}-500/20 text-${stat.color}-400 shadow-inner`">
                            <component :is="stat.icon" class="h-4 w-4" />
                        </div>
                        <router-link v-if="stat.label === 'Pending Reviews'" to="/facilitator/reviews" class="text-[7px] font-black uppercase tracking-widest text-blue-400 hover:text-white transition-colors underline decoration-blue-500/30">Review Now</router-link>
                    </div>
                    <p class="text-[9px] font-black text-gray-600 uppercase tracking-widest leading-none">{{ stat.label }}</p>
                    <p class="text-4xl font-black text-white mt-2 tracking-tighter">{{ stat.val }}</p>
                    <p :class="`text-[8px] font-bold text-${stat.color}-500/80 uppercase mt-2 tracking-tight`">{{ stat.sub }}</p>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            <div class="lg:col-span-7 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3.5rem] p-8 overflow-hidden relative">
                <div class="flex items-center justify-between mb-8 px-2">
                    <h3 class="text-lg font-black text-white uppercase tracking-tighter italic">Student Activity</h3>
                    <router-link to="/facilitator/students" class="text-[8px] font-black text-blue-500 hover:text-pink-500 transition-colors uppercase tracking-[0.2em]">View All Activity</router-link>
                </div>
                
                <div class="space-y-2">
                    <div v-for="activity in studentActivity" :key="activity.id"
                        class="flex items-center justify-between p-3 rounded-2xl transition-all duration-300 hover:bg-white/5 border border-transparent hover:border-white/5 group">
                        <div class="flex items-center gap-4 min-w-0">
                            <img :src="activity.avatar" :alt="activity.name" class="h-9 w-9 rounded-xl object-cover border border-white/10 group-hover:border-blue-500/50 transition-all" />
                            <div class="min-w-0">
                                <p class="text-xs font-bold text-gray-200 truncate leading-tight">{{ activity.name }}</p>
                                <p class="text-[9px] text-gray-500 truncate lowercase font-medium italic">{{ activity.action }}</p>
                            </div>
                        </div>
                        <div class="text-right shrink-0 ml-4">
                            <p class="text-xs font-black text-blue-400 leading-tight">{{ activity.score }}%</p>
                            <p class="text-[8px] font-mono text-gray-600 uppercase tracking-tighter">{{ activity.time }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="lg:col-span-5 bg-[#0d0d12] border border-white/5 rounded-[3.5rem] p-8">
                <h3 class="text-lg font-black text-white uppercase tracking-tighter italic mb-8 px-2">Quick Tasks</h3>
                <div class="grid grid-cols-1 gap-3">
                    <router-link v-for="action in [
                        { to: '/facilitator/modules/create', icon: PlusIcon, label: 'Create New Module', color: 'hover:border-blue-500/30 text-blue-500', bg: 'bg-blue-500/5' },
                        { to: '/facilitator/students', icon: UsersIcon, label: 'View Student List', color: 'hover:border-pink-500/30 text-pink-500', bg: 'bg-pink-500/5' },
                        { to: '/facilitator/analytics', icon: LineChartIcon, label: 'Check Performance', color: 'hover:border-purple-500/30 text-purple-500', bg: 'bg-purple-500/5' },
                        { to: '/facilitator/resources', icon: FolderIcon, label: 'Teacher Resources', color: 'hover:border-emerald-500/30 text-emerald-500', bg: 'bg-emerald-500/5' }
                    ]" :key="action.label" :to="action.to"
                        class="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 transition-all duration-300 group hover:bg-white/[0.04] shadow-md"
                        :class="action.color">
                        <div :class="`p-2 rounded-xl ${action.bg} border border-white/5 transition-all group-hover:scale-110 group-hover:rotate-6`, text-inherit">
                            <component :is="action.icon" class="h-4 w-4" />
                        </div>
                        <span class="text-[10px] font-black group-hover:text-white uppercase tracking-widest">{{ action.label }}</span>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import {
    PlusIcon,
    UsersIcon,
    BookOpenIcon,
    TrendingUpIcon,
    ClipboardCheckIcon,
    LineChartIcon,
    FolderIcon
} from 'lucide-vue-next';

const authStore = useAuthStore();
const facilitatorName = computed(() => authStore.user?.name?.split(' ')[0] || 'Facilitator');

const stats = ref({
    totalStudents: 87,
    activeStudents: 34,
    myModules: 23,
    publishedModules: 19,
    completionRate: 76,
    completionGrowth: 8,
    pendingReviews: 12
});

const studentActivity = ref([
    { id: 1, name: 'Maria Santos', action: 'Completed "Understanding VAWC"', score: 95, time: '10m ago', avatar: 'https://ui-avatars.com/api/?name=Maria+Santos&background=0d0d12&color=3b82f6' },
    { id: 2, name: 'Juan Dela Cruz', action: 'Started "Gender Equality Basics"', score: 0, time: '30m ago', avatar: 'https://ui-avatars.com/api/?name=Juan+Dela+Cruz&background=0d0d12&color=ec4899' },
    { id: 3, name: 'Ana Reyes', action: 'Completed Quiz on GAD', score: 88, time: '1h ago', avatar: 'https://ui-avatars.com/api/?name=Ana+Reyes&background=0d0d12&color=a855f7' }
]);
</script>

<style scoped>
/* High-Density Entry Animation */
.animate-in {
    animation: dashboardEntry 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes dashboardEntry {
    from { opacity: 0; transform: translateY(20px); filter: blur(5px); }
    to { opacity: 1; transform: translateY(0); filter: blur(0); }
}

/* Custom Scrollbar */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
</style>