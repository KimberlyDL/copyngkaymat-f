<template>
  <div v-if="isOpen" class="fixed inset-0 z-[150] flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
    <div class="fixed inset-0 bg-slate-900/60 dark:bg-[#020203]/90 backdrop-blur-md transition-opacity" @click="$emit('close')"></div>

    <div class="relative w-full max-w-7xl bg-white dark:bg-[#060608] border border-slate-200 dark:border-white/10 rounded-[3rem] shadow-2xl overflow-hidden animate-in font-['Poppins'] flex flex-col max-h-[98vh] text-black dark:text-white">
      
      <header class="px-8 py-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-white/[0.01]">
        <div class="flex items-center gap-5">
            <div class="h-10 w-1 bg-purple-600 rounded-full"></div>
            <div class="space-y-0.5">
                <h2 class="text-xl font-black uppercase tracking-tighter italic leading-none">
                    Create <span class="text-purple-600">Quiz Game</span>
                </h2>
                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Set Assessment Parameters</p>
            </div>
        </div>
        <button @click="$emit('close')" class="p-2 text-slate-400 hover:text-purple-600 transition-all text-3xl leading-none">&times;</button>
      </header>

      <div class="p-8 md:p-10 overflow-y-auto custom-scrollbar flex-1 bg-white dark:bg-[#060608]">
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div class="space-y-2 md:col-span-2">
            <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1 italic">Mode Selection</label>
            <div class="relative">
                <select v-model="form.quiz_type" 
                class="w-full px-6 py-4 rounded-2xl bg-slate-100 dark:bg-[#0d0d12] border border-slate-200 dark:border-white/10 text-black dark:text-white text-xs font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-purple-500/30 appearance-none transition-all cursor-pointer shadow-inner">
                    <option value="time_attack">Time Attack</option>
                    <option value="streak">Streak Master</option>
                    <option value="boss_battle">Boss Battle</option>
                </select>
                <div class="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-purple-600 text-[10px]">▼</div>
            </div>
          </div>
          
          <div class="space-y-2">
            <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1 italic">Seconds Per Item</label>
            <input type="number" v-model="form.time_limit" 
              class="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-[#0d0d12] border border-slate-200 dark:border-white/10 text-black dark:text-white text-sm font-bold outline-none focus:ring-2 focus:ring-purple-500/30 transition-all shadow-inner" />
          </div>
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
          <div v-for="(q, index) in form.questions_data" :key="index" 
            class="group bg-white dark:bg-[#0d0d12] border border-slate-200 dark:border-white/10 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500">
            
            <div class="flex justify-between items-center mb-6">
                <div class="flex items-center gap-3">
                    <span class="flex items-center justify-center w-8 h-8 rounded-xl bg-purple-600/10 border border-purple-600/20 text-purple-600 text-[10px] font-black italic">#{{ index + 1 }}</span>
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Item Content</span>
                </div>
                <button @click="removeQuestion(index)" class="p-2.5 bg-slate-50 dark:bg-white/5 rounded-xl text-slate-300 hover:text-red-500 transition-all border border-slate-200 dark:border-white/10">
                    <XIcon class="w-4 h-4" />
                </button>
            </div>

            <div class="space-y-6">
                <div class="space-y-2">
                    <label class="text-[8px] font-black uppercase tracking-widest text-slate-400 ml-1">The Question</label>
                    <textarea v-model="q.question" rows="2" placeholder="Input specific question..." 
                    class="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-[#060608] border border-slate-200 dark:border-white/5 text-black dark:text-white text-sm font-medium outline-none focus:ring-2 focus:ring-purple-500/30 transition-all resize-none shadow-inner italic"></textarea>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div v-for="(opt, optIdx) in 4" :key="optIdx" 
                        class="flex items-center gap-3 px-4 py-3 bg-slate-100 dark:bg-[#0b0b0f] rounded-xl border border-slate-200 dark:border-white/5 transition-all"
                        :class="{ 'border-purple-600 bg-purple-500/5 dark:bg-purple-600/10': q.correctAnswer === optIdx }">
                        <input type="radio" :name="'correct-'+index" :value="optIdx" v-model="q.correctAnswer"
                            class="w-4 h-4 text-purple-600 bg-white dark:bg-white/5 border-slate-300 dark:border-white/20 focus:ring-purple-500 cursor-pointer accent-purple-600" />
                        <input v-model="q.options[optIdx]" :placeholder="'Choice ' + (optIdx + 1)" 
                            class="w-full bg-transparent border-none text-black dark:text-slate-300 text-[11px] font-bold outline-none focus:text-purple-600 transition-all" />
                    </div>
                </div>
            </div>
          </div>

          <button @click="addQuestion" 
            class="h-full min-h-[250px] border-2 border-dashed border-slate-200 dark:border-white/5 text-slate-300 dark:text-slate-700 hover:border-purple-500/30 hover:text-purple-600 hover:bg-purple-500/5 rounded-[2.5rem] transition-all flex flex-col items-center justify-center gap-4">
            <div class="w-12 h-12 rounded-full border-2 border-dashed border-current flex items-center justify-center text-xl">+</div>
            <span class="text-[10px] font-black uppercase tracking-widest italic">Add New Item</span>
          </button>
        </div>
      </div>

      <footer class="px-8 py-6 border-t border-slate-100 dark:border-white/5 flex justify-end gap-5 bg-slate-50 dark:bg-white/[0.01]">
        <button @click="$emit('close')" 
          class="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-black dark:hover:text-white transition-all italic">Dismiss</button>
        <button @click="handleSave" 
          class="btn-3d-purple px-16 py-4 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl active:scale-95 transition-all shadow-xl">
          Publish Unit Game
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useQuizStore } from '@/stores/quiz';
import { X as XIcon } from 'lucide-vue-next';

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
.custom-font-poppins { font-family: 'Poppins', sans-serif !important; }

.btn-3d-purple {
  background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
  box-shadow: 0 10px 20px -5px rgba(124, 58, 237, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.3);
}

@keyframes modalEntry {
    from { opacity: 0; transform: scale(0.98) translateY(20px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
}
.animate-in { animation: modalEntry 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(124, 58, 237, 0.2); border-radius: 10px; }

/* Fixed select option colors for Light Mode */
select option {
    background-color: white;
    color: black;
}
.dark select option {
    background-color: #060608;
    color: white;
}
</style>