<template>
  <div class="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 font-['Poppins']">
    
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
      <div class="space-y-2">
        <h3 class="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
          <UsersIcon class="w-6 h-6 text-blue-500" /> Guardian Information
        </h3>
        <p class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 italic">Essential for minors and account recovery.</p>
      </div>
      <button @click="openModal()"
        class="group relative px-8 py-4 bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-500 hover:border-blue-500/50">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="relative z-10 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white">
          <UserPlusIcon class="w-4 h-4 text-blue-400" /> Add Guardian
        </div>
      </button>
    </div>

    <div v-if="isLoading" class="py-20 text-center">
      <div class="inline-block animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mb-4"></div>
      <p class="text-[10px] font-black uppercase tracking-widest text-gray-600 animate-pulse">Loading guardians...</p>
    </div>

    <div v-else-if="guardians.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div v-for="guardian in guardians" :key="guardian.id" 
        class="group relative bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 transition-all duration-500 hover:bg-white/[0.05] hover:border-white/10 hover:translate-y-[-4px]">
        
        <div v-if="guardian.is_primary" class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-pink-500 opacity-50"></div>

        <div class="flex justify-between items-start mb-6">
          <div class="h-12 w-12 rounded-2xl bg-gradient-to-tr from-gray-800 to-gray-900 border border-white/5 flex items-center justify-center text-blue-400 font-black text-xs shadow-lg shadow-black/50">
            {{ guardian.full_name.substring(0,2).toUpperCase() }}
          </div>
          <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button @click="openModal(guardian)" class="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
              <SettingsIcon class="w-3.5 h-3.5" />
            </button>
            <button @click="confirmDelete(guardian)" class="p-2 bg-red-500/10 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-all">
              <Trash2Icon class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <h4 class="text-sm font-black text-white uppercase tracking-widest leading-none mb-1">{{ guardian.full_name }}</h4>
            <div class="flex items-center gap-2">
              <span class="text-[9px] font-mono text-blue-500 uppercase">{{ guardian.guardian_type.replace('_', ' ') }}</span>
              <span class="text-gray-800 text-[8px]">•</span>
              <span class="text-[9px] font-mono text-gray-500 uppercase">{{ guardian.relationship }}</span>
            </div>
          </div>

          <div class="space-y-2 pt-2 border-t border-white/5">
            <div class="flex items-center gap-3 text-gray-400">
              <PhoneIcon class="w-3 h-3 text-pink-500" />
              <span class="text-[10px] font-mono tracking-tighter">{{ guardian.phone_number }}</span>
            </div>
            <div v-if="guardian.email" class="flex items-center gap-3 text-gray-400">
              <MailIcon class="w-3 h-3 text-blue-500" />
              <span class="text-[10px] font-mono tracking-tighter truncate">{{ guardian.email }}</span>
            </div>
          </div>

          <div v-if="guardian.is_primary" class="pt-2">
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
              <ShieldCheckIcon class="w-2.5 h-2.5 text-blue-400" />
              <span class="text-[8px] font-black uppercase tracking-widest text-blue-400">Primary</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="relative p-16 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-[3.5rem] group overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-tr from-blue-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <UsersIcon class="mx-auto h-16 w-16 text-gray-800 mb-6 group-hover:text-blue-500/50 transition-colors" />
      <h3 class="text-sm font-black text-white uppercase tracking-[0.3em] mb-2">No guardians added</h3>
      <p class="text-[10px] text-gray-600 font-medium tracking-widest mb-8">Get started by adding a guardian for account recovery.</p>
      <button @click="openModal()"
        class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-pink-600 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-900/20 hover:scale-105 active:scale-95 transition-all">
        Add Your First Guardian
      </button>
    </div>

    <teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-10">
        <div class="absolute inset-0 bg-[#020203]/90 backdrop-blur-md" @click="closeModal"></div>
        
        <div class="relative w-full max-w-xl bg-[#0d0d12] border border-white/10 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] overflow-hidden animate-in zoom-in duration-500">
          <div class="px-10 py-8 border-b border-white/5 flex items-center justify-between">
            <h3 class="text-xl font-black text-white uppercase tracking-tighter">
              {{ editMode ? 'Edit' : 'Add New' }} <span class="text-blue-500">Guardian</span>
            </h3>
            <button @click="closeModal" class="p-2 text-gray-600 hover:text-white transition-colors">
              <XIcon class="w-5 h-5" />
            </button>
          </div>

          <form @submit.prevent="saveGuardian" class="p-10 space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Guardian Type</label>
                <div class="relative">
                  <select v-model="form.guardian_type" required
                    class="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-xs outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none transition-all">
                    <option value="">Select type...</option>
                    <option value="parent">Parent</option>
                    <option value="legal_guardian">Legal Guardian</option>
                    <option value="other">Other</option>
                  </select>
                  <div class="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600">▼</div>
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Full Name</label>
                <input v-model="form.full_name" type="text" required placeholder="Juan Dela Cruz"
                  class="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-xs outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Relationship</label>
                <input v-model="form.relationship" type="text" required placeholder="Mother, Father, etc."
                  class="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-xs outline-none focus:ring-2 focus:ring-pink-500/50 transition-all" />
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Phone Number</label>
                <input v-model="form.phone_number" type="tel" required pattern="^\+639\d{9}$" placeholder="+639XXXXXXXXX"
                  class="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-xs outline-none focus:ring-2 focus:ring-pink-500/50 transition-all" />
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Email (Optional)</label>
              <input v-model="form.email" type="email" placeholder="guardian@example.com"
                class="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-xs outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Address (Optional)</label>
              <textarea v-model="form.address" rows="2" placeholder="Complete address"
                class="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-xs outline-none focus:ring-2 focus:ring-blue-500/50 resize-none transition-all"></textarea>
            </div>

            <div class="flex items-center gap-4 p-6 bg-white/[0.02] rounded-[2rem] border border-white/5 group">
              <input v-model="form.is_primary" type="checkbox" id="is_primary"
                class="h-5 w-5 rounded-lg bg-white/5 border-white/10 text-blue-600 focus:ring-blue-500/40 transition-all cursor-pointer shadow-sm group-hover:border-blue-500/50" />
              <div>
                <label for="is_primary" class="text-[11px] font-black uppercase tracking-widest text-white leading-none">Set as Primary Guardian</label>
                <p class="text-[9px] text-gray-600 font-medium uppercase mt-1">Primary guardian will be contacted first in emergencies.</p>
              </div>
            </div>

            <div class="pt-6 flex gap-4">
              <button type="submit" :disabled="isSaving"
                class="flex-1 py-4 bg-gradient-to-r from-blue-600 to-pink-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2">
                <svg v-if="isSaving" class="animate-spin h-3 w-3 text-white" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                {{ isSaving ? 'Saving...' : (editMode ? 'Update Guardian' : 'Add Guardian') }}
              </button>
              <button type="button" @click="closeModal" class="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { 
  UserPlusIcon, 
  UsersIcon, 
  ShieldCheckIcon, 
  Settings as SettingsIcon, 
  Trash2Icon, 
  PhoneIcon, 
  MailIcon, 
  X as XIcon 
} from 'lucide-vue-next';
import { useProfileStore } from '@/stores/profile';
import { useToast } from '@/utils/useToast';

const profileStore = useProfileStore();
const toast = useToast();

const guardians = ref([]);
const showModal = ref(false);
const isLoading = ref(false);
const isSaving = ref(false);
const editMode = ref(false);
const editingId = ref(null);

const emptyForm = {
  guardian_type: '',
  full_name: '',
  relationship: '',
  phone_number: '',
  email: '',
  address: '',
  is_primary: false
};

const form = ref({ ...emptyForm });

const loadGuardians = async () => {
  isLoading.value = true;
  try {
    await profileStore.fetchGuardians();
    guardians.value = profileStore.guardians;
  } catch (error) {
    toast.error('Failed to load guardians');
  } finally {
    isLoading.value = false;
  }
};

const openModal = (guardian = null) => {
  if (guardian) {
    editMode.value = true;
    editingId.value = guardian.id;
    form.value = { ...guardian };
  } else {
    editMode.value = false;
    editingId.value = null;
    form.value = { ...emptyForm };
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editMode.value = false;
  editingId.value = null;
  form.value = { ...emptyForm };
};

const saveGuardian = async () => {
  isSaving.value = true;
  try {
    let success = editMode.value 
      ? await profileStore.updateGuardian(editingId.value, form.value)
      : await profileStore.addGuardian(form.value);

    if (success) {
      await loadGuardians();
      closeModal();
    }
  } catch (error) {
    console.error('Save guardian error:', error);
  } finally {
    isSaving.value = false;
  }
};

const confirmDelete = async (guardian) => {
  if (confirm(`Are you sure you want to remove ${guardian.full_name} as a guardian? This action cannot be undone.`)) {
    const success = await profileStore.deleteGuardian(guardian.id);
    if (success) {
      await loadGuardians();
    }
  }
};

onMounted(() => loadGuardians());
</script>

<style scoped>
/* High-Density Transition */
.animate-in {
  animation: fadeInScale 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeInScale {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}

/* Scrollbar refinement */
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }

input, select, textarea {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>