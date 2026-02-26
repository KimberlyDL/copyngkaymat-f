<template>
    <div class="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 font-['Poppins'] text-white">
        
        <section v-if="deletionStatus?.has_pending_deletion"
            class="bg-yellow-500/5 border border-yellow-500/20 p-8 rounded-[2.5rem] relative overflow-hidden group">
            <div class="absolute -top-10 -right-10 w-40 h-40 bg-yellow-500/5 rounded-full blur-[80px]"></div>
            <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div class="flex items-start gap-4">
                    <div class="p-3 rounded-2xl bg-yellow-500/20 text-yellow-500 shadow-lg">
                        <AlertTriangleIcon class="h-6 w-6" />
                    </div>
                    <div>
                        <h3 class="text-xl font-black uppercase tracking-tighter text-yellow-500">Account Deletion Pending</h3>
                        <p class="mt-1 text-xs text-yellow-500/70 font-medium">
                            Your account is scheduled for permanent deletion on <strong>{{ formatDate(deletionStatus.scheduled_deletion_date) }}</strong>.
                        </p>
                        <p class="text-[9px] font-black uppercase tracking-widest text-yellow-600/50 mt-2">Days remaining: {{ deletionStatus.days_remaining }}</p>
                    </div>
                </div>
                <button @click="cancelDeletion" :disabled="isCancelling"
                    class="px-8 py-3 bg-yellow-500 text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-yellow-400 transition-all disabled:opacity-50">
                    {{ isCancelling ? 'Cancelling...' : 'Cancel Deletion' }}
                </button>
            </div>
        </section>

        <section class="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12 border-b border-white/5">
            <div class="lg:col-span-1 space-y-2">
                <h3 class="text-2xl font-black uppercase tracking-tighter text-white">Change <span class="text-blue-500">Password</span></h3>
                <p class="text-xs text-gray-500 font-medium leading-relaxed italic">
                    Update your password regularly to keep your account secure. All sessions will be logged out after password change.
                </p>
            </div>

            <div class="lg:col-span-2 space-y-6">
                <div class="grid grid-cols-1 gap-6">
                    <div class="space-y-2 group">
                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 group-focus-within:text-blue-500 transition-colors">Current Password *</label>
                        <input v-model="passwordData.current_password" type="password" required
                            class="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all shadow-sm" />
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-2 group">
                            <label class="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 group-focus-within:text-pink-500 transition-colors">New Password *</label>
                            <input v-model="passwordData.password" type="password" required minlength="8"
                                class="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white focus:ring-2 focus:ring-pink-500/50 outline-none transition-all shadow-sm" />
                            <p class="text-[8px] font-black uppercase text-gray-600 ml-1 tracking-widest italic">Minimum 8 characters</p>
                        </div>
                        <div class="space-y-2 group">
                            <label class="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 group-focus-within:text-pink-500 transition-colors">Confirm New Password *</label>
                            <input v-model="passwordData.password_confirmation" type="password" required
                                class="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white focus:ring-2 focus:ring-pink-500/50 outline-none transition-all shadow-sm" />
                        </div>
                    </div>
                </div>
                <div class="flex justify-end pt-2">
                    <button @click="changePassword" :disabled="!isPasswordFormValid || isChangingPassword"
                        class="px-10 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 disabled:opacity-30">
                        <span v-if="!isChangingPassword">Update Password</span>
                        <span v-else class="flex items-center gap-2">
                            <svg class="animate-spin h-3 w-3" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Updating...
                        </span>
                    </button>
                </div>
            </div>
        </section>

        <section class="space-y-8 pb-12 border-b border-white/5">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div class="space-y-1">
                    <h3 class="text-2xl font-black uppercase tracking-tighter text-white">Active <span class="text-pink-500">Sessions</span></h3>
                    <p class="text-xs text-gray-500 font-medium italic">Manage devices where you're currently logged in.</p>
                </div>
                <button @click="logoutAllDevices" :disabled="isLoggingOut"
                    class="px-6 py-3 bg-white/5 border border-white/10 text-red-500 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-red-500 hover:text-white transition-all">
                    <LogOutIcon class="h-3 w-3 inline-block mr-1" /> Logout All Devices
                </button>
            </div>

            <div v-if="isLoadingSessions" class="py-12 text-center">
                <div class="inline-block animate-spin h-8 w-8 border-2 border-pink-500 border-t-transparent rounded-full mb-2"></div>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <div v-for="session in sessions" :key="session.id"
                    class="group relative bg-white/[0.02] border border-white/5 rounded-[2.2rem] p-6 transition-all duration-500 hover:bg-white/[0.05] hover:border-pink-500/20">
                    <div class="flex justify-between items-start mb-4">
                        <div class="p-3 rounded-2xl bg-gradient-to-tr from-gray-800 to-gray-900 border border-white/5 text-gray-400 group-hover:text-blue-400 transition-colors shadow-lg">
                            <MonitorIcon class="w-5 h-5" />
                        </div>
                        <span v-if="session.is_current" class="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[8px] font-black uppercase tracking-widest rounded-full italic shadow-lg shadow-blue-900/20">Current Session</span>
                    </div>
                    <h4 class="text-xs font-black uppercase tracking-widest mb-1">{{ session.device_name || 'Unknown Device' }}</h4>
                    <p class="text-[9px] font-mono text-gray-500 uppercase tracking-tighter italic">{{ session.ip_address }}</p>
                    <p class="text-[8px] font-black text-gray-600 uppercase tracking-widest mt-4 italic">Last active: {{ formatDateTime(session.last_activity) }}</p>
                </div>
            </div>
        </section>

        <section class="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
            <div class="bg-orange-950/10 border border-orange-500/20 p-8 rounded-[2.8rem] space-y-4 group">
                <div class="flex items-center gap-3">
                    <PauseCircleIcon class="h-5 w-5 text-orange-500" />
                    <h3 class="text-lg font-black uppercase tracking-tighter text-white">Deactivate Account</h3>
                </div>
                <p class="text-xs text-gray-500 leading-relaxed font-medium italic">Temporarily disable your account. Your profile will be hidden until you log back in (within 30 days).</p>
                <button @click="confirmDeactivation" :disabled="isDeactivating"
                    class="w-full py-4 bg-white/5 border border-white/10 text-orange-500 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-orange-500 hover:text-white transition-all shadow-sm">
                    {{ isDeactivating ? 'Deactivating...' : 'Deactivate Account' }}
                </button>
            </div>

            <div class="bg-red-950/10 border border-red-500/20 p-8 rounded-[2.8rem] space-y-4 group">
                <div class="flex items-center gap-3">
                    <Trash2Icon class="h-5 w-5 text-red-500" />
                    <h3 class="text-lg font-black uppercase tracking-tighter text-red-500">Permanent Account Deletion</h3>
                </div>
                <p class="text-xs text-gray-500 leading-relaxed font-medium italic">This will schedule your account for permanent deletion after 30 days. All data, progress, and personal info will be permanently lost.</p>
                <button v-if="!showDeleteForm" @click="showDeleteForm = true"
                    class="w-full py-4 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-red-900/20 hover:scale-[1.02] transition-all">
                    Request Account Deletion
                </button>
            </div>
        </section>

        <transition name="fade">
            <div v-if="showDeleteForm" class="p-10 bg-[#0d0d12] border border-red-500/30 rounded-[3rem] space-y-8 animate-in zoom-in duration-500">
                <div class="space-y-6">
                    <div class="space-y-2 group">
                        <label class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1 group-focus-within:text-red-400 transition-colors">Confirm Password *</label>
                        <input v-model="deleteForm.password" type="password" required
                            class="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white focus:ring-2 focus:ring-red-500/50 outline-none transition-all shadow-sm" />
                    </div>
                    <div class="space-y-2 group">
                        <label class="text-[10px] font-black uppercase tracking-[0.2em] text-red-400 ml-1">Type <span class="font-bold text-red-600">DELETE MY ACCOUNT</span> to confirm *</label>
                        <input v-model="deleteForm.confirm_text" type="text" placeholder="DELETE MY ACCOUNT" required
                            class="w-full px-6 py-4 rounded-2xl bg-red-500/5 border border-red-500/20 text-white placeholder-red-900/40 outline-none focus:ring-2 focus:ring-red-500/50 transition-all shadow-sm" />
                    </div>
                    <div class="space-y-2 group">
                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Reason (Optional - helps us improve)</label>
                        <textarea v-model="deleteForm.reason" rows="3" placeholder="Help us improve by sharing why you're leaving"
                            class="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white focus:ring-2 focus:ring-red-500/50 outline-none resize-none transition-all shadow-sm"></textarea>
                    </div>
                </div>
                <div class="flex flex-col sm:flex-row gap-4">
                    <button @click="requestDeletion" :disabled="!isDeleteFormValid || isDeleting"
                        class="flex-1 py-4 bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-red-900/20 disabled:opacity-30 transition-all">
                        {{ isDeleting ? 'Processing...' : 'Confirm & Schedule Deletion' }}
                    </button>
                    <button @click="cancelDeleteForm" class="px-10 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all">Cancel</button>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
    AlertTriangleIcon,
    MonitorIcon,
    LogOutIcon,
    PauseCircleIcon,
    Trash2Icon
} from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import { useProfileStore } from '@/stores/profile';
import { useToast } from '@/utils/useToast';

const router = useRouter();
const authStore = useAuthStore();
const profileStore = useProfileStore();
const toast = useToast();

// State
const showDeleteForm = ref(false);
const isDeleting = ref(false);
const isDeactivating = ref(false);
const isChangingPassword = ref(false);
const isLoggingOut = ref(false);
const isCancelling = ref(false);
const isLoadingSessions = ref(false);

const deleteForm = ref({
    password: '',
    confirm_text: '',
    reason: ''
});

const deletionStatus = ref(null);
const sessions = ref([]);

// Password change state
const passwordData = ref({
    current_password: '',
    password: '',
    password_confirmation: ''
});

// Computed
const isDeleteFormValid = computed(() => {
    return deleteForm.value.confirm_text === 'DELETE MY ACCOUNT' &&
        deleteForm.value.password.length > 0;
});

const isPasswordFormValid = computed(() => {
    return passwordData.value.current_password &&
        passwordData.value.password &&
        passwordData.value.password_confirmation &&
        passwordData.value.password === passwordData.value.password_confirmation &&
        passwordData.value.password.length >= 8;
});

// Methods
const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const formatDateTime = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const changePassword = async () => {
    isChangingPassword.value = true;
    try {
        const result = await authStore.changePassword(passwordData.value);
        if (result.ok) {
            passwordData.value = {
                current_password: '',
                password: '',
                password_confirmation: ''
            };
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        }
    } catch (error) {
        // Error toast handled by store
    } finally {
        isChangingPassword.value = false;
    }
};

const loadSessions = async () => {
    isLoadingSessions.value = true;
    try {
        const sessionList = await authStore.fetchSessions();
        sessions.value = sessionList || [];
    } catch (error) {
        toast.error('Failed to load sessions');
    } finally {
        isLoadingSessions.value = false;
    }
};

const logoutAllDevices = async () => {
    if (!confirm('This will log you out of all devices including this one. You will need to log in again. Continue?')) {
        return;
    }
    isLoggingOut.value = true;
    try {
        await authStore.logoutAll();
        toast.success('Logged out of all devices');
        router.push('/login');
    } catch (error) {
        toast.error('Failed to logout');
    } finally {
        isLoggingOut.value = false;
    }
};

const confirmDeactivation = async () => {
    if (!confirm('Are you sure you want to deactivate your account? Your profile will be hidden and you can reactivate within 30 days by logging in again.')) {
        return;
    }
    isDeactivating.value = true;
    try {
        const success = await profileStore.deactivateAccount();
        if (success) {
            router.push('/login');
        }
    } catch (error) {
    } finally {
        isDeactivating.value = false;
    }
};

const requestDeletion = async () => {
    isDeleting.value = true;
    try {
        const success = await profileStore.requestAccountDeletion(
            deleteForm.value.password,
            deleteForm.value.reason
        );
        if (success) {
            await loadDeletionStatus();
            showDeleteForm.value = false;
            deleteForm.value = {
                password: '',
                confirm_text: '',
                reason: ''
            };
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        }
    } catch (error) {
    } finally {
        isDeleting.value = false;
    }
};

const cancelDeletion = async () => {
    if (!confirm('Are you sure you want to cancel the account deletion? Your account will be reactivated.')) {
        return;
    }
    isCancelling.value = true;
    try {
        const success = await profileStore.cancelAccountDeletion();
        if (success) {
            deletionStatus.value = null;
        }
    } catch (error) {
    } finally {
        isCancelling.value = false;
    }
};

const cancelDeleteForm = () => {
    showDeleteForm.value = false;
    deleteForm.value = {
        password: '',
        confirm_text: '',
        reason: ''
    };
};

const loadDeletionStatus = async () => {
    try {
        const status = await profileStore.getDeletionStatus();
        deletionStatus.value = status;
    } catch (error) {
        console.error('Failed to load deletion status:', error);
    }
};

onMounted(async () => {
    await Promise.all([
        loadSessions(),
        loadDeletionStatus()
    ]);
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(10px); }

input, select, textarea {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>