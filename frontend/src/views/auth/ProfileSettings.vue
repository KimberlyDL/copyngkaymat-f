<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@stores/auth'
import { User, Lock, Eye, EyeOff, Settings, Camera, Lightbulb, ShieldCheck, Upload } from 'lucide-vue-next'
import { useToast } from '@/utils/useToast'

// --- Component: ToggleSwitch ---
const ToggleSwitch = {
  props: ['modelValue', 'label'],
  emits: ['update:modelValue'],
  template: `
    <div class="flex items-center justify-between py-3 group">
      <label v-if="label" class="font-dosis text-xs font-semibold text-platinum-600 dark:text-platinum-400 cursor-pointer group-hover:text-calm-lavender-600 dark:group-hover:text-calm-lavender-400 transition-colors">{{ label }}</label>
      <button @click="$emit('update:modelValue', !modelValue)"
        :class="modelValue ? 'bg-calm-lavender-600 dark:bg-calm-lavender-500' : 'bg-slate-200 dark:bg-abyss-500'"
        class="relative inline-flex flex-shrink-0 h-6 w-11 rounded-full cursor-pointer transition-all duration-300 focus:outline-none border-2"
        :style="modelValue ? 'border-color: var(--color-calm-lavender-700)' : 'border-color: transparent'">
        <span :class="modelValue ? 'translate-x-5' : 'translate-x-1'"
          class="mt-1 pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-300">
        </span>
      </button>
    </div>
  `,
}

const auth = useAuthStore()
const toast = useToast()

const isSaving = ref(false)
const avatarFile = ref(null)

const form = reactive({ name: '', email: '', phone: '', bio: '', avatar_url: '' })
const initialForm = ref({})

const preferences = reactive({
  emailNotifications: true,
  darkMode: true,
  publicProfile: false,
})

onMounted(async () => {
  if (!auth.user) await auth.restoreSession()
  const u = auth.user || {}
  Object.assign(form, {
    name: u.name || '',
    email: u.email || '',
    phone: u.phone || '',
    bio: u.bio || '',
    avatar_url: u.avatar_url || ''
  })
  initialForm.value = JSON.parse(JSON.stringify(form))
})

const hasChanges = computed(() => JSON.stringify(form) !== JSON.stringify(initialForm.value))

function handleAvatarInput(e) {
  const file = e.target.files?.[0]
  if (!file) return
  avatarFile.value = file
  form.avatar_url = URL.createObjectURL(file)
}

function removeAvatar() {
  avatarFile.value = null
  form.avatar_url = ''
}

async function onUploadAvatar() {
  if (!avatarFile.value) return
  isSaving.value = true
  try {
    await auth.uploadAvatar(avatarFile.value)
    toast.success('Photo updated!')
    initialForm.value.avatar_url = form.avatar_url
  } catch (e) {
    toast.error('Could not update photo')
  } finally {
    isSaving.value = false
  }
}

async function onSaveProfile() {
  isSaving.value = true
  try {
    await auth.updateProfile({ ...form })
    initialForm.value = JSON.parse(JSON.stringify(form))
    toast.success('Profile saved!')
  } catch (e) {
    toast.error('Could not save profile')
  } finally {
    isSaving.value = false
  }
}

/* -------- Password -------- */
const pwd = reactive({ current_password: '', password: '', password_confirmation: '' })
const pwdSaving = ref(false)
const show = reactive({ current: false, new: false, confirm: false })

const pwdHints = computed(() => ({
  min8:  pwd.password.length >= 8,
  mixed: /[a-z]/.test(pwd.password) && /[A-Z]/.test(pwd.password),
  num:   /\d/.test(pwd.password),
  match: !!pwd.password && pwd.password === pwd.password_confirmation,
}))

const strengthWidth = computed(() => {
  const count = Object.values(pwdHints.value).filter(Boolean).length
  return ['0%', '25%', '50%', '75%', '100%'][count]
})

const strengthColor = computed(() => {
  const count = Object.values(pwdHints.value).filter(Boolean).length
  return ['bg-slate-300', 'bg-red-500', 'bg-vawc-orange-400', 'bg-calm-lavender-400', 'bg-safety-teal-500'][count]
})

async function onChangePassword() {
  if (!Object.values(pwdHints.value).every(Boolean)) {
    toast.error('Please fix all password requirements')
    return
  }
  pwdSaving.value = true
  try {
    await auth.changePassword({ ...pwd })
    toast.success('Password changed!')
    Object.assign(pwd, { current_password: '', password: '', password_confirmation: '' })
  } catch (e) {
    toast.error('Could not change password')
  } finally {
    pwdSaving.value = false
  }
}
</script>

<template>
  <div class="page-wrapper animate-in pb-20">

    <!-- Header -->
    <div class="page-header">
      <div class="flex items-center gap-4">
        <div class="ds-icon-badge ds-icon-badge--lavender">
          <Settings class="w-5 h-5" />
        </div>
        <div>
          <p class="section-eyebrow">Account</p>
          <h1 class="page-title">
            My <span class="brand-gradient-text">Settings</span>
          </h1>
        </div>
      </div>
      <p class="page-subtitle">Update your profile, photo, and password here.</p>
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">

      <!-- Left — main forms -->
      <div class="lg:col-span-8 space-y-6">

        <!-- Profile Photo -->
        <section class="card border-2 border-slate-200 dark:border-abyss-500 rounded-2xl overflow-hidden p-0">
          <div class="flex items-center gap-3 px-6 py-4 container-bg border-b-2 border-slate-200 dark:border-abyss-500">
            <div class="ds-icon-badge ds-icon-badge--lavender !p-2">
              <Camera class="w-4 h-4" />
            </div>
            <span class="section-eyebrow">Profile Photo</span>
          </div>

          <div class="p-6">
            <div class="flex flex-col sm:flex-row items-center gap-6">
              <div class="w-24 h-24 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-abyss-500 shrink-0">
                <img :src="form.avatar_url || '/placeholder.svg'" class="w-full h-full object-cover" />
              </div>

              <div class="flex-1 space-y-4 w-full text-center sm:text-left">
                <div @click="$refs.avatarInput?.click()"
                  class="border-2 border-dashed border-slate-200 dark:border-abyss-500 rounded-xl p-5 cursor-pointer hover:border-calm-lavender-300 dark:hover:border-calm-lavender-700 hover:bg-calm-lavender-50 dark:hover:bg-calm-lavender-900/10 transition-all group">
                  <Upload class="w-5 h-5 text-platinum-400 group-hover:text-calm-lavender-500 mx-auto mb-1.5 transition-colors" />
                  <p class="font-mplusrounded text-sm font-medium text-slate-500 dark:text-platinum-400">Click to upload new photo</p>
                </div>
                <input ref="avatarInput" type="file" accept="image/*" class="hidden" @change="handleAvatarInput" />

                <div class="flex flex-wrap gap-3 justify-center sm:justify-start">
                  <button :disabled="!avatarFile || isSaving" @click="onUploadAvatar" class="btn-primary btn-3d disabled:opacity-30">
                    Save Photo
                  </button>
                  <button @click="removeAvatar" class="btn-secondary hover:text-red-500 hover:border-red-200 dark:hover:border-red-800/40">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Profile Info -->
        <section class="card border-2 border-slate-200 dark:border-abyss-500 rounded-2xl overflow-hidden p-0">
          <div class="flex items-center gap-3 px-6 py-4 container-bg border-b-2 border-slate-200 dark:border-abyss-500">
            <div class="ds-icon-badge ds-icon-badge--lavender !p-2">
              <User class="w-4 h-4" />
            </div>
            <span class="section-eyebrow">My Info</span>
          </div>

          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div class="space-y-1.5">
                <label class="field-label">Full Name</label>
                <input v-model="form.name" type="text" class="input-field" />
              </div>
              <div class="space-y-1.5">
                <label class="field-label">Email (cannot change)</label>
                <div class="relative">
                  <input :value="form.email" disabled class="input-field opacity-50 cursor-not-allowed" />
                  <Lock class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-platinum-400" />
                </div>
              </div>
            </div>
            <div class="space-y-1.5 mb-6">
              <label class="field-label">About Me</label>
              <textarea
                v-model="form.bio"
                rows="3"
                class="input-field resize-none"
                placeholder="Tell us a little about yourself…"
              ></textarea>
            </div>
            <div class="flex justify-end gap-3 border-t-2 border-platinum-200 dark:border-abyss-600 pt-5">
              <button @click="() => Object.assign(form, initialForm)" :disabled="!hasChanges || isSaving" class="btn-secondary disabled:opacity-30">
                Undo Changes
              </button>
              <button @click="onSaveProfile" :disabled="!hasChanges || isSaving" class="btn-primary btn-3d disabled:opacity-30">
                Save Profile
              </button>
            </div>
          </div>
        </section>

      </div>

      <!-- Right — sidebar -->
      <div class="lg:col-span-4 space-y-5">

        <!-- Preferences -->
        <section class="card border-2 border-slate-200 dark:border-abyss-500 rounded-2xl lg:sticky lg:top-6">
          <div class="flex items-center gap-3 mb-5">
            <div class="ds-icon-badge ds-icon-badge--pink !p-2">
              <Lightbulb class="w-4 h-4" />
            </div>
            <span class="section-eyebrow text-neon-pink-600 dark:text-neon-pink-400">Preferences</span>
          </div>
          <div class="space-y-1 border-b-2 border-platinum-200 dark:border-abyss-600 pb-4">
            <ToggleSwitch v-model="preferences.emailNotifications" label="Email Alerts" />
            <ToggleSwitch v-model="preferences.darkMode" label="Dark Mode" />
            <ToggleSwitch v-model="preferences.publicProfile" label="Public Profile" />
          </div>
        </section>

        <!-- Password -->
        <section class="card border-2 border-slate-200 dark:border-abyss-500 rounded-2xl">
          <div class="flex items-center gap-3 mb-5">
            <div class="ds-icon-badge ds-icon-badge--lavender !p-2">
              <ShieldCheck class="w-4 h-4" />
            </div>
            <span class="section-eyebrow">Security</span>
          </div>

          <div class="space-y-3">
            <!-- Current password -->
            <div class="relative">
              <input
                :type="show.current ? 'text' : 'password'"
                v-model="pwd.current_password"
                placeholder="Current password"
                class="input-field !pr-10"
              />
              <button @click="show.current = !show.current" type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-platinum-400 hover:text-calm-lavender-500 transition-colors">
                <Eye v-if="!show.current" class="w-4 h-4" />
                <EyeOff v-else class="w-4 h-4" />
              </button>
            </div>

            <!-- New password -->
            <div class="relative">
              <input
                :type="show.new ? 'text' : 'password'"
                v-model="pwd.password"
                placeholder="New password"
                class="input-field !pr-10"
              />
              <button @click="show.new = !show.new" type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-platinum-400 hover:text-calm-lavender-500 transition-colors">
                <Eye v-if="!show.new" class="w-4 h-4" />
                <EyeOff v-else class="w-4 h-4" />
              </button>
            </div>

            <!-- Strength bar -->
            <div v-if="pwd.password" class="space-y-2 px-1 animate-in">
              <div class="progress-track">
                <div class="progress-fill" :class="strengthColor" :style="{ width: strengthWidth }"></div>
              </div>
              <div class="grid grid-cols-2 gap-1.5">
                <div
                  v-for="(hint, key) in { min8: '8+ characters', mixed: 'Upper & lower', num: 'Has number', match: 'Passwords match' }"
                  :key="key"
                  :class="pwdHints[key] ? 'text-safety-teal-600 dark:text-safety-teal-400' : 'text-platinum-400 dark:text-platinum-600'"
                  class="font-dosis text-[10px] font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <div class="w-1 h-1 rounded-full bg-current"></div> {{ hint }}
                </div>
              </div>
            </div>

            <!-- Confirm password -->
            <div class="relative">
              <input
                :type="show.confirm ? 'text' : 'password'"
                v-model="pwd.password_confirmation"
                placeholder="Confirm new password"
                class="input-field !pr-10"
              />
              <button @click="show.confirm = !show.confirm" type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-platinum-400 hover:text-calm-lavender-500 transition-colors">
                <Eye v-if="!show.confirm" class="w-4 h-4" />
                <EyeOff v-else class="w-4 h-4" />
              </button>
            </div>

            <button @click="onChangePassword" :disabled="pwdSaving" class="btn-primary btn-3d w-full justify-center mt-1 disabled:opacity-50">
              <span class="main-button-text">Change Password</span>
            </button>
          </div>
        </section>

      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "@/style.css";

.animate-in {
  animation: fadeSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

.ds-icon-badge {
  @apply p-2.5 rounded-xl border-2 flex items-center justify-center shrink-0;
}

.ds-icon-badge--lavender {
  @apply bg-calm-lavender-50 dark:bg-calm-lavender-900/20;
  @apply border-calm-lavender-200 dark:border-calm-lavender-800/40;
  @apply text-calm-lavender-600 dark:text-calm-lavender-400;
}

.ds-icon-badge--pink {
  @apply bg-neon-pink-50 dark:bg-neon-pink-900/20;
  @apply border-neon-pink-200 dark:border-neon-pink-800/40;
  @apply text-neon-pink-600 dark:text-neon-pink-400;
}

.btn-3d {
  @apply border-b-4 border-black/10 active:border-b active:translate-y-px;
}
</style>