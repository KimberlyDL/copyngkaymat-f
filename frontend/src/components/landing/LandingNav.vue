<template>
  <nav class="fixed top-8 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl z-50 font-['Poppins',_sans-serif]">
    <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] px-8 py-4 
                shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)]">
      
      <div class="flex items-center justify-between">
        
        <router-link :to="{ name: 'home' }" class="flex items-center gap-4 group">
          <div class="relative h-10 w-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-700 
                      flex items-center justify-center shadow-[0_0_20px_rgba(216,16,255,0.4)]
                      group-hover:rotate-6 transition-all duration-300">
            <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
          </div>
          <div class="flex flex-col">
            <span class="text-xl font-black tracking-tighter leading-none text-white uppercase italic">
              Protect<span class="text-fuchsia-500">Ed</span>
            </span>
            <span class="text-[8px] font-bold tracking-[0.4em] text-white/40 uppercase leading-none mt-1">
              System Protocol
            </span>
          </div>
        </router-link>

        <div class="hidden md:flex items-center gap-8">
          <a v-for="item in ['Features', 'Impact', 'Archive']" :key="item" 
             :href="'#' + item.toLowerCase()" 
             class="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-fuchsia-400 transition-colors">
            {{ item }}
          </a>
        </div>

        <div class="flex items-center gap-8">
          <router-link :to="{ name: 'login' }" 
            class="hidden sm:inline-block text-[10px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-white transition-all">
            Log In
          </router-link>
          
          <router-link :to="{ name: 'signup' }" 
            class="px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-full transition-all active:scale-95
                   bg-gradient-to-r from-purple-700 to-fuchsia-600 text-white
                   shadow-[0_10px_20px_rgba(168,85,247,0.2)] hover:shadow-[0_10px_30px_rgba(216,16,255,0.4)]
                   hover:-translate-y-0.5">
            Begin Access
          </router-link>
        </div>

      </div>
    </div>
  </nav>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;900&display=swap');

nav {
  /* Ensuring the glassmorphism pops against the dark background */
  animation: navEntry 1s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes navEntry {
  from { opacity: 0; transform: translate(-50%, -20px); }
  to { opacity: 1; transform: translate(-50%, 0); }
}

span {
  text-shadow: 0 0 15px rgba(216, 16, 255, 0.2);
}
</style>