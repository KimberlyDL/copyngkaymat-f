<template>
    <div class="min-h-screen w-full relative overflow-hidden flex items-center justify-center p-6 bg-[#060606] font-['Poppins'] selection:bg-blue-500/30">
        
        <div class="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
        <div class="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-pink-600/15 rounded-full blur-[120px] animate-pulse delay-1000 pointer-events-none"></div>
        <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div class="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-100 pointer-events-none"></div>

        <div class="relative z-10 max-w-md w-full animate-in fade-in zoom-in duration-700">
            <div class="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden p-10 sm:p-12 text-center group transition-all duration-500 hover:border-white/20">
                
                <div v-if="status === 'loading'" class="space-y-8">
                    <div class="relative mx-auto h-20 w-20">
                        <div class="absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-blue-600 to-pink-600 animate-spin opacity-20"></div>
                        <div class="absolute inset-2 rounded-[1.5rem] bg-[#0d0d12] flex items-center justify-center border border-white/10">
                            <div class="h-2 w-2 bg-blue-500 rounded-full animate-ping"></div>
                        </div>
                    </div>
                    <div>
                        <h2 class="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-3">
                            Verifying <span class="bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent text-shadow-glow">Node</span>
                        </h2>
                        <p class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Securing Nexus Identity...</p>
                    </div>
                </div>

                <div v-else-if="status === 'success'" class="space-y-8">
                    <div class="relative mx-auto h-20 w-20 group">
                        <div class="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-pink-600 rounded-[2rem] blur opacity-40 animate-pulse"></div>
                        <div class="relative h-full w-full bg-[#0d0d12] rounded-[2rem] border border-white/10 flex items-center justify-center shadow-2xl">
                            <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <h2 class="text-4xl font-black text-white uppercase tracking-tighter leading-none mb-3">
                            Sync <span class="bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">Complete</span>
                        </h2>
                        <p class="text-xs text-gray-500 font-medium italic mb-10">Your identity node is now active. Access to the intelligent vault granted.</p>
                        
                        <router-link :to="{ name: 'login' }"
                            class="w-full inline-flex items-center justify-center py-4 px-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-500">
                            Execute Sign In
                        </router-link>
                    </div>
                </div>

                <div v-else class="space-y-8">
                    <div class="relative mx-auto h-20 w-20">
                        <div class="absolute -inset-1 bg-red-600/20 rounded-[2rem] blur opacity-40"></div>
                        <div class="relative h-full w-full bg-[#0d0d12] rounded-[2rem] border border-red-500/20 flex items-center justify-center">
                            <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <h2 class="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-3">
                            Signal <span class="text-red-500">Error</span>
                        </h2>
                        <p class="text-xs text-red-500/70 font-medium mb-10 italic">{{ errorMessage }}</p>
                        
                        <div class="flex flex-col gap-4">
                            <router-link :to="{ name: 'verify-notice' }" 
                                class="w-full py-4 px-8 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-white/10 transition-all">
                                Request New Signal
                            </router-link>
                            <router-link :to="{ name: 'login' }"
                                class="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600 hover:text-blue-400 transition-colors">
                                Return to Terminal
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>

            <p class="mt-8 text-center text-[9px] font-black text-gray-700 uppercase tracking-[0.4em]">
                Secure Protocol // <span class="text-blue-600/50 italic">Nexus Core v2.0</span>
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/utils/api'

const route = useRoute()
const status = ref('loading') // 'loading' | 'success' | 'error'
const errorMessage = ref('')

onMounted(async () => {
    const token = route.query.token

    if (!token) {
        status.value = 'error'
        errorMessage.value = 'Verification token missing or corrupted.'
        return
    }

    try {
        await api.get(`/api/v1/auth/verify-email?token=${token}`)
        status.value = 'success'
    } catch (error) {
        status.value = 'error'
        errorMessage.value = error.response?.data?.message || 'The verification link is invalid or has expired.'
    }
})
</script>

<style scoped>
.text-shadow-glow {
    text-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
}

.animate-in {
    animation: zoomIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes zoomIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
}
</style>