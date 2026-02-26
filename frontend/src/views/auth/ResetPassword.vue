<template>
    <div class="min-h-screen w-full flex items-center justify-center bg-[#060606] font-['Poppins'] relative overflow-hidden p-4">
        
        <div class="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
        <div class="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[120px] animate-pulse delay-1000 pointer-events-none"></div>

        <div class="w-full max-w-[480px] relative z-10 animate-in fade-in zoom-in duration-700">
            <div class="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
                
                <div class="text-center mb-10">
                    <div class="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-pink-600 shadow-lg mb-6 rotate-3 hover:rotate-0 transition-transform duration-500">
                        <svg class="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                        </svg>
                    </div>
                    <h1 class="text-3xl font-black text-white uppercase tracking-tighter leading-tight">
                        Set New <span class="bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">Password</span>
                    </h1>
                    <p class="text-gray-400 text-sm mt-2 font-medium">Choose a strong password you haven't used before.</p>
                </div>

                <form @submit.prevent="submit" class="space-y-6">
                    <div class="space-y-2">
                        <label class="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Email Address</label>
                        <input v-model.trim="email" type="email" readonly
                            class="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-gray-400 cursor-not-allowed outline-none" />
                        <p v-if="errors.email" class="mt-1 text-[10px] font-black uppercase text-pink-500 ml-1">{{ errors.email }}</p>
                    </div>

                    <div class="space-y-4">
                        <div class="space-y-2">
                            <label class="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">New Password</label>
                            <input v-model="password" type="password" placeholder="••••••••" required
                                class="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 shadow-sm"
                                :class="{ 'border-red-500/50 focus:ring-red-500/30': errors.password }" />
                        </div>

                        <div class="space-y-2">
                            <label class="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Confirm Password</label>
                            <input v-model="password_confirmation" type="password" placeholder="••••••••" required
                                class="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 shadow-sm" />
                        </div>
                    </div>
                    <p v-if="errors.password" class="mt-1 text-[10px] font-black uppercase text-pink-500 ml-1">{{ errors.password }}</p>

                    <button type="submit" :disabled="loading"
                        class="w-full py-4 bg-gradient-to-r from-blue-600 to-pink-600 text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:shadow-[0_15px_30px_rgba(37,99,235,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-50">
                        <span v-if="!loading">Update Password</span>
                        <div v-else class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    </button>
                </form>

                <div class="mt-8 text-center border-t border-white/10 pt-6">
                    <router-link :to="{ name: 'login' }"
                        class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-blue-400 transition-all">
                        Cancel and return to login
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from "@stores/auth";
import { useToast } from '@/utils/useToast';

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore();
const toast = useToast();

const token = ref('')
const email = ref('')
const password = ref('')
const password_confirmation = ref('')

const loading = ref(false)
const errors = ref({ email: '', password: '' })

onMounted(() => {
    token.value = route.query.token?.toString() || ''
    email.value = route.query.email?.toString() || ''
})

async function submit() {
    errors.value = { email: '', password: '' }
    loading.value = true

    try {
        await authStore.performPasswordReset({
            token: token.value,
            email: email.value,
            password: password.value,
            password_confirmation: password_confirmation.value,
        })

        toast.success('Password updated! Redirecting to login...');
        setTimeout(() => router.push({ name: 'login' }), 1500)
    } catch (e) {
        const data = e?.response?.data
        if (data?.errors) {
            errors.value.email = data.errors.email?.[0] || ''
            errors.value.password = data.errors.password?.[0] || ''
        }
        const msg = data?.message || 'Reset failed. Please check the link and try again.';
        if (!data?.errors) {
            toast.error(msg);
        }
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');

.animate-in {
    animation: fadeInScale 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeInScale {
    from { opacity: 0; transform: scale(0.95) translateY(20px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
}

input {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>