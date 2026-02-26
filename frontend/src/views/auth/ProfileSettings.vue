<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@stores/auth'
import {
    User, Mail, Phone, MapPin, Save, Upload, X, Lock, Eye, EyeOff, Settings, Camera, Lightbulb
} from 'lucide-vue-next'
import { useToast } from '@/utils/useToast';

// --- Component: ToggleSwitch (Vibrant Theme) ---
const ToggleSwitch = {
    props: ['modelValue', 'label'],
    emits: ['update:modelValue'],
    template: `
        <div class="flex items-center justify-between py-3 group">
            <label v-if="label" class="text-gray-400 font-black uppercase tracking-widest text-[10px] cursor-pointer group-hover:text-white transition-colors">{{ label }}</label>
            <button @click="$emit('update:modelValue', !modelValue)"
                :class="modelValue ? 'bg-gradient-to-r from-blue-600 to-pink-600' : 'bg-white/10'"
                class="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-all duration-300 focus:outline-none ring-offset-black">
                <span :class="modelValue ? 'translate-x-5' : 'translate-x-0'"
                    class="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transform transition duration-300">
                </span>
            </button>
        </div>
    `,
}

const auth = useAuthStore()
const toast = useToast()

const isSaving = ref(false)
const avatarFile = ref(null)

const form = reactive({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    bio: '',
    avatar_url: '',
})
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
        address: u.address || '',
        city: u.city || '',
        country: u.country || '',
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
        toast.success('Visual identity updated!');
        initialForm.value.avatar_url = form.avatar_url
    } catch (e) {
        toast.error('Identity update failed.');
    } finally {
        isSaving.value = false
    }
}

async function onSaveProfile() {
    isSaving.value = true
    try {
        await auth.updateProfile({ ...form })
        initialForm.value = JSON.parse(JSON.stringify(form))
        toast.success('Profile Synced Successfully! 🚀');
    } catch (e) {
        toast.error('Sync failed.');
    } finally {
        isSaving.value = false
    }
}

/* -------- Password Logic ---------- */
const pwd = reactive({ current_password: '', password: '', password_confirmation: '' })
const pwdSaving = ref(false)
const show = reactive({ current: false, new: false, confirm: false })

const pwdHints = computed(() => ({
    min8: pwd.password.length >= 8,
    mixed: /[a-z]/.test(pwd.password) && /[A-Z]/.test(pwd.password),
    num: /\d/.test(pwd.password),
    match: !!pwd.password && pwd.password === pwd.password_confirmation,
}))

async function onChangePassword() {
    if (!Object.values(pwdHints.value).every(Boolean)) {
        toast.error('Fulfill all security protocols.');
        return
    }
    pwdSaving.value = true
    try {
        await auth.changePassword({ ...pwd })
        toast.success('Security Protocol Updated. 🎉');
        Object.assign(pwd, { current_password: '', password: '', password_confirmation: '' })
    } catch (e) {
        toast.error('Security update failed.');
    } finally {
        pwdSaving.value = false
    }
}
</script>

<template>
    <div class="min-h-screen bg-[#060606] font-['Poppins'] relative overflow-hidden pb-20">
        
        <div class="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
        <div class="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[120px] animate-pulse delay-1000 pointer-events-none"></div>

        <header class="relative z-10 pt-12 pb-8 px-6 max-w-6xl mx-auto">
            <div class="flex items-center gap-4 mb-2">
                <div class="p-3 rounded-2xl bg-gradient-to-tr from-blue-600 to-pink-600 shadow-lg">
                    <Settings class="w-6 h-6 text-white animate-spin-slow" />
                </div>
                <h1 class="text-4xl font-black text-white uppercase tracking-tighter">System <span class="bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">Settings</span></h1>
            </div>
            <p class="text-gray-500 font-medium tracking-tight ml-16 uppercase text-xs tracking-[0.2em]">Manage your digital footprint and security protocols</p>
        </header>

        <main class="relative z-10 max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div class="lg:col-span-2 space-y-8">
                
                <section class="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl group transition-all duration-500 hover:border-blue-500/30">
                    <h2 class="text-xs font-black uppercase tracking-[0.3em] text-gray-500 mb-8 flex items-center gap-3">
                        <Camera class="w-4 h-4 text-blue-500" /> Identity Image
                    </h2>
                    <div class="flex flex-col sm:flex-row items-center gap-10">
                        <div class="relative group/avatar">
                            <img :src="form.avatar_url || '/placeholder.svg'" class="w-32 h-32 rounded-[2rem] object-cover border-2 border-white/10 shadow-2xl transition-transform duration-500 group-hover/avatar:scale-105" />
                            <div class="absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-blue-600/20 to-pink-600/20 opacity-0 group-hover/avatar:opacity-100 transition-opacity"></div>
                        </div>
                        <div class="flex-1 space-y-4 w-full">
                            <div @click="$refs.avatarInput?.click()" class="border-2 border-dashed border-white/10 rounded-2xl p-6 text-center cursor-pointer hover:bg-white/5 hover:border-blue-500/50 transition-all group/upload">
                                <Upload class="w-6 h-6 text-gray-500 group-hover/upload:text-blue-400 mx-auto mb-2 transition-colors" />
                                <p class="text-white text-xs font-black uppercase tracking-widest">Deploy New Visual</p>
                            </div>
                            <input ref="avatarInput" type="file" accept="image/*" class="hidden" @change="handleAvatarInput" />
                            <div class="flex gap-3">
                                <button :disabled="!avatarFile || isSaving" @click="onUploadAvatar" class="flex-1 py-3 bg-gradient-to-r from-blue-600 to-pink-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:shadow-[0_10px_20px_rgba(37,99,235,0.3)] disabled:opacity-30 transition-all">Upload Avatar</button>
                                <button @click="removeAvatar" class="px-5 py-3 bg-white/5 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:text-pink-500 transition-all">Remove</button>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
                    <h2 class="text-xs font-black uppercase tracking-[0.3em] text-gray-500 mb-8 flex items-center gap-3">
                        <User class="w-4 h-4 text-blue-500" /> Bio-Data Components
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div class="space-y-2">
                            <label class="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Full Designation</label>
                            <input v-model="form.name" type="text" class="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 transition-all outline-none" />
                        </div>
                        <div class="space-y-2">
                            <label class="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Secure Email (Locked)</label>
                            <div class="relative">
                                <input :value="form.email" disabled class="w-full px-5 py-4 rounded-2xl bg-white/[0.02] border border-white/5 text-gray-600 cursor-not-allowed outline-none" />
                                <Lock class="absolute right-5 top-4 w-4 h-4 text-gray-700" />
                            </div>
                        </div>
                    </div>
                    <div class="space-y-2 mb-8">
                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Personal Narrative</label>
                        <textarea v-model="form.bio" rows="4" class="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 transition-all outline-none resize-none"></textarea>
                    </div>
                    <div class="flex justify-end gap-4">
                        <button @click="() => Object.assign(form, initialForm)" :disabled="!hasChanges || isSaving" class="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all">Revert</button>
                        <button @click="onSaveProfile" :disabled="!hasChanges || isSaving" class="px-10 py-4 bg-gradient-to-r from-blue-600 to-pink-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:shadow-[0_15px_30px_rgba(37,99,235,0.3)] transition-all">Sync Changes</button>
                    </div>
                </section>
            </div>

            <div class="space-y-8">
                <section class="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl lg:sticky lg:top-8">
                    <h2 class="text-xs font-black uppercase tracking-[0.3em] text-gray-500 mb-6 flex items-center gap-3">
                        <Lightbulb class="w-4 h-4 text-pink-500" /> Interface
                    </h2>
                    <div class="space-y-2">
                        <ToggleSwitch v-model="preferences.emailNotifications" label="Data Alerts" />
                        <ToggleSwitch v-model="preferences.darkMode" label="Abyss Mode" />
                        <ToggleSwitch v-model="preferences.publicProfile" label="Signal Broadcast" />
                    </div>
                </section>

                <section class="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
                    <h2 class="text-xs font-black uppercase tracking-[0.3em] text-gray-500 mb-8 flex items-center gap-3">
                        <Lock class="w-4 h-4 text-pink-500" /> Crypto Update
                    </h2>
                    <div class="space-y-4">
                        <div class="relative">
                            <input :type="show.current ? 'text' : 'password'" v-model="pwd.current_password" placeholder="Current Password" class="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-blue-500/50" />
                            <button @click="show.current = !show.current" class="absolute right-4 top-4 text-gray-600 hover:text-white"><Eye v-if="!show.current" class="w-4 h-4"/><EyeOff v-else class="w-4 h-4"/></button>
                        </div>
                        <div class="relative">
                            <input :type="show.new ? 'text' : 'password'" v-model="pwd.password" placeholder="New Password" class="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-blue-500/50" />
                            <button @click="show.new = !show.new" class="absolute right-4 top-4 text-gray-600 hover:text-white"><Eye v-if="!show.new" class="w-4 h-4"/><EyeOff v-else class="w-4 h-4"/></button>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-2 px-1">
                            <div v-for="(hint, key) in { min8: '8+ Char', mixed: 'Aa Case', num: 'Number', match: 'Match' }" :key="key" 
                                :class="pwdHints[key] ? 'text-blue-400' : 'text-gray-700'" class="text-[9px] font-black uppercase tracking-tighter flex items-center gap-1 transition-colors">
                                <div class="w-1 h-1 rounded-full bg-current"></div> {{ hint }}
                            </div>
                        </div>

                        <button @click="onChangePassword" :disabled="pwdSaving" class="w-full py-4 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all mt-4">Auth Password Update</button>
                    </div>
                </section>
            </div>
        </main>
    </div>
</template>

<style scoped>
.animate-spin-slow { animation: spin 8s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

input, textarea {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>