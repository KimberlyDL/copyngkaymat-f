<!-- src/layouts/DashboardLayout.vue -->
<template>
    <div class="min-h-screen bg-platinum-50 dark:bg-abyss-900">
        <DashboardHeader @toggle-mobile-sidebar="mobileOpen = !mobileOpen" />

        <div class="pt-16">
            <!-- Sidebar -->
            <DashboardSidebar :is-mobile-open="mobileOpen" :user-id="$route.params.id || null"
                @close-mobile-sidebar="mobileOpen = false" @expanded-change="isFull = $event" />

            <!-- Main: adjust margin for md+ depending on icon/full -->
            <main :class="[
                'transition-all duration-300 ease-in-out',
                'px-6 py-6',
                // icon (w-20) vs full (w-64)
                'md:ml-20',
                isFull && 'md:ml-64'
            ]">
                <router-view />
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import DashboardHeader from '@/components/nav/user_dashboard_header.vue'
import DashboardSidebar from '@/components/nav/user_dashboard_sidebar.vue'

const mobileOpen = ref(false)
const isFull = ref(false) // from sidebar expand/collapse (md+)
</script>
