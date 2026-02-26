<template>
  <section class="relative min-h-screen w-full flex items-center overflow-hidden bg-[#0d0221] font-['Poppins',_sans-serif] text-white">
    
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1a0b2e_0%,#0a051a_100%)]"></div>
    
    <nav class="absolute top-0 w-full flex items-center justify-between px-12 py-10 z-50">
      <div class="flex flex-col border-l-4 border-fuchsia-500 pl-4">
        <span class="font-black text-xl tracking-tighter leading-none italic uppercase">Protect</span>
        <span class="font-bold text-xs tracking-[0.4em] text-fuchsia-500/80 leading-none mt-1 uppercase">GAD Portal</span>
      </div>
      <div class="hidden md:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.2em]">
        <div class="flex items-center bg-white/5 border border-white/10 backdrop-blur-md px-6 py-2 rounded-full cursor-pointer hover:bg-white/10 transition-all">
          <svg class="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          <span class="text-[9px] font-black">Curriculum Resources</span>
        </div>
      </div>
    </nav>

    <div class="absolute inset-0 pointer-events-none">
       <div v-for="n in 12" :key="'line-'+n" 
            class="absolute bg-gradient-to-b from-transparent via-fuchsia-500/20 to-transparent w-[1px] h-[700px] rotate-[65deg]"
            :style="{ 
              left: (-10 + (n * 10)) + '%', 
              top: '-20%',
              opacity: 0.05 + (n * 0.02)
            }">
       </div>
    </div>

    <div v-for="(obj, index) in elements" :key="index"
      @mousedown="startDrag($event, index)"
      @touchstart.passive="startDrag($event, index)"
      :style="{ 
        left: obj.x + 'px', 
        top: obj.y + 'px', 
        width: obj.size + 'px',
        height: obj.size + 'px',
        transform: `rotate(${obj.rotation}deg) scale(${obj.isDragging ? 1.1 : 1})`,
        zIndex: obj.isDragging ? 60 : 10,
        opacity: obj.opacity
      }"
      class="absolute cursor-grab active:cursor-grabbing transition-transform duration-500 ease-out rounded-full liquid-sphere"
      :class="[!obj.isDragging ? 'animate-float' : '']">
      
      <div class="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent opacity-40"></div>
    </div>

    <div class="relative z-30 w-full max-w-7xl mx-auto px-16 pointer-events-none">
      <div class="max-w-2xl space-y-6 pointer-events-auto">
        
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20">
          <div class="w-1.5 h-1.5 rounded-full bg-fuchsia-500 animate-pulse"></div>
          <span class="text-[9px] font-black uppercase tracking-[0.3em] text-fuchsia-400">Inclusive Learning Active</span>
        </div>
        
        <h1 class="text-6xl md:text-[85px] font-black leading-[0.9] tracking-tighter uppercase italic">
          Empower <br />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-600">Equality.</span>
        </h1>

        <p class="text-base md:text-lg max-w-md text-white/50 leading-relaxed italic font-medium">
          A dedicated space for teachers and students to explore Gender and Development. 
          Learn to break stereotypes and build a safer, more inclusive school environment for everyone.
        </p>

        <div class="flex flex-col sm:flex-row items-center gap-6 pt-6">
          <button class="w-full sm:w-auto px-12 py-5 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all
            bg-purple-700 text-white shadow-[0_8px_0_#46178f] hover:translate-y-1 hover:shadow-[0_4px_0_#46178f] active:translate-y-2 active:shadow-none">
            Teacher Access
          </button>
          
          <button class="w-full sm:w-auto px-12 py-5 text-[11px] font-black uppercase tracking-widest rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 transition-all">
            Student Module
          </button>
        </div>
      </div>
    </div>

    <div class="absolute inset-0 opacity-[0.03] pointer-events-none" 
      style="background-image: radial-gradient(#d810ff 1.2px, transparent 1.2px); background-size: 40px 40px;">
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const elements = ref([
  { x: 850, y: 150, size: 380, rotation: 0, opacity: 1, isDragging: false }, 
  { x: 800, y: 500, size: 140, rotation: 45, opacity: 1, isDragging: false },
  { x: 300, y: 650, size: 220, rotation: -15, opacity: 0.8, isDragging: false },
  ...Array.from({ length: 6 }).map(() => ({
    x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
    y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
    size: Math.random() * 60 + 20,
    rotation: Math.random() * 360,
    opacity: 0.4,
    isDragging: false
  }))
]);

let currentElementIndex = null;
let offset = { x: 0, y: 0 };

const startDrag = (event, index) => {
  currentElementIndex = index;
  elements.value[index].isDragging = true;
  const e = event.touches ? event.touches[0] : event;
  offset.x = e.clientX - elements.value[index].x;
  offset.y = e.clientY - elements.value[index].y;
  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', stopDrag);
  window.addEventListener('touchmove', onDrag, { passive: false });
  window.addEventListener('touchend', stopDrag);
};

const onDrag = (event) => {
  if (currentElementIndex === null) return;
  const e = event.touches ? event.touches[0] : event;
  elements.value[currentElementIndex].x = e.clientX - offset.x;
  elements.value[currentElementIndex].y = e.clientY - offset.y;
};

const stopDrag = () => {
  if (currentElementIndex !== null) elements.value[currentElementIndex].isDragging = false;
  currentElementIndex = null;
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', stopDrag);
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800;900&display=swap');

.liquid-sphere {
  background: radial-gradient(circle at 35% 35%, #ff47ff 0%, #7d12ff 45%, #1a0240 100%);
  box-shadow: 
    inset -15px -15px 40px rgba(0,0,0,0.7),
    inset 10px 10px 20px rgba(255,255,255,0.15),
    0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.animate-float {
  animation: float 15s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(20px, -40px) rotate(5deg); }
  66% { transform: translate(-10px, 20px) rotate(-3deg); }
}

::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #0d0221; }
::-webkit-scrollbar-thumb { background: #46178f; border-radius: 10px; }
::selection { background: #d810ff; color: white; }
</style>