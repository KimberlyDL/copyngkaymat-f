<template>
    <!-- Mobile overlay -->
    <Transition
        enter-active-class="transition-opacity duration-300"
        leave-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
    >
        <div
            v-if="isMobileShown"
            class="fixed inset-0 z-40 md:hidden bg-slate-900/50"
            @click="sidebarStore.closeMobile()"
        />
    </Transition>

    <!-- Sidebar -->
    <aside :class="[
        'fixed top-0 left-0 bottom-0 z-[60] flex flex-col font-poppins transition-all duration-300',
        'bg-platinum-100 dark:bg-abyss-700 border-r-2 border-platinum-200 dark:border-abyss-600 text-slate-800 dark:text-platinum-100',
        isHidden     && 'hidden md:flex -translate-x-full',
        isIcon       && 'w-20 md:flex',
        isFull       && 'w-72 md:flex',
        isMobileShown && 'w-72',
    ]">

        <!-- Logo / Brand -->
        <div :class="['flex items-center h-20 border-b-2 border-platinum-200 dark:border-abyss-600 shrink-0 transition-all duration-300', isFull ? 'px-5 gap-3' : 'justify-center px-0']">
            <router-link :to="{ name: 'facilitator.dashboard' }" class="flex items-center gap-3 group/logo">
                <!-- Icon -->
                <div class="w-10 h-10 rounded-xl bg-calm-lavender-600 dark:bg-calm-lavender-700 border-2 border-calm-lavender-700 dark:border-calm-lavender-600 flex items-center justify-center shrink-0 group-hover/logo:bg-calm-lavender-700 transition-colors">
                    <ShieldCheckIcon class="w-5 h-5 text-white" />
                </div>

                <!-- Brand name (full mode only) -->
                <Transition name="fade">
                    <div v-if="isFull" class="flex flex-col leading-none min-w-0">
                        <span class="font-madimione text-lg text-slate-800 dark:text-platinum-100 tracking-wide leading-none">
                            Protect<span class="brand-gradient-text">Ed</span>
                        </span>
                        <span class="field-subtext mt-0.5">Academy Hub</span>
                    </div>
                </Transition>
            </router-link>
        </div>

        <!-- Collapse toggle -->
        <div :class="['flex items-center py-4 border-b border-platinum-200 dark:border-abyss-600 shrink-0', isFull ? 'justify-between px-5' : 'justify-center px-0']">
            <Transition name="fade">
                <span v-if="isFull" class="section-eyebrow text-xs">Navigation</span>
            </Transition>
            <button
                @click="sidebarStore.toggleExpanded()"
                class="p-1.5 rounded-lg bg-white dark:bg-abyss-600 border-2 border-platinum-200 dark:border-abyss-500 hover:border-calm-lavender-300 dark:hover:border-calm-lavender-700 text-platinum-500 hover:text-calm-lavender-600 dark:hover:text-calm-lavender-400 transition-all"
            >
                <ChevronLeft v-if="isFull" class="h-4 w-4" />
                <ChevronRight v-else class="h-4 w-4" />
            </button>
        </div>

        <!-- Nav items -->
        <nav class="flex-1 overflow-y-auto custom-scrollbar py-3 space-y-1" :class="isFull ? 'px-3' : 'px-2'">

            <button @click="router.push({ name: 'facilitator.dashboard' })"
                class="sidebar-btn group"
                :class="{ 'sidebar-btn-active': route.name === 'facilitator.dashboard' }">
                <div class="icon-wrap" :class="{ 'icon-wrap-active': route.name === 'facilitator.dashboard' }">
                    <LayoutDashboard class="h-4 w-4" />
                </div>
                <span v-if="!isIcon" class="sidebar-item-name" :class="route.name === 'facilitator.dashboard' ? 'sidebar-active-item-name' : 'sidebar-inactive-item-name sidebar-inactive-item-name-hover'">
                    Dashboard
                </span>
            </button>

            <button @click="router.push({ name: 'facilitator.classrooms' })"
                class="sidebar-btn group"
                :class="{ 'sidebar-btn-active': route.name === 'facilitator.classrooms' }">
                <div class="icon-wrap" :class="{ 'icon-wrap-active': route.name === 'facilitator.classrooms' }">
                    <School class="h-4 w-4" />
                </div>
                <span v-if="!isIcon" class="sidebar-item-name" :class="route.name === 'facilitator.classrooms' ? 'sidebar-active-item-name' : 'sidebar-inactive-item-name sidebar-inactive-item-name-hover'">
                    Classrooms
                </span>
            </button>

            <button @click="isLeaderboardOpen = true"
                class="sidebar-btn group">
                <div class="icon-wrap">
                    <Trophy class="h-4 w-4" />
                </div>
                <span v-if="!isIcon" class="sidebar-item-name sidebar-inactive-item-name sidebar-inactive-item-name-hover">
                    Leaderboards
                </span>
            </button>

            <button @click="router.push({ name: 'facilitator.modules' })"
                class="sidebar-btn group"
                :class="{ 'sidebar-btn-active': route.name === 'facilitator.modules' }">
                <div class="icon-wrap" :class="{ 'icon-wrap-active': route.name === 'facilitator.modules' }">
                    <BookOpen class="h-4 w-4" />
                </div>
                <span v-if="!isIcon" class="sidebar-item-name" :class="route.name === 'facilitator.modules' ? 'sidebar-active-item-name' : 'sidebar-inactive-item-name sidebar-inactive-item-name-hover'">
                    Modules
                </span>
            </button>

            <button @click="router.push({ name: 'facilitator.rewards' })"
                class="sidebar-btn group"
                :class="{ 'sidebar-btn-active': route.name === 'facilitator.rewards' }">
                <div class="icon-wrap" :class="{ 'icon-wrap-active': route.name === 'facilitator.rewards' }">
                    <Gift class="h-4 w-4" />
                </div>
                <div v-if="!isIcon" class="flex-1 flex items-center justify-between min-w-0">
                    <span class="sidebar-item-name" :class="route.name === 'facilitator.rewards' ? 'sidebar-active-item-name' : 'sidebar-inactive-item-name sidebar-inactive-item-name-hover'">
                        Rewards
                    </span>
                    <span class="badge badge-lavender text-xs shrink-0">Manage</span>
                </div>
            </button>

            <!-- Section divider -->
            <div v-if="isFull" class="px-3 pt-5 pb-1">
                <p class="section-eyebrow text-xs">Performance</p>
            </div>
            <div v-else class="my-2 mx-3 border-t border-platinum-200 dark:border-abyss-500"></div>

            <button @click="router.push({ name: 'facilitator.analytics' })"
                class="sidebar-btn group"
                :class="{ 'sidebar-btn-active': route.name === 'facilitator.analytics' }">
                <div class="icon-wrap" :class="{ 'icon-wrap-active': route.name === 'facilitator.analytics' }">
                    <LineChart class="h-4 w-4" />
                </div>
                <span v-if="!isIcon" class="sidebar-item-name" :class="route.name === 'facilitator.analytics' ? 'sidebar-active-item-name' : 'sidebar-inactive-item-name sidebar-inactive-item-name-hover'">
                    Analytics
                </span>
            </button>

        </nav>

        <!-- User profile footer -->
        <div class="shrink-0 border-t-2 border-platinum-200 dark:border-abyss-600 p-3 relative">

            <!-- Profile card -->
            <div :class="['flex items-center bg-white dark:bg-abyss-600 border-2 border-platinum-200 dark:border-abyss-500 rounded-xl transition-all hover:border-calm-lavender-200 dark:hover:border-calm-lavender-800', isFull ? 'gap-3 px-3 py-2.5' : 'justify-center p-2.5']">

                <!-- Avatar -->
                <div class="avatar-sm !w-8 !h-8 !rounded-lg !bg-calm-lavender-100 dark:!bg-calm-lavender-900/30 !text-calm-lavender-700 dark:!text-calm-lavender-300 !border-calm-lavender-200 dark:!border-calm-lavender-800/40 shrink-0 text-xs font-semibold">
                    {{ initials }}
                </div>

                <div v-if="isFull" class="flex-1 min-w-0 text-left">
                    <p class="font-semibold text-sm text-slate-800 dark:text-platinum-100 truncate leading-none">
                        {{ auth.user?.name || 'Admin' }}
                    </p>
                    <p class="field-subtext mt-0.5 leading-none">Facilitator</p>
                </div>

                <button v-if="isFull"
                    @click="profileMenuOpen = !profileMenuOpen"
                    class="p-1 rounded-lg text-platinum-500 hover:text-calm-lavender-600 dark:hover:text-calm-lavender-400 hover:bg-platinum-100 dark:hover:bg-abyss-500 transition-all shrink-0">
                    <MoreVertical class="h-4 w-4" />
                </button>

                <button v-else
                    @click="profileMenuOpen = !profileMenuOpen"
                    class="p-1 rounded-lg text-platinum-500 hover:text-calm-lavender-600 transition-all">
                    <MoreVertical class="h-4 w-4" />
                </button>
            </div>

            <!-- Profile dropdown menu -->
            <Transition name="slide-up">
                <div v-if="profileMenuOpen"
                    :class="[
                        'absolute z-[70] bg-white dark:bg-abyss-600 border-2 border-platinum-200 dark:border-abyss-500 rounded-xl overflow-hidden',
                        isIcon ? 'left-24 bottom-4 w-52' : 'bottom-[4.5rem] left-3 right-3'
                    ]">
                    <button
                        @click="router.push({ name: 'profile' }); profileMenuOpen = false"
                        class="menu-item">
                        <UserIcon class="h-4 w-4 text-calm-lavender-500 shrink-0" />
                        <span>Account</span>
                    </button>
                    <button
                        @click="router.push({ name: 'settings' }); profileMenuOpen = false"
                        class="menu-item">
                        <Settings class="h-4 w-4 text-calm-lavender-500 shrink-0" />
                        <span>Settings</span>
                    </button>
                    <button
                        @click="isLogoutModalOpen = true; profileMenuOpen = false"
                        class="menu-item !text-red-600 dark:!text-red-400 hover:!bg-red-50 dark:hover:!bg-red-900/20 border-t-0">
                        <LogOut class="h-4 w-4 shrink-0" />
                        <span>Log out</span>
                    </button>
                </div>
            </Transition>
        </div>
    </aside>

    <LeaderboardModal :is-open="isLeaderboardOpen" @close="isLeaderboardOpen = false" />

    <!-- Logout confirmation modal -->
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="isLogoutModalOpen" class="modal-overlay">
                <div class="absolute inset-0 bg-slate-900/50" @click="isLogoutModalOpen = false"></div>

                <div class="modal-panel relative w-full max-w-sm text-center flex flex-col items-center gap-5">
                    <div class="empty-state-icon !bg-red-50 dark:!bg-red-900/20 !border-red-100 dark:!border-red-800/30">
                        <LogOut class="w-7 h-7 text-red-500" />
                    </div>

                    <div>
                        <h3 class="modal-title !mb-1">Sign out?</h3>
                        <p class="page-subtitle text-sm">Your session will be ended. You'll need to sign back in to continue.</p>
                    </div>

                    <div class="grid grid-cols-2 gap-3 w-full">
                        <button @click="isLogoutModalOpen = false" class="btn-secondary justify-center">
                            Cancel
                        </button>
                        <button @click="logout" class="btn-danger justify-center">
                            Sign out
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSidebarStore } from '@/stores/stores'
import LeaderboardModal from '@/components/ui/LeaderboardModal.vue'
import {
    ChevronLeft, ChevronRight, Users, BookOpen,
    MoreVertical, User as UserIcon, Settings,
    LogOut, LayoutDashboard, School, LineChart,
    ShieldCheck as ShieldCheckIcon, Gift, Trophy
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const sidebarStore = useSidebarStore()

const isLeaderboardOpen = ref(false)
const profileMenuOpen = ref(false)
const isLogoutModalOpen = ref(false)
const width = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)

const logout = async () => {
    isLogoutModalOpen.value = false
    try { await auth.logout() } finally { router.push({ name: 'login' }) }
}

const initials = computed(() => {
    const name = auth.user?.name || 'Admin'
    return name.trim().split(/\s+/).map(p => p[0]).join('').toUpperCase().slice(0, 2)
})

const isFull = computed(() => sidebarStore.isExpanded && width.value >= 1024)
const isIcon = computed(() => !sidebarStore.isExpanded && width.value >= 1024)
const isMobileShown = computed(() => sidebarStore.isMobileOpen && width.value < 1024)
const isHidden = computed(() => !sidebarStore.isMobileOpen && width.value < 1024)

onMounted(() => {
    if (typeof window !== 'undefined') {
        window.addEventListener('resize', () => width.value = window.innerWidth)
    }
})
</script>

<style scoped>
@reference "@/style.css";

/* ── Sidebar nav button ───────────────────────────── */
.sidebar-btn {
    @apply w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150;
}

.sidebar-btn-active {
    @apply bg-white dark:bg-abyss-600 border-2 border-calm-lavender-200 dark:border-calm-lavender-800/60;
}

/* ── Icon container ───────────────────────────────── */
.icon-wrap {
    @apply p-2 rounded-lg bg-platinum-200 dark:bg-abyss-500 text-platinum-600 dark:text-platinum-400 shrink-0 transition-all duration-150;
    @apply group-hover:bg-calm-lavender-100 dark:group-hover:bg-calm-lavender-900/30 group-hover:text-calm-lavender-600 dark:group-hover:text-calm-lavender-400;
}

.icon-wrap-active {
    @apply bg-calm-lavender-100 dark:bg-calm-lavender-900/30 text-calm-lavender-600 dark:text-calm-lavender-400 border border-calm-lavender-200 dark:border-calm-lavender-800/40;
}

/* ── Profile dropdown item ────────────────────────── */
.menu-item {
    @apply w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 dark:text-platinum-300;
    @apply hover:bg-platinum-100 dark:hover:bg-abyss-500 hover:text-calm-lavender-600 dark:hover:text-calm-lavender-400;
    @apply border-b border-platinum-200 dark:border-abyss-500 last:border-b-0 transition-all;
}

/* ── Scrollbar ────────────────────────────────────── */
.custom-scrollbar::-webkit-scrollbar { width: 3px; }
.custom-scrollbar::-webkit-scrollbar-thumb {
    @apply rounded-full bg-platinum-300 dark:bg-abyss-500;
}

/* ── Transitions ──────────────────────────────────── */
.slide-up-enter-active, .slide-up-leave-active {
    transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.slide-up-enter-from, .slide-up-leave-to {
    opacity: 0;
    transform: translateY(10px) scale(0.97);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>