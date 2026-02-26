<template>
  <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-2">
    <div class="absolute inset-0 bg-[#020203]/95 backdrop-blur-2xl transition-opacity" @click="$emit('close')"></div>

    <div class="relative w-full max-w-7xl h-full max-h-[98vh] bg-[#060608] border border-white/10 rounded-[3.5rem] shadow-[0_0_120px_-20px_rgba(0,0,0,1)] overflow-hidden animate-in zoom-in duration-500 font-['Poppins'] flex flex-col text-white">
      
      <header class="px-12 py-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01] relative z-20">
        <div class="flex items-center gap-6">
            <div class="h-10 w-1.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)]"></div>
            <div class="space-y-1">
                <h2 class="text-3xl font-black italic uppercase tracking-tighter leading-none">
                    Create <span class="bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">Gamified Reviewer</span>
                </h2>
                <p class="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">Create a gamified quiz for your students</p>
            </div>
        </div>
        <button @click="$emit('close')" class="p-4 text-gray-600 hover:text-pink-500 transition-all text-4xl leading-none hover:rotate-90">&times;</button>
      </header>

      <div class="p-12 overflow-y-auto custom-scrollbar flex-1 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-pink-500/5 via-transparent to-blue-500/5">
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div class="space-y-3 group md:col-span-2">
            <label class="text-[11px] font-black uppercase tracking-[0.2em] text-blue-400/80 ml-1 group-focus-within:text-blue-400 transition-colors italic">GAME MODE</label>
            <div class="relative">
                <select v-model="form.quiz_type" 
                class="w-full px-8 py-5 rounded-[2rem] bg-[#0d0d12] border border-white/20 text-white text-base font-bold outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 appearance-none transition-all cursor-pointer shadow-2xl relative z-10">
                    <option value="time_attack" class="bg-[#0d0d12] text-white">Time Attack (Fast Paced)</option>
                    <option value="streak" class="bg-[#0d0d12] text-white">Streak Master (Multipliers)</option>
                    <option value="boss_battle" class="bg-[#0d0d12] text-white">Boss Battle (3 Lives)</option>
                </select>
                <div class="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none z-20 text-blue-500">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
          </div>
          
          <div class="space-y-3 group">
            <label class="text-[11px] font-black uppercase tracking-[0.2em] text-pink-400/80 ml-1 group-focus-within:text-pink-400 transition-colors italic">Time Limit (Sec/Q)</label>
            <input type="number" v-model="form.time_limit" 
              class="w-full px-8 py-5 rounded-[2rem] bg-[#0d0d12] border border-white/20 text-white text-base font-bold outline-none focus:ring-4 focus:ring-pink-500/30 focus:border-pink-500 transition-all shadow-2xl" />
          </div>
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div v-for="(q, index) in form.questions_data" :key="index" 
            class="p-[2px] rounded-[3rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-pink-600 shadow-2xl transition-all duration-500 hover:scale-[1.01]">
            
            <div class="bg-[#0b0b0f] rounded-[2.9rem] p-10 space-y-8 h-full">
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-4">
                        <span class="flex items-center justify-center w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black shadow-lg">#{{ index + 1 }}</span>
                        <span class="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">QUESTION</span>
                    </div>
                    <button @click="removeQuestion(index)" class="group flex items-center gap-2 text-[10px] font-black text-red-500/40 hover:text-red-500 uppercase tracking-widest transition-all">
                        <span class="opacity-0 group-hover:opacity-100 transition-opacity">Delete</span>
                        <div class="p-2 bg-red-500/5 rounded-lg border border-red-500/10">✕</div>
                    </button>
                </div>

                <div class="space-y-2">
                    <label class="text-[9px] font-black uppercase tracking-widest text-gray-600 ml-1 italic">Input Question</label>
                    <textarea v-model="q.question" rows="2" placeholder="Enter question..." 
                    class="w-full px-8 py-6 rounded-3xl bg-[#060608] border border-white/5 text-white text-lg font-medium outline-none focus:ring-2 focus:ring-blue-500/40 transition-all resize-none shadow-inner"></textarea>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div v-for="(opt, optIdx) in 4" :key="optIdx" 
                    class="relative flex items-center group/opt p-[1.5px] rounded-2xl bg-white/5 transition-all"
                    :class="{ 'bg-gradient-to-r from-pink-500/30 to-blue-500/30': q.correctAnswer === optIdx }">
                    <div class="flex items-center gap-4 w-full bg-[#0b0b0f] rounded-[0.9rem] px-6 py-5">
                        <input type="radio" :name="'correct-'+index" :value="optIdx" v-model="q.correctAnswer"
                        class="w-5 h-5 text-pink-600 bg-white/5 border-white/20 focus:ring-pink-500/50 cursor-pointer accent-pink-500" />
                        <input v-model="q.options[optIdx]" :placeholder="'Choice ' + (optIdx + 1)" 
                        class="w-full bg-transparent border-none text-gray-300 text-sm outline-none focus:text-white transition-all font-bold" />
                    </div>
                </div>
                </div>
            </div>
          </div>

          <button @click="addQuestion" 
            class="h-full min-h-[300px] border-4 border-dashed border-white/5 text-gray-700 hover:border-blue-500/30 hover:text-blue-500 hover:bg-blue-500/5 rounded-[3rem] transition-all flex flex-col items-center justify-center gap-4 group">
            <div class="w-20 h-20 rounded-full border-2 border-dashed border-current flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">+</div>
            <span class="text-sm font-black uppercase tracking-[0.5em]">Add Question</span>
          </button>
        </div>
      </div>

      <footer class="px-12 py-10 border-t border-white/5 flex justify-end gap-8 bg-white/[0.01] relative z-20">
        <button @click="$emit('close')" 
          class="px-12 py-5 text-[11px] font-black uppercase tracking-[0.4em] text-gray-600 hover:text-white transition-all">Cancel Process</button>
        <button @click="handleSave" 
          class="px-20 py-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600 text-white text-[11px] font-black uppercase tracking-[0.5em] rounded-[2.5rem] shadow-[0_20px_50px_-10px_rgba(59,130,246,0.5)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-500">
          Publish Quiz Game
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useQuizStore } from '@/stores/quiz';

const props = defineProps(['isOpen', 'moduleId']);
const emit = defineEmits(['close', 'saved']);
const quizStore = useQuizStore();

const form = reactive({
  module_id: props.moduleId,
  title: 'Module Reviewer',
  quiz_type: 'time_attack',
  time_limit: 30,
  questions_data: []
});

const addQuestion = () => {
  form.questions_data.push({ question: '', options: ['', '', '', ''], correctAnswer: 0 });
};

const removeQuestion = (index) => form.questions_data.splice(index, 1);

const handleSave = async () => {
  await quizStore.createQuiz({ ...form, module_id: props.moduleId });
  emit('saved');
  emit('close');
};
</script>

<style scoped>
/* Visibility Fixes */
select option {
    background-color: #0d0d12;
    color: white;
    padding: 20px;
    font-weight: bold;
}

.custom-scrollbar::-webkit-scrollbar { width: 8px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #060608; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.2); border-radius: 20px; border: 2px solid #060608; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ec4899; }

@keyframes zoomIn {
  from { opacity: 0; transform: scale(0.97) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.animate-in { animation: zoomIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

textarea::placeholder, input::placeholder {
    color: #374151;
    font-style: italic;
}
</style>