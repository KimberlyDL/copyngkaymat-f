<template>
    <Teleport to="body">
        <TransitionGroup name="toast" tag="div"
            class="fixed bottom-6 right-6 z-[300] flex flex-col gap-4 pointer-events-none">
            <Toast v-for="toast in toastStore.toasts" :key="toast.id" :toast="toast"
                class="pointer-events-auto hover:scale-[1.02] transition-transform duration-300" />
        </TransitionGroup>
    </Teleport>
</template>

<script setup>
import { useToastStore } from '@/stores/toast'
import Toast from './Toast.vue'
import { TransitionGroup } from 'vue'

const toastStore = useToastStore()
</script>

<style scoped>
@reference "@/style.css";

/* Institutional Slide & Blur Animation */
.toast-enter-active,
.toast-leave-active {
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-enter-from {
    opacity: 0;
    filter: blur(10px);
    transform: translateX(40px) scale(0.9);
}

.toast-leave-to {
    opacity: 0;
    filter: blur(4px);
    transform: translateX(20px) scale(0.95);
}

/* Smooth layout re-stacking when a toast is dismissed */
.toast-move {
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>