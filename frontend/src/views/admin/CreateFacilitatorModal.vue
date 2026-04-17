<template>
  <div
    class="fixed inset-0 z-[100] bg-abyss-950/60 overflow-y-auto flex items-start justify-center pt-16 px-6 pb-10"
    @click.self="$emit('close')"
  >
    <div class="modal-shell animate-modal">

      <!-- Header -->
      <header class="modal-header">
        <div class="flex items-center gap-4">
          <div class="ds-icon-badge ds-icon-badge--lavender">
            <UserPlusIcon class="w-4 h-4" />
          </div>
          <div>
            <p class="section-eyebrow">User Management</p>
            <h2 class="font-madimione text-2xl text-abyss-800 dark:text-platinum-100 leading-tight">
              Add <span class="brand-gradient-text">New User</span>
            </h2>
          </div>
        </div>
        <button @click="$emit('close')" class="close-btn" aria-label="Close">
          <XIcon class="w-4 h-4" />
        </button>
      </header>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="modal-body space-y-5">

        <div class="field-group">
          <label class="field-label">Full Name <span class="text-red-400">*</span></label>
          <input
            v-model.trim="form.name"
            type="text"
            required
            placeholder="e.g. John Dela Cruz"
            class="input-field placeholder:text-platinum-700 dark:placeholder:text-platinum-400"
            :class="errors.name ? 'border-red-400 dark:border-red-700 bg-red-50 dark:bg-red-900/10' : ''"
          />
          <p v-if="errors.name" class="field-subtext-error">{{ errors.name }}</p>
        </div>

        <div class="field-group">
          <label class="field-label">Email Address <span class="text-red-400">*</span></label>
          <input
            v-model.trim="form.email"
            type="email"
            required
            placeholder="john.delacruz@school.edu"
            class="input-field placeholder:text-platinum-700 dark:placeholder:text-platinum-400"
            :class="errors.email ? 'border-red-400 dark:border-red-700 bg-red-50 dark:bg-red-900/10' : ''"
          />
          <p v-if="errors.email" class="field-subtext-error">{{ errors.email }}</p>
        </div>

        <div class="field-group">
          <label class="field-label">Access Level <span class="text-red-400">*</span></label>
          <div class="ds-select-wrap">
            <select v-model="form.role" required class="ds-select">
              <option value="educator">Educator / Facilitator</option>
              <option value="moderator">Moderator</option>
            </select>
            <ChevronDownIcon class="ds-select-icon" />
          </div>
        </div>

        <div class="info-notice">
          <div class="ds-icon-badge ds-icon-badge--lavender !p-1.5 shrink-0">
            <InfoIcon class="w-3.5 h-3.5" />
          </div>
          <div class="space-y-0.5">
            <p class="font-dosis font-semibold text-sm text-abyss-800 dark:text-platinum-100">Next Step</p>
            <p class="font-mplusrounded text-xs text-platinum-600 dark:text-platinum-500 leading-relaxed">
              A welcome email with a secure temporary password will be sent automatically.
            </p>
          </div>
        </div>

      </form>

      <!-- Footer -->
      <footer class="modal-footer">
        <button type="button" @click="$emit('close')" class="btn-secondary btn-3d--secondary justify-center flex-1 max-w-[160px]">
          Cancel
        </button>
        <button type="submit" @click="handleSubmit" :disabled="isLoading" class="btn-primary btn-3d justify-center flex-1 max-w-[240px] disabled:opacity-50 disabled:cursor-not-allowed">
          <span v-if="!isLoading">Create Account</span>
          <div v-else class="flex items-center gap-2">
            <div class="spinner !w-4 !h-4 !border-2 !border-white/30 !border-t-white"></div>
            Processing…
          </div>
        </button>
      </footer>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { X as XIcon, Info as InfoIcon, ChevronDown as ChevronDownIcon, UserPlus as UserPlusIcon } from 'lucide-vue-next';
import { useToast } from '@/utils/useToast';
import api from '@/utils/api';

const emit = defineEmits(['close', 'created']);
const toast = useToast();

const form = ref({ name: '', email: '', role: 'educator' });
const errors = ref({});
const isLoading = ref(false);

const handleSubmit = async () => {
  errors.value = {};
  isLoading.value = true;
  try {
    const { data } = await api.post('/api/v1/facilitators', form.value);
    toast.success(`Account created! Welcome email sent to ${form.value.email}`);
    emit('created', data.facilitator);
  } catch (error) {
    const errorData = error.response?.data;
    if (errorData?.errors) errors.value = errorData.errors;
    toast.error(errorData?.message || 'Setup failed');
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
@reference "@/style.css";

.modal-shell {
  @apply relative w-full max-w-lg flex flex-col;
  @apply bg-platinum-100 dark:bg-abyss-700;
  @apply border-2 border-platinum-300 dark:border-abyss-500;
  @apply rounded-2xl overflow-hidden;
}

.modal-header {
  @apply flex items-center justify-between shrink-0 px-7 py-5;
  @apply bg-platinum-200 dark:bg-abyss-600;
  @apply border-b-2 border-platinum-300 dark:border-abyss-500;
}

.modal-body { @apply px-7 py-6; }

.modal-footer {
  @apply flex items-center justify-end gap-3 shrink-0 px-7 py-5;
  @apply bg-platinum-200 dark:bg-abyss-600;
  @apply border-t-2 border-platinum-300 dark:border-abyss-500;
}

.close-btn {
  @apply p-2 rounded-xl shrink-0 transition-all duration-150;
  @apply bg-platinum-300 dark:bg-abyss-500 border-2 border-platinum-300 dark:border-abyss-400;
  @apply text-platinum-600 dark:text-platinum-400;
  @apply hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800/40 hover:text-red-500 dark:hover:text-red-400;
}

.field-group { @apply space-y-1.5; }

.ds-select-wrap { @apply relative; }
.ds-select {
  @apply w-full appearance-none cursor-pointer transition-all duration-150;
  @apply bg-platinum-200 dark:bg-abyss-600 border-2 border-platinum-300 dark:border-abyss-500;
  @apply hover:border-calm-lavender-300 dark:hover:border-calm-lavender-700;
  @apply text-abyss-800 dark:text-platinum-200 font-medium text-sm;
  @apply rounded-xl px-4 py-3 pr-10;
  @apply focus:outline-none focus:ring-2 focus:ring-calm-lavender-400/40 focus:border-calm-lavender-400;
}
.ds-select-icon { @apply absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none w-4 h-4 text-platinum-500 dark:text-platinum-400; }

.ds-icon-badge { @apply p-2.5 rounded-xl border-2 flex items-center justify-center shrink-0; }
.ds-icon-badge--lavender {
  @apply bg-calm-lavender-50 dark:bg-calm-lavender-900/20;
  @apply border-calm-lavender-200 dark:border-calm-lavender-800/40;
  @apply text-calm-lavender-600 dark:text-calm-lavender-400;
}

.info-notice {
  @apply flex items-start gap-3 p-4 rounded-xl;
  @apply bg-platinum-200 dark:bg-abyss-600;
  @apply border-2 border-calm-lavender-200 dark:border-calm-lavender-800/40;
}

.btn-3d { @apply border-b-4 border-black/10 active:border-b active:translate-y-px; }
.btn-3d--secondary { @apply border-b-4 border-platinum-400 dark:border-abyss-400 active:border-b active:translate-y-px; }

.animate-modal {
  animation: modalEntry 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes modalEntry {
  from { opacity: 0; transform: scale(0.97) translateY(16px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

select option { @apply bg-platinum-50 text-abyss-800; }
.dark select option { @apply bg-abyss-600 text-platinum-100; }
</style>