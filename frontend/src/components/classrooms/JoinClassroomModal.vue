<template>
  <div class="modal-overlay fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#020203]/90 backdrop-blur-md" @click.self="$emit('close')">
    <div class="modal-content floating-anim relative bg-[#0d0d12] p-10 rounded-[2.5rem] border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,1)] max-w-sm w-full text-center overflow-hidden">
      <div class="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <h2 class="title text-2xl font-black uppercase tracking-tighter italic text-white mb-2">Join a Class</h2>
      <p class="subtitle text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed mb-8">Enter the 6-character code provided by your teacher.</p>
      
      <div class="input-container relative mb-10">
        <input 
          v-model="joinCode" 
          type="text" 
          maxlength="6" 
          placeholder="EX: A1B2C3"
          class="code-input w-full bg-transparent border-b-2 border-pink-500 py-4 text-3xl font-black text-blue-400 text-center tracking-[0.3em] uppercase outline-none focus:border-blue-400 transition-all"
        />
      </div>

      <div class="actions grid grid-cols-2 gap-4">
        <button @click="$emit('close')" class="cancel-btn px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:bg-white/10 hover:text-white transition-all active:scale-95">
          Back
        </button>
        <button @click="handleJoin" class="join-btn pulse px-6 py-4 bg-gradient-to-r from-blue-600 to-pink-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-900/30 hover:scale-105 active:scale-95 transition-all">
          Join Now
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['close', 'join']);
const joinCode = ref('');

const handleJoin = () => {
  // Siguraduhin na 6 characters ang code bago i-emit
  if (joinCode.value.trim().length === 6) {
    emit('join', joinCode.value.toUpperCase().trim());
  } else {
    // Maaari kang magdagdag ng toast notification dito kung kulang ang characters
    console.warn("Invalid code length");
  }
};
</script>

<style scoped>
.modal-content {
  font-family: 'Century Gothic', sans-serif; /* */
}

/* Floating Animation */
.floating-anim {
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Pulse effect para sa active button */
.pulse:hover {
  animation: pulse-animation 1.5s infinite;
}

@keyframes pulse-animation {
  0% { box-shadow: 0 0 0 0px rgba(0, 183, 255, 0.4); }
  100% { box-shadow: 0 0 0 15px rgba(0, 183, 255, 0); }
}
</style>