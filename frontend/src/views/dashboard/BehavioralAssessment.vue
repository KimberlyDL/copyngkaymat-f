<template>
  <section class="min-h-[70vh]">
    <div class="max-w-4xl mx-auto space-y-6">

      <!-- Header -->
      <header class="rounded-2xl border-2 p-6 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/40">
        <p class="section-eyebrow text-red-600 dark:text-red-400">Early Intervention Tool</p>
        <h1 class="page-title mt-1">Behavioral Pattern &amp; Risk Check</h1>
        <p class="font-mplusrounded text-sm font-normal leading-relaxed text-platinum-700 dark:text-platinum-300 mt-2">
          This dedicated questionnaire is separate from gamified quizzes and is used for behavioral screening and support recommendations.
        </p>
      </header>

      <!-- Loading -->
      <div v-if="loading" class="container-bg rounded-2xl border-2 border-platinum-300 dark:border-abyss-500 p-8 text-center">
        <div class="spinner mx-auto mb-3"></div>
        <p class="loading-text">Loading assessment questionnaire…</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="rounded-2xl border-2 p-6 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/40">
        <p class="font-mplusrounded text-sm text-red-600 dark:text-red-300 leading-relaxed">{{ error }}</p>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="submitAssessment" class="space-y-4">

        <article
          v-for="(q, index) in questions"
          :key="q.id || index"
          class="container-bg rounded-2xl border-2 border-platinum-300 dark:border-abyss-500 p-5"
        >
          <p class="section-eyebrow">Question {{ index + 1 }}</p>
          <h2 class="font-madimione text-base text-abyss-800 dark:text-platinum-100 mt-1">{{ q.question }}</h2>

          <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label
              v-for="(option, optionIndex) in q.options"
              :key="`${q.id || index}-${optionIndex}`"
              class="flex items-center gap-2 rounded-xl border-2 px-3 py-2 cursor-pointer transition-all duration-150"
              :class="selectedIndex(index) === optionIndex
                ? 'bg-calm-lavender-50 dark:bg-calm-lavender-900/20 border-calm-lavender-300 dark:border-calm-lavender-700'
                : 'bg-white dark:bg-abyss-600 border-platinum-200 dark:border-abyss-500 hover:border-calm-lavender-300 dark:hover:border-calm-lavender-700'"
            >
              <input
                type="radio"
                :name="`q-${index}`"
                :value="optionIndex"
                v-model.number="answers[index].selectedOptionIndex"
                class="accent-calm-lavender-600"
              />
              <span class="font-mplusrounded text-sm text-abyss-700 dark:text-platinum-200">{{ option }}</span>
            </label>
          </div>
        </article>

        <!-- Safety notice -->
        <div class="rounded-2xl border-2 p-4 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700/40">
          <p class="font-mplusrounded text-xs leading-relaxed text-amber-700 dark:text-amber-300">
            This tool supports early intervention and guidance. It does not replace immediate emergency support when safety is at risk.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button
            type="submit"
            :disabled="submitting || !isComplete"
            class="btn-primary btn-3d disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="main-button-text">{{ submitting ? 'Submitting Assessment…' : 'Submit Assessment' }}</span>
          </button>
          <p v-if="!isComplete" class="font-mplusrounded text-xs text-platinum-500 dark:text-platinum-400">
            Answer all questions to submit.
          </p>
        </div>
      </form>

      <!-- Result -->
      <section v-if="result" class="rounded-2xl border-2 p-6 bg-safety-teal-50 dark:bg-safety-teal-900/20 border-safety-teal-200 dark:border-safety-teal-700/40">
        <h3 class="font-madimione text-lg text-abyss-800 dark:text-platinum-100">Assessment submitted</h3>
        <p class="font-mplusrounded text-sm leading-relaxed text-platinum-700 dark:text-platinum-300 mt-1">
          ML risk level: <span class="font-bold">{{ result.mlResult?.overall_risk_level || 'N/A' }}</span>
        </p>
        <p class="font-mplusrounded text-sm leading-relaxed text-platinum-700 dark:text-platinum-300 mt-1">
          Alert status: <span class="font-bold">{{ result.alertCreated ? 'Early-support alert created' : 'No new alert created' }}</span>
        </p>
      </section>

    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import api from '@/utils/api';

const loading = ref(true);
const submitting = ref(false);
const error = ref('');
const assessment = ref(null);
const questions = ref([]);
const answers = ref([]);
const result = ref(null);

const isComplete = computed(() =>
  answers.value.length > 0 && answers.value.every(a => Number.isInteger(a.selectedOptionIndex))
);

const selectedIndex = (index) => answers.value[index]?.selectedOptionIndex ?? null;

const loadQuestionnaire = async () => {
  loading.value = true;
  error.value = '';
  try {
    const { data } = await api.get('/api/v1/ml-analysis/assessment/questionnaire');
    assessment.value = data.assessment;
    questions.value = Array.isArray(data.assessment?.questions) ? data.assessment.questions : [];
    answers.value = questions.value.map((q) => ({
      questionId: q.id,
      selectedOptionIndex: null,
      selectedAnswer: ''
    }));
  } catch (err) {
    error.value = err?.response?.data?.message || 'Failed to load assessment questionnaire.';
  } finally {
    loading.value = false;
  }
};

const submitAssessment = async () => {
  if (!isComplete.value || submitting.value) return;
  submitting.value = true;
  error.value = '';
  try {
    const payloadAnswers = answers.value.map((a, index) => {
      const q = questions.value[index];
      const selected = q?.options?.[a.selectedOptionIndex] || '';
      return {
        questionId: q?.id,
        question: q?.question,
        selectedOptionIndex: a.selectedOptionIndex,
        selectedAnswer: selected
      };
    });
    const { data } = await api.post('/api/v1/ml-analysis/assessment/submit', {
      quizId: assessment.value?.id,
      answers: payloadAnswers
    });
    result.value = data?.data || null;
  } catch (err) {
    error.value = err?.response?.data?.message || 'Failed to submit assessment.';
  } finally {
    submitting.value = false;
  }
};

onMounted(loadQuestionnaire);
</script>

<style scoped>
@reference "@/style.css";

.btn-3d {
  @apply border-b-4 border-black/10 active:border-b active:translate-y-px;
}
</style>