<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-[#fdfcff] dark:bg-[#04020a] font-['Poppins'] relative overflow-hidden px-4 py-8 transition-colors duration-700">
    
    <div class="absolute top-[-10%] left-[-10%] w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-purple-600/10 rounded-full blur-[80px] sm:blur-[130px] pointer-events-none animate-pulse"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-fuchsia-600/10 rounded-full blur-[80px] sm:blur-[130px] pointer-events-none animate-pulse delay-700"></div>

    <div class="w-full max-w-[1000px] relative z-10 animate-vessel">
      
      <div class="bg-white/40 dark:bg-white/[0.03] backdrop-blur-3xl border border-white dark:border-white/10 rounded-[3rem] sm:rounded-[3.5rem] 
        shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15),inset_0_1px_2px_rgba(255,255,255,1)] 
        dark:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] overflow-hidden">
        
        <div class="flex flex-col lg:flex-row">
          
          <div class="lg:w-[45%] p-10 lg:p-16 flex flex-col justify-center items-center text-center bg-gradient-to-br from-purple-500/5 to-transparent border-b lg:border-b-0 lg:border-r border-white dark:border-white/5">
            
            <div class="relative h-24 w-24 sm:h-32 sm:w-32 mb-8 group">
                <div class="absolute inset-0 rounded-[2.5rem] liquid-gem-logo animate-pulse opacity-20"></div>
                <div class="absolute inset-2 rounded-[2rem] bg-white dark:bg-[#0d0d12] flex items-center justify-center border border-white dark:border-white/10 shadow-2xl transition-all group-hover:scale-105">
                    <MailIcon class="w-10 h-10 sm:w-14 sm:h-14 text-purple-500 group-hover:rotate-12 transition-transform duration-500" />
                </div>
                <div class="absolute top-4 left-4 w-4 h-4 bg-white/40 blur-[1px] rounded-full pointer-events-none"></div>
            </div>

            <div class="space-y-3">
                <h2 class="text-xs font-[900] uppercase tracking-[0.5em] text-slate-400 italic">Action Required</h2>
                <h1 class="text-4xl sm:text-5xl font-[900] text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">
                    Check <span class="text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-fuchsia-600">Email</span>
                </h1>
                <div class="h-1 w-16 liquid-3d-underline mx-auto rounded-full mt-4"></div>
            </div>
          </div>

          <div class="lg:w-[55%] p-10 lg:p-16 flex flex-col justify-center">
            
            <div class="space-y-8">
                <div class="space-y-4">
                    <p class="text-slate-500 dark:text-slate-400 text-sm sm:text-base font-medium italic leading-relaxed">
                        We have sent a verification link to your inbox. Please click the link to confirm your account and start your journey.
                    </p>
                    <div class="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/10 inline-block w-full text-center">
                        <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-1">Target Account</span>
                        <span class="text-purple-600 dark:text-purple-400 font-[900] tracking-widest break-all">{{ model.email || "AUTHORIZED_NODE" }}</span>
                    </div>
                </div>

                <form @submit.prevent="onResend" class="space-y-4">
                    <button type="submit"
                        class="btn-purple-liquid w-full py-5 text-white font-[900] uppercase tracking-[0.3em] rounded-[1.5rem] transition-all duration-500 flex items-center justify-center gap-4 relative overflow-hidden group hover:scale-[1.03] active:scale-95 shadow-2xl disabled:opacity-40"
                        :disabled="isLoading || !isValidEmail || cooldown > 0">
                        
                        <span v-if="!isLoading && cooldown === 0" class="relative z-10 drop-shadow-xl">Resend Email link</span>
                        <span v-else-if="cooldown > 0" class="flex items-center justify-center gap-3 relative z-10">
                            <span class="h-1.5 w-1.5 rounded-full bg-white animate-ping"></span>
                            Wait {{ cooldown }}s
                        </span>
                        <div v-else class="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin relative z-10"></div>
                        
                        <div class="absolute top-[10%] left-[10%] w-full h-full bg-gradient-to-br from-white/30 to-transparent opacity-50 blur-[2px]"></div>
                    </button>

                    <button @click="refreshFromQuery" type="button"
                        class="w-full py-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-purple-600 transition-all bg-slate-100 dark:bg-white/5 border border-white/5 rounded-[1.2rem] italic">
                        Refresh Terminal
                    </button>
                </form>

                <div class="p-6 bg-purple-500/5 dark:bg-purple-500/[0.03] border border-purple-500/10 rounded-[2rem] flex gap-4 items-start">
                    <div class="h-8 w-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 flex-shrink-0">
                        <InfoIcon class="w-4 h-4" />
                    </div>
                    <div>
                        <h4 class="text-[10px] font-[900] text-slate-800 dark:text-white uppercase tracking-widest mb-1 italic">Quick Tip</h4>
                        <p class="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold italic">Don't see it? Check your <span class="text-purple-500">Spam/Junk folder</span>. Verification links expire in 1 hour.</p>
                    </div>
                </div>

                <div class="flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-8 px-2">
                    <router-link :to="{ name: 'login' }" class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-purple-600 transition-all italic underline underline-offset-8">Return to Sign In</router-link>
                    <router-link :to="{ name: 'signup' }" class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-fuchsia-500 transition-all italic underline underline-offset-8">Edit Details</router-link>
                </div>
            </div>

          </div>
        </div>
      </div>

      <p class="mt-10 text-center text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.5em] italic">ProtectEd Node Synchronization // v2.6</p>
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
        errs.email = "Invalid email address.";
        return;
    }

    try {
        isLoading.value = true;
        auth.setPendingEmail(model.email);
        await auth.resendVerificationEmail(model.email);
        toast.success("Verification email sent!");
        if (cooldown.value === 0) startCooldown();
    } catch (e) {
        toast.error(e?.response?.data?.message || "Failed to resend email.");
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
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&display=swap');

/* --- 3D LIQUID PHYSICS --- */
.liquid-gem-logo {
  background: radial-gradient(circle at 35% 35%, #a855f7 0%, #6b21a8 55%, #2e1065 100%);
  box-shadow: inset -5px -5px 12px rgba(0,0,0,0.5), inset 5px 5px 10px rgba(255,255,255,0.3), 0 20px 40px rgba(107, 33, 168, 0.4);
}

.btn-purple-liquid {
  background: radial-gradient(circle at 30% 30%, #7c3aed 0%, #4c1d95 55%, #1e1b4b 100%);
  box-shadow: inset -8px -8px 25px rgba(0,0,0,0.6), inset 8px 8px 15px rgba(255,255,255,0.2), 0 30px 60px rgba(76, 29, 149, 0.4);
}

:where(.dark) .btn-purple-liquid {
  background: radial-gradient(circle at 30% 30%, #a855f7 0%, #6d28d9 55%, #2e1065 100%);
}

.liquid-3d-underline {
  background: radial-gradient(circle at 30% 30%, #f472b6 0%, #db2777 55%, #831843 100%);
}

/* Entrance Physics */
.animate-vessel {
  animation: vesselSlideIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes vesselSlideIn {
  from { opacity: 0; transform: translateY(40px) scale(0.98); }
  to { opacity: 1; transform: translateY(0); }
}

input {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  -webkit-appearance: none;
}
</style>