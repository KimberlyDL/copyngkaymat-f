<template>
  <div class="space-y-10 custom-font-poppins animate-in text-slate-900 dark:text-white transition-all selection:bg-purple-500/30">
    
    <header class="flex flex-col lg:flex-row justify-between items-center gap-8 bg-white/70 dark:bg-[#0d0d15]/60 backdrop-blur-3xl border border-slate-200 dark:border-white/5 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden transition-all duration-500">
        <div class="absolute -right-20 -top-20 w-64 h-64 bg-purple-600/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div class="relative z-10 space-y-2 text-center lg:text-left">
            <div class="flex items-center justify-center lg:justify-start gap-3 mb-1">
                <div class="h-1 w-10 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-full shadow-[0_2px_10px_rgba(139,92,246,0.4)]"></div>
                <span class="text-[10px] font-[900] uppercase tracking-[0.4em] text-purple-600 dark:text-purple-400 italic">Academy Hub</span>
            </div>
            <h1 class="text-4xl md:text-5xl font-[900] tracking-tighter uppercase italic leading-none">
                My <span class="bg-gradient-to-r from-purple-600 to-fuchsia-400 bg-clip-text text-transparent italic">Classrooms</span>
            </h1>
            <p class="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest italic">Authorized synchronization nodes for institutional learning.</p>
        </div>

        <button 
            @click="isFacilitator ? showCreateModal = true : showJoinModal = true"
            class="group relative flex items-center gap-5 px-12 py-5 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-[11px] font-[900] uppercase tracking-[0.2em] rounded-full transition-all duration-500 hover:scale-[1.03] active:scale-[0.97] overflow-hidden shadow-[0_15px_30px_-10px_rgba(124,58,237,0.5),inset_0_2px_4px_rgba(255,255,255,0.3)] italic"
        >
            <PlusIcon class="w-5 h-5 relative z-10 group-hover:rotate-90 transition-transform duration-500" />
            <span class="relative z-10">{{ isFacilitator ? 'Establish Classroom' : 'Link to Classroom' }}</span>
        </button>
    </header>

    <div v-if="classroomStore.loading" class="flex flex-col items-center justify-center py-48">
        <div class="relative h-16 w-16">
            <div class="absolute inset-0 border-4 border-purple-500/10 rounded-full"></div>
            <div class="absolute inset-0 border-4 border-t-purple-600 rounded-full animate-spin"></div>
        </div>
        <p class="mt-6 text-[10px] font-black uppercase tracking-[0.4em] text-purple-500 animate-pulse italic">Synchronizing Data...</p>
    </div>

    <div v-else-if="classroomStore.classrooms.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in">
        <div v-for="classroom in classroomStore.classrooms" :key="classroom.id" 
             @click="enterClassroom(classroom.id)"
             class="group relative bg-white/80 dark:bg-[#0d0d12]/80 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-7 transition-all duration-500 cursor-pointer shadow-lg hover:shadow-2xl hover:border-purple-600/40 hover:-translate-y-2 overflow-hidden"
        >
            <div class="flex items-center gap-5 mb-8">
                <div class="p-4 rounded-[1.5rem] bg-purple-500/10 border border-purple-500/10 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500 shadow-inner">
                    <SchoolIcon class="w-6 h-6 text-purple-600 group-hover:text-white" />
                </div>
                <div class="flex flex-col min-w-0">
                    <h3 class="text-xl font-[900] uppercase italic tracking-tighter text-slate-900 dark:text-slate-100 group-hover:text-purple-600 transition-colors truncate leading-none mb-1.5">
                        {{ classroom.name }}
                    </h3>
                    <p class="text-[9px] font-black text-slate-400 dark:text-gray-600 uppercase tracking-[0.3em] leading-none italic">Class Node // ACTIVE</p>
                </div>
            </div>

            <div class="flex flex-col gap-2 relative z-10">
                <p class="text-[9px] font-[900] text-slate-400 dark:text-gray-600 uppercase tracking-widest italic">Registry Credentials</p>
                <div class="h-12 px-5 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-between border border-slate-100 dark:border-white/5 group-hover:border-purple-500/30 transition-all shadow-inner">
                    <span class="text-[11px] font-[900] text-purple-600 dark:text-purple-400 italic tracking-tight uppercase">
                        {{ isFacilitator ? classroom.join_code : (classroom.facilitator?.name || 'Authorized Faculty') }}
                    </span>
                    <ArrowRightIcon class="w-4 h-4 text-purple-600/20 group-hover:translate-x-1 group-hover:text-purple-600 transition-all" />
                </div>
            </div>

            <div class="absolute inset-0 bg-gradient-to-tr from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
    </div>

    <div v-else class="py-40 text-center rounded-[3.5rem] border-2 border-dashed border-slate-200 dark:border-white/5 mt-10 bg-slate-50/50 dark:bg-transparent">
        <div class="inline-flex p-6 bg-slate-100 dark:bg-white/5 rounded-full mb-6">
            <SchoolIcon class="w-10 h-10 text-slate-300 dark:text-gray-700" />
        </div>
        <h3 class="text-[11px] font-[900] text-slate-400 dark:text-gray-700 uppercase tracking-[0.5em] italic">No classrooms added to registry.</h3>
        <p class="mt-2 text-[9px] font-black text-slate-300 dark:text-gray-800 uppercase tracking-widest italic">Waiting for initial deployment...</p>
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
import { ArrowRight as ArrowRightIcon, School as SchoolIcon, Plus as PlusIcon } from 'lucide-vue-next';
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
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700;1,900&display=swap');

.custom-font-poppins { font-family: 'Poppins', sans-serif !important; }

/* Entry Animation */
.animate-in { 
    animation: hubEntry 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
}

@keyframes hubEntry {
    from { 
        opacity: 0; 
        transform: translateY(30px) scale(0.98); 
        filter: blur(10px);
    }
    to { 
        opacity: 1; 
        transform: translateY(0) scale(1); 
        filter: blur(0);
    }
}
</style>