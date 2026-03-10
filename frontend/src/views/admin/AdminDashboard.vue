<template>
    <div
        class="space-y-10 custom-font-poppins animate-in fade-in duration-700 text-black dark:text-white transition-all selection:bg-purple-500/30">

        <header
            class="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 dark:border-white/5 pb-8 relative">
            <div class="space-y-2">
                <div class="flex items-center gap-2.5">
                    <div
                        class="h-1 w-8 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-full shadow-[0_2px_10px_rgba(139,92,246,0.4)]">
                    </div>
                    <span
                        class="text-[10px] font-extrabold uppercase tracking-[0.3em] text-purple-600 dark:text-purple-400">Admin
                        Console</span>
                </div>
                <h1
                    class="text-3xl md:text-4xl font-[900] text-black dark:text-white uppercase tracking-tighter leading-tight italic">
                    Admin <span
                        class="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-500 bg-clip-text text-transparent">Dashboard</span>
                </h1>
                <p class="text-xs font-medium text-black/50 dark:text-slate-400 italic tracking-tight">Welcome! A simple
                    look at how your community is doing.</p>
            </div>

            <div class="flex gap-3">
                <button @click="downloadReport" :disabled="isDownloading"
                    class="group flex items-center gap-3 px-6 py-3 bg-purple-600 border border-purple-500 rounded-2xl hover:bg-purple-700 transition-all duration-300 disabled:opacity-50 shadow-lg shadow-purple-500/20">
                    <DownloadIcon :class="['h-4 w-4 text-white', isDownloading && 'animate-bounce']" />
                    <span class="text-[10px] font-[900] tracking-widest text-white uppercase italic">{{ isDownloading ?
                        'Generating...' : 'Download Report' }}</span>
                </button>
                <button @click="refreshAnalytics" :disabled="isLoading"
                    class="group flex items-center gap-3 px-6 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300 disabled:opacity-50">
                    <RefreshCwIcon
                        :class="['h-4 w-4 text-slate-500 dark:text-gray-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-all', isLoading && 'animate-spin']" />
                    <span
                        class="text-[10px] font-[900] tracking-widest text-slate-600 dark:text-gray-300 uppercase italic">Refresh</span>
                </button>
            </div>
        </header>

        <!-- Loading State -->
        <div v-if="isLoading && !stats.totalUsers" class="flex items-center justify-center py-20">
            <div class="text-center space-y-4">
                <div class="relative h-12 w-12 text-purple-600 mx-auto">
                    <div class="absolute inset-0 rounded-full border-2 border-current opacity-10"></div>
                    <div class="absolute inset-0 rounded-full border-2 border-t-transparent animate-spin"></div>
                </div>
                <p class="text-[10px] font-[900] uppercase tracking-[0.4em] text-purple-500 italic">Loading Analytics...
                </p>
            </div>
        </div>

        <template v-else>
            <!-- Stats Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div v-for="stat in statsCards" :key="stat.label"
                    class="relative overflow-hidden bg-white dark:bg-[#0d0d15]/60 backdrop-blur-3xl border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 transition-all duration-500 hover:border-purple-500/40 group shadow-lg hover:shadow-purple-500/10">

                    <div class="relative z-10 flex flex-col justify-between h-full">
                        <div class="flex justify-between items-start mb-6">
                            <div
                                class="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-inner">
                                <component :is="stat.icon" class="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <span
                                class="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-[8px] font-[900] uppercase tracking-widest rounded-full italic">{{
                                stat.sub }}</span>
                        </div>
                        <div>
                            <p
                                class="text-[9px] font-black text-black/40 dark:text-slate-500 uppercase tracking-widest leading-none mb-1.5 italic">
                                {{ stat.label }}</p>
                            <p
                                class="text-3xl font-[900] text-black dark:text-white tracking-tighter italic leading-none">
                                {{ stat.val }}</p>
                        </div>
                    </div>
                    <div
                        class="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    </div>
                </div>
            </div>

            <!-- Secondary Stats -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div v-for="stat in secondaryStats" :key="stat.label"
                    class="bg-white/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-2xl p-5 text-center hover:border-purple-500/30 transition-all">
                    <component :is="stat.icon" class="h-5 w-5 mx-auto mb-2 text-purple-500" />
                    <p class="text-2xl font-black text-black dark:text-white italic">{{ stat.val }}</p>
                    <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{{ stat.label }}</p>
                </div>
            </div>

            <!-- Charts Section -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- User Growth Chart -->
                <div
                    class="bg-white/90 dark:bg-[#0d0d15]/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 shadow-lg">
                    <div class="flex items-center gap-3 mb-6">
                        <div class="h-6 w-1 bg-purple-600 rounded-full"></div>
                        <h3 class="text-lg font-[900] text-black dark:text-white uppercase tracking-tighter italic">User
                            Registrations</h3>
                    </div>
                    <div class="h-64">
                        <Line v-if="chartData.monthlyUsers.length" :data="userChartData" :options="lineChartOptions" />
                        <div v-else class="flex items-center justify-center h-full text-slate-400 text-sm italic">
                            Loading chart data...</div>
                    </div>
                </div>

                <!-- Quiz Attempts Chart -->
                <div
                    class="bg-white/90 dark:bg-[#0d0d15]/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 shadow-lg">
                    <div class="flex items-center gap-3 mb-6">
                        <div class="h-6 w-1 bg-fuchsia-600 rounded-full"></div>
                        <h3 class="text-lg font-[900] text-black dark:text-white uppercase tracking-tighter italic">Quiz
                            Activity</h3>
                    </div>
                    <div class="h-64">
                        <Bar v-if="chartData.monthlyQuizAttempts.length" :data="quizChartData"
                            :options="barChartOptions" />
                        <div v-else class="flex items-center justify-center h-full text-slate-400 text-sm italic">
                            Loading chart data...</div>
                    </div>
                </div>

                <!-- Role Distribution Chart -->
                <div
                    class="bg-white/90 dark:bg-[#0d0d15]/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 shadow-lg">
                    <div class="flex items-center gap-3 mb-6">
                        <div class="h-6 w-1 bg-violet-600 rounded-full"></div>
                        <h3 class="text-lg font-[900] text-black dark:text-white uppercase tracking-tighter italic">User
                            Distribution</h3>
                    </div>
                    <div class="h-64 flex items-center justify-center">
                        <div class="w-56 h-56">
                            <Doughnut v-if="chartData.roleDistribution.length" :data="roleChartData"
                                :options="doughnutChartOptions" />
                            <div v-else class="flex items-center justify-center h-full text-slate-400 text-sm italic">
                                Loading chart data...</div>
                        </div>
                    </div>
                </div>

                <!-- Module Creation Chart -->
                <div
                    class="bg-white/90 dark:bg-[#0d0d15]/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 shadow-lg">
                    <div class="flex items-center gap-3 mb-6">
                        <div class="h-6 w-1 bg-purple-500 rounded-full"></div>
                        <h3 class="text-lg font-[900] text-black dark:text-white uppercase tracking-tighter italic">
                            Module Creation</h3>
                    </div>
                    <div class="h-64">
                        <Line v-if="chartData.monthlyModules.length" :data="moduleChartData"
                            :options="lineChartOptions" />
                        <div v-else class="flex items-center justify-center h-full text-slate-400 text-sm italic">
                            Loading chart data...</div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                <div
                    class="lg:col-span-7 bg-white/90 dark:bg-[#0d0d15]/40 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                    <div class="flex items-center justify-between mb-8 px-2">
                        <div class="flex items-center gap-3">
                            <div class="h-6 w-1 bg-purple-600 rounded-full"></div>
                            <h3 class="text-xl font-[900] text-black dark:text-white uppercase tracking-tighter italic">
                                Recent Activity</h3>
                        </div>
                    </div>

                    <div class="space-y-3">
                        <div v-for="activity in recentActivity" :key="activity.id"
                            class="flex items-center justify-between p-4 rounded-[1.5rem] transition-all duration-300 bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 hover:border-purple-500/30 group">
                            <div class="flex items-center gap-4 min-w-0">
                                <div
                                    class="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 group-hover:scale-110 transition-all">
                                    <component :is="activity.icon"
                                        class="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div class="min-w-0">
                                    <p class="text-sm font-bold text-black dark:text-slate-200 truncate">{{
                                        activity.title }}</p>
                                    <p
                                        class="text-[9px] font-bold text-slate-400 dark:text-gray-600 uppercase tracking-widest mt-0.5 italic">
                                        {{ activity.time }}</p>
                                </div>
                            </div>
                        </div>
                        <div v-if="recentActivity.length === 0" class="text-center py-8">
                            <p class="text-sm text-slate-400 italic">No recent activity</p>
                        </div>
                    </div>
                </div>

                <div
                    class="lg:col-span-5 bg-slate-50/50 dark:bg-[#0b0a12]/50 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 shadow-inner backdrop-blur-sm">
                    <h3
                        class="text-xl font-[900] text-black dark:text-white uppercase tracking-tighter italic mb-8 px-2">
                        Quick Tasks</h3>
                    <div class="grid grid-cols-1 gap-4">
                        <router-link v-for="action in quickActions" :key="action.label" :to="{ name: action.name }"
                            class="flex items-center gap-5 p-5 rounded-[1.8rem] bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 transition-all duration-500 group hover:shadow-xl hover:-translate-y-1 hover:border-purple-500/30">
                            <div
                                :class="`p-3 rounded-2xl ${action.bg} text-white transition-all group-hover:rotate-6 group-hover:scale-110 shadow-lg ${action.shadow}`">
                                <component :is="action.icon" class="h-5 w-5" />
                            </div>
                            <span
                                class="text-xs font-bold text-black dark:text-slate-300 group-hover:text-purple-600 dark:group-hover:text-white uppercase tracking-[0.15em] transition-colors">
                                {{ action.label }}
                            </span>
                        </router-link>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Line, Bar, Doughnut } from 'vue-chartjs';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import {
    UsersIcon,
    UserCogIcon,
    BookOpenIcon,
    ActivityIcon,
    RefreshCwIcon,
    UserPlusIcon,
    FileTextIcon,
    BarChartIcon,
    SettingsIcon,
    GraduationCapIcon,
    TrophyIcon,
    MegaphoneIcon,
    ClipboardListIcon,
    DownloadIcon
} from 'lucide-vue-next';
import api from '@/utils/api';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const isLoading = ref(false);
const isDownloading = ref(false);
const stats = ref({
    totalUsers: 0,
    newUsersThisMonth: 0,
    userGrowth: 0,
    totalFacilitators: 0,
    educators: 0,
    moderators: 0,
    totalModules: 0,
    publishedModules: 0,
    modulesThisMonth: 0,
    totalClassrooms: 0,
    activeClassrooms: 0,
    totalQuizzes: 0,
    totalQuizAttempts: 0,
    totalBadges: 0
});

const chartData = ref({
    monthlyUsers: [],
    monthlyModules: [],
    monthlyQuizAttempts: [],
    roleDistribution: [],
    moduleStatus: [],
    classroomStatus: []
});

const recentUsers = ref([]);
const recentModules = ref([]);

const statsCards = computed(() => [
    {
        label: 'Total Users',
        val: stats.value.totalUsers,
        sub: `+${stats.value.newUsersThisMonth} New`,
        icon: UsersIcon
    },
    {
        label: 'Facilitators',
        val: stats.value.totalFacilitators,
        sub: `${stats.value.educators} Edu / ${stats.value.moderators} Mod`,
        icon: UserCogIcon
    },
    {
        label: 'Modules',
        val: stats.value.totalModules,
        sub: `${stats.value.publishedModules} Published`,
        icon: BookOpenIcon
    },
    {
        label: 'Classrooms',
        val: stats.value.totalClassrooms,
        sub: `${stats.value.activeClassrooms} Active`,
        icon: GraduationCapIcon
    }
]);

const secondaryStats = computed(() => [
    { label: 'Quizzes', val: stats.value.totalQuizzes, icon: ClipboardListIcon },
    { label: 'Quiz Attempts', val: stats.value.totalQuizAttempts, icon: ActivityIcon },
    { label: 'Badges', val: stats.value.totalBadges, icon: TrophyIcon },
    { label: 'Growth %', val: `${stats.value.userGrowth}%`, icon: BarChartIcon }
]);

// Chart Options
const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: 'rgba(15, 15, 25, 0.9)',
            titleColor: '#fff',
            bodyColor: '#a78bfa',
            borderColor: 'rgba(139, 92, 246, 0.3)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 12
        }
    },
    scales: {
        x: {
            grid: { display: false },
            ticks: { color: '#94a3b8', font: { size: 10, weight: 600 } }
        },
        y: {
            grid: { color: 'rgba(148, 163, 184, 0.1)' },
            ticks: { color: '#94a3b8', font: { size: 10 } },
            beginAtZero: true
        }
    }
};

const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: 'rgba(15, 15, 25, 0.9)',
            titleColor: '#fff',
            bodyColor: '#f0abfc',
            borderColor: 'rgba(192, 38, 211, 0.3)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 12
        }
    },
    scales: {
        x: {
            grid: { display: false },
            ticks: { color: '#94a3b8', font: { size: 10, weight: 600 } }
        },
        y: {
            grid: { color: 'rgba(148, 163, 184, 0.1)' },
            ticks: { color: '#94a3b8', font: { size: 10 } },
            beginAtZero: true
        }
    }
};

const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                color: '#94a3b8',
                padding: 16,
                font: { size: 10, weight: 600 },
                usePointStyle: true,
                pointStyle: 'circle'
            }
        },
        tooltip: {
            backgroundColor: 'rgba(15, 15, 25, 0.9)',
            titleColor: '#fff',
            bodyColor: '#c4b5fd',
            borderColor: 'rgba(139, 92, 246, 0.3)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 12
        }
    },
    cutout: '65%'
};

// Chart Data Computed Properties
const userChartData = computed(() => ({
    labels: chartData.value.monthlyUsers.map(d => d.month),
    datasets: [{
        label: 'New Users',
        data: chartData.value.monthlyUsers.map(d => d.count),
        borderColor: '#9333ea',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#9333ea',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
    }]
}));

const moduleChartData = computed(() => ({
    labels: chartData.value.monthlyModules.map(d => d.month),
    datasets: [{
        label: 'Modules Created',
        data: chartData.value.monthlyModules.map(d => d.count),
        borderColor: '#a855f7',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#a855f7',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
    }]
}));

const quizChartData = computed(() => ({
    labels: chartData.value.monthlyQuizAttempts.map(d => d.month),
    datasets: [{
        label: 'Quiz Attempts',
        data: chartData.value.monthlyQuizAttempts.map(d => d.count),
        backgroundColor: [
            'rgba(192, 38, 211, 0.8)',
            'rgba(168, 85, 247, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(124, 58, 237, 0.8)',
            'rgba(109, 40, 217, 0.8)',
            'rgba(91, 33, 182, 0.8)'
        ],
        borderRadius: 8,
        borderSkipped: false
    }]
}));

const roleChartData = computed(() => ({
    labels: chartData.value.roleDistribution.map(d => d.role),
    datasets: [{
        data: chartData.value.roleDistribution.map(d => d.count),
        backgroundColor: [
            'rgba(147, 51, 234, 0.9)',
            'rgba(192, 38, 211, 0.9)',
            'rgba(168, 85, 247, 0.9)',
            'rgba(124, 58, 237, 0.9)'
        ],
        borderColor: [
            'rgba(147, 51, 234, 1)',
            'rgba(192, 38, 211, 1)',
            'rgba(168, 85, 247, 1)',
            'rgba(124, 58, 237, 1)'
        ],
        borderWidth: 2
    }]
}));

const recentActivity = computed(() => {
    const activities = [];

    recentUsers.value.forEach(user => {
        activities.push({
            id: `user-${user.id}`,
            icon: UserPlusIcon,
            title: `${user.name} joined as ${user.role}`,
            time: formatTimeAgo(user.created_at)
        });
    });

    recentModules.value.forEach(module => {
        activities.push({
            id: `module-${module.id}`,
            icon: FileTextIcon,
            title: `Module "${module.title}" ${module.is_published ? 'published' : 'created'}`,
            time: formatTimeAgo(module.created_at)
        });
    });

    return activities.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 6);
});

const quickActions = [
    { name: 'admin.facilitators', icon: UserPlusIcon, label: 'Manage Users', bg: 'bg-purple-600', shadow: 'shadow-purple-500/20' },
    { name: 'admin.announcements', icon: MegaphoneIcon, label: 'Announcements', bg: 'bg-fuchsia-600', shadow: 'shadow-fuchsia-500/20' },
    { name: 'admin.dashboard', icon: FileTextIcon, label: 'Manage Lessons', bg: 'bg-violet-600', shadow: 'shadow-violet-500/20' },
    { name: 'settings', icon: SettingsIcon, label: 'System Settings', bg: 'bg-slate-600', shadow: 'shadow-slate-500/20' }
];

const formatTimeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
};

const fetchAnalytics = async () => {
    isLoading.value = true;
    try {
        const [analyticsRes, chartRes] = await Promise.all([
            api.get('/api/v1/admin/analytics'),
            api.get('/api/v1/admin/analytics/charts')
        ]);

        if (analyticsRes.data?.analytics) {
            const data = analyticsRes.data.analytics;
            stats.value = {
                totalUsers: data.users.total,
                newUsersThisMonth: data.users.newThisMonth,
                userGrowth: data.users.growth,
                totalFacilitators: data.facilitators.total,
                educators: data.facilitators.educators,
                moderators: data.facilitators.moderators,
                totalModules: data.modules.total,
                publishedModules: data.modules.published,
                modulesThisMonth: data.modules.newThisMonth,
                totalClassrooms: data.classrooms.total,
                activeClassrooms: data.classrooms.active,
                totalQuizzes: data.quizzes.total,
                totalQuizAttempts: data.quizzes.totalAttempts,
                totalBadges: data.badges.total
            };
            recentUsers.value = data.recentActivity.users || [];
            recentModules.value = data.recentActivity.modules || [];
        }

        if (chartRes.data?.chartData) {
            chartData.value = chartRes.data.chartData;
        }
    } catch (error) {
        console.error('Failed to fetch analytics:', error);
    } finally {
        isLoading.value = false;
    }
};

const downloadReport = async () => {
    isDownloading.value = true;
    try {
        const response = await api.get('/api/v1/admin/reports/download', {
            responseType: 'blob',
            headers: {
                'Accept': 'application/pdf'
            }
        });

        // Check if response is actually an error (JSON returned as blob)
        const contentType = response.headers['content-type'];
        if (contentType && contentType.includes('application/json')) {
            // It's an error response, parse it
            const text = await response.data.text();
            const errorData = JSON.parse(text);
            throw new Error(errorData.message || 'Failed to generate report');
        }

        // Create download link for PDF
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const today = new Date().toISOString().split('T')[0];
        link.setAttribute('download', `ProtectEd_Report_${today}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Failed to download report:', error);
        // Try to extract error message from blob response
        if (error.response?.data instanceof Blob) {
            try {
                const text = await error.response.data.text();
                const errorData = JSON.parse(text);
                alert(errorData.message || 'Failed to download report. Please try again.');
            } catch {
                alert('Failed to download report. Please try again.');
            }
        } else {
            alert(error.message || 'Failed to download report. Please try again.');
        }
    } finally {
        isDownloading.value = false;
    }
};

const refreshAnalytics = () => {
    fetchAnalytics();
};

onMounted(() => {
    fetchAnalytics();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700;1,900&display=swap');

.custom-font-poppins {
    font-family: 'Poppins', sans-serif !important;
}
</style>