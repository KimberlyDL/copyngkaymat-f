<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" @click="close"></div>

      <!-- Modal Content -->
      <div class="relative w-full max-w-6xl max-h-[90vh] bg-white dark:bg-[#04020a] rounded-[3rem] border-2 border-slate-200 dark:border-white/20 shadow-[0_0_100px_rgba(107,33,168,0.2)] overflow-hidden flex flex-col animate-modal-in">
        
        <!-- Animated Background Orbs (Inside Modal) -->
        <div class="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-fuchsia-600/10 rounded-full blur-[80px] pointer-events-none"></div>

        <!-- Header -->
        <div class="relative z-10 flex items-center justify-between px-8 py-6 border-b-2 border-slate-100 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-xl">
          <div class="flex items-center gap-4">
            <div class="p-2.5 rounded-xl liquid-gem-logo shadow-xl border border-white/20">
              <Trophy class="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 class="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic leading-none"><span class="text-purple-600 italic">Leaderboards</span></h2>
              <p class="text-[9px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-[0.4em] italic mt-1">Class Rankings</p>
            </div>
          </div>
          
          <button @click="close" class="group p-3 rounded-xl bg-slate-100 dark:bg-white/5 border-2 border-slate-200 dark:border-white/10 hover:border-purple-500 transition-all">
            <X class="w-5 h-5 text-slate-400 group-hover:text-purple-500 transition-colors" />
          </button>
        </div>

        <!-- Body (Scrollable) -->
        <div class="relative z-10 flex-1 overflow-y-auto hide-scrollbar p-6 lg:p-8">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                <!-- Leaderboard Table Area -->
                <div class="lg:col-span-8">
                    <div v-if="loading" class="py-24 text-center">
                        <div class="relative h-10 w-10 text-purple-600 mx-auto mb-4 scale-125">
                            <div class="absolute inset-0 rounded-full border-2 border-current opacity-10"></div>
                            <div class="absolute inset-0 rounded-full border-2 border-t-transparent animate-spin"></div>
                        </div>
                        <p class="text-[9px] font-[900] uppercase tracking-[0.4em] text-purple-500 italic">Finding Scores...</p>
                    </div>
                    
                    <div v-else class="space-y-3">
                        <div v-for="(learner, index) in learners" :key="learner.id"
                            @click="selectedStudent = learner"
                            class="group relative flex items-center gap-4 p-4 rounded-[2rem] bg-white/60 dark:bg-white/[0.03] border-2 border-transparent hover:border-purple-500/30 hover:bg-white/80 dark:hover:bg-white/5 transition-all duration-500 cursor-pointer shadow-sm hover:shadow-xl"
                            :class="{'border-purple-500/40 bg-white/90 dark:bg-white/10': selectedStudent?.id === learner.id}">
                            
                            <!-- Rank Number -->
                            <div class="flex-shrink-0 w-12 text-center flex justify-center items-center">
                                <span v-if="index < 3" class="transform group-hover:scale-110 transition-transform duration-500">
                                    <div v-if="index === 0" class="p-1.5 bg-yellow-400/10 rounded-lg border border-yellow-400/20">
                                        <Trophy class="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    </div>
                                    <div v-else-if="index === 1" class="p-1.5 bg-slate-300/10 rounded-lg border border-slate-300/20">
                                        <Medal class="w-4 h-4 text-slate-400 fill-slate-300" />
                                    </div>
                                    <div v-else class="p-1.5 bg-amber-700/10 rounded-lg border border-amber-700/20">
                                        <Medal class="w-4 h-4 text-amber-700 fill-amber-700" />
                                    </div>
                                </span>
                                <span v-else class="text-sm font-black text-slate-300 dark:text-gray-700 italic">#{{ index + 1 }}</span>
                            </div>

                            <!-- Student Info -->
                            <div class="flex-1 flex items-center gap-4">
                                <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center text-white text-sm font-black shadow-lg uppercase">
                                    {{ learner.initials || learner.name?.charAt(0) }}
                                </div>
                                <div class="space-y-0.5">
                                    <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight italic">{{ learner.name }}</h3>
                                    <span class="px-2 py-0.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-md text-[8px] font-black uppercase tracking-widest italic">Lvl {{ learner.level }}</span>
                                </div>
                            </div>

                            <!-- Score -->
                            <div class="text-right flex-shrink-0 px-3">
                                <p class="text-lg font-black text-purple-600 dark:text-fuchsia-400 italic tabular-nums leading-none">{{ learner.points?.toLocaleString() }}</p>
                                <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1 text-center">XP</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sidebar Details -->
                <div class="lg:col-span-4 lg:sticky lg:top-0">
                    <div class="bg-white/80 dark:bg-[#0d0d15] border-2 border-slate-200 dark:border-white/20 p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden h-full min-h-[350px]">
                        <div v-if="selectedStudent" class="space-y-6 relative z-10 animate-fade-in">
                            <div class="text-center space-y-3">
                                <div class="relative inline-block mt-2">
                                    <div class="absolute -inset-2 bg-gradient-to-tr from-purple-600 to-fuchsia-600 rounded-2xl blur opacity-30"></div>
                                    <div class="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-700 to-fuchsia-800 flex items-center justify-center text-white text-2xl font-black shadow-2xl uppercase">
                                        {{ selectedStudent.initials || selectedStudent.name?.charAt(0) }}
                                    </div>
                                </div>
                                <h2 class="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">{{ selectedStudent.name }}</h2>
                            </div>

                            <div class="grid grid-cols-2 gap-3">
                                <div class="p-4 rounded-[2rem] bg-slate-50 dark:bg-white/[0.03] border-2 border-slate-100 dark:border-white/5 text-center shadow-inner">
                                    <p class="text-lg font-black text-purple-600 italic">#{{ getRank(selectedStudent) }}</p>
                                    <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Rank</p>
                                </div>
                                <div class="p-4 rounded-[2rem] bg-slate-50 dark:bg-white/[0.03] border-2 border-slate-100 dark:border-white/5 text-center shadow-inner">
                                    <p class="text-lg font-black text-fuchsia-600 italic">{{ selectedStudent.points }}</p>
                                    <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Total XP</p>
                                </div>
                            </div>

                            <div class="space-y-3">
                                <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] text-center italic">Top Skills</p>
                                <div class="flex flex-wrap gap-2 justify-center">
                                    <span v-for="skill in ['Fast Reader', 'Quiz Master', 'Top Learner']" :key="skill"
                                        class="px-4 py-2 bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[8px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-tight italic">
                                        {{ skill }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div v-else class="h-full min-h-[300px] flex flex-col items-center justify-center text-center space-y-4">
                            <div class="p-5 rounded-[2.5rem] bg-slate-50 dark:bg-white/5 border-2 border-slate-100 dark:border-white/10 shadow-inner">
                                <MousePointer2 class="w-8 h-8 text-slate-300 dark:text-gray-700 animate-bounce" />
                            </div>
                            <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] italic px-8">Select a student name to see their card!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="relative z-10 px-8 py-5 border-t-2 border-slate-100 dark:border-white/10 bg-white/50 dark:bg-white/5 text-center">
            <p class="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em] italic">Stay Kind // Study Hard // Reach the Top</p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Trophy, X, MousePointer2, Medal } from 'lucide-vue-next'
import api from '@/utils/api'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close'])

const learners = ref([])
const selectedStudent = ref(null)
const loading = ref(true)

const close = () => {
  emit('close')
}

import { watch } from 'vue'
watch(() => props.isOpen, (newVal) => {
  if (newVal) fetchLeaderboard()
})

const getRank = (student) => {
    const index = learners.value.findIndex(l => l.id === student.id)
    return index !== -1 ? index + 1 : '?'
}

const fetchLeaderboard = async () => {
    loading.value = true
    try {
        const res = await api.get('/api/v1/quizzes/gamification/leaderboard')
        if (res.data?.learners) {
            learners.value = res.data.learners
            if (learners.value.length > 0) selectedStudent.value = learners.value[0]
        }
    } catch (error) {
        console.error('Failed to load leaderboard modal:', error)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchLeaderboard()
})
</script>

<style scoped>
.liquid-gem-logo {
    background: radial-gradient(circle at 35% 35%, #a855f7 0%, #6b21a8 55%, #2e1065 100%);
    box-shadow: inset -5px -5px 12px rgba(0,0,0,0.5), inset 5px 5px 10px rgba(255,255,255,0.3);
}

.animate-modal-in {
  animation: modalIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes modalIn {
  from { opacity: 0; transform: translateY(40px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.modal-enter-active, .modal-leave-active { transition: opacity 0.4s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.animate-fade-in { animation: fadeIn 0.4s ease forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>