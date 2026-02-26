<template>
  <div class="fixed bottom-8 right-8 z-[999] font-['Century_Gothic']">
    <transition name="slide-up">
      <div v-if="isOpen" class="w-80 md:w-96 h-[500px] bg-[#0d0d12] border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden mb-4">
        <div class="p-6 bg-gradient-to-r from-blue-600 to-pink-600 flex justify-between items-center">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span class="text-[10px] font-black uppercase tracking-[0.2em] text-white">ProtectEd AI</span>
          </div>
          <button @click="isOpen = false" class="text-white/50 hover:text-white transition-colors">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar bg-white/[0.02]">
          <div v-for="(msg, i) in messages" :key="i" 
               :class="['max-w-[85%] p-4 rounded-3xl text-[11px] leading-relaxed shadow-lg transition-all', 
               msg.role === 'user' ? 'ml-auto bg-blue-600 text-white rounded-tr-none' : 'mr-auto bg-white/5 border border-white/5 text-gray-300 rounded-tl-none']">
            {{ msg.text }}
          </div>
          <div v-if="isTyping" class="mr-auto bg-white/5 p-4 rounded-3xl text-[10px] italic text-gray-500 animate-pulse">
            AI is thinking...
          </div>
        </div>

        <div class="p-6 border-t border-white/5 bg-[#0d0d12]">
          <div class="relative">
            <input v-model="userInput" @keyup.enter="sendMessage" 
                   class="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-xs outline-none focus:border-pink-500 transition-all pr-12" 
                   placeholder="Ask about GAD or VAWC..." />
            <button @click="sendMessage" class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center hover:scale-110 transition-all">
              <i class="fas fa-paper-plane text-[10px]"></i>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <button @click="isOpen = !isOpen" 
            class="w-16 h-16 bg-gradient-to-tr from-blue-600 via-indigo-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:scale-110 hover:rotate-12 transition-all group">
      <i class="fas fa-robot text-2xl text-white group-hover:animate-bounce"></i>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '@/utils/api';

const isOpen = ref(false);
const isTyping = ref(false);
const userInput = ref('');
const messages = ref([{ role: 'ai', text: 'Mabuhay! I am your ProtectEd AI Assistant. Ask me anything about GAD, VAWC, or Sex Education.' }]);

const sendMessage = async () => {
  if (!userInput.value.trim() || isTyping.value) return;
  
  const text = userInput.value;
  messages.value.push({ role: 'user', text });
  userInput.value = '';
  isTyping.value = true;

  try {
    const res = await api.post('/api/v1/chatbot/ask', { message: text });
    messages.value.push({ role: 'ai', text: res.data.reply });
  } catch (err) {
    messages.value.push({ role: 'ai', text: 'System Error: Neural link interrupted. Please try again later.' });
  } finally {
    isTyping.value = false;
  }
};
</script>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.slide-up-enter-from { opacity: 0; transform: translateY(40px) scale(0.8); }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
</style>