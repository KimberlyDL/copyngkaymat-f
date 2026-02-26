<template>
    <section id="about" class="relative py-32 px-6 overflow-hidden transition-all duration-1000
        bg-[#f8fafc] dark:bg-[#060608] font-['Poppins',_sans-serif]">
        
        <div class="absolute inset-0 opacity-[0.1] dark:opacity-[0.05] pointer-events-none" 
            style="background-image: radial-gradient(#46178f 1.2px, transparent 1.2px); background-size: 40px 40px;">
        </div>

        <div class="max-w-5xl mx-auto text-center space-y-16 relative z-10">
            
            <div class="space-y-6">
                <h2 class="text-4xl md:text-6xl font-[900] text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">
                    About <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#46178f] to-[#d810ff]">ProtectEd</span>
                </h2>
                <div class="h-1.5 w-24 bg-gradient-to-r from-[#46178f] to-[#d810ff] mx-auto rounded-full shadow-[0_5px_15px_rgba(70,23,143,0.3)]"></div>
            </div>

            <div class="space-y-10 text-base md:text-xl text-slate-500 dark:text-slate-400 leading-relaxed max-w-4xl mx-auto font-semibold italic">
                <p class="transition-all duration-500 hover:text-slate-900 dark:hover:text-white">
                    ProtectEd is a cutting-edge platform that bridges the gap between interactive education and predictive intelligence. By combining gamified learning modules with AI-powered behavioral analysis, we create a unified system that educates, engages, and supports early intervention efforts in VAWC prevention.
                </p>

                <p class="transition-all duration-500 hover:text-slate-900 dark:hover:text-white">
                    Built specifically for educational institutions and VAWC prevention organizations, ProtectEd provides comprehensive tools for teaching critical life skills while simultaneously identifying and supporting at-risk individuals before issues escalate.
                </p>
            </div>

            <div class="flex flex-col sm:flex-row gap-8 justify-center pt-8">
                <router-link :to="{ name: 'signup' }" 
                    class="px-14 py-6 text-sm font-black uppercase tracking-widest rounded-2xl transition-all duration-150
                    bg-[#46178f] text-white shadow-[0_10px_0_#2d0e5e] hover:translate-y-1 hover:shadow-[0_6px_0_#2d0e5e] active:translate-y-2 active:shadow-none">
                    Join Community
                </router-link>

                <a href="#features" 
                    class="px-14 py-6 text-sm font-black uppercase tracking-widest rounded-2xl transition-all duration-150
                    bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 shadow-sm hover:scale-105">
                    Learn Protocols
                </a>
            </div>
        </div>
    </section>
</template>

<script setup>
// Poppins (Bold Italic) is prioritized for the Elite Gaming Look
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800;900&display=swap');

/* Smooth adaptive background transition */
section {
    transition: background-color 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

p, h2 {
    transition: all 0.4s ease;
}
</style>