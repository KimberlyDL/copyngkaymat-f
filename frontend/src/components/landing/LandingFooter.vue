<template>
  <footer class="bg-platinum-100 dark:bg-abyss-950 border-t-2 border-slate-200 dark:border-abyss-700">
    <div class="max-w-6xl mx-auto px-6 py-12">

      <!-- Top row: logo + nav links -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">

        <!-- Logo -->
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-calm-lavender-500 border-2 border-calm-lavender-700 border-b-[4px] flex items-center justify-center">
            <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
          </div>
          <span class="font-madimione text-2xl text-slate-700 dark:text-platinum-200 tracking-tight">
            Protect<span class="text-calm-lavender-500">Ed</span>
          </span>
        </div>

        <!-- Footer nav links — technical/micro-UI → font-dosis -->
        <nav class="flex flex-wrap gap-x-8 gap-y-3">
          <template v-for="group in footerData" :key="group.title">
            <div class="flex flex-col gap-1.5">
              <span class="font-dosis font-700 text-[10px] uppercase tracking-[0.25em] text-slate-400 dark:text-abyss-400 mb-1">{{ group.title }}</span>
              <a
                v-for="link in group.links"
                :key="link.name"
                :href="link.href"
                class="font-dosis font-600 text-sm text-slate-500 dark:text-platinum-500 hover:text-calm-lavender-600 dark:hover:text-calm-lavender-400 transition-colors"
              >
                {{ link.name }}
              </a>
            </div>
          </template>
        </nav>
      </div>

      <!-- Divider -->
      <div class="border-t border-slate-200 dark:border-abyss-700 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">

        <!-- Policy links -->
        <div class="flex flex-wrap justify-center sm:justify-start gap-5">
          <a href="#" class="font-mplusrounded font-bold text-xs text-slate-400 dark:text-abyss-400 hover:text-calm-lavender-500 transition-colors">Privacy Policy</a>
          <a href="#" class="font-mplusrounded font-bold text-xs text-slate-400 dark:text-abyss-400 hover:text-calm-lavender-500 transition-colors">Terms of Service</a>
          <a href="#" class="font-mplusrounded font-bold text-xs text-slate-400 dark:text-abyss-400 hover:text-calm-lavender-500 transition-colors">Contact Us</a>
        </div>

        <!-- Credit -->
        <p class="font-mplusrounded text-xs font-medium text-slate-400 dark:text-abyss-400 text-center sm:text-right leading-relaxed">
          Developed by <strong class="text-slate-500 dark:text-abyss-300 font-bold">ProtectED Team</strong> ·
          College of Computer Studies, Mindoro State University.
        </p>
      </div>

    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue';

const backgroundOrbs = ref([
  { size: 450, left: -8,  top: -10, delay: 0, opacity: 0.6, blur: 0  },
  { size: 380, left:  85, top:  40, delay: 2, opacity: 0.5, blur: 0  },
  { size: 280, left:  65, top: -15, delay: 4, opacity: 0.4, blur: 10 },
  { size: 200, left:   5, top:  70, delay: 1, opacity: 0.6, blur: 0  },
  { size: 180, left:  40, top:  85, delay: 3, opacity: 0.2, blur: 20 },
  { size: 150, left:  30, top:   5, delay: 5, opacity: 0.3, blur: 2  },
  { size: 100, left:  90, top:   5, delay: 2, opacity: 0.4, blur: 0  },
  { size: 220, left:  -5, top:  40, delay: 6, opacity: 0.1, blur: 40 },
]);

const footerData = [
  {
    title: 'Protocol',
    links: [
      { name: 'Features',         href: '#features' },
      { name: 'Real-World Impact', href: '#impact'  }
    ]
  },
  {
    title: 'Structure',
    links: [
      { name: 'About Mission', href: '#about' },
      { name: 'Support Center', href: '#'    }
    ]
  },
  {
    title: 'Compliance',
    links: [
      { name: 'Privacy Vault', href: '#' },
      { name: 'Terms of Use',  href: '#' }
    ]
  },
  {
    title: 'Connect',
    links: [
      { name: 'Institutional Portal', href: '#' },
      { name: 'Help Desk',            href: '#' }
    ]
  }
];
</script>