<template>
  <div class="fixed bottom-6 right-6 z-[999] font-['Poppins']">
    <!-- Chat Window -->
    <transition name="slide-up">
      <div v-if="isOpen" 
           class="fixed flex flex-col overflow-hidden bg-[#09090b]/90 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-300 ease-in-out z-[9999]"
           :class="isFullscreen ? 'inset-0 w-full h-full rounded-none' : 'bottom-20 right-6 w-[400px] md:w-[450px] h-[650px] rounded-3xl'">
        
        <!-- Header -->
        <div class="px-5 py-4 bg-gradient-to-r from-violet-600/90 via-fuchsia-600/90 to-violet-600/90 border-b border-white/10 flex justify-between items-center backdrop-blur-md relative overflow-hidden">
          
          <!-- Animated Background mesh -->
          <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

          <div class="flex items-center gap-3 relative z-10">
            <div class="w-11 h-11 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)]">
              <Bot class="w-6 h-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]" />
            </div>
            <div>
              <h3 class="text-base font-bold text-white tracking-wide drop-shadow-sm">Lumina</h3>
              <div class="flex items-center gap-1.5">
                <span class="relative flex h-2.5 w-2.5">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                </span>
                <span class="text-[11px] text-white/90 font-medium tracking-wide">Always Online</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-1 relative z-10">
            <button @click="toggleFullscreen" class="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-all duration-200 active:scale-95" :title="isFullscreen ? 'Minimize' : 'Maximize'">
              <component :is="isFullscreen ? Minimize2 : Maximize2" class="w-4 h-4" />
            </button>
            <button @click="clearChat" class="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-all duration-200 active:scale-95" title="Clear chat">
              <Trash2 class="w-4 h-4" />
            </button>
            <button @click="toggleChat" class="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-all duration-200 active:scale-95" title="Close">
              <X class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Quick Topic Pills -->
        <div class="px-5 py-3 bg-[#09090b]/50 border-b border-white/5 flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          <button v-for="topic in topics" :key="topic.id" @click="selectTopic(topic)" 
                  class="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-semibold transition-all border duration-300 shadow-sm"
                  :class="selectedTopic === topic.id 
                    ? 'bg-violet-500 text-white border-violet-400 shadow-[0_4px_10px_rgba(139,92,246,0.3)]' 
                    : 'bg-zinc-800/80 border-white/5 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 hover:border-white/10'">
            <component :is="topic.icon" class="w-3.5 h-3.5" :class="selectedTopic === topic.id ? 'text-violet-400' : 'text-zinc-500'" /> 
            {{ topic.name }}
          </button>
        </div>

        <!-- Messages Container -->
        <div ref="messagesContainer" class="flex-1 p-5 overflow-y-auto space-y-5 custom-scrollbar bg-[#09090b] relative">
          <!-- Ambient Glow Effect -->
          <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-violet-600/5 rounded-full blur-[100px] pointer-events-none"></div>

          <!-- Welcome Message -->
          <div v-if="messages.length === 1" class="text-center py-10 relative z-10">
            <div class="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 rounded-full flex items-center justify-center border border-white/5 shadow-[0_0_40px_rgba(139,92,246,0.1)] ring-1 ring-white/5 rotate-3 hover:rotate-0 transition-all duration-500">
              <ShieldCheck class="w-12 h-12 text-violet-400 drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]" />
            </div>
            <h4 class="text-white font-bold text-lg mb-2">Welcome to Lumina</h4>
            <p class="text-zinc-400 text-sm px-8 leading-relaxed max-w-[80%] mx-auto">I'm your intelligent assistant. Ask me anything about GAD, VAWC, Sex Ed, or any other topic!</p>
          </div>

          <!-- Messages -->
          <div v-for="(msg, i) in messages" :key="i" class="animate-fadeIn group relative z-10">
            <!-- User Message -->
            <div v-if="msg.role === 'user'" class="flex justify-end mb-4 pl-10">
              <div class="relative max-w-full px-6 py-3.5 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-[24px] rounded-tr-sm text-white text-[13px] leading-relaxed shadow-[0_4px_15px_rgba(124,58,237,0.3)] border border-white/10">
                {{ msg.text }}
              </div>
            </div>
            
            <!-- AI Message -->
            <div v-else class="flex gap-4 mb-4 pr-4">
              <div class="flex-shrink-0 w-9 h-9 bg-zinc-800/80 rounded-full flex items-center justify-center border border-white/10 shadow-lg mt-1 backdrop-blur-sm">
                <Bot class="w-5 h-5 text-violet-400" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="px-6 py-4 bg-[#18181b]/80 border border-white/5 rounded-[24px] rounded-tl-sm text-zinc-300 text-[13px] leading-7 shadow-sm backdrop-blur-xl ring-1 ring-black/20" 
                     v-html="formatMessage(msg.text)">
                </div>
                <div class="flex items-center gap-2 mt-2 ml-1 opacity-70">
                  <span class="text-[10px] text-zinc-500 font-medium">{{ formatTime(msg.timestamp) }}</span>
                  <span v-if="msg.model" class="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-zinc-600 border border-white/5 uppercase tracking-wider font-bold">{{ msg.model.replace('gemini-', '') }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Typing Indicator -->
          <div v-if="isTyping" class="flex gap-4 animate-fadeIn relative z-10">
             <div class="flex-shrink-0 w-9 h-9 bg-zinc-800/80 rounded-xl flex items-center justify-center border border-white/10 shadow-lg mt-1">
                <Bot class="w-5 h-5 text-violet-400" />
              </div>
            <div class="px-5 py-4 bg-[#18181b]/80 border border-white/5 rounded-2xl rounded-tl-sm w-fit backdrop-blur-sm">
              <div class="flex gap-1.5 items-center h-4">
                <div class="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div class="w-1.5 h-1.5 bg-fuchsia-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div class="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Suggestions -->
        <div v-if="suggestions.length > 0 && !isTyping" class="px-5 py-3 border-t border-white/5 bg-[#09090b]/80 backdrop-blur-xl z-20">
          <div class="flex flex-wrap gap-2">
            <button v-for="(suggestion, i) in suggestions" :key="i" @click="sendSuggestion(suggestion)"
                    class="px-4 py-2 bg-zinc-800/40 hover:bg-violet-500/10 border border-white/5 hover:border-violet-500/30 rounded-full text-[11px] text-zinc-400 hover:text-violet-200 transition-all duration-200 text-left hover:shadow-[0_0_10px_rgba(139,92,246,0.1)] active:scale-95">
              {{ suggestion }}
            </button>
          </div>
        </div>

        <!-- Input Area -->
        <div class="p-5 border-t border-white/5 bg-[#09090b] z-20">
          <div class="flex gap-3 relative">
            <div class="flex-1 relative group">
              <input v-model="userInput" @keyup.enter="sendMessage" @input="handleInput"
                     class="w-full bg-zinc-900/50 border border-white/10 rounded-full px-6 py-4 text-sm text-white placeholder-zinc-500 outline-none focus:border-violet-500/50 focus:bg-zinc-900 focus:ring-2 focus:ring-violet-500/10 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]" 
                     placeholder="Type your question..." 
                     :disabled="isTyping"
                     maxlength="500" />
              <div class="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                <span v-if="userInput.length > 0" class="text-[10px] text-zinc-600 font-medium font-mono">
                  {{ userInput.length }}/500
                </span>
              </div>
            </div>
            <button @click="sendMessage" 
                    :disabled="!userInput.trim() || isTyping"
                    class="w-[52px] h-[52px] bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-full flex items-center justify-center transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:saturation-0 shadow-lg shadow-violet-900/20 group">
              <Send class="w-5 h-5 text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div class="flex justify-center items-center gap-2 mt-4 opacity-60">
             <Lock class="w-3 h-3 text-zinc-600" />
             <p class="text-[10px] text-zinc-600 font-medium tracking-wide">Secure & Encrypted • Powered by Gemini AI</p>
          </div>
        </div>
      </div>
    </transition>

    <!-- Floating Button -->
    <button @click="toggleChat" 
            class="group w-14 h-14 md:w-16 md:h-16 bg-[#09090b] border border-white/10 rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.5)] hover:shadow-[0_8px_40px_rgba(124,58,237,0.3)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
      
      <!-- Background Gradient -->
      <div class="absolute inset-0 bg-gradient-to-br from-violet-600 to-fuchsia-600 opacity-20 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <!-- Icon -->
      <div class="relative z-10 transition-transform duration-300 transform" :class="isOpen ? 'rotate-90 scale-90' : 'group-hover:scale-110'">
         <X v-if="isOpen" class="w-6 h-6 md:w-8 md:h-8 text-white" />
         <MessageCircleHeart v-else class="w-6 h-6 md:w-8 md:h-8 text-white group-hover:text-white" />
      </div>

      <!-- Notification Badge -->
      <span v-if="!isOpen && hasNewMessage" class="absolute top-3 right-3 w-3 h-3">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-[#09090b]"></span>
      </span>
      
      <!-- Tooltip -->
      <span v-if="!isOpen" class="absolute right-full mr-4 px-3 py-1.5 bg-[#09090b] border border-white/10 rounded-lg text-xs text-zinc-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 shadow-xl pointer-events-none flex items-center gap-2">
        <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
        Chat with AI
      </span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue';
import { 
  Bot, 
  Maximize2,
  Minimize2,
  Trash2, 
  X, 
  Send, 
  Lock, 
  MessageCircleHeart, 
  ShieldCheck,
  BookOpen,
  HeartHandshake,
  Users,
  Heart
} from 'lucide-vue-next';
import api from '@/utils/api'; 

// State
const isOpen = ref(false);
const isFullscreen = ref(false);
const isTyping = ref(false);
const userInput = ref('');
const messagesContainer = ref(null);
const hasNewMessage = ref(false);
const selectedTopic = ref('gad');

// Topics
const topics = [
  { id: 'gad', name: 'GAD', icon: Users },
  { id: 'vawc', name: 'VAWC', icon: HeartHandshake },
  { id: 'sex', name: 'Sex Ed', icon: Heart }
];

// Messages with localStorage persistence
const STORAGE_KEY = 'lumina_chatbot_messages';
const messages = ref([]);
const suggestions = ref(['Tell me about GAD', 'Explain quantum physics', 'Help me with coding', 'What is VAWC?']);

// Initialize messages from localStorage
onMounted(() => {
  loadMessages();
  if (messages.value.length === 0) {
    messages.value = [{
      role: 'ai',
      text: 'Mabuhay! 👋 I\'m **Lumina**, your friendly assistant!\n\nI can help you with **any topic** - from GAD, VAWC, and Sex Education to science, math, coding, history, and more!\n\nWhat would you like to know?',
      timestamp: new Date().toISOString()
    }];
    saveMessages();
  }
});

// Watch for new messages to scroll
watch(messages, () => {
  nextTick(() => scrollToBottom());
}, { deep: true });

// Load messages from localStorage
function loadMessages() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      messages.value = JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load chat history:', e);
  }
}

// Save messages to localStorage
function saveMessages() {
  try {
    const toSave = messages.value.slice(-50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.error('Failed to save chat history:', e);
  }
}

// Toggle chat window
function toggleChat() {
  isOpen.value = !isOpen.value;
  hasNewMessage.value = false;
  if (isOpen.value) {
    nextTick(() => scrollToBottom());
  }
}

// Toggle fullscreen
function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value;
  nextTick(() => scrollToBottom());
}

// Scroll to bottom of messages
function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
}

// Format message with basic markdown
function formatMessage(text) {
  if (!text) return '';
  return text
    // Headlines
    .replace(/^### (.*$)/gim, '<h3 class="font-bold text-white mt-2 mb-1">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="font-bold text-white mt-2 mb-1">$1</h2>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Bullet points
    .replace(/^\* /gm, '<div class="flex gap-2 mb-1"><span class="text-violet-400">•</span><span>')
    .replace(/^• /gm, '<div class="flex gap-2 mb-1"><span class="text-violet-400">•</span><span>')
    // Close Bullet points divs (hacky usage for simple formatting)
    .replace(/\n\n/g, '</span></div><br>') 
    // Line breaks
    .replace(/\n/g, '<br>');
}

// Format timestamp
function formatTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

// Handle input changes
function handleInput() {
  // Could add typing indicator or other features here
}

// Select topic for quick suggestions
async function selectTopic(topic) {
  selectedTopic.value = topic.id;
  try {
    const res = await api.get(`/api/v1/chatbot/suggestions?topic=${topic.id}`);
    if (res.data.success) {
      suggestions.value = res.data.suggestions;
    }
  } catch (e) {
    console.error('Failed to fetch suggestions:', e);
  }
}

// Send a suggestion as a message
function sendSuggestion(text) {
  userInput.value = text;
  sendMessage();
}

// Clear chat history
function clearChat() {
  messages.value = [{
    role: 'ai',
    text: 'Chat cleared! 🔄 Ask me anything - I\'m ready to help!',
    timestamp: new Date().toISOString()
  }];
  suggestions.value = ['Tell me about GAD', 'Explain quantum physics', 'Help me with coding', 'What is VAWC?'];
  selectedTopic.value = 'gad';
  saveMessages();
}

// Send message to AI
async function sendMessage() {
  if (!userInput.value.trim() || isTyping.value) return;

  const text = userInput.value.trim();
  const userMessage = {
    role: 'user',
    text,
    timestamp: new Date().toISOString()
  };
  
  messages.value.push(userMessage);
  userInput.value = '';
  isTyping.value = true;
  saveMessages();

  try {
    // Build conversation history for context
    const conversationHistory = messages.value
      .slice(-10)
      .map(msg => ({ role: msg.role, text: msg.text }));

    const res = await api.post('/api/v1/chatbot/ask', {
      message: text,
      conversationHistory
    });

    const aiMessage = {
      role: 'ai',
      text: res.data.reply,
      timestamp: res.data.timestamp || new Date().toISOString(),
      model: res.data.model
    };
    
    messages.value.push(aiMessage);
    
    // Update suggestions if provided
    if (res.data.suggestions && res.data.suggestions.length > 0) {
      suggestions.value = res.data.suggestions;
    }

    saveMessages();

    // Show notification if chat is closed
    if (!isOpen.value) {
      hasNewMessage.value = true;
    }
  } catch (err) {
    console.error('Chat error:', err);
    messages.value.push({
      role: 'ai',
      text: '⚠️ Sorry, I\'m having trouble connecting right now. Please try again in a moment.\n\n**Need immediate help?**\n• PNP Women\'s Desk: 117\n• DSWD Hotline: (02) 931-8101',
      timestamp: new Date().toISOString()
    });
    saveMessages();
  } finally {
    isTyping.value = false;
  }
}
</script>

<style scoped>
.slide-up-enter-active, 
.slide-up-leave-active { 
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
}
.slide-up-enter-from, 
.slide-up-leave-to { 
  opacity: 0; 
  transform: translateY(20px) scale(0.95); 
}

.custom-scrollbar::-webkit-scrollbar { 
  width: 4px; 
}
.custom-scrollbar::-webkit-scrollbar-track { 
  background: transparent; 
}
.custom-scrollbar::-webkit-scrollbar-thumb { 
  background: rgba(147, 51, 234, 0.3); 
  border-radius: 10px; 
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover { 
  background: rgba(147, 51, 234, 0.5); 
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>