<template>
    <div class="classroom-dashboard-container">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
      <div class="relative pl-4">
        <div class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-pink-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
        <h1 class="text-4xl font-black uppercase tracking-tighter leading-none">
          My <span class="bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent italic">Classrooms</span>
        </h1>
        <p class="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mt-2">Registry Hub // {{ isFacilitator ? 'Facilitator' : 'Student' }}</p>
      </div>
      
      <button 
        @click="isFacilitator ? showCreateModal = true : showJoinModal = true"
        class="group relative px-10 py-4 bg-white/[0.03] border border-white/10 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] overflow-hidden transition-all hover:scale-105 active:scale-95 hover:border-blue-500/50"
      >
        <span class="relative z-10 flex items-center gap-3">
            <span class="w-5 h-5 rounded-lg bg-gradient-to-br from-blue-500 to-pink-500 flex items-center justify-center text-white text-xs">+</span>
            {{ isFacilitator ? 'Create New Class' : 'Join with Code' }}
        </span>
      </button>
    </div>

    <div v-if="classroomStore.loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-pink-500"></div>
    </div>

    <div v-else-if="classroomStore.classrooms.length > 0" class="space-y-2">
        <div v-for="classroom in classroomStore.classrooms" :key="classroom.id" 
             @click="enterClassroom(classroom.id)"
             class="group relative flex flex-col md:flex-row items-center gap-6 p-6 rounded-[2rem] hover:bg-white/[0.03] transition-all duration-500 cursor-pointer overflow-hidden border border-transparent hover:border-white/5"
        >
            <div class="relative flex-shrink-0">
                <div class="w-14 h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center group-hover:bg-blue-500/10 transition-all duration-500">
                    <SchoolIcon class="w-6 h-6 text-gray-500 group-hover:text-blue-400 transition-colors" />
                </div>
                <div class="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-4 border-[#060608] shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
            </div>

            <div class="flex-1 min-w-0">
                <div class="flex flex-col md:flex-row md:items-center gap-3 mb-1">
                    <h3 class="text-xl font-black uppercase italic tracking-tight text-gray-300 group-hover:text-white transition-colors truncate">
                        {{ classroom.name }}
                    </h3>
                    <span class="text-[9px] font-black uppercase tracking-widest text-blue-500/60 bg-blue-500/5 px-2 py-0.5 rounded border border-blue-500/10">
                        {{ isFacilitator ? 'Code: ' + classroom.join_code : (classroom.facilitator?.name || 'Instructor') }}
                    </span>
                </div>
                <p class="text-[11px] text-gray-600 uppercase tracking-widest line-clamp-1 font-bold">
                    {{ classroom.description || 'Secure Environment Node' }}
                </p>
                
                <div class="mt-4 h-[1px] w-full bg-white/5 relative overflow-hidden">
                    <div class="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-pink-500 w-full translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700"></div>
                </div>
            </div>

            <div class="flex items-center gap-6">
                <div class="hidden md:flex flex-col items-end opacity-40 group-hover:opacity-100 transition-opacity">
                    <span class="text-[8px] font-black text-gray-500 uppercase tracking-widest leading-none">Registry</span>
                    <span class="text-[10px] font-black text-blue-400 uppercase italic tracking-tighter mt-1">Authorized</span>
                </div>
                <div class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-pink-600 transition-all duration-500">
                    <ArrowRightIcon class="w-4 h-4 text-gray-500 group-hover:text-white" />
                </div>
            </div>
        </div>
    </div>

    <div v-else class="py-20 text-center border-t border-dashed border-white/5 mt-10">
        <p class="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em]">No active nodes found in the registry.</p>
    </div>

    <CreateClassroomModal v-if="showCreateModal" @close="showCreateModal = false" @created="handleCreated" />
    <JoinClassroomModal v-if="showJoinModal" @close="showJoinModal = false" @join="handleJoin" />
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useClassroomStore } from '@/stores/classroom';
import { ArrowRight as ArrowRightIcon, School as SchoolIcon } from 'lucide-vue-next';
import CreateClassroomModal from '@/components/classrooms/CreateClassroomModal.vue';
import JoinClassroomModal from '@/components/classrooms/JoinClassroomModal.vue';

const router = useRouter();
const authStore = useAuthStore();
const classroomStore = useClassroomStore();

const showCreateModal = ref(false);
const showJoinModal = ref(false);

const isFacilitator = computed(() => ['admin', 'educator', 'moderator'].includes(authStore.user?.role));

onMounted(async () => {
    await classroomStore.fetchMyClassrooms();
});

const handleCreated = async (formData) => {
    try {
        await classroomStore.createClassroom(formData);
        showCreateModal.value = false;
    } catch (error) { console.error(error); }
};

const handleJoin = async (code) => {
    try {
        await classroomStore.joinClassroom(code);
        showJoinModal.value = false;
    } catch (error) { console.error(error); }
};

const enterClassroom = (id) => {
    const routeName = isFacilitator.value ? 'facilitator.classrooms.show' : 'classrooms.show';
    router.push({ name: routeName, params: { id } });
};
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
</style>