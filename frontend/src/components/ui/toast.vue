<template>
    <div
        class="pointer-events-auto relative flex w-full max-w-sm overflow-hidden rounded-xl bg-[#0d0d12]/95 backdrop-blur-md transition-all duration-300 shadow-[0_10px_40px_rgba(0,0,0,0.4)]"
    >
        <div class="flex-1 p-4">
            <div class="flex items-center gap-3">
                <component 
                    :is="currentStyle.icon" 
                    size="20" 
                    :class="currentStyle.iconColor" 
                    strokeWidth="2.5" 
                />

                <div class="flex-1 min-w-0">
                    <p class="text-[13px] font-medium text-white/90 leading-snug break-words">
                        {{ toast.message }}
                    </p>
                </div>
            </div>
        </div>

        <button 
            @click="handleClose" 
            class="flex items-center justify-center px-4 hover:bg-white/5 transition-colors group"
            aria-label="Close"
        >
            <XIcon size="16" class="text-white/20 group-hover:text-white/60" />
        </button>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { 
    CheckCircle2, 
    AlertCircle, 
    AlertTriangle, 
    Info, 
    X as XIcon 
} from 'lucide-vue-next'
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()
const props = defineProps({
    toast: { 
        type: Object, 
        required: true 
    }
})

const handleClose = () => {
    toastStore.removeToast(props.toast.id)
}

// Configuration mapping para sa icons at kulay
const themeConfig = {
    success: {
        icon: CheckCircle2,
        iconColor: 'text-emerald-500'
    },
    error: {
        icon: AlertCircle,
        iconColor: 'text-red-500'
    },
    warning: {
        icon: AlertTriangle,
        iconColor: 'text-amber-500'
    },
    info: {
        icon: Info,
        iconColor: 'text-blue-500'
    }
}

const currentStyle = computed(() => themeConfig[props.toast.type] || themeConfig.info)
</script>

<style scoped>
/* Swabe na slide-in animation mula sa kanan */
@keyframes slideIn {
    from { 
        transform: translateX(20px); 
        opacity: 0; 
    }
    to { 
        transform: translateX(0); 
        opacity: 1; 
    }
}

.pointer-events-auto {
    animation: slideIn 0.3s ease-out;
}
</style>