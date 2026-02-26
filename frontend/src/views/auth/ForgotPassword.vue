<template>
    <div class="min-h-screen w-full flex items-center justify-center bg-[#060606] font-['Poppins'] relative overflow-hidden p-4">
        
        <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>

        <div class="w-full max-w-[450px] relative z-10 animate-in fade-in zoom-in duration-700">
            <div class="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
                
                <div class="text-center mb-10">
                    <div class="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-pink-600 shadow-lg mb-6 rotate-3 hover:rotate-0 transition-transform duration-500">
                        <svg class="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                        </svg>
                    </div>
                    <h1 class="text-3xl font-black text-white uppercase tracking-tighter">
                        Forgot <span class="bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">Password?</span>
                    </h1>
                    <p class="text-gray-400 text-sm mt-2 font-medium">Enter your email and we'll send you a reset link.</p>
                </div>

                <form @submit.prevent="submit" class="space-y-6">
                    <div class="space-y-2">
                        <label class="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Email Address</label>
                        <input v-model.trim="email" type="email" placeholder="you@example.com" required
                            class="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 shadow-sm"
                            :class="{ 'border-red-500/50 focus:ring-red-500/30': fieldError }" />
                        <p v-if="fieldError" class="mt-1 text-[10px] font-black uppercase text-pink-500 ml-1">{{ fieldError }}</p>
                    </div>

                    <button type="submit" :disabled="loading"
                        class="w-full py-4 bg-gradient-to-r from-blue-600 to-pink-600 text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:shadow-[0_15px_30px_rgba(37,99,235,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-50">
                        <span v-if="!loading">Send Reset Link</span>
                        <div v-else class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    </button>
                </form>

                <div class="mt-8 text-center border-t border-white/10 pt-6">
                    <router-link :to="{ name: 'login' }"
                        class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-blue-400 transition-all">
                        Back to secure login
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from "vue-router";
import { useAuthStore } from "@stores/auth";
import { useToast } from '@/utils/useToast';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const email = ref('')
const loading = ref(false)
const fieldError = ref('')

async function submit() {
    fieldError.value = ''
    loading.value = true

    try {
        await authStore.requestPasswordReset(email.value);
        toast.success('If that email exists, a reset link has been sent.');
        email.value = '';
    } catch (e) {
        const data = e?.response?.data;
        if (data?.errors?.email) {
            fieldError.value = data.errors.email[0];
        } else {
            toast.error(data?.message || 'Something went wrong. Please try again.');
        }
    } finally {
        loading.value = false;
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