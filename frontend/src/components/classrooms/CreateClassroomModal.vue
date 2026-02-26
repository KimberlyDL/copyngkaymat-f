<template>
  <div class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#020203]/90 backdrop-blur-md" @click.self="$emit('close')">
    <div class="relative bg-[#0d0d12] p-10 rounded-[2.5rem] border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,1)] max-w-lg w-full overflow-hidden transition-all duration-500">
      
      <div class="absolute -top-24 -left-24 w-48 h-48 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div class="absolute -bottom-24 -right-24 w-48 h-48 bg-pink-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div class="relative z-10 mb-10">
        <h2 class="text-3xl font-black uppercase italic tracking-tighter text-white leading-none">
          Establish <span class="bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">Classroom</span>
        </h2>
        <p class="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mt-3">Registry Deployment Phase</p>
      </div>

      <form @submit.prevent="handleSubmit" class="relative z-10 space-y-8">
        <div class="space-y-2 group">
          <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 group-focus-within:text-blue-400 transition-colors">Classroom Designation</label>
          <input 
            v-model="form.name"
            type="text"
            required
            placeholder="EX: GRADE 10 - CYBERSECURITY"
            class="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white placeholder:text-gray-700 outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all"
          />
        </div>

        <div class="space-y-2 group">
          <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 group-focus-within:text-pink-400 transition-colors">Operational Brief / Description</label>
          <textarea 
            v-model="form.description"
            rows="3"
            placeholder="Enter classroom objectives or sections..."
            class="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white placeholder:text-gray-700 outline-none focus:border-pink-500/50 focus:bg-white/[0.05] transition-all resize-none"
          ></textarea>
        </div>

        <div class="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-start gap-3">
          <div class="p-2 rounded-lg bg-blue-500/20 text-blue-400">
            <InfoIcon class="w-4 h-4" />
          </div>
          <p class="text-[9px] font-bold text-blue-400/80 uppercase tracking-wider leading-relaxed">
            Note: The system will automatically generate a unique 6-character access code upon successful deployment.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-4 pt-4">
          <button 
            type="button" 
            @click="$emit('close')"
            class="px-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-white/10 hover:text-white transition-all"
          >
            Abort
          </button>
          <button 
            type="submit"
            :disabled="loading"
            class="group relative px-6 py-4 bg-gradient-to-r from-blue-600 to-pink-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white overflow-hidden shadow-xl shadow-blue-900/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            <span class="relative z-10 flex items-center justify-center gap-2">
              {{ loading ? 'Processing...' : 'Deploy Classroom' }}
              <ZapIcon v-if="!loading" class="w-3.5 h-3.5 animate-pulse" />
            </span>
          </button>
        </div>
      </form>
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
  // DAPAT MAY .value DITO:
  if (form.value.name && form.value.name.trim()) {
    emit('created', { ...form.value });
  }
};
</script>

<style scoped>
/* Industrial font consistency */
input, textarea, button {
  font-family: 'Century Gothic', sans-serif;
}

/* Chrome/Safari placeholder fix */
::placeholder {
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 10px;
}
</style>