<template>
    <div class="min-h-screen w-full flex items-center justify-center bg-[#060606] font-['Poppins'] relative overflow-hidden p-4">
        
        <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[120px] animate-pulse delay-1000 pointer-events-none"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div class="w-full max-w-[400px] relative z-10 animate-in fade-in zoom-in duration-700">
            <div class="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] text-center">
                
                <div class="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-white/5 border border-white/10 mb-8 relative group">
                    <div class="absolute inset-0 rounded-3xl bg-gradient-to-tr from-blue-600 to-pink-600 opacity-20 animate-pulse"></div>
                    <svg class="w-10 h-10 text-white relative z-10" :class="{ 'animate-bounce': !error }" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                    </svg>
                </div>

                <div v-if="!error" class="space-y-6">
                    <div class="space-y-2">
                        <h2 class="text-3xl font-black text-white uppercase tracking-tighter">
                            Authenticating<span class="bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">...</span>
                        </h2>
                        <p class="text-gray-400 text-sm font-medium tracking-tight">Exchanging credentials with Google Secure Auth.</p>
                    </div>
                    
                    <div class="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-blue-600 to-pink-600 animate-progress-flow w-full"></div>
                    </div>
                </div>

                <div v-else class="space-y-6">
                    <div class="space-y-2">
                        <h2 class="text-3xl font-black text-white uppercase tracking-tighter">
                            Sync <span class="text-pink-500">Failed</span>
                        </h2>
                        <p class="text-gray-400 text-sm font-medium">{{ error }}</p>
                    </div>

                    <router-link :to="{ name: 'login' }"
                        class="block w-full py-4 bg-gradient-to-r from-blue-600 to-pink-600 text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:shadow-[0_15px_30px_rgba(37,99,235,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-500">
                        Try Again
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { setAuthToken } from '@/utils/api';
import { useToast } from '@/utils/useToast';
import api from '@/utils/api';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const toast = useToast();
const error = ref(null);

onMounted(async () => {
    const code = route.query.code;
    if (!code) {
        error.value = "Authorization code not found.";
        return;
    }

    try {
        const { data } = await api.post('/api/v1/auth/google/exchange', { code });
        setAuthToken(data.token);
        auth.user = data.user;
        toast.success(`Access Granted. Welcome, ${data.user.name || 'User'}!`);
        router.replace({ name: 'user.dashboard' });
    } catch (err) {
        error.value = err.response?.data?.message || "Google synchronization failed.";
    }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');

.animate-in {
    animation: fadeInScale 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeInScale {
    from { opacity: 0; transform: scale(0.9) translateY(20px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
}

@keyframes progress-flow {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}

.animate-progress-flow {
    animation: progress-flow 2s infinite linear;
}
</style>