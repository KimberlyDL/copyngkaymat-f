<script setup>
import { useRouter } from 'vue-router'
import { Ghost, ArrowLeft, Home } from 'lucide-vue-next'

const router = useRouter()

function goHome() {
    router.push({ path: '/' })
}

function goBack() {
    router.go(-1)
}
</script>

<template>
    <div class="min-h-screen w-full relative overflow-hidden flex items-center justify-center p-6 bg-[#060606] font-['Poppins'] selection:bg-blue-500/30">
        
        <div class="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
        <div class="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-pink-600/15 rounded-full blur-[120px] animate-pulse delay-1000 pointer-events-none"></div>
        <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div class="relative z-10 max-w-lg w-full animate-in fade-in zoom-in duration-700">
            <div class="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden p-10 sm:p-14 text-center group transition-all duration-500 hover:border-white/20">
                
                <div class="flex justify-center mb-10">
                    <div class="relative">
                        <div class="absolute -inset-4 bg-gradient-to-tr from-blue-600 to-pink-600 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                        <Ghost class="w-24 h-24 text-blue-400 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500" :stroke-width="1.5" />
                    </div>
                </div>

                <h1 class="text-8xl font-black text-white uppercase tracking-tighter leading-none mb-4">
                    4<span class="bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">0</span>4
                </h1>

                <h2 class="text-2xl font-black text-white uppercase tracking-tight mb-4">
                    Lost in <span class="text-pink-500 italic">Space</span>
                </h2>

                <p class="text-xs text-gray-500 font-medium italic leading-relaxed mb-10">
                    The node you are looking for has been moved or does not exist in our current coordinates.
                </p>

                <div class="flex flex-col sm:flex-row justify-center gap-4">
                    <button @click="goHome"
                        class="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-500">
                        <Home class="w-4 h-4" />
                        Execute Return
                    </button>
                    
                    <button @click="goBack"
                        class="flex items-center justify-center px-8 py-4 bg-white/5 border border-white/10 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-white/10 hover:text-white transition-all shadow-sm">
                        <ArrowLeft class="w-4 h-4 mr-2" />
                        Go Back
                    </button>
                </div>
            </div>

            <p class="mt-8 text-center text-[9px] font-black text-gray-700 uppercase tracking-[0.4em]">
                System Synchronized // <span class="text-blue-600/50 italic">Terminal Error 0x404</span>
            </p>
        </div>
    </div>
</template>

<style scoped>
/* Industrial Entry Animation */
.animate-in {
    animation: zoomIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes zoomIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
}
</style>