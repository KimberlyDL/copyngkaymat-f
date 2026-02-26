<template>
    <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" @click.self="$emit('close')">
        <div class="absolute inset-0 bg-[#020203]/80 backdrop-blur-md transition-opacity" @click="$emit('close')"></div>

        <div class="relative w-full max-w-lg bg-[#0d0d12] border border-white/10 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] overflow-hidden animate-in zoom-in duration-500 font-['Poppins']">
            
            <div class="px-10 py-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                <div class="space-y-1">
                    <h3 class="text-xl font-black text-white uppercase tracking-tighter">
                        Add <span class="text-blue-500 text-shadow-glow">New User</span>
                    </h3>
                    <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">Setup educator or moderator access</p>
                </div>
                <button @click="$emit('close')" class="p-2 text-gray-600 hover:text-white transition-colors">
                    <XIcon class="w-5 h-5" />
                </button>
            </div>

            <form @submit.prevent="handleSubmit" class="p-10 space-y-6">
                <div class="space-y-2 group">
                    <label class="text-[10px] font-black uppercase tracking-widest text-gray-600 ml-1 group-focus-within:text-blue-500 transition-colors">Full Name *</label>
                    <input v-model.trim="form.name" type="text" required placeholder="Ex: John Doe"
                        class="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-xs outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm"
                        :class="{ 'border-red-500/50 bg-red-500/5': errors.name }" />
                    <p v-if="errors.name" class="text-[9px] font-black uppercase text-red-500 ml-1 italic">{{ errors.name }}</p>
                </div>

                <div class="space-y-2 group">
                    <label class="text-[10px] font-black uppercase tracking-widest text-gray-600 ml-1 group-focus-within:text-pink-500 transition-colors">Email Address *</label>
                    <input v-model.trim="form.email" type="email" required placeholder="john.doe@school.edu"
                        class="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-xs outline-none focus:ring-2 focus:ring-pink-500/50 transition-all shadow-sm"
                        :class="{ 'border-red-500/50 bg-red-500/5': errors.email }" />
                    <p v-if="errors.email" class="text-[9px] font-black uppercase text-red-500 ml-1 italic">{{ errors.email }}</p>
                </div>

                <div class="space-y-2 group">
                    <label class="text-[10px] font-black uppercase tracking-widest text-gray-600 ml-1 group-focus-within:text-blue-500 transition-colors">Access Level *</label>
                    <div class="relative">
                        <select v-model="form.role" required
                            class="w-full px-6 py-4 rounded-2xl bg-[#0d0d12] border border-white/10 text-white text-xs outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none transition-all cursor-pointer">
                            <option value="educator">Educator / Facilitator</option>
                            <option value="moderator">Moderator</option>
                        </select>
                        <div class="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600">
                            <ChevronDownIcon class="w-4 h-4" />
                        </div>
                    </div>
                </div>

                <div class="p-6 bg-blue-600/5 border border-blue-500/10 rounded-[2rem] flex gap-4 items-start">
                    <div class="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                        <InfoIcon class="w-4 h-4" />
                    </div>
                    <div class="space-y-1">
                        <h4 class="text-[10px] font-black text-white uppercase tracking-widest">Next Step</h4>
                        <p class="text-[10px] text-gray-500 leading-relaxed font-medium">A welcome email with a secure temporary password will be sent automatically.</p>
                    </div>
                </div>

                <div class="flex gap-4 pt-4">
                    <button type="button" @click="$emit('close')" 
                        class="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all bg-white/5 rounded-2xl border border-transparent hover:border-white/10">
                        Cancel
                    </button>
                    <button type="submit" :disabled="isLoading"
                        class="flex-1 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3">
                        <span v-if="!isLoading">Create Account</span>
                        <div v-else class="flex items-center gap-2">
                            <div class="animate-spin h-3 w-3 border-2 border-white/30 border-t-white rounded-full"></div>
                            Processing...
                        </div>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { X as XIcon, Info as InfoIcon, ChevronDown as ChevronDownIcon } from 'lucide-vue-next';
import { useToast } from '@/utils/useToast';
import api from '@/utils/api';

const emit = defineEmits(['close', 'created']);
const toast = useToast();

const form = ref({
    name: '',
    email: '',
    role: 'educator'
});

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
.text-shadow-glow {
    text-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
}

input, select {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes zoomIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
}
</style>