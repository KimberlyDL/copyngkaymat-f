<template>
  <div class="p-6 font-['Century_Gothic'] text-white min-h-screen bg-[#050507]">
    <div class="relative p-10 rounded-[3rem] bg-[#0d0d12] border border-white/10 overflow-hidden mb-8 shadow-2xl">
      <div class="absolute -right-20 -top-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
      <div class="absolute -left-20 -bottom-20 w-96 h-96 bg-pink-600/10 rounded-full blur-[120px]"></div>
      
      <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <span class="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[9px] font-black tracking-[0.2em] text-blue-400 uppercase">
              Virtual Academy
            </span>
            <span class="px-3 py-1 bg-pink-500/10 border border-pink-500/20 rounded-full text-[9px] font-black tracking-[0.2em] text-pink-400 uppercase">
              {{ classroom?.status || 'Active' }}
            </span>
          </div>
          <h1 class="text-5xl lg:text-7xl font-black italic uppercase tracking-tighter leading-none bg-gradient-to-r from-white via-white to-gray-500 bg-clip-text text-transparent">
            {{ classroom?.name }}
          </h1>
          <p class="text-gray-400 max-w-2xl text-sm italic leading-relaxed">
            {{ classroom?.description || 'Welcome to your collaborative learning space.' }}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="p-6 bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10 text-center">
            <p class="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Access Code</p>
            <p class="text-2xl font-black text-blue-400 tracking-[0.2em]">{{ classroom?.join_code }}</p>
          </div>
          <div class="p-6 bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10 text-center">
            <p class="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Students</p>
            <p class="text-2xl font-black text-pink-500">{{ classroom?.students?.length || 0 }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-8 mb-8 px-4 border-b border-white/5">
      <button 
        v-for="tab in availableTabs" 
        :key="tab"
        @click="activeTab = tab"
        :class="[
          'pb-4 text-[11px] font-black uppercase tracking-[0.3em] transition-all relative',
          activeTab === tab ? 'text-blue-400' : 'text-gray-500 hover:text-white'
        ]"
      >
        {{ tab === 'Progress' ? 'Progress Report' : tab }}
        <div v-if="activeTab === tab" class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-pink-600"></div>
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div class="lg:col-span-3 space-y-6">
        
        <div v-if="activeTab === 'Feed'" class="space-y-6 animate-in">
          <div v-if="isFacilitator" class="p-8 bg-[#0d0d12] border border-white/5 rounded-[2.5rem] shadow-xl">
            <div class="flex gap-4">
              <div class="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center font-black">
                {{ auth.user?.name?.[0] || 'U' }}
              </div>
              <div class="flex-1 space-y-4">
                <textarea placeholder="Share something with the class..." class="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-sm italic focus:ring-1 focus:ring-blue-500 outline-none transition-all" rows="3"></textarea>
                <div class="flex justify-end">
                  <button class="px-8 py-3 bg-gradient-to-r from-blue-600 to-pink-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">Post Announcement</button>
                </div>
              </div>
            </div>
          </div>
          <div class="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
            <p class="text-gray-300 italic">Welcome to {{ classroom?.name }}! Explore the modules to start your learning journey.</p>
          </div>
        </div>

        <div v-if="activeTab === 'Modules'" class="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in">
           <div v-for="module in classroom?.modules" :key="module.id" 
                class="p-6 bg-[#0d0d12] border border-white/5 rounded-3xl hover:border-blue-500/50 transition-all cursor-pointer group"
                @click="$router.push(`/modules/${module.id}`)"> 
              <div class="w-12 h-12 bg-blue-500/10 rounded-2xl mb-4 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                <i class="fas fa-book-open"></i>
              </div>
              <h3 class="font-black uppercase tracking-widest text-sm mb-2">{{ module.title }}</h3>
              <p class="text-xs text-gray-500 italic mb-6 line-clamp-2">{{ module.description || 'No description provided.' }}</p>
              <div class="flex justify-between items-center">
                <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">{{ module.category }}</span>
                <button class="text-[9px] font-black uppercase text-blue-400">View Module →</button>
              </div>
           </div>
           <div v-if="!classroom?.modules?.length" class="col-span-full py-20 text-center opacity-50 italic uppercase text-[10px] tracking-widest">
             No modules uploaded yet.
           </div>
        </div>

        <div v-if="activeTab === 'Progress'" class="animate-in">
          <div class="p-8 bg-[#0d0d12] border border-white/5 rounded-[2.5rem] shadow-xl overflow-hidden relative">
            <div class="absolute top-0 right-0 p-8 opacity-10">
              <i class="fas fa-chart-line text-6xl text-blue-500"></i>
            </div>
            
            <h3 class="text-xs font-black uppercase tracking-[0.3em] text-blue-400 mb-8">Performance Analytics</h3>
            
            <div class="overflow-x-auto custom-scrollbar">
              <table class="w-full text-left">
                <thead>
                  <tr class="text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-white/5">
                    <th class="pb-4 pl-2">Student</th>
                    <th class="pb-4">Module Activity</th>
                    <th class="pb-4 text-center">Recent Score</th>
                    <th class="pb-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-white/[0.02]">
                  <tr v-for="student in progressData" :key="student.id" class="group hover:bg-white/[0.01] transition-colors">
                    <td class="py-6 pl-2">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-[10px] font-black border border-white/10 group-hover:border-blue-500/50 transition-all">
                          {{ student.name?.[0] }}
                        </div>
                        <div class="flex flex-col">
                          <span class="text-[11px] font-bold uppercase">{{ student.name }}</span>
                          <span class="text-[8px] text-gray-600 uppercase">{{ student.email }}</span>
                        </div>
                      </div>
                    </td>
                    <td class="py-6">
                      <div v-if="student.quizAttempts?.length" class="space-y-1">
                        <div v-for="attempt in student.quizAttempts.slice(0, 1)" :key="attempt.id" class="text-[10px] italic text-gray-400">
                          {{ attempt.quiz?.module?.title || 'General Quiz' }}
                        </div>
                      </div>
                      <span v-else class="text-[10px] text-gray-700 italic">No activity recorded</span>
                    </td>
                    <td class="py-6 text-center">
                      <div v-if="student.quizAttempts?.length" class="text-sm font-black text-pink-500">
                        {{ student.quizAttempts[0].score }}/{{ student.quizAttempts[0].total_questions || 10 }}
                      </div>
                      <span v-else class="text-gray-700">-</span>
                    </td>
                    <td class="py-6 text-right">
                      <span :class="[
                        'px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter border',
                        student.quizAttempts?.length ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-gray-500/10 text-gray-600 border-white/5'
                      ]">
                        {{ student.quizAttempts?.length ? 'Active' : 'Inactive' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-if="!progressData.length" class="text-center py-20 opacity-30 italic text-[10px] uppercase tracking-widest">
                No student data available.
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'People'" class="animate-in space-y-8">
           <section>
              <h3 class="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-4">Facilitator</h3>
              <div class="p-4 bg-white/[0.02] rounded-2xl border border-white/5 flex items-center gap-4">
                 <div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-black">{{ classroom?.facilitator?.name?.[0] }}</div>
                 <span class="text-xs font-black uppercase">{{ classroom?.facilitator?.name }}</span>
              </div>
           </section>
           <section>
              <h3 class="text-[10px] font-black uppercase tracking-widest text-pink-500 mb-4">Classmates ({{ classroom?.students?.length || 0 }})</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div v-for="student in classroom?.students" :key="student.id" class="p-4 bg-white/[0.02] rounded-2xl border border-white/5 flex items-center gap-4">
                    <div class="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-[10px] font-black">{{ student.name?.[0] }}</div>
                    <span class="text-[11px] font-black uppercase">{{ student.name }}</span>
                 </div>
              </div>
           </section>
        </div>

        <div v-if="activeTab === 'Settings'" class="animate-in">
          <div class="p-8 bg-[#0d0d12] border border-white/5 rounded-[2.5rem]">
            <h3 class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Classroom Controls</h3>
            <p class="text-xs italic text-gray-600">Settings and management features coming soon.</p>
          </div>
        </div>

      </div>

      <div class="space-y-8">
        <div class="p-8 bg-[#0d0d12] border border-white/5 rounded-[2.5rem] shadow-xl">
          <h2 class="text-xs font-black uppercase tracking-widest text-pink-500 mb-6 flex justify-between">
            The Squad
            <span class="text-[9px] opacity-50">{{ classroom?.students?.length || 0 }}</span>
          </h2>
          <div class="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
            <div v-for="student in classroom?.students?.slice(0, 10)" :key="student.id" class="flex items-center gap-4 group cursor-pointer">
              <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-pink-600 p-[2px]">
                <div class="w-full h-full rounded-full bg-[#0d0d12] flex items-center justify-center text-[10px] font-black group-hover:bg-transparent transition-all">
                  {{ student.name?.[0] }}
                </div>
              </div>
              <div class="flex flex-col">
                <span class="text-[11px] font-black uppercase tracking-wider group-hover:text-blue-400 transition-colors">{{ student.name }}</span>
                <span class="text-[8px] text-gray-600 font-bold uppercase tracking-widest">Active Member</span>
              </div>
            </div>
            <div v-if="!classroom?.students?.length" class="text-center py-4 text-[10px] uppercase opacity-30">Awaiting members...</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import api from '@/utils/api';

const route = useRoute();
const auth = useAuthStore();
const classroom = ref(null);
const progressData = ref([]);
const activeTab = ref('Feed');

// Role checks
const isFacilitator = computed(() => {
  return auth.user?.role !== 'player' || classroom.value?.created_by === auth.user?.id;
});

const availableTabs = computed(() => {
  const tabs = ['Feed', 'Modules', 'People'];
  if (isFacilitator.value) tabs.push('Progress');
  tabs.push('Settings');
  return tabs;
});

const fetchClassroomDetails = async () => {
    try {
        const classId = route.params.id;
        const res = await api.get(`/api/v1/classrooms/${classId}`); 
        classroom.value = res.data.classroom;
    } catch (err) { 
        console.error("Fetch Error:", err); 
    }
};

const fetchProgressReport = async () => {
    try {
        const classId = route.params.id;
        const res = await api.get(`/api/v1/classrooms/${classId}/progress`); 
        progressData.value = res.data.progress;
    } catch (err) { 
        console.error("Progress Fetch Error:", err); 
    }
};

// Auto-fetch progress if facilitator clicks the tab
watch(activeTab, (newTab) => {
  if (newTab === 'Progress' && isFacilitator.value) {
    fetchProgressReport();
  }
});

onMounted(() => {
  fetchClassroomDetails();
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }

.animate-in { animation: slideUp 0.6s ease-out forwards; }
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Glass table effect */
table {
  border-spacing: 0 8px;
  border-collapse: separate;
}
</style>