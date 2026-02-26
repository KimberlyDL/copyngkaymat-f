<template>
  <footer class="relative py-24 px-8 overflow-hidden transition-all duration-1000
    bg-[#f8fafc] dark:bg-[#060608] font-['Poppins',_sans-serif] border-t border-slate-100 dark:border-white/5">
    
    <div class="absolute inset-0 opacity-[0.12] dark:opacity-[0.06] pointer-events-none" 
      style="background-image: radial-gradient(#46178f 1.5px, transparent 1.5px); background-size: 50px 50px;">
    </div>

    <div class="max-w-7xl mx-auto relative z-10">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
        <div v-for="category in footerData" :key="category.title" class="space-y-8">
          <h4 class="text-[10px] font-[900] text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] italic">
            {{ category.title }}
          </h4>
          
          <ul class="space-y-5">
            <li v-for="link in category.links" :key="link.name">
              <a :href="link.href" class="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase italic tracking-widest transition-all 
                hover:text-[#46178f] dark:hover:text-[#d810ff] hover:translate-x-2 flex items-center gap-3 group">
                <div class="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-white/10 group-hover:bg-purple-500 transition-colors"></div>
                {{ link.name }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="pt-12 border-t border-slate-200/50 dark:border-white/5">
        <div class="flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-left">
          
          <div class="space-y-3">
            <span class="text-3xl font-[900] tracking-tighter text-slate-900 dark:text-white uppercase italic">
              Protect<span class="text-transparent bg-clip-text bg-gradient-to-r from-[#46178f] to-[#d810ff]">Ed</span>
            </span>
            <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">
              © 2026 ProtectEd Protocol. All rights reserved.
            </p>
          </div>
          
          <div class="flex flex-wrap justify-center gap-10">
            <a v-for="legal in ['Privacy Policy', 'Terms of Service', 'Cookie Protocol']" :key="legal" href="#" 
              class="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-[#46178f] dark:hover:text-white transition-colors">
              {{ legal }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
/**
 * Data architecture for the Elite Footer Archive.
 * Organized by category for high-level awareness protocols.
 */
const footerData = [
  { 
    title: 'Product', 
    links: [{ name: 'Features', href: '#features' }, { name: 'Impact', href: '#impact' }] 
  },
  { 
    title: 'Company', 
    links: [{ name: 'About', href: '#about' }, { name: 'Contact', href: '#' }] 
  },
  { 
    title: 'Legal', 
    links: [{ name: 'Privacy', href: '#' }, { name: 'Terms', href: '#' }] 
  },
  { 
    title: 'Support', 
    links: [{ name: 'Documentation', href: '#' }, { name: 'Help Center', href: '#' }] 
  }
];
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;900&display=swap');

/* Smooth adaptive background transition for light/dark mode */
footer {
  transition: background-color 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Physics-based transition for tactile interactive links */
a {
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}
</style>