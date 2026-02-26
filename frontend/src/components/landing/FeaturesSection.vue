<template>
    <section id="features" class="relative py-32 px-6 overflow-hidden transition-all duration-1000
        bg-[#f8fafc] dark:bg-[#060608] font-['Poppins',_sans-serif]">
        
        <div class="absolute inset-0 opacity-[0.1] dark:opacity-[0.05] pointer-events-none" 
            style="background-image: radial-gradient(#46178f 1.2px, transparent 1.2px); background-size: 40px 40px;">
        </div>

        <div class="max-w-7xl mx-auto relative z-10">
            <div class="text-center mb-24 space-y-6">
                <h2 class="text-4xl md:text-6xl font-[900] text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">
                    Core <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#46178f] to-[#d810ff]">Protocols</span>
                </h2>
                
                <p class="text-base md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-semibold italic leading-relaxed">
                    Everything you need to develop critical awareness and life skills through a smooth and professional interactive experience.
                </p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                <FeatureCard
                    title="Gamified Learning"
                    description="Interactive quizzes, challenges, and activities make learning about GAD, sexual health, and violence prevention engaging and professional."
                    icon="M13 10V3L4 14h7v7l9-11h-7z"
                />
                <FeatureCard
                    title="Personalized Paths"
                    description="Content adapts based on your age and knowledge level, creating a customized learning journey tailored for high-end users."
                    icon="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
                <FeatureCard
                    title="Rewards & Recognition"
                    description="Earn technical badges and unlock achievements as you progress. Compete on elite leaderboards to stay motivated."
                    icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                <FeatureCard
                    title="AI-Powered Insights"
                    description="Our advanced AI analyzes behavioral patterns to provide early detection alerts and support for VAWC prevention."
                    icon="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                <FeatureCard
                    title="Resource Library"
                    description="Access technical guides, videos, and materials tailored for your age group. Learn at your own professional pace."
                    icon="M13 10V3L4 14h7v7l9-11h-7z"
                />
                <FeatureCard
                    title="Data Privacy"
                    description="Your data is secure and protected. We maintain strict compliance with industry privacy standards and ethical guidelines."
                    icon="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
            </div>
        </div>
    </section>
</template>

<script setup>
import FeatureCard from './FeatureCard.vue'
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800;900&display=swap');

/* Smooth adaptive transition base sa system settings */
section {
    transition: background-color 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>