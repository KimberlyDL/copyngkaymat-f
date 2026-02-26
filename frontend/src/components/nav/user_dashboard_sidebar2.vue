<!-- frontend\src\components\nav\home_sidebar.vue -->
<script setup>
import { ref, computed, onMounted, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/utils/api'
import { useAuthStore } from '@/stores/auth' // Added for dynamic user name
import {
    ClipboardList,
    UserPlus,
    Users,
    Settings,
    ChevronLeft,
    ChevronRight,
    SquareArrowUpRight,
    Share2,
    ShieldCheck,
    BookOpen,
    LogOut,
    User,
    Users2,
    AlertCircle,
    Heart,
    Handshake,
    Trophy,
    MoreVertical
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore() // Access auth store

/** Props */
const props = defineProps({
    isMobileOpen: { type: Boolean, default: false },
    userId: { type: [String, Number, null], default: null },
})
const emit = defineEmits(['close-mobile-sidebar', 'expanded-change'])

/* ------- responsive + mode ------- */
const expanded = ref(false)
const width = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)
const isMobile = computed(() => width.value < 768)

const mode = computed(() => {
    if (isMobile.value) return props.isMobileOpen ? 'mobile-full' : 'hidden'
    return expanded.value ? 'full' : 'icon'
})
const isHidden = computed(() => mode.value === 'hidden')
const isMobileShown = computed(() => mode.value === 'mobile-full')
const isIcon = computed(() => mode.value === 'icon')
const isFull = computed(() => mode.value === 'full')

watchEffect(() => emit('expanded-change', isFull.value))

/* ------- learning modules data (Contents preserved) ------- */
const modules = ref([
    { id: 1, name: 'Gender & Power', icon: '👥', progress: 65, status: 'in-progress' },
    { id: 2, name: 'Recognizing VAWC', icon: '🚨', progress: 100, status: 'completed' },
    { id: 3, name: 'Sexual Health 101', icon: '💚', progress: 40, status: 'in-progress' },
    { id: 4, name: 'Support Resources', icon: '🤝', progress: 0, status: 'not-started' },
])

const myLearningPaths = ref([
    { id: 1, name: 'VAWC Prevention', progress: 65, modules: 4 },
    { id: 2, name: 'Sexual Health', progress: 40, modules: 5 },
    { id: 3, name: 'GAD Management', progress: 25, modules: 6 },
])

/* ------- helpers (Functions preserved) ------- */
function goModule(moduleId) { router.push({ name: 'module', params: { id: moduleId } }) }
function goPath(pathId) { router.push({ name: 'learning-path', params: { id: pathId } }) }
function goLeaderboard() { router.push({ name: 'leaderboard' }) }
function goSettings() { router.push({ name: 'settings' }) }
function goManageBadges() { router.push({ name: 'user.managebadges' }) }

/* ------- organizations data (Contents preserved) ------- */
const mine = ref([])
const all = ref([])
const reqs = ref([])
const loading = ref({ mine: false, all: false, req: false })

async function loadMine() {
    loading.value.mine = true
    try {
        const { data } = await axios.get('/api/organizations/my')
        mine.value = data || []
    } finally { loading.value.mine = false }
}

async function loadAll() {
    loading.value.all = true
    try {
        const { data } = await axios.get('/api/organizations', { params: { scope: 'others' } })
        all.value = data || []
    } finally { loading.value.all = false }
}

async function loadReqs() {
    loading.value.req = true
    try {
        const { data } = await axios.get('/api/organizations/my-requests')
        reqs.value = data || []
    } finally { loading.value.req = false }
}

const R2_WORKER_ENDPOINT = import.meta.env.VITE_R2_WORKER_ENDPOINT || ''

function getOrgLogoUrl(org) {
    if (!org || !org.logo) return ''
    const path = org.logo
    if (typeof path !== 'string') return ''
    if (path.startsWith('http://') || path.startsWith('https://')) return path
    if (!R2_WORKER_ENDPOINT) return ''
    const cleanEndpoint = R2_WORKER_ENDPOINT.replace(/\/$/, '')
    const cleanPath = path.startsWith('/') ? path.slice(1) : path
    return `${cleanEndpoint}/${cleanPath}`
}

function getOrgInitials(org) {
    const name = org?.name || auth.user?.name || '?'
    const parts = name.trim().split(/\s+/).filter(Boolean)
    if (!parts.length) return '?'
    const first = parts[0]?.[0] || ''
    const second = parts[1]?.[0] || ''
    return (first + second).toUpperCase()
}

function goSharedDocuments() {
    if (currentId.value) {
        router.push({ name: 'org.shared-documents', params: { id: currentId.value } })
    } else {
        router.push({ name: 'home.shared-documents' })
    }
}

const currentId = computed(() => props.orgId ?? route.params.id ?? null)

if (typeof window !== 'undefined') {
    window.addEventListener('resize', () => (width.value = window.innerWidth))
}

onMounted(() => {
    loadMine()
    loadAll()
    loadReqs()
})
</script>

<template>
    <Transition enter-active-class="transition-opacity duration-300" leave-active-class="transition-opacity duration-200" enter-from-class="opacity-0" leave-to-class="opacity-0">
        <div v-if="isMobileShown" class="fixed inset-0 z-40 md:hidden bg-[#020203]/90 backdrop-blur-md" @click="$emit('close-mobile-sidebar')" />
    </Transition>

    <aside :class="[
        'fixed top-16 left-0 bottom-0 z-40 font-[\'Poppins\']',
        'bg-[#060608]/95 backdrop-blur-2xl text-white border-r border-white/5',
        'transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)',
        isHidden && 'hidden md:block translate-x-[-100%]',
        isIcon && 'w-20 md:block',
        isFull && 'w-64 md:block',
        isMobileShown && 'w-72 md:hidden shadow-[20px_0_50px_rgba(0,0,0,0.5)]'
    ]">
        <div class="h-full flex flex-col relative overflow-hidden">
            <!-- Background Glow -->
            <div class="absolute -top-20 -left-20 w-40 h-40 bg-blue-600/5 rounded-full blur-[80px] pointer-events-none"></div>

            <!-- COLLAPSE HEADER -->
            <div v-if="!isMobileShown" class="hidden md:flex items-center justify-between px-5 py-4 border-b border-white/5">
                <span v-if="isFull" class="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600 italic">Navigation Node</span>
                <button @click="expanded = !expanded" class="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all group">
                    <ChevronLeft v-if="isFull" class="h-3.5 w-3.5 text-blue-400 group-hover:scale-110" />
                    <ChevronRight v-else class="h-3.5 w-3.5 text-blue-400 group-hover:scale-110" />
                </button>
            </div>

            <nav class="flex-1 px-3 py-6 space-y-8 overflow-y-auto custom-scrollbar relative z-10">
                <!-- ACTIVE MODULES SECTION -->
                <section class="space-y-2">
                    <div v-if="isFull || isMobileShown" class="px-4 mb-4 text-[9px] font-black uppercase tracking-[0.25em] text-blue-500 italic opacity-80">
                        Active Protocols
                    </div>
                    <div class="space-y-1">
                        <button v-for="module in modules" :key="'module-' + module.id" @click="goModule(module.id)"
                            :title="module.name" :class="[
                                'group w-full rounded-2xl transition-all duration-300 px-3 py-2.5 relative overflow-hidden flex items-center',
                                isIcon ? 'justify-center' : 'gap-3',
                                route.params.id == module.id ? 'bg-white/5 border border-white/10 shadow-lg shadow-blue-900/10' : 'border border-transparent hover:bg-white/[0.03]'
                            ]">
                            <div v-if="route.params.id == module.id" class="absolute left-0 top-3 bottom-3 w-1 bg-gradient-to-b from-blue-500 to-pink-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.6)]"></div>
                            <div :class="['p-2 rounded-xl transition-all duration-500 group-hover:scale-110', route.params.id == module.id ? 'bg-blue-500/10' : 'bg-white/5']">
                                <span class="text-lg">{{ module.icon }}</span>
                            </div>
                            <div v-if="!isIcon" class="flex-1 min-w-0 text-left">
                                <p :class="['truncate text-xs tracking-wide uppercase', route.params.id == module.id ? 'font-black text-white' : 'font-bold text-gray-500 group-hover:text-gray-300']">{{ module.name }}</p>
                                <div v-if="module.progress > 0" class="flex items-center gap-2 mt-1">
                                    <div class="flex-1 h-0.5 bg-white/5 rounded-full overflow-hidden text-[0px]">.
                                        <div class="h-full bg-gradient-to-r from-blue-500 to-pink-500" :style="{ width: module.progress + '%' }"></div>
                                    </div>
                                    <span class="text-[8px] font-black text-blue-500/70">{{ module.progress }}%</span>
                                </div>
                            </div>
                        </button>
                    </div>
                </section>

                <!-- JOURNEYS SECTION -->
                <section class="space-y-4">
                    <div v-if="isFull || isMobileShown" class="px-4 text-[9px] font-black uppercase tracking-[0.25em] text-pink-500 italic opacity-80">
                        Your Journeys
                    </div>
                    <div v-if="!isIcon" class="space-y-4 px-4">
                        <button v-for="path in myLearningPaths" :key="'path-' + path.id" @click="goPath(path.id)" class="w-full text-left group">
                            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 group-hover:text-pink-500 transition-colors">{{ path.name }}</p>
                            <div class="relative h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <div class="absolute inset-y-0 left-0 bg-gradient-to-r from-pink-500 to-indigo-500 shadow-[0_0_8px_rgba(236,72,153,0.3)] transition-all duration-1000" :style="{ width: path.progress + '%' }"></div>
                            </div>
                        </button>
                    </div>
                    <div v-else class="flex flex-col items-center gap-3">
                        <div v-for="path in myLearningPaths" :key="'p-icon-' + path.id" class="w-1.5 h-1.5 rounded-full bg-pink-500/20 border border-pink-500/50"></div>
                    </div>
                </section>

                <!-- UTILITIES SECTION -->
                <section class="pt-6 border-t border-white/5 space-y-1">
                    <button @click="goLeaderboard()" class="sidebar-btn group">
                        <div :class="['flex items-center gap-3 w-full', isIcon ? 'justify-center' : '']">
                            <div class="p-2 rounded-xl bg-white/5 group-hover:bg-pink-500/10 transition-colors">
                                <Trophy class="h-4.5 w-4.5 text-gray-600 group-hover:text-pink-500 transition-colors" />
                            </div>
                            <span v-if="!isIcon" class="text-xs font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-200">Leaderboard</span>
                        </div>
                    </button>
                    <button @click="goManageBadges()" :class="['sidebar-btn group', route.name === 'user.managebadges' ? 'active-util' : '']">
                        <div :class="['flex items-center gap-3 w-full', isIcon ? 'justify-center' : '']">
                            <div class="p-2 rounded-xl bg-white/5 group-hover:bg-blue-500/10 transition-colors">
                                <ShieldCheck :class="['h-4.5 w-4.5 text-gray-600 group-hover:text-blue-400 transition-colors', route.name === 'user.managebadges' ? 'text-blue-400' : '']" />
                            </div>
                            <span v-if="!isIcon" class="text-xs font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-200">Manage Badges</span>
                        </div>
                    </button>
                    <button @click="goSettings()" class="sidebar-btn group">
                        <div :class="['flex items-center gap-3 w-full', isIcon ? 'justify-center' : '']">
                            <div class="p-2 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
                                <Settings class="h-4.5 w-4.5 text-gray-600 group-hover:text-white transition-colors" />
                            </div>
                            <span v-if="!isIcon" class="text-xs font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-200">Settings</span>
                        </div>
                    </button>
                </section>
            </nav>

            <!-- PROFILE FOOTER: Dynamic User Name applied here -->
            <div class="mt-auto border-t border-white/5 bg-white/[0.01]">
                <div v-if="isFull" class="p-4 flex items-center gap-3">
                    <div class="relative group/avatar cursor-pointer">
                        <div class="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-pink-600 rounded-full blur opacity-20 group-hover/avatar:opacity-60 transition duration-500"></div>
                        <div class="relative w-10 h-10 rounded-full bg-[#0d0d12] border border-white/10 flex items-center justify-center text-xs font-black text-blue-400 shadow-xl uppercase">
                            {{ getOrgInitials(mine[0]) || 'U' }}
                        </div>
                    </div>
                    <div class="flex-1 min-w-0">
                        <!-- CHANGED: Static "You" replaced with Dynamic User Name -->
                        <p class="text-[11px] font-black uppercase tracking-tight text-white truncate">{{ auth.user?.name || 'Authenticated User' }}</p>
                        <p class="text-[8px] font-black text-gray-600 uppercase tracking-widest leading-none mt-1">Registry Sync Active</p>
                    </div>
                </div>
                <div v-else class="p-4 flex justify-center">
                    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-pink-500 flex items-center justify-center text-[10px] font-black text-white shadow-lg">
                        {{ getOrgInitials(mine[0]) || 'U' }}
                    </div>
                </div>
            </div>
        </div>
    </aside>
</template>

<style scoped>
@reference "@/style.css";

.sidebar-btn {
    @apply w-full rounded-2xl transition-all duration-300 px-3 py-2.5 text-left border border-transparent;
}
.active-util {
    @apply bg-white/5 border-white/10 shadow-lg shadow-blue-950/20;
}
.custom-scrollbar::-webkit-scrollbar { width: 3px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
</style>