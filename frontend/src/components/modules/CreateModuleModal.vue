<template>
    <!-- ── Overlay ──────────────────────────────────────────────────
         Block scroll container — modal is never cropped on short screens
    ─────────────────────────────────────────────────────────────── -->
    <div
        class="fixed inset-0 z-[150] bg-abyss-950/60 backdrop-blur-sm overflow-y-auto py-10 px-4"
        @click.self="$emit('cancel')"
    >
        <!-- ── Modal shell ────────────────────────────────────────
             L1 layer: platinum-100 / abyss-700
             border-2 border-platinum-300 = stamped boundary
        ─────────────────────────────────────────────────────── -->
        <div class="modal-shell animate-modal font-poppins">

            <!-- ── HEADER ────────────────────────────────────── -->
            <header class="modal-header">
                <div class="flex items-center gap-4">
                    <!-- Accent stamp -->
                    <div class="ds-icon-badge ds-icon-badge--lavender">
                        <BookOpenIcon class="w-4 h-4" />
                    </div>
                    <div>
                        <p class="section-eyebrow">Module Registry</p>
                        <h2 class="font-madimione text-2xl text-abyss-800 dark:text-platinum-100 leading-tight">
                            Create a <span class="brand-gradient-text">New Module</span>
                        </h2>
                    </div>
                </div>
                <button
                    @click="$emit('cancel')"
                    class="close-btn"
                    aria-label="Close"
                >
                    <XIcon class="w-4 h-4" />
                </button>
            </header>

            <!-- ── FORM ──────────────────────────────────────── -->
            <form @submit.prevent="handleSubmit" class="modal-body custom-scrollbar space-y-5">

                <!-- Classroom assignment -->
                <div class="field-group">
                    <label class="field-label">Classroom Assignment</label>
                    <div class="ds-select-wrap">
                        <select v-model="form.classroom_id" class="ds-select">
                            <option :value="null">🌍 Public Access (All Students)</option>
                            <option v-for="cls in classroomStore.classrooms" :key="cls.id" :value="cls.id">
                                🔒 {{ cls.name }}
                            </option>
                        </select>
                        <ChevronDownIcon class="ds-select-icon" />
                    </div>
                </div>

                <!-- Title -->
                <div class="field-group">
                    <label class="field-label">
                        Module Title <span class="text-red-400">*</span>
                    </label>
                    <input
                        v-model="form.title"
                        type="text"
                        required
                        placeholder="e.g. Introduction to GAD Awareness"
                        class="input-field placeholder:text-platinum-700 dark:placeholder:text-platinum-400"
                    />
                </div>

                <!-- Category + Difficulty row -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="field-group">
                        <label class="field-label">Category <span class="text-red-400">*</span></label>
                        <div class="ds-select-wrap">
                            <select v-model="form.category" required class="ds-select">
                                <option value="gad">Institutional</option>
                                <option value="sexual_health">Health</option>
                                <option value="vawc">Safety</option>
                                <option value="general">Standard</option>
                            </select>
                            <ChevronDownIcon class="ds-select-icon" />
                        </div>
                    </div>

                    <div class="field-group">
                        <label class="field-label">Difficulty Level</label>
                        <div class="ds-select-wrap">
                            <select v-model="form.difficulty_level" class="ds-select">
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                            <ChevronDownIcon class="ds-select-icon" />
                        </div>
                    </div>
                </div>

                <!-- Description -->
                <div class="field-group">
                    <label class="field-label">Description</label>
                    <textarea
                        v-model="form.description"
                        rows="3"
                        placeholder="Brief overview of this module's objectives…"
                        class="input-field resize-none placeholder:text-platinum-700 dark:placeholder:text-platinum-400"
                    ></textarea>
                    <p class="field-subtext">Optional — visible to students on the module card.</p>
                </div>

                <!-- File uploads row ────────────────────────────
                     L2 inset tiles: platinum-200 / abyss-600
                ──────────────────────────────────────────────── -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <!-- Module file -->
                    <div class="upload-tile">
                        <div class="flex items-center gap-2 mb-3">
                            <div class="ds-icon-badge ds-icon-badge--lavender !p-1.5">
                                <FileIcon class="w-3.5 h-3.5" />
                            </div>
                            <span class="font-semibold text-sm text-abyss-800 dark:text-platinum-100">Module File</span>
                        </div>
                        <label class="upload-zone cursor-pointer">
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                @change="handleFileSelect"
                                class="absolute inset-0 opacity-0 cursor-pointer z-10"
                            />
                            <UploadIcon class="w-4 h-4 text-platinum-500 dark:text-platinum-400 shrink-0" />
                            <span class="field-subtext truncate !text-sm">
                                {{ moduleFile ? moduleFile.name : 'Select PDF or Word document' }}
                            </span>
                        </label>
                        <p class="field-subtext mt-2">PDF or .docx · max 25 MB</p>
                    </div>

                    <!-- Thumbnail -->
                    <div class="upload-tile">
                        <div class="flex items-center gap-2 mb-3">
                            <div class="ds-icon-badge ds-icon-badge--pink !p-1.5">
                                <ImageIcon class="w-3.5 h-3.5" />
                            </div>
                            <span class="font-semibold text-sm text-abyss-800 dark:text-platinum-100">Cover Thumbnail</span>
                        </div>
                        <label class="upload-zone cursor-pointer">
                            <input
                                type="file"
                                accept="image/*"
                                @change="handleThumbnailSelect"
                                class="absolute inset-0 opacity-0 cursor-pointer z-10"
                            />
                            <ImageIcon class="w-4 h-4 text-platinum-500 dark:text-platinum-400 shrink-0" />
                            <span class="field-subtext truncate !text-sm">
                                {{ thumbnail ? thumbnail.name : 'Select cover image' }}
                            </span>
                        </label>
                        <p class="field-subtext mt-2">Any image format · max 5 MB</p>
                    </div>

                </div>

                <!-- Visibility toggles ──────────────────────────
                     L2 inset row: platinum-200 / abyss-600
                ──────────────────────────────────────────────── -->
                <div class="toggle-row">
                    <label class="toggle-item group">
                        <input
                            v-model="form.is_published"
                            type="checkbox"
                            class="toggle-checkbox"
                        />
                        <div class="toggle-track">
                            <div class="toggle-thumb"></div>
                        </div>
                        <div>
                            <p class="font-semibold text-sm text-abyss-800 dark:text-platinum-100
                                       group-hover:text-calm-lavender-600 dark:group-hover:text-calm-lavender-400 transition-colors">
                                Published
                            </p>
                            <p class="field-subtext">Visible to students immediately</p>
                        </div>
                    </label>

                    <div class="w-px self-stretch bg-platinum-300 dark:bg-abyss-500 hidden md:block"></div>

                    <label class="toggle-item group">
                        <input
                            v-model="form.is_featured"
                            type="checkbox"
                            class="toggle-checkbox"
                        />
                        <div class="toggle-track">
                            <div class="toggle-thumb"></div>
                        </div>
                        <div>
                            <p class="font-semibold text-sm text-abyss-800 dark:text-platinum-100
                                       group-hover:text-calm-lavender-600 dark:group-hover:text-calm-lavender-400 transition-colors">
                                Featured
                            </p>
                            <p class="field-subtext">Highlighted in the module library</p>
                        </div>
                    </label>
                </div>

                <!-- Inline error -->
                <div v-if="error" class="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800/40">
                    <AlertCircleIcon class="w-4 h-4 text-red-500 shrink-0" />
                    <p class="text-sm font-medium text-red-600 dark:text-red-400">{{ error }}</p>
                </div>

            </form>

            <!-- ── FOOTER ─────────────────────────────────────── -->
            <footer class="modal-footer">
                <button
                    type="button"
                    @click="$emit('cancel')"
                    class="btn-secondary btn-3d--secondary justify-center flex-1 max-w-[160px]"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    @click="handleSubmit"
                    :disabled="creating"
                    class="btn-primary btn-3d justify-center flex-1 max-w-[240px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span v-if="!creating">Create Module</span>
                    <div v-else class="spinner !w-4 !h-4 !border-2 !border-white/30 !border-t-white"></div>
                </button>
            </footer>

        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import {
    X as XIcon,
    Upload as UploadIcon,
    Image as ImageIcon,
    AlertCircle as AlertCircleIcon,
    FileIcon,
    ChevronDown as ChevronDownIcon,
    BookOpen as BookOpenIcon
} from 'lucide-vue-next';
import { useModuleStore } from '@/stores/module';
import { useClassroomStore } from '@/stores/classroom';

const props = defineProps({
    defaultClassroomId: { type: Number, default: null }
});

const emit = defineEmits(['saved', 'cancel']);
const moduleStore = useModuleStore();
const classroomStore = useClassroomStore();

const form = reactive({
    title: '',
    description: '',
    content: '',
    category: 'general',
    difficulty_level: 'beginner',
    classroom_id: props.defaultClassroomId || null,
    order: 0,
    is_published: false,
    is_featured: false
});

const moduleFile = ref(null);
const thumbnail = ref(null);
const creating = ref(false);
const error = ref(null);

onMounted(async () => {
    if (classroomStore.classrooms.length === 0) {
        await classroomStore.fetchMyClassrooms();
    }
});

const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
            alert('PDF or Word docs only.');
            event.target.value = '';
            return;
        }
        if (file.size > 25 * 1024 * 1024) {
            alert('Limit: 25MB.');
            event.target.value = '';
            return;
        }
        moduleFile.value = file;
    }
};

const handleThumbnailSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
        if (!file.type.startsWith('image/')) {
            alert('Images only.');
            event.target.value = '';
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('Limit: 5MB.');
            event.target.value = '';
            return;
        }
        thumbnail.value = file;
    }
};

const handleSubmit = async () => {
    creating.value = true;
    error.value = null;
    try {
        const files = { moduleFile: moduleFile.value, thumbnail: thumbnail.value };
        await moduleStore.createModule(form, files);
        emit('saved');
    } catch (err) {
        error.value = err.response?.data?.message || 'Setup failed';
    } finally {
        creating.value = false;
    }
};
</script>

<style scoped>
@reference "@/style.css";

/* ═══════════════════════════════════════════════════════════
   MODAL SHELL  —  L1 layer
   Light: platinum-100 on platinum-50 page / scrim
   Dark:  abyss-700 on abyss-950 scrim
═══════════════════════════════════════════════════════════ */
.modal-shell {
    @apply relative w-full max-w-3xl mx-auto flex flex-col;
    @apply bg-platinum-100 dark:bg-abyss-700;
    @apply border-2 border-platinum-300 dark:border-abyss-500;
    @apply rounded-2xl overflow-hidden;
}

/* ── Header ───────────────────────────────────────────────── */
.modal-header {
    @apply flex items-center justify-between shrink-0;
    @apply px-7 py-5;
    @apply bg-platinum-200 dark:bg-abyss-600;
    @apply border-b-2 border-platinum-300 dark:border-abyss-500;
}

/* ── Body (scrollable form area) ──────────────────────────── */
.modal-body {
    @apply flex-1 overflow-y-auto px-7 py-6;
}

/* ── Footer ───────────────────────────────────────────────── */
.modal-footer {
    @apply flex items-center justify-end gap-3 shrink-0;
    @apply px-7 py-5;
    @apply bg-platinum-200 dark:bg-abyss-600;
    @apply border-t-2 border-platinum-300 dark:border-abyss-500;
}

/* ── Close button ─────────────────────────────────────────── */
.close-btn {
    @apply p-2 rounded-xl shrink-0 transition-all duration-150;
    @apply bg-platinum-300 dark:bg-abyss-500;
    @apply border-2 border-platinum-300 dark:border-abyss-400;
    @apply text-platinum-600 dark:text-platinum-400;
    @apply hover:bg-red-50 dark:hover:bg-red-900/20;
    @apply hover:border-red-200 dark:hover:border-red-800/40;
    @apply hover:text-red-500 dark:hover:text-red-400;
}

/* ═══════════════════════════════════════════════════════════
   FIELD GROUP
═══════════════════════════════════════════════════════════ */
.field-group {
    @apply space-y-1.5;
}

/* ═══════════════════════════════════════════════════════════
   SELECT  —  L2 inset: platinum-200 / abyss-600
═══════════════════════════════════════════════════════════ */
.ds-select-wrap {
    @apply relative;
}

.ds-select {
    @apply w-full appearance-none cursor-pointer;
    @apply bg-platinum-200 dark:bg-abyss-600;
    @apply border-2 border-platinum-300 dark:border-abyss-500;
    @apply hover:border-calm-lavender-300 dark:hover:border-calm-lavender-700;
    @apply text-abyss-800 dark:text-platinum-200;
    @apply font-medium text-sm;
    @apply rounded-xl px-4 py-3 pr-10;
    @apply focus:outline-none focus:ring-2 focus:ring-calm-lavender-400/40 focus:border-calm-lavender-400;
    @apply transition-all duration-150;
}

.ds-select-icon {
    @apply absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none;
    @apply w-4 h-4 text-platinum-500 dark:text-platinum-400;
}

/* ═══════════════════════════════════════════════════════════
   ICON BADGE  —  bordered stamp (reused from dashboard)
═══════════════════════════════════════════════════════════ */
.ds-icon-badge {
    @apply p-2.5 rounded-xl border-2 shrink-0 flex items-center justify-center;
}

.ds-icon-badge--lavender {
    @apply bg-calm-lavender-50 dark:bg-calm-lavender-900/20;
    @apply border-calm-lavender-200 dark:border-calm-lavender-800/40;
    @apply text-calm-lavender-600 dark:text-calm-lavender-400;
}

.ds-icon-badge--pink {
    @apply bg-neon-pink-50 dark:bg-neon-pink-900/20;
    @apply border-neon-pink-200 dark:border-neon-pink-800/40;
    @apply text-neon-pink-600 dark:text-neon-pink-400;
}

/* ═══════════════════════════════════════════════════════════
   UPLOAD TILE  —  L2 inset: platinum-200 / abyss-600
═══════════════════════════════════════════════════════════ */
.upload-tile {
    @apply p-4 rounded-xl;
    @apply bg-platinum-200 dark:bg-abyss-600;
    @apply border-2 border-platinum-300 dark:border-abyss-500;
}

.upload-zone {
    @apply relative flex items-center gap-3 p-3 rounded-xl transition-all duration-150;
    @apply bg-platinum-50 dark:bg-abyss-700;
    @apply border-2 border-platinum-300 dark:border-abyss-500 border-dashed;
    @apply hover:border-calm-lavender-300 dark:hover:border-calm-lavender-700;
    @apply hover:bg-calm-lavender-50/50 dark:hover:bg-calm-lavender-900/10;
}

/* ═══════════════════════════════════════════════════════════
   TOGGLE ROW  —  L2 inset: platinum-200 / abyss-600
═══════════════════════════════════════════════════════════ */
.toggle-row {
    @apply flex flex-col md:flex-row items-start md:items-center gap-5 p-4 rounded-xl;
    @apply bg-platinum-200 dark:bg-abyss-600;
    @apply border-2 border-platinum-300 dark:border-abyss-500;
}

.toggle-item {
    @apply flex items-center gap-3 cursor-pointer flex-1;
}

/* Hide the native checkbox — replaced by custom toggle */
.toggle-checkbox {
    @apply sr-only;
}

.toggle-track {
    @apply relative w-10 h-6 rounded-full shrink-0 transition-colors duration-200;
    @apply bg-platinum-300 dark:bg-abyss-500;
    @apply border-2 border-platinum-400 dark:border-abyss-400;
}

/* Active state via peer — when checkbox is checked */
.toggle-checkbox:checked ~ .toggle-track {
    @apply bg-calm-lavender-500 border-calm-lavender-600;
}

.toggle-thumb {
    @apply absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.toggle-checkbox:checked ~ .toggle-track .toggle-thumb {
    @apply translate-x-4;
}

/* ═══════════════════════════════════════════════════════════
   FLAT-3D BUTTON MODIFIERS
═══════════════════════════════════════════════════════════ */
.btn-3d {
    @apply border-b-4 border-black/10 active:border-b active:translate-y-px;
}

.btn-3d--secondary {
    @apply border-b-4 border-platinum-400 dark:border-abyss-400 active:border-b active:translate-y-px;
}

/* ═══════════════════════════════════════════════════════════
   MODAL ENTRY ANIMATION  —  no blur filter
═══════════════════════════════════════════════════════════ */
.animate-modal {
    animation: modalEntry 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes modalEntry {
    from { opacity: 0; transform: scale(0.97) translateY(16px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
}

/* ── Scrollbar ──────────────────────────────────────────── */
.custom-scrollbar::-webkit-scrollbar { width: 3px; }
.custom-scrollbar::-webkit-scrollbar-thumb {
    @apply rounded-full bg-platinum-300 dark:bg-abyss-500;
}

/* ── Select option colors (browser override) ────────────── */
select option {
    @apply bg-platinum-50 text-abyss-800;
}

.dark select option {
    @apply bg-abyss-600 text-platinum-100;
}
</style>