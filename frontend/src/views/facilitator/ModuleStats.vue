<template>
  <div class="p-8 space-y-8 bg-[#020203] min-h-screen text-white font-['Poppins']">
    <div class="flex items-center justify-between">
      <div>
        <button @click="$router.back()" class="text-gray-500 hover:text-white transition-colors flex items-center gap-2 mb-4 group">
          <ArrowLeftIcon size="16" class="group-hover:-translate-x-1 transition-transform" />
          <span class="text-[10px] font-black uppercase tracking-widest">Back to Dashboard</span>
        </button>
        <h1 class="text-3xl font-black uppercase tracking-tighter italic">Module Engagement Details</h1>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <div v-else-if="error" class="bg-red-500/10 border border-red-500/20 p-6 rounded-[2rem] text-center">
      <p class="text-red-400 font-bold">{{ error }}</p>
      <button @click="fetchStats" class="mt-4 text-xs underline uppercase tracking-widest">Try Again</button>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="bg-[#0d0d12] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
        <div class="p-6 border-b border-white/5 flex items-center gap-3">
          <div class="p-2 bg-blue-500/10 rounded-xl text-blue-400">
            <EyeIcon size="20" />
          </div>
          <h2 class="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Content Viewers ({{ stats.viewers.length }})</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-white">
            <thead>
              <tr class="bg-white/[0.02]">
                <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Student Name</th>
                <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Last Accessed</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr v-for="viewer in stats.viewers" :key="viewer.id" class="hover:bg-white/[0.02] transition-colors">
                <td class="px-6 py-4">
                  <div class="flex flex-col">
                    <span class="font-bold text-sm">{{ viewer.user?.first_name }} {{ viewer.user?.last_name }}</span>
                    <span class="text-[10px] text-gray-500">{{ viewer.user?.email }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 text-xs text-gray-400">{{ formatDate(viewer.viewed_at || viewer.created_at) }}</td>
              </tr>
              <tr v-if="stats.viewers.length === 0">
                <td colspan="2" class="px-6 py-10 text-center text-xs text-gray-600 italic">No one has viewed this module yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="bg-[#0d0d12] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
        <div class="p-6 border-b border-white/5 flex items-center gap-3">
          <div class="p-2 bg-pink-500/10 rounded-xl text-pink-400">
            <ClipboardCheckIcon size="20" />
          </div>
          <h2 class="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Quiz Participants ({{ stats.takers.length }})</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-white">
            <thead>
              <tr class="bg-white/[0.02]">
                <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Student Name</th>
                <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Score / Time</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr v-for="taker in stats.takers" :key="taker.id" class="hover:bg-white/[0.02] transition-colors">
                <td class="px-6 py-4">
                  <div class="flex flex-col">
                    <span class="font-bold text-sm">{{ taker.user?.first_name }} {{ taker.user?.last_name }}</span>
                    <span class="text-[10px] text-gray-500">{{ taker.user?.email }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 text-xs text-gray-400">
                  <div class="flex flex-col">
                    <span class="font-bold text-emerald-400">{{ taker.score }} / {{ taker.total_questions }}</span>
                    <span>{{ formatDate(taker.created_at) }}</span>
                  </div>
                </td>
              </tr>
              <tr v-if="stats.takers.length === 0">
                <td colspan="2" class="px-6 py-10 text-center text-xs text-gray-600 italic">No quiz submissions yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/utils/api';
import { Eye as EyeIcon, ClipboardCheck as ClipboardCheckIcon, ArrowLeft as ArrowLeftIcon } from 'lucide-vue-next';

const route = useRoute();
const loading = ref(true);
const error = ref(null);
const stats = ref({ viewers: [], takers: [] });

const fetchStats = async () => {
  loading.value = true;
  error.value = null;
  try {
    const { data } = await api.get(`/api/v1/modules/facilitator/module-stats/${route.params.id}`);
    // Inaasahan ang backend response na may { success: true, viewers: [], takers: [] }
    if (data.success) {
      stats.value = {
        viewers: data.viewers || [],
        takers: data.takers || []
      };
    } else {
      error.value = data.message || "Failed to load data";
    }
  } catch (err) {
    console.error("Failed to load engagement stats:", err);
    error.value = err.response?.data?.message || "Connection Error: Could not reach the server.";
  } finally {
    loading.value = false;
  }
};

const formatDate = (date) => {
  if (!date) return '---';
  return new Date(date).toLocaleString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

onMounted(fetchStats);
</script>