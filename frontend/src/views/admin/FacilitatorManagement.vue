<template>
    <div class="space-y-6 font-['Poppins'] animate-in fade-in duration-700">
        
        <header class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
            <div class="space-y-1">
                <div class="flex items-center gap-2">
                    <div class="h-1 w-8 bg-gradient-to-r from-blue-600 to-pink-600 rounded-full"></div>
                    <span class="text-[8px] font-black uppercase tracking-[0.4em] text-blue-500/80">User Directory</span>
                </div>
                <h1 class="text-4xl font-black text-white uppercase tracking-tighter leading-none">
                    Facilitator <span class="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Management</span>
                </h1>
                <p class="text-[11px] text-gray-500 font-medium italic">Create and manage your team of educators and moderators.</p>
            </div>
            
            <button @click="showCreateModal = true"
                class="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-500">
                <PlusIcon class="w-4 h-4" /> Add Facilitator
            </button>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-[2rem]">
            <div class="space-y-1.5 group">
                <label class="text-[9px] font-black uppercase tracking-widest text-gray-600 ml-1 group-focus-within:text-blue-400">Filter Role</label>
                <select v-model="filters.role" @change="fetchFacilitators"
                    class="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none transition-all">
                    <option value="">All Roles</option>
                    <option value="educator">Educator</option>
                    <option value="moderator">Moderator</option>
                </select>
            </div>
            <div class="space-y-1.5 group">
                <label class="text-[9px] font-black uppercase tracking-widest text-gray-600 ml-1 group-focus-within:text-pink-400">Filter Status</label>
                <select v-model="filters.status" @change="fetchFacilitators"
                    class="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs outline-none focus:ring-2 focus:ring-pink-500/50 appearance-none transition-all">
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="deactivated">Deactivated</option>
                </select>
            </div>
            <div class="md:col-span-2 space-y-1.5 group">
                <label class="text-[9px] font-black uppercase tracking-widest text-gray-600 ml-1 group-focus-within:text-blue-400">Search Team</label>
                <div class="relative">
                    <input v-model="searchQuery" @input="debouncedSearch" type="text"
                        placeholder="Search by name or email..."
                        class="w-full px-10 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
                    <SearchIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
                </div>
            </div>
        </div>

        <div class="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden">
            <div v-if="isLoading" class="py-20 text-center">
                <div class="inline-block animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mb-4"></div>
                <p class="text-[10px] font-black uppercase tracking-widest text-gray-600 animate-pulse">Syncing Directory...</p>
            </div>

            <div v-else-if="facilitators.length === 0" class="py-20 text-center space-y-4">
                <UsersIcon class="mx-auto h-12 w-12 text-gray-800" />
                <p class="text-xs font-black uppercase tracking-widest text-gray-600">No facilitators detected</p>
                <button @click="showCreateModal = true" class="text-[9px] font-black text-blue-500 underline uppercase tracking-widest hover:text-pink-500 transition-colors">Deploy New Facilitator</button>
            </div>

            <div v-else class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead class="bg-white/[0.03] border-b border-white/5">
                        <tr>
                            <th class="px-8 py-5 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Team Member</th>
                            <th class="px-6 py-5 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Role</th>
                            <th class="px-6 py-5 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Status</th>
                            <th class="px-6 py-5 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Activity</th>
                            <th class="px-8 py-5 text-right text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-white/5">
                        <tr v-for="facilitator in facilitators" :key="facilitator.id"
                            class="group hover:bg-white/[0.02] transition-all duration-300">
                            <td class="px-8 py-4 whitespace-nowrap text-sm font-medium text-white tracking-tight">
                                <div class="flex items-center gap-4">
                                    <img class="h-10 w-10 rounded-2xl object-cover border border-white/10 group-hover:border-blue-500/50 transition-all shadow-lg"
                                        :src="facilitator.avatar_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(facilitator.name) + '&background=0d0d12&color=fff'"
                                        :alt="facilitator.name">
                                    <div class="flex flex-col">
                                        <span class="text-gray-200 uppercase text-xs font-black tracking-widest">{{ facilitator.name }}</span>
                                        <span class="text-[10px] text-gray-600 font-medium lowercase">{{ facilitator.email }}</span>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap capitalize text-[10px] font-black tracking-widest">
                                <span :class="getRoleBadgeClass(facilitator.role)" class="px-3 py-1 rounded-full border">
                                    {{ facilitator.role }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap uppercase text-[9px] font-black tracking-widest">
                                <div class="flex flex-col gap-1">
                                    <span :class="getStatusBadgeClass(facilitator.account_status)">{{ facilitator.account_status }}</span>
                                    <span v-if="facilitator.requires_password_change" class="text-[7px] text-yellow-600 italic">PENDING_SETUP</span>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap italic text-[9px] font-black text-gray-600 uppercase tracking-widest">
                                {{ facilitator.last_login_at ? formatDate(facilitator.last_login_at) : 'NEVER_LOGGED' }}
                            </td>
                            <td class="px-8 py-4 whitespace-nowrap text-right">
                                <div class="flex items-center justify-end gap-2">
                                    <button @click="resendWelcome(facilitator)" class="p-2.5 rounded-xl bg-white/5 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/30 transition-all shadow-sm" title="Resend Signal">
                                        <MailIcon class="w-4 h-4" />
                                    </button>
                                    <button @click="editFacilitator(facilitator)" class="p-2.5 rounded-xl bg-white/5 text-gray-500 hover:text-pink-400 hover:bg-pink-500/10 border border-transparent hover:border-pink-500/30 transition-all shadow-sm" title="Edit Access">
                                        <Edit2Icon class="w-4 h-4" />
                                    </button>
                                    <button @click="confirmDelete(facilitator)" class="p-2.5 rounded-xl bg-white/5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all shadow-sm" title="Purge Node">
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
            <div class="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em]">
                Page {{ pagination.page }} of {{ pagination.totalPages }} // <span class="text-blue-500/50">{{ pagination.total }} Nodes Detected</span>
            </div>
            <div class="flex gap-2">
                <button @click="changePage(pagination.page - 1)" :disabled="pagination.page === 1"
                    class="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                    Prev
                </button>
                <button @click="changePage(pagination.page + 1)" :disabled="pagination.page === pagination.totalPages"
                    class="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">
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
        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
        : 'bg-pink-500/10 text-pink-400 border-pink-500/20';
};

const getStatusBadgeClass = (status) => {
    return status === 'active' ? 'text-emerald-400' : 'text-gray-600';
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
/* Industrial Table Refinements */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
</style>