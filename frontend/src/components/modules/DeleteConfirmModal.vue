<template>
    <div class="fixed inset-0 z-[150] flex items-center justify-center p-4">
        <div 
            class="absolute inset-0 bg-[#020203]/90 backdrop-blur-md transition-opacity"
            @click="$emit('cancel')"
        ></div>

        <div class="relative bg-[#0d0d12] border border-white/10 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] max-w-md w-full p-10 animate-in zoom-in duration-300 font-['Poppins'] text-white">
            
            <div class="relative flex items-center justify-center w-20 h-20 mx-auto mb-8">
                <div class="absolute inset-0 bg-pink-600/20 rounded-full blur-2xl animate-pulse"></div>
                <div class="relative z-10 flex items-center justify-center w-full h-full bg-pink-500/10 border border-pink-500/30 rounded-full text-pink-500 shadow-xl shadow-pink-900/20">
                    <svg class="w-10 h-10 shadow-glow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                </div>
            </div>

            <div class="text-center space-y-4 mb-10">
                <h3 class="text-2xl font-black uppercase tracking-tighter italic leading-none">
                    Delete <span class="bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">Module?</span>
                </h3>
                <p class="text-xs text-gray-500 font-medium leading-relaxed px-2">
                    Are you sure you want to delete <strong class="text-blue-400 font-black italic">"{{ moduleTitle }}"</strong>? 
                    This action cannot be undone and all associated data will be permanently removed.
                </p>
            </div>

            <div class="flex gap-4">
                <button 
                    @click="$emit('cancel')"
                    class="flex-1 px-6 py-4 bg-white/5 border border-white/10 text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all"
                >
                    Cancel
                </button>
                <button 
                    @click="$emit('confirm')"
                    class="flex-1 px-6 py-4 bg-gradient-to-br from-pink-600 via-red-600 to-pink-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-pink-900/40 hover:scale-[1.05] active:scale-[0.95] transition-all duration-500"
                >
                    Delete Module
                </button>
            </div>
            
            <p class="mt-8 text-center text-[8px] font-black text-gray-700 uppercase tracking-[0.4em]">Delete Modules or terminate</p>
        </div>
    </div>
</template>

<script setup>
defineProps({
    moduleTitle: {
        type: String,
        required: true
    }
});

defineEmits(['confirm', 'cancel']);
</script>

<style scoped>
.shadow-glow {
    filter: drop-shadow(0 0 8px rgba(236, 72, 153, 0.6));
}

@keyframes zoomIn {
    from { opacity: 0; transform: scale(0.95) translateY(10px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
}

.animate-in {
    animation: zoomIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>