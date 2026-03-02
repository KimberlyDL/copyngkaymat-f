<template>
    <div class="space-y-10 custom-font-poppins animate-in fade-in duration-700 text-black dark:text-white transition-all selection:bg-purple-500/30">
        
        <header class="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 dark:border-white/5 pb-8 relative">
            <div class="space-y-2">
                <div class="flex items-center gap-2.5">
                    <div class="h-1 w-8 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-full shadow-[0_2px_10px_rgba(139,92,246,0.4)]"></div>
                    <span class="text-[10px] font-extrabold uppercase tracking-[0.3em] text-purple-600 dark:text-purple-400">User Directory</span>
                </div>
                <h1 class="text-3xl md:text-4xl font-[900] text-black dark:text-white uppercase tracking-tighter leading-tight italic">
                    Facilitator <span class="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-500 bg-clip-text text-transparent">Management</span>
                </h1>
                <p class="text-xs font-medium text-black/50 dark:text-slate-400 italic tracking-tight">Create and manage your team of educators and moderators.</p>
            </div>
            
            <button @click="showCreateModal = true"
                class="group flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-[11px] font-[900] uppercase tracking-[0.2em] rounded-full shadow-[0_15px_30px_-10px_rgba(124,58,237,0.5),inset_0_2px_4px_rgba(255,255,255,0.3)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-500 italic">
                <PlusIcon class="w-4 h-4 group-hover:rotate-90 transition-transform" /> Add Facilitator
            </button>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white/80 dark:bg-[#0d0d15]/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-6 rounded-[2rem] shadow-lg">
            <div class="space-y-2 group">
                <label class="text-[9px] font-[900] uppercase tracking-widest text-slate-500 dark:text-gray-600 ml-1 group-focus-within:text-purple-600 italic">Filter Role</label>
                <select v-model="filters.role" @change="fetchFacilitators"
                    class="dark-select w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#1e1e2e] border border-slate-200 dark:border-white/10 text-black dark:text-white text-xs font-bold outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all cursor-pointer">
                    <option value="">All Roles</option>
                    <option value="educator">Educator</option>
                    <option value="moderator">Moderator</option>
                </select>
            </div>
            <div class="space-y-2 group">
                <label class="text-[9px] font-[900] uppercase tracking-widest text-slate-500 dark:text-gray-600 ml-1 group-focus-within:text-purple-600 italic">Filter Status</label>
                <select v-model="filters.status" @change="fetchFacilitators"
                    class="dark-select w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#1e1e2e] border border-slate-200 dark:border-white/10 text-black dark:text-white text-xs font-bold outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all cursor-pointer">
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="deactivated">Deactivated</option>
                </select>
            </div>
            <div class="md:col-span-2 space-y-2 group">
                <label class="text-[9px] font-[900] uppercase tracking-widest text-slate-500 dark:text-gray-600 ml-1 group-focus-within:text-purple-600 italic">Search Team</label>
                <div class="relative">
                    <input v-model="searchQuery" @input="debouncedSearch" type="text"
                        placeholder="Search by name or email..."
                        class="w-full px-10 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-black dark:text-white text-xs font-bold outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all placeholder:text-slate-400" />
                    <SearchIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-gray-600" />
                </div>
            </div>
        </div>

        <div class="bg-white/90 dark:bg-[#0d0d15]/40 backdrop-blur-3xl border border-slate-200 dark:border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div v-if="isLoading" class="py-32 text-center">
                <div class="relative h-12 w-12 text-purple-600 mx-auto mb-4">
                    <div class="absolute inset-0 rounded-full border-2 border-current opacity-10"></div>
                    <div class="absolute inset-0 rounded-full border-2 border-t-transparent animate-spin"></div>
                </div>
                <p class="text-[10px] font-[900] uppercase tracking-[0.4em] text-purple-500 animate-pulse italic">Syncing Directory...</p>
            </div>

            <div v-else-if="facilitators.length === 0" class="py-32 text-center space-y-4">
                <div class="inline-flex p-6 bg-slate-100 dark:bg-white/5 rounded-full mb-4">
                    <UsersIcon class="mx-auto h-12 w-12 text-slate-300 dark:text-gray-700" />
                </div>
                <p class="text-sm font-[900] uppercase tracking-widest text-slate-400 dark:text-gray-600 italic">No facilitators detected</p>
                <button @click="showCreateModal = true" class="text-[10px] font-[900] text-purple-600 underline uppercase tracking-widest hover:text-fuchsia-500 transition-colors italic">Deploy New Facilitator</button>
            </div>

            <div v-else class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead class="bg-slate-50/50 dark:bg-white/[0.02] border-b border-slate-200 dark:border-white/5">
                        <tr>
                            <th class="px-8 py-5 text-[9px] font-[900] text-slate-500 dark:text-gray-500 uppercase tracking-[0.2em] italic">Team Member</th>
                            <th class="px-6 py-5 text-[9px] font-[900] text-slate-500 dark:text-gray-500 uppercase tracking-[0.2em] italic">Role</th>
                            <th class="px-6 py-5 text-[9px] font-[900] text-slate-500 dark:text-gray-500 uppercase tracking-[0.2em] italic">Status</th>
                            <th class="px-6 py-5 text-[9px] font-[900] text-slate-500 dark:text-gray-500 uppercase tracking-[0.2em] italic">Activity</th>
                            <th class="px-8 py-5 text-right text-[9px] font-[900] text-slate-500 dark:text-gray-500 uppercase tracking-[0.2em] italic">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-white/5">
                        <tr v-for="facilitator in facilitators" :key="facilitator.id"
                            class="group hover:bg-purple-50/50 dark:hover:bg-purple-500/5 transition-all duration-300">
                            <td class="px-8 py-5 whitespace-nowrap text-sm font-medium tracking-tight">
                                <div class="flex items-center gap-4">
                                    <img class="h-12 w-12 rounded-2xl object-cover border-2 border-white dark:border-slate-800 group-hover:border-purple-500/50 transition-all shadow-lg"
                                        :src="facilitator.avatar_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(facilitator.name) + '&background=7c3aed&color=fff'"
                                        :alt="facilitator.name">
                                    <div class="flex flex-col">
                                        <span class="text-black dark:text-gray-200 uppercase text-xs font-[900] tracking-widest italic">{{ facilitator.name }}</span>
                                        <span class="text-[10px] text-slate-500 dark:text-gray-600 font-medium lowercase">{{ facilitator.email }}</span>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-5 whitespace-nowrap capitalize text-[10px] font-[900] tracking-widest">
                                <span :class="getRoleBadgeClass(facilitator.role)" class="px-4 py-1.5 rounded-full border italic">
                                    {{ facilitator.role }}
                                </span>
                            </td>
                            <td class="px-6 py-5 whitespace-nowrap uppercase text-[9px] font-[900] tracking-widest">
                                <div class="flex flex-col gap-1">
                                    <span :class="getStatusBadgeClass(facilitator.account_status)">{{ facilitator.account_status }}</span>
                                    <span v-if="facilitator.requires_password_change" class="text-[8px] text-amber-600 italic">PENDING_SETUP</span>
                                </div>
                            </td>
                            <td class="px-6 py-5 whitespace-nowrap italic text-[9px] font-[900] text-slate-400 dark:text-gray-600 uppercase tracking-widest">
                                {{ facilitator.last_login_at ? formatDate(facilitator.last_login_at) : 'NEVER_LOGGED' }}
                            </td>
                            <td class="px-8 py-5 whitespace-nowrap text-right">
                                <div class="flex items-center justify-end gap-2">
                                    <button @click="resendWelcome(facilitator)" class="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-500/10 border border-slate-200 dark:border-transparent hover:border-purple-500/30 transition-all shadow-sm" title="Resend Signal">
                                        <MailIcon class="w-4 h-4" />
                                    </button>
                                    <button @click="editFacilitator(facilitator)" class="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-gray-500 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 hover:bg-fuchsia-500/10 border border-slate-200 dark:border-transparent hover:border-fuchsia-500/30 transition-all shadow-sm" title="Edit Access">
                                        <Edit2Icon class="w-4 h-4" />
                                    </button>
                                    <button @click="confirmDelete(facilitator)" class="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-gray-500 hover:text-red-500 hover:bg-red-500/10 border border-slate-200 dark:border-transparent hover:border-red-500/30 transition-all shadow-sm" title="Purge Node">
                                        <Trash2Icon class="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <footer v-if="pagination.totalPages > 1" class="flex items-center justify-between px-2">
            <div class="text-[9px] font-[900] text-slate-500 dark:text-gray-600 uppercase tracking-[0.2em] italic">
                Page {{ pagination.page }} of {{ pagination.totalPages }} // <span class="text-purple-600 dark:text-purple-500/50">{{ pagination.total }} Nodes Detected</span>
            </div>
            <div class="flex gap-3">
                <button @click="changePage(pagination.page - 1)" :disabled="pagination.page === 1"
                    class="px-5 py-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[9px] font-[900] uppercase tracking-widest text-slate-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-white hover:border-purple-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all italic">
                    Prev
                </button>
                <button @click="changePage(pagination.page + 1)" :disabled="pagination.page === pagination.totalPages"
                    class="px-5 py-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[9px] font-[900] uppercase tracking-widest text-slate-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-white hover:border-purple-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all italic">
                    Next
                </button>
            </div>
        </footer>

        <CreateFacilitatorModal v-if="showCreateModal" @close="showCreateModal = false" @created="handleFacilitatorCreated" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { 
    UsersIcon, 
    PlusIcon, 
    SearchIcon, 
    MailIcon, 
    Edit2Icon, 
    Trash2Icon 
} from 'lucide-vue-next';
import { useToast } from '@/utils/useToast';
import api from '@/utils/api';
import CreateFacilitatorModal from './CreateFacilitatorModal.vue';

const toast = useToast();
const facilitators = ref([]);
const isLoading = ref(false);
const showCreateModal = ref(false);
const searchQuery = ref('');
const filters = ref({ role: '', status: '' });
const pagination = ref({ page: 1, limit: 20, total: 0, totalPages: 0 });

const fetchFacilitators = async () => {
    isLoading.value = true;
    try {
        const params = { page: pagination.value.page, limit: pagination.value.limit, ...filters.value, search: searchQuery.value };
        const { data } = await api.get('/api/v1/facilitators', { params });
        facilitators.value = data.facilitators;
        pagination.value = data.pagination;
    } catch (error) {
        toast.error('Failed to sync facilitator directory');
    } finally {
        isLoading.value = false;
    }
};

const resendWelcome = async (f) => {
    try {
        await api.post(`/api/v1/facilitators/${f.id}/resend-welcome`);
        toast.success(`Signal sent to ${f.email}`);
    } catch (error) {
        toast.error('Signal transmission failed');
    }
};

const editFacilitator = (f) => toast.info('Access protocols coming soon');

const confirmDelete = async (f) => {
    if (confirm(`Authorize purging of Node: ${f.name}?`)) {
        try {
            await api.delete(`/api/v1/facilitators/${f.id}`);
            toast.success('Module deleted successfully');
            fetchFacilitators();
        } catch (error) {
            toast.error('Delete request rejected');
        }
    }
};

const changePage = (p) => { pagination.value.page = p; fetchFacilitators(); };
const handleFacilitatorCreated = () => { showCreateModal.value = false; fetchFacilitators(); };

const getRoleBadgeClass = (role) => {
    return role === 'educator'
        ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
        : 'bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/20';
};

const getStatusBadgeClass = (status) => {
    return status === 'active' ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400 dark:text-gray-600';
};

const formatDate = (d) => {
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

let searchTimeout;
const debouncedSearch = () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => fetchFacilitators(), 500);
};

onMounted(() => fetchFacilitators());
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700;1,900&display=swap');

.custom-font-poppins {
    font-family: 'Poppins', sans-serif !important;
}
</style>

<style>
/* Fix dropdown options in dark mode - unscoped to affect native select options */
.dark .dark-select,
.dark .dark-select option {
    background-color: #1e1e2e !important;
    color: #ffffff !important;
}

.dark-select option {
    background-color: #ffffff;
    color: #000000;
    padding: 10px 12px;
}

/* Light mode options */
html:not(.dark) .dark-select option {
    background-color: #ffffff !important;
    color: #000000 !important;
}

/* Hover state for options */
.dark .dark-select option:hover,
.dark .dark-select option:focus,
.dark .dark-select option:checked {
    background-color: #2d2d44 !important;
    color: #ffffff !important;
}
</style>