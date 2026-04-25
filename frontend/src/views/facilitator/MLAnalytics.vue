<template>
  <div class="page-wrapper">

    <!-- ── Page Header ──────────────────────────────────────────── -->
    <div class="page-header">
      <div class="space-y-1.5">
        <p class="section-eyebrow">Behavioural Intelligence</p>
        <h1 class="page-title">
          AI <span class="brand-gradient-text">Analytics</span>
        </h1>
        <p class="page-subtitle">
          ML analysis of student behavioural assessment responses.
        </p>
      </div>

      <button @click="refreshAll" class="btn-primary">
        <RefreshCwIcon class="w-4 h-4" />
        <span class="main-button-text">Refresh</span>
      </button>
    </div>

    <!-- ── Loading ──────────────────────────────────────────────── -->
    <div v-if="loading" class="card flex items-center gap-3 py-8 justify-center">
      <div class="w-5 h-5 border-2 border-calm-lavender-200 border-t-calm-lavender-600 rounded-full animate-spin"></div>
      <p class="font-dosis text-sm font-medium text-platinum-500">Loading analytics…</p>
    </div>

    <!-- ── Error ────────────────────────────────────────────────── -->
    <div v-else-if="error"
      class="flex items-start gap-3 p-5 rounded-2xl border-2
             bg-red-50 dark:bg-red-900/10
             border-red-200 dark:border-red-800/40">
      <div class="p-2 rounded-xl bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800/40 shrink-0">
        <AlertCircleIcon class="w-4 h-4 text-red-600 dark:text-red-400" />
      </div>
      <p class="font-mplusrounded text-sm leading-relaxed text-red-700 dark:text-red-300 mt-1">
        {{ error }}
      </p>
    </div>

    <template v-else>

      <!-- ── Stat Pills ────────────────────────────────────────── -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">

        <!-- Total -->
        <div class="stat-pill flex-col items-start gap-1">
          <div class="flex items-center gap-2 w-full">
            <div class="card-icon-wrap">
              <BarChart3Icon class="w-3.5 h-3.5 text-calm-lavender-600 dark:text-calm-lavender-400" />
            </div>
            <p class="stat-pill-label">Total</p>
          </div>
          <p class="stat-pill-value text-slate-800 dark:text-platinum-100 pl-1">
            {{ stats.totalAnalyses || 0 }}
          </p>
        </div>

        <!-- Flagged -->
        <div class="stat-pill flex-col items-start gap-1">
          <div class="flex items-center gap-2 w-full">
            <div class="p-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30">
              <FlagIcon class="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
            </div>
            <p class="stat-pill-label">Flagged</p>
          </div>
          <p class="stat-pill-value text-red-600 dark:text-red-400 pl-1">
            {{ stats.flaggedCount || 0 }}
          </p>
        </div>

        <!-- Needs Review -->
        <div class="stat-pill flex-col items-start gap-1">
          <div class="flex items-center gap-2 w-full">
            <div class="p-2.5 rounded-xl bg-vawc-orange-50 dark:bg-vawc-orange-900/20 border border-vawc-orange-100 dark:border-vawc-orange-800/30">
              <ClockIcon class="w-3.5 h-3.5 text-vawc-orange-600 dark:text-vawc-orange-400" />
            </div>
            <p class="stat-pill-label">Needs Review</p>
          </div>
          <p class="stat-pill-value text-vawc-orange-600 dark:text-vawc-orange-400 pl-1">
            {{ stats.unreviewedCount || 0 }}
          </p>
        </div>

        <!-- Reviewed -->
        <div class="stat-pill flex-col items-start gap-1">
          <div class="flex items-center gap-2 w-full">
            <div class="p-2.5 rounded-xl bg-safety-teal-50 dark:bg-safety-teal-900/20 border border-safety-teal-100 dark:border-safety-teal-800/30">
              <CheckCircle2Icon class="w-3.5 h-3.5 text-safety-teal-600 dark:text-safety-teal-400" />
            </div>
            <p class="stat-pill-label">Reviewed</p>
          </div>
          <p class="stat-pill-value text-safety-teal-600 dark:text-safety-teal-400 pl-1">
            {{ reviewedCount }}
          </p>
        </div>
      </div>

      <!-- ── Filter Bar ────────────────────────────────────────── -->
      <div class="card">
        <div class="flex flex-wrap gap-3 items-center">
          <!-- Risk filter -->
          <div class="relative">
            <select
              v-model="filters.riskLevel"
              @change="fetchResults(1)"
              class="input-field !py-2 !pr-8 appearance-none cursor-pointer min-w-[140px]"
            >
              <option value="">All Risk Levels</option>
              <option value="Severe">Severe</option>
              <option value="High">High</option>
              <option value="Moderate">Moderate</option>
              <option value="Low">Low</option>
            </select>
            <ChevronDownIcon class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-platinum-400" />
          </div>

          <!-- Checkbox: Flagged only -->
          <label class="filter-toggle">
            <input
              type="checkbox"
              v-model="filters.flaggedOnly"
              @change="fetchResults(1)"
              class="filter-checkbox"
            />
            <FlagIcon class="w-3 h-3 text-red-500" />
            <span>Flagged only</span>
          </label>

          <!-- Checkbox: Unreviewed only -->
          <label class="filter-toggle">
            <input
              type="checkbox"
              v-model="filters.unreviewedOnly"
              @change="fetchResults(1)"
              class="filter-checkbox"
            />
            <ClockIcon class="w-3 h-3 text-vawc-orange-500" />
            <span>Unreviewed only</span>
          </label>

          <!-- Result count -->
          <div class="ml-auto stat-pill !py-1.5 !px-3 gap-2">
            <ListIcon class="w-3.5 h-3.5 text-platinum-400" />
            <p class="stat-pill-label !text-slate-600 dark:!text-platinum-400">
              {{ resultsMeta.total }} result{{ resultsMeta.total !== 1 ? 's' : '' }}
            </p>
          </div>
        </div>
      </div>

      <!-- ── Results Table ─────────────────────────────────────── -->
      <div class="card !p-0 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[860px]">
            <thead>
              <tr class="border-b border-slate-100 dark:border-abyss-500 bg-slate-50 dark:bg-abyss-700">
                <th v-for="col in columns" :key="col" class="th-cell">{{ col }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in results"
                :key="item.id"
                class="table-row group"
              >
                <!-- Student -->
                <td class="td-cell">
                  <div class="flex items-center gap-2.5">
                    <div class="w-7 h-7 rounded-lg bg-calm-lavender-100 dark:bg-calm-lavender-900/30 border border-calm-lavender-200 dark:border-calm-lavender-800/40 flex items-center justify-center shrink-0">
                      <span class="font-dosis text-[10px] font-bold text-calm-lavender-700 dark:text-calm-lavender-400">
                        {{ (item.student?.name || 'U')[0].toUpperCase() }}
                      </span>
                    </div>
                    <span class="font-mplusrounded text-sm font-medium text-slate-700 dark:text-platinum-200 truncate max-w-[120px]">
                      {{ item.student?.name || 'Unknown' }}
                    </span>
                  </div>
                </td>

                <!-- Quiz -->
                <td class="td-cell">
                  <span class="font-mplusrounded text-sm text-slate-600 dark:text-platinum-400 truncate max-w-[160px] block">
                    {{ item.quiz?.title || '—' }}
                  </span>
                </td>

                <!-- Risk badge -->
                <td class="td-cell">
                  <span :class="['badge', riskBadgeClass(item.overall_risk_level)]">
                    {{ item.overall_risk_level }}
                  </span>
                </td>

                <!-- Category -->
                <td class="td-cell">
                  <span class="badge badge-muted">{{ item.dominant_category }}</span>
                </td>

                <!-- Flags -->
                <td class="td-cell">
                  <div class="flex items-center gap-1.5">
                    <FlagIcon v-if="item.concerning_answers_count > 0"
                      class="w-3 h-3 text-red-400 shrink-0" />
                    <span class="font-dosis text-xs font-semibold"
                      :class="item.concerning_answers_count > 0 ? 'text-red-600 dark:text-red-400' : 'text-platinum-500'">
                      {{ item.concerning_answers_count || 0 }}
                    </span>
                  </div>
                </td>

                <!-- Status -->
                <td class="td-cell">
                  <span :class="['badge', item.reviewed ? 'badge-teal' : 'badge-orange']">
                    {{ item.reviewed ? 'Reviewed' : 'Pending' }}
                  </span>
                </td>

                <!-- Date -->
                <td class="td-cell">
                  <span class="font-dosis text-xs text-platinum-500 whitespace-nowrap">
                    {{ formatDate(item.created_at) }}
                  </span>
                </td>

                <!-- Action -->
                <td class="td-cell">
                  <button
                    @click="openDetail(item.id)"
                    class="btn-secondary !px-3 !py-1.5 !text-xs group-hover:border-calm-lavender-300 dark:group-hover:border-calm-lavender-700/60 transition-colors"
                  >
                    <EyeIcon class="w-3.5 h-3.5" />
                    View
                  </button>
                </td>
              </tr>

              <!-- Empty state -->
              <tr v-if="!results.length">
                <td colspan="8" class="py-14 text-center">
                  <div class="flex flex-col items-center gap-2">
                    <div class="p-3 rounded-2xl bg-slate-100 dark:bg-abyss-700 border border-slate-200 dark:border-abyss-600 mb-1">
                      <BarChart3Icon class="w-6 h-6 text-platinum-400" />
                    </div>
                    <p class="font-mplusrounded text-sm font-medium text-slate-600 dark:text-platinum-400">
                      No ML analysis results yet.
                    </p>
                    <p class="field-subtext">Results will appear once students complete behavioural assessments.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ── Analysis Detail Panel ─────────────────────────────── -->
      <Transition name="detail-slide">
        <div v-if="detail" class="card space-y-5">

          <!-- Detail header -->
          <div class="flex items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-abyss-500">
            <div class="flex items-center gap-3">
              <div class="card-icon-wrap">
                <BrainCircuitIcon class="w-4 h-4 text-calm-lavender-600 dark:text-calm-lavender-400" />
              </div>
              <div>
                <p class="section-eyebrow">Analysis Detail</p>
                <h2 class="font-madimione text-xl text-slate-800 dark:text-platinum-100 leading-tight">
                  {{ detail.student?.name || 'Unknown Student' }}
                </h2>
              </div>
            </div>
            <button @click="detail = null" class="btn-secondary !px-3 !py-1.5">
              <XIcon class="w-3.5 h-3.5" />
              <span class="font-dosis text-xs font-medium">Close</span>
            </button>
          </div>

          <!-- Overview info-rows -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div class="info-row">
              <span class="info-label">Quiz</span>
              <span class="font-mplusrounded text-sm text-slate-700 dark:text-platinum-200 truncate max-w-[160px]">
                {{ detail.quiz?.title || '—' }}
              </span>
            </div>
            <div class="info-row">
              <span class="info-label">Risk Level</span>
              <span :class="['badge', riskBadgeClass(detail.overall_risk_level)]">
                {{ detail.overall_risk_level }}
              </span>
            </div>
            <div class="info-row">
              <span class="info-label">Category</span>
              <span class="badge badge-muted">{{ detail.dominant_category }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Status</span>
              <span :class="['badge', detail.reviewed ? 'badge-teal' : 'badge-orange']">
                {{ detail.reviewed ? 'Reviewed' : 'Pending Review' }}
              </span>
            </div>
          </div>

          <!-- Per-answer breakdown -->
          <div v-if="detail.analysis_results?.length" class="space-y-2.5">
            <p class="section-eyebrow pt-1">Per-Answer Breakdown</p>

            <div
              v-for="(a, idx) in detail.analysis_results"
              :key="idx"
              :class="['answer-card', answerCardAccent(a.risk_level)]"
            >
              <!-- Risk badge + index -->
              <div class="flex items-center justify-between mb-2.5">
                <span class="font-dosis text-[10px] font-semibold text-platinum-500 uppercase tracking-wider">
                  Answer {{ idx + 1 }}
                </span>
                <span :class="['badge', riskBadgeClass(a.risk_level)]">
                  {{ a.risk_level }}
                </span>
              </div>

              <!-- Question -->
              <p v-if="a.question_text"
                class="font-mplusrounded text-sm font-medium leading-relaxed text-slate-700 dark:text-platinum-200 mb-2">
                {{ a.question_text }}
              </p>

              <!-- Divider -->
              <div class="h-px bg-slate-100 dark:bg-abyss-500 my-2"></div>

              <!-- Key-value rows -->
              <div class="space-y-1.5">
                <div class="flex items-start gap-2">
                  <span class="info-label mt-0.5 shrink-0 w-24">Response</span>
                  <p class="font-mplusrounded text-sm leading-relaxed text-slate-600 dark:text-platinum-400">
                    {{ a.selected_answer || a.answer_text || '—' }}
                  </p>
                </div>
                <div class="flex items-center gap-2">
                  <span class="info-label shrink-0 w-24">Category</span>
                  <span class="badge badge-muted">{{ a.category }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- No answers fallback -->
          <div v-else class="py-6 text-center">
            <p class="field-subtext">No per-answer data available for this result.</p>
          </div>
        </div>
      </Transition>

    </template>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import api from '@/utils/api';
import {
  RefreshCw as RefreshCwIcon,
  AlertCircle as AlertCircleIcon,
  BarChart3 as BarChart3Icon,
  Flag as FlagIcon,
  Clock as ClockIcon,
  CheckCircle2 as CheckCircle2Icon,
  ChevronDown as ChevronDownIcon,
  List as ListIcon,
  Eye as EyeIcon,
  X as XIcon,
  BrainCircuit as BrainCircuitIcon,
} from 'lucide-vue-next';

// ── State (preserved exactly) ──────────────────────────────────
const loading = ref(true);
const error   = ref('');
const stats   = ref({});
const results = ref([]);
const detail  = ref(null);

const resultsMeta = reactive({ page: 1, totalPages: 1, total: 0 });
const filters     = reactive({ riskLevel: '', flaggedOnly: false, unreviewedOnly: false });

// ── Computed (preserved exactly) ──────────────────────────────
// const reviewedCount = computed(() => {
//   const total   = stats.value.totalAnalyses  || 0;
//   const pending = stats.value.unreviewedCount || 0;
//   return Math.max(0, total - pending);
// });

// ── Table columns ─────────────────────────────────────────────
const columns = ['Student', 'Quiz', 'Risk', 'Category', 'Flags', 'Status', 'Date', 'Action'];

// ── Helpers ───────────────────────────────────────────────────
const formatDate = (d) => (d ? new Date(d).toLocaleString() : '—');

const riskBadgeClass = (risk) => {
  if (risk === 'Severe')   return 'badge-red';
  if (risk === 'High')     return 'badge-orange';
  if (risk === 'Moderate') return 'badge badge-orange'; // reuse orange at lower intensity
  return 'badge-teal';
};

const answerCardAccent = (risk) => {
  if (risk === 'Severe')   return 'answer-card--red';
  if (risk === 'High')     return 'answer-card--orange';
  if (risk === 'Moderate') return 'answer-card--amber';
  return 'answer-card--teal';
};

// ── API (preserved exactly) ───────────────────────────────────
const fetchStats = async () => {
  const { data } = await api.get('/api/v1/ml-analysis/facilitator/stats');
  if (!data.success) throw new Error(data.message || 'Failed to fetch stats');
  stats.value = data.stats || {};
};

const fetchResults = async (page = 1) => {
  const params = new URLSearchParams({ page, limit: 20 });
  if (filters.riskLevel)     params.append('riskLevel',  filters.riskLevel);
  if (filters.flaggedOnly)   params.append('flaggedOnly', 'true');
  if (filters.unreviewedOnly) params.append('reviewed',  'false');

  const { data } = await api.get(`/api/v1/ml-analysis/facilitator/results?${params.toString()}`);
  if (!data.success) throw new Error(data.message || 'Failed to fetch results');

  results.value        = data.results   || [];
  resultsMeta.page      = data.page      || 1;
  resultsMeta.totalPages = data.totalPages || 1;
  resultsMeta.total     = data.total     || 0;
};

const openDetail = async (id) => {
  const { data } = await api.get(`/api/v1/ml-analysis/${id}`);
  if (!data.success) throw new Error(data.message || 'Failed to fetch detail');
  detail.value = data.result;
};

const refreshAll = async () => {
  loading.value = true;
  error.value   = '';
  try {
    await Promise.all([fetchStats(), fetchResults(1)]);
  } catch (e) {
    error.value = e?.response?.data?.message || e.message || 'Failed to load analytics.';
  } finally {
    loading.value = false;
  }
};

onMounted(refreshAll);
</script>

<style scoped>
@reference "@/style.css";

/* ── Table ──────────────────────────────────────────────────── */
.th-cell {
  @apply px-4 py-3;
  @apply font-dosis text-[10px] font-semibold uppercase tracking-widest;
  @apply text-platinum-500 dark:text-platinum-600;
  @apply text-left;
}

.td-cell {
  @apply px-4 py-3;
}

.table-row {
  @apply border-b border-slate-100 dark:border-abyss-600;
  @apply hover:bg-slate-50 dark:hover:bg-abyss-700/50;
  @apply transition-colors duration-150;
}

/* ── Filter toggles ─────────────────────────────────────────── */
.filter-toggle {
  @apply flex items-center gap-2 cursor-pointer select-none;
  @apply font-dosis text-xs font-semibold text-slate-600 dark:text-platinum-400;
  @apply px-3 py-2 rounded-xl;
  @apply bg-slate-50 dark:bg-abyss-700;
  @apply border border-slate-200 dark:border-abyss-500;
  @apply hover:border-calm-lavender-200 dark:hover:border-calm-lavender-800/50;
  @apply transition-all;
}

.filter-checkbox {
  @apply accent-calm-lavender-600 w-3.5 h-3.5 cursor-pointer;
}

/* ── Answer cards (per-answer breakdown) ────────────────────── */
.answer-card {
  @apply p-4 rounded-xl border-l-4;
  @apply bg-slate-50 dark:bg-abyss-700;
  @apply border border-slate-200 dark:border-abyss-500;
}

.answer-card--red    { @apply border-l-red-500; }
.answer-card--orange { @apply border-l-vawc-orange-500; }
.answer-card--amber  { @apply border-l-amber-400; }
.answer-card--teal   { @apply border-l-safety-teal-500; }

/* ── Detail slide transition ────────────────────────────────── */
.detail-slide-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.detail-slide-leave-active {
  transition: all 0.2s ease-in;
}
.detail-slide-enter-from,
.detail-slide-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>