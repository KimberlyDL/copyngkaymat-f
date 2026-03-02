<template>
    <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" @click.self="$emit('close')">
        <div class="absolute inset-0 bg-slate-900/60 dark:bg-[#020203]/80 backdrop-blur-md transition-opacity" @click="$emit('close')"></div>

        <div class="relative w-full max-w-lg bg-white dark:bg-[#0d0d12] border border-slate-200 dark:border-white/10 rounded-[3rem] shadow-2xl dark:shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] overflow-hidden animate-in zoom-in duration-500 custom-font-poppins">
            
            <div class="px-10 py-8 border-b border-slate-200 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.01]">
                <div class="space-y-1">
                    <h3 class="text-xl font-[900] text-black dark:text-white uppercase tracking-tighter italic">
                        Add <span class="text-purple-600 dark:text-purple-500">New User</span>
                    </h3>
                    <p class="text-[10px] font-bold text-slate-500 dark:text-gray-500 uppercase tracking-widest leading-none italic">Setup educator or moderator access</p>
                </div>
                <button @click="$emit('close')" class="p-2 text-slate-400 dark:text-gray-600 hover:text-black dark:hover:text-white transition-colors">
                    <XIcon class="w-5 h-5" />
                </button>
            </div>

            <form @submit.prevent="handleSubmit" class="p-10 space-y-6">
                <div class="space-y-2 group">
                    <label class="text-[10px] font-[900] uppercase tracking-widest text-slate-500 dark:text-gray-600 ml-1 group-focus-within:text-purple-600 transition-colors italic">Full Name *</label>
                    <input v-model.trim="form.name" type="text" required placeholder="Ex: John Doe"
                        class="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-black dark:text-white text-xs font-bold outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all shadow-sm placeholder:text-slate-400"
                        :class="{ 'border-red-500/50 bg-red-500/5': errors.name }" />
                    <p v-if="errors.name" class="text-[9px] font-[900] uppercase text-red-500 ml-1 italic">{{ errors.name }}</p>
                </div>

                <div class="space-y-2 group">
                    <label class="text-[10px] font-[900] uppercase tracking-widest text-slate-500 dark:text-gray-600 ml-1 group-focus-within:text-purple-600 transition-colors italic">Email Address *</label>
                    <input v-model.trim="form.email" type="email" required placeholder="john.doe@school.edu"
                        class="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-black dark:text-white text-xs font-bold outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all shadow-sm placeholder:text-slate-400"
                        :class="{ 'border-red-500/50 bg-red-500/5': errors.email }" />
                    <p v-if="errors.email" class="text-[9px] font-[900] uppercase text-red-500 ml-1 italic">{{ errors.email }}</p>
                </div>

                <div class="space-y-2 group">
                    <label class="text-[10px] font-[900] uppercase tracking-widest text-slate-500 dark:text-gray-600 ml-1 group-focus-within:text-purple-600 transition-colors italic">Access Level *</label>
                    <div class="relative">
                        <select v-model="form.role" required
                            class="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-[#0d0d12] border border-slate-200 dark:border-white/10 text-black dark:text-white text-xs font-bold outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 appearance-none transition-all cursor-pointer">
                            <option value="educator">Educator / Facilitator</option>
                            <option value="moderator">Moderator</option>
                        </select>
                        <div class="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-gray-600">
                            <ChevronDownIcon class="w-4 h-4" />
                        </div>
                    </div>
                </div>

                <div class="p-6 bg-purple-600/5 border border-purple-500/10 rounded-[2rem] flex gap-4 items-start">
                    <div class="p-2 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-400">
                        <InfoIcon class="w-4 h-4" />
                    </div>
                    <div class="space-y-1">
                        <h4 class="text-[10px] font-[900] text-black dark:text-white uppercase tracking-widest italic">Next Step</h4>
                        <p class="text-[10px] text-slate-500 dark:text-gray-500 leading-relaxed font-medium">A welcome email with a secure temporary password will be sent automatically.</p>
                    </div>
                </div>

                <div class="flex gap-4 pt-4">
                    <button type="button" @click="$emit('close')" 
                        class="px-8 py-4 text-[10px] font-[900] uppercase tracking-widest text-slate-500 dark:text-gray-500 hover:text-black dark:hover:text-white transition-all bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-transparent hover:border-purple-500/30 italic">
                        Cancel
                    </button>
                    <button type="submit" :disabled="isLoading"
                        class="flex-1 py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-[10px] font-[900] uppercase tracking-widest rounded-2xl shadow-xl shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3 italic">
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
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700;1,900&display=swap');

.custom-font-poppins {
    font-family: 'Poppins', sans-serif !important;
}

input, select {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes zoomIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
}
</style>