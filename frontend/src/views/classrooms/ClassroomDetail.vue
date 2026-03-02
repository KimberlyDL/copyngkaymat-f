<template>
  <div class="custom-font-poppins animate-in min-h-screen p-4 md:p-8 text-black dark:text-white transition-colors duration-500 bg-slate-50 dark:bg-[#050507]">
    
    <div class="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      <aside class="lg:col-span-4 space-y-6 lg:sticky lg:top-8 self-start">
        
        <div class="bg-white dark:bg-[#0d0d12] border border-slate-200 dark:border-white/10 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
          <div class="relative z-10 space-y-6">
            <div class="flex items-center gap-5">
              <div class="w-14 h-14 rounded-2xl bg-purple-600 flex items-center justify-center shadow-lg">
                <SchoolIcon class="w-7 h-7 text-white" />
              </div>
              <div class="min-w-0">
                <p class="text-[10px] font-black uppercase tracking-[0.3em] text-purple-600 dark:text-purple-400 leading-none mb-1">Classroom</p>
                <h1 class="text-2xl font-black uppercase italic tracking-tighter truncate leading-none">{{ classroom?.name }}</h1>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-3">
              <div class="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 flex justify-between items-center">
                <span class="text-[9px] font-black uppercase text-slate-400">Class Code</span>
                <span class="text-sm font-black tracking-widest text-purple-600">{{ classroom?.join_code }}</span>
              </div>
              <div class="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 flex justify-between items-center">
                <span class="text-[9px] font-black uppercase text-slate-400">Total Members</span>
                <span class="text-sm font-black text-purple-600">{{ classroom?.students?.length || 0 }}</span>
              </div>
            </div>

            <button @click="isFacilitator ? (showCreateModal = true) : (showJoinModal = true)"
              class="btn-3d-purple w-full py-4 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] transition-transform">
              {{ isFacilitator ? 'Manage Class' : 'Change Class' }}
            </button>
          </div>
        </div>

        <div class="bg-white/50 dark:bg-[#0d0d12]/50 backdrop-blur-md border border-slate-200 dark:border-white/10 p-8 rounded-[2.5rem] shadow-lg">
          <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 italic">Member Registry</h3>
          <div class="space-y-4 max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
            <div v-for="student in classroom?.students" :key="student.id" class="flex items-center gap-4 group">
              <div class="w-10 h-10 rounded-xl bg-slate-200 dark:bg-white/5 flex items-center justify-center text-[10px] font-black uppercase group-hover:bg-purple-600 group-hover:text-white transition-all">
                {{ student.name?.[0] }}
              </div>
              <div class="min-w-0">
                <p class="text-xs font-bold uppercase tracking-tight truncate group-hover:text-purple-600 transition-colors">{{ student.name }}</p>
                <p class="text-[8px] font-black text-slate-400 uppercase">Active</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main class="lg:col-span-8 space-y-6">
        
        <nav class="bg-white/80 dark:bg-[#0d0d12]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-full p-2 flex items-center gap-2 shadow-lg w-fit mx-auto lg:mx-0">
          <button v-for="tab in availableTabs" :key="tab" @click="activeTab = tab"
            :class="['px-8 py-3 text-[10px] font-black uppercase tracking-widest rounded-full transition-all', 
            activeTab === tab ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg' : 'text-slate-400 hover:text-purple-600']">
            {{ tab === 'Progress' ? 'Grades' : tab }}
          </button>
        </nav>

        <div class="bg-white dark:bg-[#0d0d12] border border-slate-200 dark:border-white/10 rounded-[3rem] p-8 shadow-2xl min-h-[600px] relative overflow-hidden">
          
          <div v-if="activeTab === 'Modules'" class="animate-in grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
             <div v-for="module in classroom?.modules" :key="module.id" 
                  @click="$router.push(`/modules/${module.id}`)"
                  class="group p-6 bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 rounded-3xl hover:border-purple-600/30 transition-all cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1">
                <div class="w-10 h-10 bg-purple-100 dark:bg-purple-600/10 rounded-xl flex items-center justify-center text-purple-600 mb-4 group-hover:bg-purple-600 group-hover:text-white transition-all">
                  <BookOpenIcon class="w-5 h-5" />
                </div>
                <h3 class="text-sm font-black uppercase italic tracking-tight mb-1 leading-none">{{ module.title }}</h3>
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{{ module.category || 'Standard' }}</p>
                <div class="mt-4 flex justify-end">
                  <ArrowRightIcon class="w-4 h-4 text-slate-300 group-hover:text-purple-600 transition-colors" />
                </div>
             </div>
             
             <div v-if="isFacilitator" class="border-2 border-dashed border-slate-200 dark:border-white/10 rounded-3xl flex flex-col items-center justify-center gap-2 opacity-50 hover:opacity-100 transition-all cursor-pointer min-h-[140px]">
                <PlusIcon class="w-6 h-6" />
                <span class="text-[9px] font-black uppercase tracking-widest">New Unit</span>
             </div>
          </div>

          <div v-if="activeTab === 'Feed'" class="animate-in space-y-6">
            <!-- Create Announcement (Facilitators Only) -->
            <div v-if="isFacilitator" class="bg-gradient-to-r from-purple-600/10 to-violet-600/10 p-8 rounded-[2.5rem] border-2 border-dashed border-purple-500/30">
              <div class="flex items-center gap-3 mb-4">
                <MegaphoneIcon class="w-5 h-5 text-purple-600" />
                <span class="text-sm font-black text-purple-600 uppercase tracking-widest">Post Announcement</span>
              </div>
              <input v-model="newAnnouncement.title" placeholder="Announcement title..." 
                class="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 text-sm font-bold outline-none focus:border-purple-600 transition-all mb-3" />
              <textarea v-model="newAnnouncement.content" placeholder="Write your announcement..." 
                class="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 text-sm outline-none focus:border-purple-600 transition-all" rows="3"></textarea>
              <div class="flex items-center justify-between mt-4">
                <select v-model="newAnnouncement.priority" class="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full px-4 py-2 text-[10px] font-bold uppercase outline-none">
                  <option value="low">Low Priority</option>
                  <option value="normal">Normal Priority</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">Urgent</option>
                </select>
                <button @click="createAnnouncement" :disabled="!newAnnouncement.title || !newAnnouncement.content || isCreatingAnnouncement"
                  class="btn-3d-purple px-10 py-3 text-white text-[10px] font-black uppercase tracking-widest rounded-full disabled:opacity-50">
                  {{ isCreatingAnnouncement ? 'Posting...' : 'Publish' }}
                </button>
              </div>
            </div>

            <!-- Announcements List -->
            <div v-if="announcements.length === 0" class="text-center py-20 bg-slate-50 dark:bg-white/[0.02] rounded-[2rem]">
              <MegaphoneIcon class="w-16 h-16 mx-auto text-slate-200 dark:text-slate-700 mb-4" />
              <p class="text-lg font-black text-slate-300 uppercase italic">No Announcements Yet</p>
              <p class="text-sm text-slate-400 mt-2">{{ isFacilitator ? 'Create your first announcement above!' : 'Check back later for updates from your facilitator.' }}</p>
            </div>

            <!-- Enhanced Announcement Cards -->
            <div v-for="announcement in announcements" :key="announcement.id" 
              class="relative overflow-hidden rounded-[2rem] transition-all duration-300 hover:scale-[1.01]"
              :class="getClassroomAnnouncementClass(announcement.priority)">
              
              <!-- Background Pattern -->
              <div v-if="announcement.priority === 'urgent' || announcement.priority === 'high'" class="absolute inset-0 opacity-10">
                <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzBoLTZWMGg2djMwem0tNiAwSDI0VjBoNnYzMHoiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
              </div>
              
              <div class="relative z-10 p-6 md:p-8">
                <div class="flex items-start justify-between gap-4">
                  <div class="flex items-start gap-4 flex-1">
                    <!-- Icon -->
                    <div class="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                      :class="announcement.priority === 'urgent' ? 'bg-white/20 animate-pulse' : 'bg-white/10'">
                      <MegaphoneIcon class="w-6 h-6" :class="announcement.priority === 'low' || announcement.priority === 'normal' ? 'text-purple-600' : 'text-white'" />
                    </div>
                    
                    <div class="flex-1 space-y-2">
                      <div class="flex items-center gap-3 flex-wrap">
                        <span :class="getClassroomPriorityBadge(announcement.priority)" class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                          {{ announcement.priority === 'urgent' ? '⚠️ URGENT' : announcement.priority === 'high' ? '🔥 HIGH' : announcement.priority }}
                        </span>
                        <span class="text-[10px] font-bold opacity-60">{{ formatDate(announcement.created_at) }}</span>
                      </div>
                      <h4 class="text-lg font-black uppercase italic tracking-tight leading-tight">{{ announcement.title }}</h4>
                      <p class="text-sm opacity-80 leading-relaxed">{{ announcement.content }}</p>
                      <div class="flex items-center gap-3 pt-2">
                        <div class="flex items-center gap-2 text-[10px] opacity-60">
                          <UserIcon class="w-3 h-3" />
                          <span>{{ announcement.author?.name || 'Facilitator' }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Edit/Delete for Facilitators -->
                  <div v-if="isFacilitator" class="flex gap-2 shrink-0">
                    <button @click="editAnnouncement(announcement)" class="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                      <PencilIcon class="w-4 h-4" />
                    </button>
                    <button @click="confirmDeleteAnnouncement(announcement)" class="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors text-red-400">
                      <TrashIcon class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Edit Announcement Modal -->
          <Transition name="modal">
            <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-md" @click="showEditModal = false"></div>
              <div class="relative w-full max-w-lg bg-white dark:bg-[#0d0d15] rounded-[2rem] border-2 border-slate-200 dark:border-white/20 shadow-2xl p-8">
                <h3 class="text-xl font-black uppercase italic tracking-tight mb-6">Edit Announcement</h3>
                <input v-model="editForm.title" placeholder="Title" class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-sm font-medium outline-none mb-4" />
                <textarea v-model="editForm.content" placeholder="Content" rows="4" class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-sm font-medium outline-none mb-4"></textarea>
                <select v-model="editForm.priority" class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-sm font-medium outline-none mb-6">
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
                <div class="flex gap-3">
                  <button @click="showEditModal = false" class="flex-1 py-4 bg-slate-100 dark:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest">Cancel</button>
                  <button @click="updateAnnouncement" :disabled="isUpdatingAnnouncement" class="flex-1 py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50">
                    {{ isUpdatingAnnouncement ? 'Saving...' : 'Update' }}
                  </button>
                </div>
              </div>
            </div>
          </Transition>

          <!-- Delete Confirmation Modal -->
          <Transition name="modal">
            <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-md" @click="showDeleteModal = false"></div>
              <div class="relative w-full max-w-sm bg-white dark:bg-[#0d0d15] rounded-[2rem] border-2 border-slate-200 dark:border-white/20 shadow-2xl p-8 text-center">
                <TrashIcon class="w-10 h-10 mx-auto text-red-500 mb-4" />
                <h3 class="text-lg font-black uppercase italic">Delete Announcement?</h3>
                <p class="text-sm text-slate-400 mt-2 mb-6">This cannot be undone.</p>
                <div class="flex gap-3">
                  <button @click="showDeleteModal = false" class="flex-1 py-4 bg-slate-100 dark:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest">Cancel</button>
                  <button @click="deleteAnnouncement" :disabled="isDeletingAnnouncement" class="flex-1 py-4 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50">
                    {{ isDeletingAnnouncement ? 'Deleting...' : 'Delete' }}
                  </button>
                </div>
              </div>
            </div>
          </Transition>

          <div v-if="activeTab === 'Progress'" class="animate-in overflow-x-auto custom-scrollbar">
            <table class="w-full text-left">
              <thead>
                <tr class="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 border-b border-slate-100 dark:border-white/5">
                  <th class="pb-6 pl-4">Member</th>
                  <th class="pb-6">Current Work</th>
                  <th class="pb-6 text-center">Score</th>
                  <th class="pb-6 text-right pr-4">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50 dark:divide-white/5">
                <tr v-for="student in progressData" :key="student.id" class="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <td class="py-5 pl-4 flex items-center gap-4">
                    <div class="w-9 h-9 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-[10px] font-black">{{ student.name?.[0] }}</div>
                    <span class="text-xs font-black uppercase italic tracking-tighter">{{ student.name }}</span>
                  </td>
                  <td class="py-5 italic text-[10px] font-bold text-slate-500 uppercase">{{ student.quizAttempts?.[0]?.quiz?.module?.title || 'None' }}</td>
                  <td class="py-5 text-center font-black text-purple-600 text-xl tracking-tighter italic">{{ student.quizAttempts?.length ? student.quizAttempts[0].score : '-' }}</td>
                  <td class="py-5 text-right pr-4">
                    <span class="px-4 py-1.5 rounded-full text-[8px] font-black uppercase border border-slate-200 dark:border-white/10 text-slate-400">Registered</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </main>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { 
  School as SchoolIcon, 
  BookOpen as BookOpenIcon, 
  ArrowRight as ArrowRightIcon,
  Plus as PlusIcon,
  Megaphone as MegaphoneIcon,
  Pencil as PencilIcon,
  Trash as TrashIcon,
  User as UserIcon,
  Calendar as CalendarIcon
} from 'lucide-vue-next';
import api from '@/utils/api';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const classroom = ref(null);
const progressData = ref([]);
const activeTab = ref('Modules');

// Announcements state
const announcements = ref([]);
const newAnnouncement = ref({ title: '', content: '', priority: 'normal' });
const isCreatingAnnouncement = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const editForm = ref({ id: null, title: '', content: '', priority: 'normal' });
const isUpdatingAnnouncement = ref(false);
const isDeletingAnnouncement = ref(false);
const announcementToDelete = ref(null);

const isFacilitator = computed(() => auth.user?.role !== 'player' || classroom.value?.created_by === auth.user?.id);

const availableTabs = computed(() => {
  const tabs = ['Modules', 'Feed', 'People'];
  if (isFacilitator.value) tabs.push('Progress');
  return tabs;
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

// Enhanced classroom announcement styling
const getClassroomAnnouncementClass = (priority) => {
  const classes = {
    low: 'bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-black dark:text-white',
    normal: 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-xl shadow-purple-500/20',
    high: 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white shadow-xl shadow-orange-500/30',
    urgent: 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-2xl shadow-red-500/40 border-2 border-red-400/50'
  };
  return classes[priority] || classes.normal;
};

const getClassroomPriorityBadge = (priority) => {
  const classes = {
    low: 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-white',
    normal: 'bg-white/20 text-white border border-white/30',
    high: 'bg-white/30 text-white border border-white/40',
    urgent: 'bg-white/30 text-white border border-white/50'
  };
  return classes[priority] || classes.normal;
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};

const fetchClassroomDetails = async () => {
    try {
        const classId = route.params.id;
        const res = await api.get(`/api/v1/classrooms/${classId}`); 
        classroom.value = res.data.classroom;
    } catch (err) { console.error(err); }
};

const fetchAnnouncements = async () => {
  try {
    const classId = route.params.id;
    const res = await api.get(`/api/v1/classrooms/${classId}/announcements`);
    announcements.value = res.data?.announcements || [];
  } catch (err) { console.error(err); }
};

const createAnnouncement = async () => {
  if (!newAnnouncement.value.title || !newAnnouncement.value.content) return;
  isCreatingAnnouncement.value = true;
  try {
    const classId = route.params.id;
    await api.post(`/api/v1/classrooms/${classId}/announcements`, newAnnouncement.value);
    newAnnouncement.value = { title: '', content: '', priority: 'normal' };
    fetchAnnouncements();
  } catch (err) { console.error(err); }
  finally { isCreatingAnnouncement.value = false; }
};

const editAnnouncement = (announcement) => {
  editForm.value = { 
    id: announcement.id, 
    title: announcement.title, 
    content: announcement.content, 
    priority: announcement.priority 
  };
  showEditModal.value = true;
};

const updateAnnouncement = async () => {
  isUpdatingAnnouncement.value = true;
  try {
    const classId = route.params.id;
    await api.put(`/api/v1/classrooms/${classId}/announcements/${editForm.value.id}`, editForm.value);
    showEditModal.value = false;
    fetchAnnouncements();
  } catch (err) { console.error(err); }
  finally { isUpdatingAnnouncement.value = false; }
};

const confirmDeleteAnnouncement = (announcement) => {
  announcementToDelete.value = announcement;
  showDeleteModal.value = true;
};

const deleteAnnouncement = async () => {
  if (!announcementToDelete.value) return;
  isDeletingAnnouncement.value = true;
  try {
    const classId = route.params.id;
    await api.delete(`/api/v1/classrooms/${classId}/announcements/${announcementToDelete.value.id}`);
    showDeleteModal.value = false;
    announcementToDelete.value = null;
    fetchAnnouncements();
  } catch (err) { console.error(err); }
  finally { isDeletingAnnouncement.value = false; }
};

const fetchProgressReport = async () => {
    try {
        const classId = route.params.id;
        const res = await api.get(`/api/v1/classrooms/${classId}/progress`); 
        progressData.value = res.data.progress;
    } catch (err) { console.error(err); }
};

watch(activeTab, (newTab) => {
  if (newTab === 'Progress' && isFacilitator.value) fetchProgressReport();
  if (newTab === 'Feed') fetchAnnouncements();
});

onMounted(() => {
  fetchClassroomDetails();
  fetchAnnouncements();
});
</script>

<style scoped>
@reference "../../style.css";
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700;1,900&display=swap');

.custom-font-poppins { font-family: 'Poppins', sans-serif !important; }

.btn-3d-purple {
  background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
  box-shadow: 
    0 12px 24px -8px rgba(124, 58, 237, 0.4), 
    inset 0 2px 4px rgba(255, 255, 255, 0.3);
}

.animate-in { animation: hubEntry 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes hubEntry {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(124, 58, 237, 0.2); border-radius: 10px; }

.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>