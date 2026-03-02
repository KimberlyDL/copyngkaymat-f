<template>
    <div class="space-y-8 custom-font-poppins animate-in fade-in duration-700 text-black dark:text-white transition-all selection:bg-purple-500/30">
        
        <!-- Header -->
        <header class="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 dark:border-white/5 pb-8">
            <div class="space-y-2">
                <div class="flex items-center gap-2.5">
                    <div class="h-1 w-8 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-full shadow-[0_2px_10px_rgba(139,92,246,0.4)]"></div>
                    <span class="text-[10px] font-extrabold uppercase tracking-[0.3em] text-purple-600 dark:text-purple-400">Admin Console</span>
                </div>
                <h1 class="text-3xl md:text-4xl font-[900] text-black dark:text-white uppercase tracking-tighter leading-tight italic">
                    Public <span class="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-500 bg-clip-text text-transparent">Announcements</span>
                </h1>
                <p class="text-xs font-medium text-black/50 dark:text-slate-400 italic tracking-tight">Create announcements visible to all users on the platform.</p>
            </div>
            
            <button @click="openCreateModal" class="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-2xl hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300">
                <PlusIcon class="h-4 w-4" />
                <span class="text-[10px] font-[900] tracking-widest uppercase italic">New Announcement</span>
            </button>
        </header>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-20">
            <div class="text-center space-y-4">
                <div class="relative h-12 w-12 text-purple-600 mx-auto">
                    <div class="absolute inset-0 rounded-full border-2 border-current opacity-10"></div>
                    <div class="absolute inset-0 rounded-full border-2 border-t-transparent animate-spin"></div>
                </div>
                <p class="text-[10px] font-[900] uppercase tracking-[0.4em] text-purple-500 italic">Loading Announcements...</p>
            </div>
        </div>

        <!-- Announcements List -->
        <div v-else class="space-y-4">
            <div v-if="announcements.length === 0" class="text-center py-20 bg-white/80 dark:bg-white/[0.02] rounded-[2.5rem] border border-slate-200 dark:border-white/10">
                <MegaphoneIcon class="h-16 w-16 mx-auto text-slate-200 dark:text-slate-800 mb-4" />
                <h3 class="text-xl font-black text-slate-400 uppercase italic">No Announcements Yet</h3>
                <p class="text-sm text-slate-400 mt-2">Create your first public announcement to get started.</p>
            </div>

            <div v-for="announcement in announcements" :key="announcement.id"
                class="bg-white/90 dark:bg-[#0d0d15]/60 border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 transition-all hover:border-purple-500/30 hover:shadow-lg group relative">
                
                <!-- Priority Badge -->
                <div class="absolute top-4 right-4 flex items-center gap-2">
                    <span :class="getPriorityClass(announcement.priority)" class="px-3 py-1 rounded-full text-[8px] font-[900] uppercase tracking-widest">
                        {{ announcement.priority }}
                    </span>
                    <span :class="announcement.status === 'active' ? 'bg-purple-500/10 text-purple-600 border-purple-500/20' : 'bg-slate-500/10 text-slate-500 border-slate-500/20'" 
                        class="px-3 py-1 rounded-full text-[8px] font-[900] uppercase tracking-widest border">
                        {{ announcement.status }}
                    </span>
                </div>

                <div class="space-y-3">
                    <h3 class="text-lg font-black text-black dark:text-white uppercase tracking-tight italic pr-32">{{ announcement.title }}</h3>
                    <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{{ announcement.content }}</p>
                    
                    <div class="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                        <div class="flex items-center gap-4">
                            <div class="flex items-center gap-2 text-[10px] text-slate-400">
                                <UserIcon class="h-3 w-3" />
                                <span>{{ announcement.author?.name || 'Admin' }}</span>
                            </div>
                            <div class="flex items-center gap-2 text-[10px] text-slate-400">
                                <CalendarIcon class="h-3 w-3" />
                                <span>{{ formatDate(announcement.created_at) }}</span>
                            </div>
                        </div>
                        <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button @click="editAnnouncement(announcement)" class="p-2 rounded-xl bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 transition-colors">
                                <PencilIcon class="h-4 w-4" />
                            </button>
                            <button @click="confirmDelete(announcement)" class="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors">
                                <TrashIcon class="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Create/Edit Modal -->
        <Transition name="modal">
            <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-md" @click="closeModal"></div>
                
                <div class="relative w-full max-w-xl bg-white dark:bg-[#0d0d15] rounded-[2.5rem] border-2 border-slate-200 dark:border-white/20 shadow-2xl overflow-hidden">
                    <div class="p-8 space-y-6">
                        <div class="flex items-center justify-between">
                            <h2 class="text-2xl font-black text-black dark:text-white uppercase tracking-tight italic">
                                {{ isEditing ? 'Edit' : 'New' }} Announcement
                            </h2>
                            <button @click="closeModal" class="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                                <XIcon class="h-5 w-5 text-slate-400" />
                            </button>
                        </div>

                        <form @submit.prevent="saveAnnouncement" class="space-y-5">
                            <div>
                                <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Title</label>
                                <input v-model="form.title" type="text" required
                                    class="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-medium text-black dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                                    placeholder="Announcement title...">
                            </div>

                            <div>
                                <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Content</label>
                                <textarea v-model="form.content" required rows="4"
                                    class="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-medium text-black dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all resize-none"
                                    placeholder="Write your announcement..."></textarea>
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Priority</label>
                                    <select v-model="form.priority"
                                        class="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-medium text-black dark:text-white focus:border-purple-500 outline-none">
                                        <option value="low">Low</option>
                                        <option value="normal">Normal</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                </div>

                                <div v-if="isEditing">
                                    <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Status</label>
                                    <select v-model="form.status"
                                        class="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-medium text-black dark:text-white focus:border-purple-500 outline-none">
                                        <option value="active">Active</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                </div>
                            </div>

                            <div class="flex gap-3 pt-4">
                                <button type="button" @click="closeModal"
                                    class="flex-1 py-4 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded-2xl text-[10px] font-[900] uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" :disabled="isSaving"
                                    class="flex-1 py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-2xl text-[10px] font-[900] uppercase tracking-widest hover:shadow-lg hover:shadow-purple-500/20 transition-all disabled:opacity-50">
                                    {{ isSaving ? 'Saving...' : (isEditing ? 'Update' : 'Create') }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Transition>

        <!-- Delete Confirmation Modal -->
        <Transition name="modal">
            <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-md" @click="showDeleteModal = false"></div>
                
                <div class="relative w-full max-w-md bg-white dark:bg-[#0d0d15] rounded-[2rem] border-2 border-slate-200 dark:border-white/20 shadow-2xl p-8 text-center">
                    <div class="p-4 rounded-full bg-red-500/10 w-fit mx-auto mb-4">
                        <TrashIcon class="h-8 w-8 text-red-500" />
                    </div>
                    <h3 class="text-xl font-black text-black dark:text-white uppercase italic">Delete Announcement?</h3>
                    <p class="text-sm text-slate-400 mt-2 mb-6">This action cannot be undone. The announcement will be permanently removed.</p>
                    
                    <div class="flex gap-3">
                        <button @click="showDeleteModal = false"
                            class="flex-1 py-4 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded-2xl text-[10px] font-[900] uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                            Cancel
                        </button>
                        <button @click="deleteAnnouncement" :disabled="isDeleting"
                            class="flex-1 py-4 bg-red-500 text-white rounded-2xl text-[10px] font-[900] uppercase tracking-widest hover:bg-red-600 transition-colors disabled:opacity-50">
                            {{ isDeleting ? 'Deleting...' : 'Delete' }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { 
    PlusIcon, MegaphoneIcon, PencilIcon, TrashIcon, 
    XIcon, UserIcon, CalendarIcon 
} from 'lucide-vue-next';
import api from '@/utils/api';

const announcements = ref([]);
const isLoading = ref(false);
const showModal = ref(false);
const showDeleteModal = ref(false);
const isSaving = ref(false);
const isDeleting = ref(false);
const isEditing = ref(false);
const selectedAnnouncement = ref(null);

const form = ref({
    title: '',
    content: '',
    priority: 'normal',
    status: 'active'
});

const getPriorityClass = (priority) => {
    const classes = {
        low: 'bg-slate-500/10 text-slate-500 border border-slate-500/20',
        normal: 'bg-purple-500/10 text-purple-600 border border-purple-500/20',
        high: 'bg-fuchsia-500/10 text-fuchsia-600 border border-fuchsia-500/20',
        urgent: 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
    };
    return classes[priority] || classes.normal;
};

const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const fetchAnnouncements = async () => {
    isLoading.value = true;
    try {
        const res = await api.get('/api/v1/admin/announcements');
        announcements.value = res.data?.announcements || [];
    } catch (error) {
        console.error('Failed to fetch announcements:', error);
    } finally {
        isLoading.value = false;
    }
};

const openCreateModal = () => {
    isEditing.value = false;
    form.value = { title: '', content: '', priority: 'normal', status: 'active' };
    showModal.value = true;
};

const editAnnouncement = (announcement) => {
    isEditing.value = true;
    selectedAnnouncement.value = announcement;
    form.value = {
        title: announcement.title,
        content: announcement.content,
        priority: announcement.priority,
        status: announcement.status
    };
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    selectedAnnouncement.value = null;
};

const saveAnnouncement = async () => {
    isSaving.value = true;
    try {
        if (isEditing.value && selectedAnnouncement.value) {
            await api.put(`/api/v1/admin/announcements/${selectedAnnouncement.value.id}`, form.value);
        } else {
            await api.post('/api/v1/admin/announcements', form.value);
        }
        closeModal();
        fetchAnnouncements();
    } catch (error) {
        console.error('Failed to save announcement:', error);
    } finally {
        isSaving.value = false;
    }
};

const confirmDelete = (announcement) => {
    selectedAnnouncement.value = announcement;
    showDeleteModal.value = true;
};

const deleteAnnouncement = async () => {
    if (!selectedAnnouncement.value) return;
    isDeleting.value = true;
    try {
        await api.delete(`/api/v1/admin/announcements/${selectedAnnouncement.value.id}`);
        showDeleteModal.value = false;
        selectedAnnouncement.value = null;
        fetchAnnouncements();
    } catch (error) {
        console.error('Failed to delete announcement:', error);
    } finally {
        isDeleting.value = false;
    }
};

onMounted(() => {
    fetchAnnouncements();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700;1,900&display=swap');

.custom-font-poppins {
    font-family: 'Poppins', sans-serif !important;
}

.modal-enter-active, .modal-leave-active { 
    transition: opacity 0.3s ease; 
}
.modal-enter-from, .modal-leave-to { 
    opacity: 0; 
}
</style>
