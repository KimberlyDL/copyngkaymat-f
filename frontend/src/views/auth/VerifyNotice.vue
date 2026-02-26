<template>
    <div class="min-h-screen w-full relative overflow-hidden flex items-center justify-center p-6 bg-[#060606] font-['Poppins'] selection:bg-blue-500/30">
        
        <div class="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
        <div class="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-pink-600/15 rounded-full blur-[120px] animate-pulse delay-1000 pointer-events-none"></div>
        
        <div class="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-100 pointer-events-none"></div>

        <div class="relative z-10 max-w-md w-full animate-in fade-in zoom-in duration-700">
            <div class="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden p-10 sm:p-12 transition-all duration-500 hover:border-white/20">
                
                <div class="mb-10 flex flex-col items-center text-center">
                    <div class="relative group mb-6">
                        <div class="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                        <div class="relative h-16 w-16 bg-[#0d0d12] border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl">
                            <MailIcon class="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform duration-500" />
                        </div>
                    </div>
                    
                    <h1 class="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-4">
                        Verify <span class="bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">Identity</span>
                    </h1>
                    <p class="text-xs text-gray-500 font-medium leading-relaxed italic">
                        We sent a verification link to <br>
                        <span class="text-blue-400 font-black tracking-widest uppercase not-italic">{{ model.email || "AUTHORIZED_NODE" }}</span>.
                    </p>
                </div>

                <form @submit.prevent="onResend" class="space-y-6">
                    <div class="space-y-2 group">
                        <div class="flex justify-between items-center px-1">
                            <label class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 group-focus-within:text-blue-400 transition-colors">Target Email Address</label>
                        </div>
                        <input v-model.trim="model.email" type="email" placeholder="name@example.com"
                            class="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all shadow-sm"
                            :disabled="isLoading || cooldown > 0" />
                        <p v-if="errs.email" class="text-[9px] font-black uppercase text-pink-500 italic ml-1 tracking-widest">{{ errs.email }}</p>
                    </div>

                    <div class="space-y-4 pt-2">
                        <button type="submit"
                            class="w-full relative group py-4 px-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 disabled:opacity-50 disabled:grayscale"
                            :disabled="isLoading || !isValidEmail || cooldown > 0">
                            
                            <span v-if="!isLoading && cooldown === 0">Resend Verification Signal</span>
                            <span v-else-if="cooldown > 0" class="flex items-center justify-center gap-2">
                                <span class="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
                                Cool Down: {{ cooldown }}s
                            </span>
                            <span v-else class="flex items-center justify-center gap-3">
                                <svg class="animate-spin h-3 w-3" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Sending...
                            </span>
                        </button>

                        <button @click="refreshFromQuery" type="button"
                            class="w-full py-4 text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all bg-white/5 border border-white/5 rounded-2xl">
                            Reload Terminal URL
                        </button>
                    </div>
                </form>

                <div class="mt-10 flex items-center justify-between border-t border-white/5 pt-8">
                    <router-link :to="{ name: 'login' }" class="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 hover:text-blue-400 transition-colors">
                        Sign In
                    </router-link>
                    <router-link :to="{ name: 'signup' }" class="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 hover:text-pink-400 transition-colors">
                        New Account
                    </router-link>
                </div>

                <div class="mt-8 p-6 bg-blue-600/5 border border-blue-500/10 rounded-[2rem] flex gap-4 items-start">
                    <div class="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                        <InfoIcon class="w-4 h-4" />
                    </div>
                    <div>
                        <h4 class="text-[10px] font-black text-white uppercase tracking-widest mb-1">Signal Tip</h4>
                        <p class="text-[10px] text-gray-500 leading-relaxed font-medium">Check your junk folder. Verification nodes expire in <span class="text-blue-400">120 cycles</span>.</p>
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
import { reactive, ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Mail as MailIcon, Info as InfoIcon } from "lucide-vue-next";
import { useAuthStore } from "@/stores/auth";
import { useToast } from '@/utils/useToast';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const toast = useToast();

const COOLDOWN_SEC = 60;

const model = reactive({
    email: route.query.email?.toString() || auth.pendingEmail || "",
});

const errs = reactive({ email: "" });
const isLoading = ref(false);
const cooldown = ref(0);
let timer = null;

const isValidEmail = computed(() => {
    const v = model.email?.trim() || "";
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
});

function startCooldown() {
    cooldown.value = COOLDOWN_SEC;
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
        cooldown.value -= 1;
        if (cooldown.value <= 0) {
            clearInterval(timer);
            timer = null;
        }
    }, 1000);
}

function refreshFromQuery() {
    const q = route.query.email?.toString() || "";
    if (q) model.email = q;
}

async function onResend() {
    errs.email = "";
    if (!isValidEmail.value) {
        errs.email = "Invalid email node.";
        return;
    }

    try {
        isLoading.value = true;
        auth.setPendingEmail(model.email);
        await auth.resendVerificationEmail(model.email);
        toast.success("Identity signal dispatched.");
        if (cooldown.value === 0) startCooldown();
    } catch (e) {
        toast.error(e?.response?.data?.message || "Signal transmission failed.");
    } finally {
        isLoading.value = false;
    }
}

onMounted(() => {
    if (!model.email && auth.pendingEmail) model.email = auth.pendingEmail;
});

onBeforeUnmount(() => {
    if (timer) clearInterval(timer);
});

watch(() => model.email, (val) => auth.setPendingEmail(val));
</script>

<style scoped>
.animate-in {
    animation: zoomIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes zoomIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
}

input {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>