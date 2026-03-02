<template>
  <div 
    class="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-slate-900/60 dark:bg-[#020203]/90 backdrop-blur-md transition-all duration-500" 
    @click.self="$emit('close')"
  >
    <div 
      class="relative bg-white dark:bg-[#0d0d12] p-8 md:p-10 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_80px_rgba(0,0,0,0.8)] max-w-lg w-full max-h-[90vh] flex flex-col transition-all duration-500 animate-in"
    >
      
      <div class="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/5 dark:bg-purple-600/15 rounded-full blur-[100px] pointer-events-none"></div>
      <div class="absolute -bottom-24 -right-24 w-48 h-48 bg-fuchsia-600/5 dark:bg-fuchsia-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div class="relative z-10 mb-10 shrink-0 text-center md:text-left">
        <div class="flex items-center justify-center md:justify-start gap-2.5 mb-3">
            <div class="h-1 w-8 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-full shadow-[0_2px_10px_rgba(139,92,246,0.4)]"></div>
            <span class="text-[10px] font-black uppercase tracking-[0.3em] text-purple-600 dark:text-purple-400 italic">Registry Deployment</span>
        </div>
        <h2 class="text-3xl font-[900] uppercase italic tracking-tighter text-slate-900 dark:text-white leading-none">
          Establish <span class="bg-gradient-to-r from-purple-600 to-fuchsia-500 bg-clip-text text-transparent italic">Classroom</span>
        </h2>
      </div>

      <form @submit.prevent="handleSubmit" class="relative z-10 space-y-8 overflow-y-auto custom-scrollbar pr-1">
        <div class="space-y-2 group">
          <label class="text-[10px] font-[900] uppercase tracking-widest text-slate-400 dark:text-gray-500 group-focus-within:text-purple-600 transition-colors italic">Classroom Designation</label>
          <input 
            v-model="form.name"
            type="text"
            required
            placeholder="EX: GRADE 10 - CYBERSECURITY"
            class="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-gray-700 outline-none focus:border-purple-500/50 focus:bg-white dark:focus:bg-white/[0.05] transition-all shadow-inner uppercase tracking-wider"
          />
        </div>

        <div class="space-y-2 group">
          <label class="text-[10px] font-[900] uppercase tracking-widest text-slate-400 dark:text-gray-500 group-focus-within:text-purple-600 transition-colors italic">Operational Brief</label>
          <textarea 
            v-model="form.description"
            rows="3"
            placeholder="Enter classroom objectives..."
            class="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-gray-700 outline-none focus:border-purple-500/50 focus:bg-white dark:focus:bg-white/[0.05] transition-all resize-none shadow-inner uppercase tracking-wider leading-relaxed"
          ></textarea>
        </div>

        <div class="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/10 flex items-start gap-3 shadow-inner">
          <div class="p-2 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400">
            <InfoIcon class="w-4 h-4" />
          </div>
          <p class="text-[9px] font-black text-purple-600/80 dark:text-purple-400/80 uppercase tracking-widest leading-relaxed italic">
            Note: System will auto-generate a unique 6-character access code upon successful deployment.
          </p>
        </div>
      </form>

      <div class="grid grid-cols-2 gap-4 pt-8 shrink-0 relative z-10">
        <button 
          type="button" 
          @click="$emit('close')"
          class="px-6 py-4 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-[10px] font-[900] uppercase tracking-widest text-slate-500 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-white/10 transition-all italic"
        >
          Abort
        </button>
        <button 
          @click="handleSubmit"
          type="submit"
          :disabled="loading"
          class="group relative px-6 py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-2xl text-[10px] font-[900] uppercase tracking-widest text-white overflow-hidden shadow-[0_10px_20px_-5px_rgba(124,58,237,0.4)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 italic"
        >
          <span class="relative z-10 flex items-center justify-center gap-2">
            {{ loading ? 'Processing...' : 'Deploy Classroom' }}
            <ZapIcon v-if="!loading" class="w-3.5 h-3.5 animate-pulse fill-current" />
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Info as InfoIcon, Zap as ZapIcon } from 'lucide-vue-next';

const emit = defineEmits(['close', 'created']);
const props = defineProps({ loading: Boolean });

const form = ref({
  name: '',
  description: ''
});

const handleSubmit = () => {
  if (form.value.name?.trim()) {
    emit('created', { ...form.value });
  }
};
</script>

<style scoped>
input, textarea, button {
  font-family: 'Poppins', sans-serif !important;
}

.animate-in {
    animation: modalEntry 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes modalEntry {
    from { 
      opacity: 0; 
      transform: scale(0.97) translateY(20px);
      filter: blur(4px);
    }
    to { 
      opacity: 1; 
      transform: scale(1) translateY(0);
      filter: blur(0);
    }
}

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { 
  background: rgba(124, 58, 237, 0.2); 
  border-radius: 10px; 
}

::placeholder {
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-size: 10px;
  font-weight: 800;
}
</style>