<template>
  <div :class="['min-h-screen text-white p-4 md:p-6 flex flex-col items-center font-[\'Century_Gothic\',_sans-serif] selection:bg-pink-500/30 overflow-x-hidden transition-all duration-700 relative', themeContainerClass]">
    
    <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div :class="['absolute top-[10%] left-[-5%] w-[600px] h-[600px] rounded-full blur-[120px] animate-[pulse_8s_infinite] transition-all duration-1000', glowColor1]"></div>
        <div :class="['absolute bottom-[10%] right-[-5%] w-[700px] h-[700px] rounded-full blur-[150px] animate-[pulse_10s_infinite] delay-1000 transition-all duration-1000', glowColor2]"></div>
        
        <div v-if="quiz?.quiz_type === 'boss_battle'" class="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,#ef4444_0%,transparent_50%)] animate-pulse"></div>
        
        <div class="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
    </div>

    <div v-if="loading" class="mt-48 flex flex-col items-center gap-6 relative z-10">
      <div class="relative w-24 h-24 flex items-center justify-center">
        <div class="absolute inset-0 border-b-4 border-pink-500 rounded-full animate-spin"></div>
        <div class="absolute inset-4 border-t-4 border-blue-500 rounded-full animate-[spin_1.5s_linear_infinite] opacity-60"></div>
        <ZapIcon class="w-8 h-8 text-white animate-pulse" />
      </div>
      <p class="font-bold uppercase tracking-[0.8em] text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-400 animate-pulse text-xs">Initializing Link...</p>
    </div>
    
    <div v-else-if="quiz && currentQuestion" class="w-full max-w-6xl relative z-10 flex flex-col items-center">
      
      <div class="w-full flex items-center justify-between gap-4 mb-12 animate-fade-in">
        <button @click="triggerBack" 
            class="group flex items-center gap-3 py-2.5 px-6 bg-white/[0.03] border border-white/10 rounded-2xl hover:bg-red-500/20 hover:border-red-500/50 transition-all active:scale-95 shadow-lg">
            <ChevronLeftIcon class="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-transform group-hover:-translate-x-1" />
            <span class="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-white">Abort</span>
        </button>

        <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 px-4 py-1 rounded-full border border-white/10 bg-black/40 backdrop-blur-md text-[8px] font-black uppercase tracking-[0.4em] z-50">
           Current Mode: <span :class="modeTextColor">{{ quiz.quiz_type.replace('_', ' ') }}</span>
        </div>

        <div class="bg-[#0d0d12]/60 backdrop-blur-3xl border border-white/10 p-1.5 rounded-[2rem] flex items-center gap-2 shadow-2xl">
            
            <div v-if="quiz.quiz_type === 'time_attack'" class="flex items-center gap-4 pl-4 pr-3 py-2">
                <div class="relative w-12 h-12 flex items-center justify-center">
                    <svg class="absolute inset-0 w-full h-full -rotate-90">
                        <circle cx="24" cy="24" r="21" stroke="currentColor" stroke-width="2" fill="transparent" class="text-white/5" />
                        <circle cx="24" cy="24" r="21" stroke="currentColor" stroke-width="4" fill="transparent" 
                            :class="timeLeft < 10 ? 'text-red-500' : 'text-blue-500'" 
                            stroke-linecap="round"
                            :stroke-dasharray="131.9" 
                            :stroke-dashoffset="131.9 - (131.9 * (timeLeft / (quiz.time_limit || 30)))" 
                            class="transition-all duration-1000 ease-linear" />
                    </svg>
                    <ClockIcon :class="['w-5 h-5 relative z-10', timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-blue-400']" />
                </div>
                <div class="flex flex-col">
                    <span class="text-2xl font-bold italic tracking-tighter tabular-nums leading-none">{{ timeLeft }}s</span>
                    <span class="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-500">Rush</span>
                </div>
            </div>

            <div v-if="quiz.quiz_type === 'streak'" class="flex items-center gap-4 pl-4 pr-3 py-2">
                <div class="relative w-12 h-12 flex items-center justify-center bg-orange-500/10 rounded-full border border-orange-500/20">
                    <FlameIcon :class="['w-6 h-6', streakCount > 0 ? 'text-orange-500 animate-bounce' : 'text-gray-600']" />
                </div>
                <div class="flex flex-col">
                    <span class="text-2xl font-bold italic tracking-tighter tabular-nums leading-none text-orange-500">x{{ streakCount }}</span>
                    <span class="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-500">Streak</span>
                </div>
            </div>

            <div v-if="quiz.quiz_type === 'boss_battle'" class="flex items-center gap-4 pl-4 pr-3 py-2 min-w-[150px]">
                <div class="flex-1 flex flex-col gap-1">
                    <div class="flex justify-between text-[8px] font-black uppercase text-red-500 tracking-widest">
                        <span>Boss HP</span>
                        <span>{{ bossHP }}%</span>
                    </div>
                    <div class="h-2 w-full bg-red-950 rounded-full overflow-hidden border border-red-500/20">
                        <div class="h-full bg-gradient-to-r from-red-600 to-orange-500 transition-all duration-500" :style="{ width: bossHP + '%' }"></div>
                    </div>
                </div>
            </div>

            <div class="h-10 w-px bg-white/10 mx-2"></div>

            <div class="flex items-center gap-4 pr-8 pl-3 py-2 group/score">
                <div class="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                    <TrophyIcon class="w-5 h-5" />
                </div>
                <div class="flex flex-col">
                    <span class="text-2xl font-bold italic text-white leading-none">{{ score }}</span>
                    <span class="text-[8px] font-bold uppercase text-gray-500 tracking-[0.2em]">XP</span>
                </div>
            </div>
        </div>

        <div class="hidden lg:flex items-center gap-4 px-6 h-14 bg-white/[0.03] border border-white/10 rounded-2xl shadow-xl">
            <div :class="['w-10 h-10 rounded-xl flex items-center justify-center animate-pulse shadow-lg', modeIconBg]">
                <SwordIcon v-if="quiz.quiz_type === 'boss_battle'" class="w-6 h-6 text-white" />
                <ZapIcon v-else class="w-6 h-6 text-white" />
            </div>
            <span class="text-base font-bold uppercase tracking-wider text-white">Protect<span :class="modeTextColor">Ed</span></span>
        </div>
      </div>

      <transition name="quiz-slide" mode="out-in">
        <div :key="currentQuestionIndex" v-if="!isFinished" class="w-full flex flex-col items-center">
            
            <div :class="['w-full p-12 md:p-20 bg-gradient-to-b border rounded-[3rem] shadow-3xl relative overflow-hidden transition-all duration-500 group', themeCardClass, feedbackClass]">
                <div :class="['absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r animate-gradient-x', modeLineGradient]"></div>
                
                <div class="relative z-10 text-center">
                    <span class="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 mb-6 block">Encrypted Query Node // {{ currentQuestionIndex + 1 }}</span>
                    <h2 class="text-3xl md:text-5xl font-bold text-white leading-tight uppercase tracking-tighter max-w-4xl mx-auto drop-shadow-2xl italic">
                        "{{ currentQuestion.question }}"
                    </h2>
                </div>
            </div>

            <div class="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <button 
                    v-for="(option, index) in currentQuestion.options" 
                    :key="index"
                    @click="handleAnswerSelection(index)"
                    :disabled="selectedAnswer !== null"
                    :class="[
                        'group relative p-6 border rounded-[2rem] transition-all duration-300 text-left flex items-center gap-6 shadow-xl active:scale-95',
                        getOptionClass(index)
                    ]"
                >
                    <div :class="['w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-500 border-2', 
                        selectedAnswer === index ? 'bg-white border-white text-black' : 'bg-black/40 border-white/10 text-gray-500']">
                        {{ String.fromCharCode(65 + index) }}
                    </div>
                    <span class="font-bold text-sm uppercase tracking-wide flex-1">{{ option }}</span>
                </button>
            </div>
        </div>

        <div v-else class="w-full flex flex-col items-center animate-fade-in">
            <div class="w-full max-w-4xl p-16 bg-[#0d0d12] border border-white/10 rounded-[4rem] text-center relative overflow-hidden">
                <div class="absolute inset-0 opacity-10" :class="modeResultBg"></div>
                
                <h2 class="text-7xl font-black italic text-white uppercase tracking-tighter leading-none mb-4">
                    {{ resultTitle }}
                </h2>
                <p class="text-[10px] font-bold text-gray-500 uppercase tracking-[0.8em] mb-12 italic">Neural pathway successfully processed</p>
                
                <div class="text-[10rem] font-bold text-white tracking-tighter leading-none mb-12">
                    {{ score }}<span class="text-2xl text-pink-500 opacity-60 ml-2 italic">XP</span>
                </div>

                <div class="flex gap-4 justify-center">
                    <button @click="router.push({ name: 'user.modules' })" class="px-10 py-4 bg-white/5 border border-white/10 rounded-xl font-bold uppercase tracking-widest text-[10px]">Return</button>
                    <button @click="router.push({ name: 'leaderboard' })" :class="['px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-2xl', modeIconBg]">Rankings</button>
                </div>
            </div>
        </div>
      </transition>

      <Teleport to="body">
          <Transition name="fade">
              <div v-if="isBackModalOpen" class="fixed inset-0 z-[300] flex items-center justify-center p-6 backdrop-blur-xl">
                  <div class="absolute inset-0 bg-black/80" @click="resumeMission"></div>
                  <div class="relative bg-[#0d0d12] border border-white/10 rounded-[3rem] p-12 max-w-md w-full text-center">
                      <AlertTriangleIcon class="w-16 h-16 text-red-500 mx-auto mb-6" />
                      <h3 class="text-2xl font-bold uppercase italic text-white mb-8">Terminate Session?</h3>
                      <div class="flex flex-col gap-3">
                        <button @click="resumeMission" class="w-full py-4 bg-white/5 rounded-xl uppercase text-[10px] font-bold tracking-[0.3em]">No, Stay Connected</button>
                        <button @click="confirmExit" class="w-full py-4 bg-red-600 rounded-xl uppercase text-[10px] font-bold tracking-[0.3em]">Yes, Disconnect</button>
                      </div>
                  </div>
              </div>
          </Transition>
      </Teleport>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/utils/api';
import { 
    Clock as ClockIcon, Trophy as TrophyIcon, ChevronLeft as ChevronLeftIcon,
    Flame as FlameIcon, Sword as SwordIcon, Zap as ZapIcon, 
    AlertTriangle as AlertTriangleIcon
} from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const quiz = ref(null);
const loading = ref(true);
const currentQuestionIndex = ref(0);
const score = ref(0);
const timeLeft = ref(0);
const totalTimeTaken = ref(0); // Para sa tracking
const isFinished = ref(false);
const selectedAnswer = ref(null);
const feedbackClass = ref('');
const isBackModalOpen = ref(false);

const streakCount = ref(0);
const bossHP = ref(100);
let timer = null;

// --- DYNAMIC CLASSES ---
const themeContainerClass = computed(() => {
  if (quiz.value?.quiz_type === 'boss_battle') return 'selection:bg-red-500/30';
  if (quiz.value?.quiz_type === 'streak') return 'selection:bg-orange-500/30';
  return 'selection:bg-blue-500/30';
});

const themeCardClass = computed(() => {
  if (quiz.value?.quiz_type === 'boss_battle') return 'from-red-900/10 via-black to-black border-red-500/20';
  if (quiz.value?.quiz_type === 'streak') return 'from-orange-900/10 via-black to-black border-orange-500/20';
  return 'from-blue-900/10 via-black to-black border-blue-500/20';
});

const modeTextColor = computed(() => {
    if (quiz.value?.quiz_type === 'boss_battle') return 'text-red-500';
    if (quiz.value?.quiz_type === 'streak') return 'text-orange-500';
    return 'text-blue-400';
});

const modeIconBg = computed(() => {
    if (quiz.value?.quiz_type === 'boss_battle') return 'bg-red-600 shadow-red-900/40';
    if (quiz.value?.quiz_type === 'streak') return 'bg-orange-600 shadow-orange-900/40';
    return 'bg-blue-600 shadow-blue-900/40';
});

const modeResultBg = computed(() => {
    if (quiz.value?.quiz_type === 'boss_battle') return 'bg-red-900/20';
    if (quiz.value?.quiz_type === 'streak') return 'bg-orange-900/20';
    return 'bg-blue-900/20';
});

const glowColor1 = computed(() => {
    if (quiz.value?.quiz_type === 'boss_battle') return 'bg-red-600/10';
    if (quiz.value?.quiz_type === 'streak') return 'bg-orange-600/10';
    return 'bg-blue-600/10';
});

const glowColor2 = computed(() => {
    if (quiz.value?.quiz_type === 'boss_battle') return 'bg-orange-600/10';
    if (quiz.value?.quiz_type === 'streak') return 'bg-red-600/10';
    return 'bg-pink-600/10';
});

const modeLineGradient = computed(() => {
    if (quiz.value?.quiz_type === 'boss_battle') return 'from-red-600 via-orange-500 to-red-600';
    if (quiz.value?.quiz_type === 'streak') return 'from-orange-600 via-yellow-500 to-orange-600';
    return 'from-blue-600 via-pink-500 to-blue-600';
});

// LOGIC HELPERS
const currentQuestion = computed(() => quiz.value?.questions_data?.[currentQuestionIndex.value] || null);

const resultTitle = computed(() => {
    if (bossHP.value <= 0) return 'BOSS DEFEATED';
    if (score.value > (quiz.value?.questions_data?.length * 5)) return 'ELITE SYNC';
    return 'LINK TERMINATED';
});

const startTimer = () => {
  if (timer) clearInterval(timer);
  timeLeft.value = quiz.value?.time_limit || 30;
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
        timeLeft.value--;
        totalTimeTaken.value++;
    } else {
        handleAnswerSelection(-1); 
    }
  }, 1000);
};

const handleAnswerSelection = (index) => {
  if (selectedAnswer.value !== null) return;
  if (timer) clearInterval(timer);
  selectedAnswer.value = index;

  const isCorrect = index === currentQuestion.value.correctAnswer;
  
  if (isCorrect) {
    feedbackClass.value = 'correct-pulse';
    if (quiz.value.quiz_type === 'streak') {
        streakCount.value++;
        score.value += (quiz.value.points_per_question || 10) + (streakCount.value * 2);
    } else if (quiz.value.quiz_type === 'boss_battle') {
        const damage = 100 / quiz.value.questions_data.length;
        bossHP.value = Math.max(0, bossHP.value - damage);
        score.value += (quiz.value.points_per_question || 10);
    } else {
        score.value += (quiz.value.points_per_question || 10);
    }
  } else {
    feedbackClass.value = 'wrong-shake';
    streakCount.value = 0;
  }

  setTimeout(() => {
    selectedAnswer.value = null;
    feedbackClass.value = '';
    if (currentQuestionIndex.value < quiz.value.questions_data.length - 1) {
      currentQuestionIndex.value++;
      startTimer();
    } else {
      finishQuiz();
    }
  }, 1500);
};

const getOptionClass = (index) => {
    if (selectedAnswer.value === null) return 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.05]';
    if (index === currentQuestion.value.correctAnswer) return 'bg-emerald-500/20 border-emerald-500 text-emerald-400 scale-[1.02] z-10';
    if (selectedAnswer.value === index) return 'bg-red-500/20 border-red-500 text-red-500';
    return 'opacity-20 pointer-events-none scale-95';
};

const finishQuiz = async () => {
    isFinished.value = true;
    if (timer) clearInterval(timer);
    
    const payload = {
        pointsEarned: score.value,
        correctCount: score.value / (quiz.value.points_per_question || 10),
        totalQuestions: quiz.value.questions_data.length,
        timeTaken: totalTimeTaken.value 
    };

    try {
        await api.post(`/api/v1/quizzes/${quiz.value.id}/submit`, payload);
    } catch (err) {
        console.error("Submit failed", err.response?.data || err.message);
    }
};

const triggerBack = () => { if (timer) clearInterval(timer); isBackModalOpen.value = true; };
const resumeMission = () => { isBackModalOpen.value = false; startTimer(); };
const confirmExit = () => { router.push({ name: 'user.modules' }); };

onMounted(async () => {
    try {
        const res = await api.get(`/api/v1/quizzes/${route.params.id}`);
        quiz.value = res.data.quiz;
        loading.value = false;
        startTimer();
    } catch (err) { loading.value = false; }
});

onUnmounted(() => clearInterval(timer));
</script>

<style scoped>
.animate-gradient-x { background-size: 200% 200%; animation: gradient 10s ease infinite; }
@keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
.correct-pulse { animation: pulse-green 0.5s ease-in-out; }
@keyframes pulse-green { 0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); } 70% { box-shadow: 0 0 0 20px rgba(16, 185, 129, 0); } 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }
.wrong-shake { animation: shake 0.4s ease-in-out; }
@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>