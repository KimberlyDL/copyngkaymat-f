<template>
    <section id="impact" class="relative py-32 px-6 overflow-hidden transition-all duration-1000
        bg-[#f8fafc] dark:bg-[#060608] font-['Poppins',_sans-serif]">
        
        <div class="absolute inset-0 opacity-[0.1] dark:opacity-[0.05] pointer-events-none" 
            style="background-image: radial-gradient(#46178f 1.2px, transparent 1.2px); background-size: 40px 40px;">
        </div>

        <div class="max-w-7xl mx-auto relative z-10">
            <div class="text-center mb-24 space-y-6">
                <h2 class="text-4xl md:text-6xl font-[900] text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">
                    Real-World <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#46178f] to-[#d810ff]">Impact</span>
                </h2>
                
                <p class="text-base md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-semibold italic leading-relaxed">
                    Designed to educate, predict, and prevent violence through a technical and interactive awareness protocol.
                </p>
            </div>

            <div class="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                <div class="group relative p-12 rounded-[2.5rem] bg-white dark:bg-[#111118] border border-slate-100 dark:border-white/5
                    shadow-[0_20px_40px_rgba(0,0,0,0.03),inset_0_2px_4px_rgba(255,255,255,1)]
                    dark:shadow-[0_30px_60px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.05)]
                    hover:-translate-y-3 transition-all duration-500">
                    
                    <h3 class="text-2xl font-[900] text-[#46178f] dark:text-[#d810ff] mb-8 uppercase italic tracking-widest">
                        Educational Excellence
                    </h3>
                    
                    <ul class="space-y-5">
                        <li v-for="(item, i) in [
                            'Comprehensive GAD and VAWC education protocols',
                            'Age-appropriate modules for technical learners',
                            'Proven gamification for engagement and retention',
                            'Interactive real-world decision-making scenarios'
                        ]" :key="i" class="flex items-start gap-4">
                            <div class="mt-1.5 w-2 h-2 rounded-full bg-purple-500/40"></div>
                            <span class="text-sm font-semibold text-slate-500 dark:text-slate-400 italic group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">{{ item }}</span>
                        </li>
                    </ul>
                </div>

                <div class="group relative p-12 rounded-[2.5rem] bg-white dark:bg-[#111118] border border-slate-100 dark:border-white/5
                    shadow-[0_20px_40px_rgba(0,0,0,0.03),inset_0_2px_4px_rgba(255,255,255,1)]
                    dark:shadow-[0_30px_60px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.05)]
                    hover:-translate-y-3 transition-all duration-500">
                    
                    <h3 class="text-2xl font-[900] text-[#46178f] dark:text-[#d810ff] mb-8 uppercase italic tracking-widest">
                        Prevention & Safety
                    </h3>
                    
                    <ul class="space-y-5">
                        <li v-for="(item, i) in [
                            'Early detection of behavioral pattern anomalies',
                            'AI-powered risk alerts for system administrators',
                            'Protocol-driven timely intervention and support',
                            'Aggregated insights for trend analysis and planning'
                        ]" :key="i" class="flex items-start gap-4">
                            <div class="mt-1.5 w-2 h-2 rounded-full bg-purple-500/40"></div>
                            <span class="text-sm font-semibold text-slate-500 dark:text-slate-400 italic group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">{{ item }}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800;900&display=swap');

section {
    transition: background-color 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

div {
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>