<template>
    <div class="min-h-screen bg-platinum-50 dark:bg-abyss-950">
        <LandingNav />
        <HeroSection />
        <FeaturesSection />
        <ImpactSection />
        <AboutSection />
        <LandingFooter />
    </div>
</template>

<script setup>
import LandingNav from '@/components/landing/LandingNav.vue'
import HeroSection from '@/components/landing/HeroSection.vue'
import FeaturesSection from '@/components/landing/FeaturesSection.vue'
import ImpactSection from '@/components/landing/ImpactSection.vue'
import AboutSection from '@/components/landing/AboutSection.vue'
import LandingFooter from '@/components/landing/LandingFooter.vue'
</script>