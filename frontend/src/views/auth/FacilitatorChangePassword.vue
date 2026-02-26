<template>
    <div class="min-h-screen w-full flex items-center justify-center bg-[#060606] font-['Poppins'] relative overflow-hidden p-4">
        
        <div class="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
        <div class="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[120px] animate-pulse delay-1000 pointer-events-none"></div>

        <div class="w-full max-w-[500px] relative z-10 animate-in fade-in zoom-in duration-700">
            
            <div v-if="isFirstLogin" 
                class="mb-6 p-5 rounded-3xl bg-white/5 backdrop-blur-xl border border-blue-500/20 shadow-2xl">
                <div class="flex gap-4">
                    <div class="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <div>
                        <h3 class="text-sm font-black text-white uppercase tracking-wider mb-1">Security First</h3>
                        <p class="text-xs text-gray-400 leading-relaxed font-medium">
                            Protect student data by choosing a unique, high-strength password.
                        </p>
                    </div>
                </div>
            </div>

            <div class="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
                
                <div class="text-center mb-10">
                    <div class="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-pink-600 shadow-lg mb-6 rotate-3">
                        <svg class="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h1 class="text-3xl font-black text-white uppercase tracking-tighter leading-tight">
                        {{ isFirstLogin ? 'Set Your' : 'Update' }} <span class="bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">Password</span>
                    </h1>
                    <p class="text-gray-400 text-sm mt-2 font-medium">Choose a strong password you haven't used before.</p>
                </div>

                <form @submit.prevent="handleSubmit" class="space-y-6">
                    <div v-if="!isFirstLogin" class="space-y-2">
                        <label class="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Current Password</label>
                        <input v-model="form.currentPassword" type="password" placeholder="••••••••" required
                            class="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300" />
                        <p v-if="errors.currentPassword" class="text-[10px] text-red-500 font-bold ml-1 uppercase">{{ errors.currentPassword }}</p>
                    </div>

                    <div class="space-y-2">
                        <label class="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">New Password</label>
                        <input v-model="form.newPassword" type="password" placeholder="••••••••" required @input="validatePassword"
                            class="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300" />
                        <p v-if="errors.newPassword" class="text-[10px] text-red-500 font-bold ml-1 uppercase">{{ errors.newPassword }}</p>
                    </div>

                    <div v-if="form.newPassword" class="space-y-3 px-1">
                        <div class="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                            <span>Strength: <span :class="strengthTextColor">{{ strengthLabel }}</span></span>
                        </div>
                        <div class="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                            <div class="h-full transition-all duration-500 ease-out" :class="strengthBarColor" :style="{ width: strengthWidth }"></div>
                        </div>
                        
                        <div class="grid grid-cols-1 gap-2 mt-2">
                            <div v-for="(check, key) in passwordChecksDisplay" :key="key" 
                                class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tight transition-colors duration-300"
                                :class="check.valid ? 'text-green-400' : 'text-gray-600'">
                                <div class="h-1 w-1 rounded-full bg-current"></div>
                                {{ check.label }}
                            </div>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Confirm New Password</label>
                        <input v-model="form.confirmPassword" type="password" placeholder="••••••••" required
                            class="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300" />
                        <p v-if="errors.confirmPassword" class="text-[10px] text-red-500 font-bold ml-1 uppercase">{{ errors.confirmPassword }}</p>
                    </div>

                    <button type="submit" :disabled="isLoading || !isPasswordValid"
                        class="w-full py-4 bg-gradient-to-r from-blue-600 to-pink-600 text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:shadow-[0_15px_30px_rgba(37,99,235,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-40">
                        <span v-if="!isLoading">{{ isFirstLogin ? 'Set & Enter Portal' : 'Update Credentials' }}</span>
                        <div v-else class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/utils/useToast';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const toast = useToast();

const isFirstLogin = computed(() => route.query.firstLogin === 'true');

const form = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
});

const errors = ref({});
const isLoading = ref(false);

// Password validation
const passwordChecks = computed(() => ({
    length: form.value.newPassword.length >= 8,
    uppercase: /[A-Z]/.test(form.value.newPassword),
    number: /[0-9]/.test(form.value.newPassword)
}));

const passwordChecksDisplay = computed(() => [
    { label: 'Min. 8 Characters', valid: passwordChecks.value.length },
    { label: 'Uppercase Letter', valid: passwordChecks.value.uppercase },
    { label: 'One Number', valid: passwordChecks.value.number }
]);

const passwordStrength = computed(() => {
    return Object.values(passwordChecks.value).filter(Boolean).length;
});

const strengthLabel = computed(() => ['Weak', 'Fair', 'Good', 'Strong'][passwordStrength.value] || 'Weak');
const strengthTextColor = computed(() => ['text-red-500', 'text-yellow-500', 'text-blue-400', 'text-green-400'][passwordStrength.value]);
const strengthBarColor = computed(() => ['bg-red-500', 'bg-yellow-500', 'bg-blue-400', 'bg-green-400'][passwordStrength.value]);
const strengthWidth = computed(() => ['25%', '50%', '75%', '100%'][passwordStrength.value] || '0%');

const isPasswordValid = computed(() => {
    return Object.values(passwordChecks.value).every(Boolean) && 
           form.value.newPassword === form.value.confirmPassword;
});

const validatePassword = () => {
    errors.value.newPassword = '';
};

const handleSubmit = async () => {
    errors.value = {};
    isLoading.value = true;

    try {
        const payload = {
            password: form.value.newPassword,
            password_confirmation: form.value.confirmPassword
        };

        if (!isFirstLogin.value) payload.current_password = form.value.currentPassword;

        const result = await authStore.changePassword(payload);

        if (result.ok) {
            toast.success('Credentials Updated Successfully.');
            router.push({ name: 'facilitator.dashboard' });
        }
    } catch (error) {
        toast.error(error.message || 'Operation Failed.');
        if (error.message.includes('Current password')) errors.value.currentPassword = error.message;
        else errors.value.newPassword = error.message;
    } finally {
        isLoading.value = false;
    }
};
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
</style>