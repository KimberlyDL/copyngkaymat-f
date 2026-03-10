<template>
    <div
        class="min-h-screen relative overflow-hidden font-['Poppins'] text-slate-900 dark:text-white selection:bg-purple-500/30">

        <!-- Background Ambient Effects -->
        <div class="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <div
                class="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[140px] mix-blend-screen dark:mix-blend-lighten opacity-60 animate-pulse">
            </div>
            <div
                class="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[140px] mix-blend-screen dark:mix-blend-lighten opacity-60 animate-pulse delay-700">
            </div>
        </div>

        <div class="relative z-10 space-y-10 p-6 md:p-10 animate-in fade-in duration-700">

            <!-- HEADER -->
            <header
                class="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2 border-b border-slate-200 dark:border-white/5 pb-8 relative">
                <div class="space-y-2">
                    <div class="flex items-center gap-2.5">
                        <div
                            class="h-1 w-8 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-full shadow-[0_2px_10px_rgba(139,92,246,0.4)]">
                        </div>
                        <span
                            class="text-[10px] font-extrabold uppercase tracking-[0.3em] text-purple-600 dark:text-purple-400">Facilitator
                            Console</span>
                    </div>
                    <h1
                        class="text-3xl md:text-4xl font-[900] text-black dark:text-white uppercase tracking-tighter leading-tight italic">
                        Welcome <span
                            class="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-500 bg-clip-text text-transparent">{{
                                facilitatorName }}</span>
                    </h1>
                    <p class="text-xs font-medium text-black/50 dark:text-slate-400 italic tracking-tight">Orchestrate
                        learning experiences and monitor student progression with precision.</p>
                </div>

                <router-link :to="{ name: 'facilitator.modules' }"
                    class="group flex items-center gap-3 px-6 py-3 bg-purple-600 border border-purple-500 rounded-2xl hover:bg-purple-700 transition-all duration-300 shadow-lg shadow-purple-500/20">
                    <PlusIcon class="h-4 w-4 text-white" />
                    <span class="text-[10px] font-[900] tracking-widest text-white uppercase italic">New Module</span>
                </router-link>
            </header>

            <!-- ANNOUNCEMENTS (Full width on top) -->
            <div v-if="announcements && announcements.length > 0"
                class="relative overflow-hidden bg-amber-50/50 dark:bg-amber-500/[0.02] backdrop-blur-xl border border-amber-200/50 dark:border-amber-500/10 rounded-[2rem] p-6 shadow-sm">
                <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center gap-4">
                        <div
                            class="p-2.5 bg-amber-100 dark:bg-amber-500/10 rounded-2xl text-amber-600 dark:text-amber-500 shadow-inner">
                            <BellRingIcon class="w-5 h-5" />
                        </div>
                        <h3 class="text-xl font-[900] text-black dark:text-white uppercase tracking-tighter italic">
                            Priority <span class="text-amber-500">Intel</span></h3>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="ann in announcements" :key="ann.id"
                        class="relative overflow-hidden p-6 bg-white/80 dark:bg-[#0d0d15]/60 backdrop-blur-md border border-amber-100 dark:border-amber-500/10 rounded-2xl hover:border-amber-400/30 hover:bg-white dark:hover:bg-[#0d0d15]/80 transition-all duration-300 group shadow-sm hover:shadow-xl hover:shadow-amber-500/5 cursor-pointer hover:-translate-y-1">

                        <div
                            class="absolute -top-4 -right-4 w-20 h-20 bg-amber-500/5 rounded-full blur-[20px] group-hover:bg-amber-500/10 transition-colors">
                        </div>

                        <div class="relative z-10">
                            <div class="flex items-center gap-3 mb-4">
                                <span :class="`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shadow-sm border ${ann.priority === 'urgent' ? 'bg-red-500/10 text-red-600 border-red-500/20' :
                                    ann.priority === 'high' ? 'bg-orange-500/10 text-orange-600 border-orange-500/20' :
                                        'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                                    }`">
                                    {{ ann.priority }}
                                </span>
                                <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{{
                                    formatTimeAgo(ann.created_at) }}</span>
                            </div>
                            <h4
                                class="text-sm font-[800] text-black dark:text-white leading-tight mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                                {{ ann.title }}
                            </h4>
                            <p class="text-[11px] text-slate-500 font-medium line-clamp-2 leading-relaxed">
                                {{ ann.content }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- STATS GRID -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <!-- Classrooms Stat -->
                <div
                    class="relative overflow-hidden bg-white dark:bg-[#0d0d15]/60 backdrop-blur-3xl border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 transition-all duration-500 hover:border-purple-500/40 group shadow-lg hover:shadow-purple-500/10">
                    <div class="relative z-10 flex flex-col justify-between h-full">
                        <div class="flex justify-between items-start mb-6">
                            <div
                                class="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-inner">
                                <SchoolIcon class="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <span
                                class="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-[8px] font-[900] uppercase tracking-widest rounded-full italic">Sections</span>
                        </div>
                        <div>
                            <p
                                class="text-[9px] font-black text-black/40 dark:text-slate-500 uppercase tracking-widest leading-none mb-1.5 italic">
                                Total Classrooms</p>
                            <p
                                class="text-3xl font-[900] text-black dark:text-white tracking-tighter italic leading-none">
                                {{ classroomStore.classrooms.length }}</p>
                        </div>
                    </div>
                    <div
                        class="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    </div>
                </div>

                <!-- Modules Stat -->
                <div
                    class="relative overflow-hidden bg-white dark:bg-[#0d0d15]/60 backdrop-blur-3xl border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 transition-all duration-500 hover:border-indigo-500/40 group shadow-lg hover:shadow-indigo-500/10">
                    <div class="relative z-10 flex flex-col justify-between h-full">
                        <div class="flex justify-between items-start mb-6">
                            <div
                                class="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-inner">
                                <BookOpenIcon class="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <span
                                class="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[8px] font-[900] uppercase tracking-widest rounded-full italic">Materials</span>
                        </div>
                        <div>
                            <p
                                class="text-[9px] font-black text-black/40 dark:text-slate-500 uppercase tracking-widest leading-none mb-1.5 italic">
                                Total Modules</p>
                            <p
                                class="text-3xl font-[900] text-black dark:text-white tracking-tighter italic leading-none">
                                {{ moduleStore.pagination.total || moduleStore.modules.length }}</p>
                        </div>
                    </div>
                    <div
                        class="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    </div>
                </div>

                <!-- Students Stat (Placeholder) -->
                <div
                    class="relative overflow-hidden bg-white dark:bg-[#0d0d15]/60 backdrop-blur-3xl border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 transition-all duration-500 hover:border-fuchsia-500/40 group shadow-lg hover:shadow-fuchsia-500/10">
                    <div class="relative z-10 flex flex-col justify-between h-full">
                        <div class="flex justify-between items-start mb-6">
                            <div
                                class="p-3.5 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-inner">
                                <UsersIcon class="h-5 w-5 text-fuchsia-600 dark:text-fuchsia-400" />
                            </div>
                            <span
                                class="px-3 py-1 bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-400 text-[8px] font-[900] uppercase tracking-widest rounded-full italic">Learners</span>
                        </div>
                        <div>
                            <p
                                class="text-[9px] font-black text-black/40 dark:text-slate-500 uppercase tracking-widest leading-none mb-1.5 italic">
                                Total Students</p>
                            <p
                                class="text-3xl font-[900] text-black dark:text-white tracking-tighter italic leading-none">
                                --</p>
                        </div>
                    </div>
                    <div
                        class="absolute inset-0 bg-gradient-to-tr from-fuchsia-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    </div>
                </div>

                <!-- Rewards/Shop Link -->
                <div class="relative overflow-hidden bg-[#0a0a0f] rounded-[2rem] p-6 group cursor-pointer border border-white/5 shadow-xl shadow-slate-900/10"
                    @click="router.push({ name: 'facilitator.rewards' })">
                    <!-- Animated Gradient Border -->
                    <div
                        class="absolute inset-0 bg-gradient-to-br from-purple-600 via-indigo-600 to-fuchsia-600 opacity-20 group-hover:opacity-40 transition-opacity duration-500 animate-gradient-xy">
                    </div>
                    <div
                        class="absolute -right-[40%] -bottom-[40%] w-[120%] h-[120%] bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-[60px] group-hover:scale-110 transition-transform duration-700">
                    </div>

                    <div class="relative z-10 flex flex-col justify-between h-full">
                        <div class="flex justify-between items-start mb-6">
                            <div
                                class="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                                <GiftIcon class="h-5 w-5" />
                            </div>
                            <div
                                class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-purple-500 group-hover:border-purple-500 transition-colors">
                                <ArrowUpRightIcon
                                    class="h-4 w-4 text-white/50 group-hover:text-white transition-colors" />
                            </div>
                        </div>
                        <div>
                            <p
                                class="text-[9px] font-black text-white/40 uppercase tracking-widest leading-none mb-1.5 italic">
                                Gamification</p>
                            <p
                                class="text-2xl font-[900] text-white tracking-tighter italic leading-none drop-shadow-md">
                                Rewards Shop</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- MAIN LAYOUT: Split Columns for Classrooms and Modules -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                <!-- LEFT SPAN: Classrooms -->
                <div
                    class="bg-white/90 dark:bg-[#0d0d15]/40 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                    <div class="flex items-center justify-between mb-8 px-2">
                        <div class="flex items-center gap-3">
                            <div class="h-6 w-1 bg-purple-600 rounded-full"></div>
                            <h3 class="text-xl font-[900] text-black dark:text-white uppercase tracking-tighter italic">
                                My Classrooms</h3>
                        </div>
                        <router-link :to="{ name: 'facilitator.classrooms' }"
                            class="text-[10px] font-black text-purple-500 hover:text-white dark:text-purple-400 dark:hover:text-white uppercase tracking-widest bg-purple-50 dark:bg-purple-500/10 hover:bg-purple-600 dark:hover:bg-purple-600 px-3 py-1.5 rounded-lg transition-colors">View
                            All</router-link>
                    </div>

                    <div v-if="classroomStore.loading" class="grid grid-cols-1 gap-4">
                        <div v-for="i in 2" :key="i"
                            class="h-24 bg-slate-100 dark:bg-white/5 rounded-2xl animate-pulse"></div>
                    </div>

                    <div v-else-if="classroomStore.classrooms.length === 0"
                        class="p-8 text-center bg-slate-50 dark:bg-white/5 rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
                        <SchoolIcon class="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <h4 class="text-sm font-[900] uppercase tracking-tight text-slate-400 mb-2">No Classrooms Yet
                        </h4>
                        <button @click="router.push({ name: 'facilitator.classrooms.create' })"
                            class="text-xs font-bold text-purple-600 underline hover:no-underline">Create your first
                            classroom</button>
                    </div>

                    <div v-else class="space-y-3">
                        <div v-for="classroom in classroomStore.classrooms.slice(0, 4)" :key="classroom.id"
                            @click="router.push({ name: 'facilitator.classrooms.show', params: { id: classroom.id } })"
                            class="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 hover:border-purple-500/30 transition-all cursor-pointer group hover:bg-white dark:hover:bg-white/5">

                            <div class="flex items-center gap-4">
                                <div
                                    class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                                    <span class="text-sm font-black italic">{{ classroom.section_name?.charAt(0) || 'C'
                                    }}</span>
                                </div>
                                <div>
                                    <div class="flex items-center gap-2 mb-0.5">
                                        <h4
                                            class="text-sm font-[900] text-black dark:text-white uppercase tracking-tight italic group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                            {{ classroom.section_name }}
                                        </h4>
                                        <span
                                            class="px-2 py-0.5 bg-slate-100 dark:bg-white/10 rounded-md text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/5">
                                            {{ classroom.join_code }}
                                        </span>
                                    </div>
                                    <p class="text-[10px] text-slate-400 font-medium line-clamp-1 max-w-[200px]">{{
                                        classroom.description || 'No description provided.' }}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-3 text-slate-400">
                                <UsersIcon class="w-4 h-4 group-hover:text-purple-500 transition-colors" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- RIGHT SPAN: Modules -->
                <div
                    class="bg-slate-50/50 dark:bg-[#0b0a12]/50 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 shadow-inner backdrop-blur-sm">
                    <div class="flex items-center justify-between mb-8 px-2">
                        <div class="flex items-center gap-3">
                            <div class="h-6 w-1 bg-indigo-500 rounded-full"></div>
                            <h3 class="text-xl font-[900] text-black dark:text-white uppercase tracking-tighter italic">
                                Recent Modules</h3>
                        </div>
                        <router-link :to="{ name: 'facilitator.modules' }"
                            class="text-[10px] font-black text-indigo-500 hover:text-white dark:text-indigo-400 dark:hover:text-white uppercase tracking-widest bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-600 dark:hover:bg-indigo-600 px-3 py-1.5 rounded-lg transition-colors">Manage
                            All</router-link>
                    </div>

                    <div v-if="moduleStore.loading" class="space-y-3">
                        <div v-for="i in 3" :key="i" class="h-16 bg-white dark:bg-white/5 rounded-2xl animate-pulse">
                        </div>
                    </div>

                    <div v-else-if="moduleStore.modules.length === 0"
                        class="p-8 text-center bg-white dark:bg-white/5 rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
                        <BookOpenIcon class="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <h4 class="text-sm font-[900] uppercase tracking-tight text-slate-400 mb-2">No Modules Found
                        </h4>
                        <button @click="router.push({ name: 'facilitator.modules' })"
                            class="text-xs font-bold text-indigo-600 underline hover:no-underline">Create
                            Content</button>
                    </div>

                    <div v-else class="space-y-3">
                        <div v-for="mod in moduleStore.modules.slice(0, 5)" :key="mod.id"
                            @click="router.push({ name: 'facilitator.module.detail', params: { id: mod.id } })"
                            class="flex items-center gap-4 p-4 bg-white dark:bg-[#0d0d15]/60 border border-slate-100 dark:border-white/5 rounded-2xl hover:bg-indigo-50/50 dark:hover:bg-white/5 transition-all duration-300 cursor-pointer group hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-x-1">
                            <div
                                class="shrink-0 w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm">
                                <FileTextIcon class="w-5 h-5" />
                            </div>

                            <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-2 mb-0.5">
                                    <h4
                                        class="text-sm font-[900] text-black dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase tracking-tight">
                                        {{ mod.title }}
                                    </h4>
                                    <span v-if="mod.is_published"
                                        class="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                                    <span v-else class="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                </div>
                                <p class="text-[10px] text-slate-500 font-medium truncate">{{ mod.description }}</p>
                            </div>

                            <div class="shrink-0 hidden sm:block">
                                <span
                                    class="text-[8px] font-black uppercase tracking-wider px-2 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-500 border border-slate-200 dark:border-white/5">
                                    {{ mod.difficulty_level || 'General' }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useClassroomStore } from '@/stores/classroom';
import { useModuleStore } from '@/stores/module';
import api from '@/utils/api';
import {
    PlusIcon,
    UsersIcon,
    BookOpenIcon,
    School as SchoolIcon,
    ClockIcon,
    FileTextIcon,
    BellRing as BellRingIcon,
    GiftIcon,
    ArrowUpRightIcon
} from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();
const classroomStore = useClassroomStore();
const moduleStore = useModuleStore();

const facilitatorName = computed(() => authStore.user?.name?.split(' ')[0] || 'Facilitator');
const announcements = ref([]);

const fetchAnnouncements = async () => {
    try {
        const res = await api.get('/api/v1/notifications/announcements');
        announcements.value = res.data.announcements || [];
    } catch (err) {
        console.error('Failed to fetch announcements:', err);
    }
};

const formatTimeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
};

onMounted(async () => {
    await Promise.all([
        classroomStore.fetchMyClassrooms(),
        moduleStore.fetchModules({ limit: 5 }), // Fetch recent 5 modules
        fetchAnnouncements()
    ]);
});
</script>

<style scoped>
@reference "@/style.css";
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700;1,900&display=swap');

.custom-font-poppins {
    font-family: 'Poppins', sans-serif !important;
}

.animate-in {
    animation: dashboardEntry 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes dashboardEntry {
    from {
        opacity: 0;
        transform: translateY(20px) scale(0.98);
        filter: blur(5px);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
        filter: blur(0);
    }
}

/* Enhanced 3D Pill Button Style */
.btn-3d-purple {
    background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
    box-shadow:
        0 10px 20px -5px rgba(124, 58, 237, 0.5),
        /* softer shadow */
        inset 0 2px 4px rgba(255, 255, 255, 0.35),
        /* gloss */
        inset 0 -3px 6px rgba(0, 0, 0, 0.15);
    /* 3d depth */
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(124, 58, 237, 0.2);
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #7c3aed;
}
</style>