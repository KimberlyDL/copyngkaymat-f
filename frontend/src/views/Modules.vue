<template>
  <div class="page-wrapper animate-in">

    <!-- Page Header -->
    <div class="page-header">
      <div class="space-y-1.5">
        <p class="section-eyebrow">Knowledge Base</p>
        <h1 class="page-title">
          Learning <span class="brand-gradient-text">Library</span>
        </h1>
        <p class="page-subtitle">Explore modules curated for your growth and awareness.</p>
      </div>

      <div class="flex items-center gap-4">
        <!-- Stats -->
        <div v-if="stats"
          class="hidden md:flex items-center gap-5 pr-5 border-r border-slate-200 dark:border-abyss-500">
          <div class="text-right">
            <p class="stat-pill-label">Total Units</p>
            <p class="text-xl font-bold text-slate-800 dark:text-platinum-100 leading-none">
              {{ stats.total_modules || 0 }}
            </p>
          </div>
          <div class="text-right">
            <p class="stat-pill-label">Total Reads</p>
            <p class="text-xl font-bold text-slate-800 dark:text-platinum-100 leading-none">
              {{ stats.total_views || 0 }}
            </p>
          </div>
        </div>

        <button v-if="canManageModules" @click="showCreateModal = true" class="btn-primary">
          <PlusIcon class="w-4 h-4" />
          <span>New Module</span>
        </button>
      </div>
    </div>

    <!-- Featured Section -->
    <section v-if="featuredModules?.length > 0" class="space-y-3">
      <div class="flex items-center gap-3">
        <div class="h-4 w-0.5 bg-calm-lavender-500 rounded-full"></div>
        <h2 class="text-xs font-semibold uppercase tracking-widest text-platinum-500 dark:text-platinum-600">
          Featured
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="module in featuredModules" :key="module.id" @click="viewModule(module.id)"
          class="card card-hover cursor-pointer group flex flex-col justify-between gap-5">
          <div class="flex items-start justify-between">
            <div class="card-icon-wrap">
              <BookOpenIcon class="w-4 h-4 text-calm-lavender-600 dark:text-calm-lavender-400" />
            </div>
            <span class="badge badge-lavender">Featured</span>
          </div>

          <div>
            <h3
              class="text-sm font-semibold text-slate-700 dark:text-platinum-200 leading-snug line-clamp-2 mb-1 group-hover:text-calm-lavender-600 dark:group-hover:text-calm-lavender-400 transition-colors">
              {{ module.title }}
            </h3>
            <p class="text-xs text-platinum-500 dark:text-platinum-600">{{ module.category || 'Standard' }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Module List -->
    <section class="space-y-3">
      <div class="flex items-center gap-3">
        <div class="h-4 w-0.5 bg-neon-pink-400 rounded-full"></div>
        <h2 class="text-xs font-semibold uppercase tracking-widest text-platinum-500 dark:text-platinum-600">
          All Modules
        </h2>
      </div>
      <div class="min-h-[400px]">
        <ModuleList />
      </div>
    </section>

    <CreateModuleModal v-if="showCreateModal" @saved="handleModuleCreated" @cancel="showCreateModal = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useModuleStore } from '@/stores/module';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/utils/useToast';
import { PlusIcon, BookOpenIcon } from 'lucide-vue-next';
import ModuleList from '@/components/modules/ModuleList.vue';
import CreateModuleModal from '@/components/modules/CreateModuleModal.vue';

const router = useRouter();
const moduleStore = useModuleStore();
const authStore = useAuthStore();
const toast = useToast();

const showCreateModal = ref(false);
const featuredModules = computed(() => moduleStore.featuredModules);
const stats = computed(() => moduleStore.stats);

const canManageModules = computed(() => {
  return ['admin', 'educator', 'moderator'].includes(authStore.user?.role);
});

const viewModule = (id) => {
  router.push({ name: 'user.module', params: { id } });
};

const handleModuleCreated = async () => {
  showCreateModal.value = false;
  toast.success('Module created successfully.');
  await moduleStore.fetchModules();
  await moduleStore.fetchFeaturedModules();
  if (canManageModules.value) {
    await moduleStore.fetchStats();
  }
};

onMounted(async () => {
  const promises = [moduleStore.fetchFeaturedModules()];
  if (canManageModules.value) {
    promises.push(moduleStore.fetchStats());
  }
  await Promise.all(promises).catch(err => {
    console.error("Archive Link Failure:", err);
  });
});
</script>

<style scoped>
@reference "@/style.css";

.page-wrapper {
  @apply space-y-7 text-slate-900 dark:text-white;
}

.page-header {
  @apply flex flex-col sm:flex-row sm:items-end justify-between gap-5 pb-6 border-b border-slate-200 dark:border-abyss-600;
}

.page-title {
  @apply font-madimione text-3xl text-slate-800 dark:text-platinum-100 leading-tight;
}

.page-subtitle {
  @apply font-mplusrounded text-sm text-platinum-600 dark:text-platinum-500;
}

.section-eyebrow {
  @apply text-xs font-semibold uppercase tracking-widest text-calm-lavender-600 dark:text-calm-lavender-400;
}

.stat-pill-label {
  @apply text-[10px] font-medium text-platinum-500 uppercase tracking-wide mb-0.5;
}

.brand-gradient-text {
  @apply bg-gradient-to-r from-calm-lavender-600 to-neon-pink-500 bg-clip-text text-transparent;
}

.card {
  @apply bg-white dark:bg-abyss-600 border border-slate-200 dark:border-abyss-500 rounded-2xl p-5;
}

.card-hover {
  @apply hover:border-calm-lavender-200 dark:hover:border-calm-lavender-800/60 hover:-translate-y-0.5 transition-all duration-200;
}

.card-icon-wrap {
  @apply p-2.5 rounded-xl bg-calm-lavender-50 dark:bg-calm-lavender-900/20 border border-calm-lavender-100 dark:border-calm-lavender-800/30 shrink-0;
}

.badge {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium;
}

.badge-lavender {
  @apply bg-calm-lavender-50 dark:bg-calm-lavender-900/30 text-calm-lavender-700 dark:text-calm-lavender-400 border border-calm-lavender-200 dark:border-calm-lavender-800/40;
}

.btn-primary {
  @apply flex items-center gap-2 px-4 py-2.5 rounded-xl bg-calm-lavender-600 hover:bg-calm-lavender-700 dark:bg-calm-lavender-700 dark:hover:bg-calm-lavender-600 text-white font-medium text-sm border border-calm-lavender-700 transition-all shrink-0;
}

.animate-in {
  animation: fadeSlideUp 0.4s ease-out forwards;
}

@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>