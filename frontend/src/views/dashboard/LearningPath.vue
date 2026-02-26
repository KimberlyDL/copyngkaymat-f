<template>
    <div class="space-y-6">
        <div class="bg-white dark:bg-abyss-800 rounded-xl p-8 border border-sun-200 dark:border-abyss-700">
            <router-link :to="{ name: 'user.dashboard' }" class="text-kaitoke-green-600 hover:underline text-sm font-medium mb-4 inline-block">
                ← Back to Dashboard
            </router-link>
            
            <h1 class="text-3xl font-bold text-abyss-900 dark:text-platinum-50 mb-2">
                {{ pathTitle }}
            </h1>
            <p class="text-platinum-600 dark:text-platinum-300 mb-6">
                Complete all modules in this learning path to master the topic.
            </p>

            <!-- Overall Progress -->
            <div class="mb-8">
                <div class="flex justify-between text-sm mb-2">
                    <span class="text-platinum-600 dark:text-platinum-400">Overall Progress</span>
                    <span class="font-medium text-abyss-900 dark:text-platinum-100">{{ overallProgress }}%</span>
                </div>
                <div class="h-3 bg-sun-100 dark:bg-abyss-700 rounded-full overflow-hidden">
                    <div class="h-full bg-kaitoke-green-500" :style="{ width: overallProgress + '%' }"></div>
                </div>
            </div>

            <!-- Modules List -->
            <div v-if="isLoading" class="text-center py-8">
                <p class="text-platinum-600 dark:text-platinum-400">Loading learning path...</p>
            </div>
            <div v-else class="space-y-3">
                <div v-for="(module, index) in modules" :key="module.id" 
                    class="flex items-center gap-4 p-4 bg-platinum-50 dark:bg-abyss-900/50 rounded-lg border border-sun-100 dark:border-abyss-600">
                    <span class="text-2xl">{{ module.icon || '📚' }}</span>
                    <div class="flex-1">
                        <p class="font-medium text-abyss-900 dark:text-platinum-100">{{ module.name }}</p>
                        <p class="text-xs text-platinum-500">{{ index + 1 }} of {{ modules.length }}</p>
                    </div>
                    <button class="px-3 py-2 bg-kaitoke-green-600 hover:bg-kaitoke-green-700 text-white text-sm font-medium rounded-lg transition">
                        {{ module.status === 'completed' ? 'Review' : 'Start' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/utils/api'

const route = useRoute()
const pathTitle = ref('Learning Path')
const overallProgress = ref(0)
const modules = ref([])
const isLoading = ref(true)

onMounted(async () => {
    const pathId = route.params.id
    try {
        const res = await api.get(`/api/v1/learning-paths/${pathId}`)
        if (res.data) {
            pathTitle.value = res.data.name || 'Learning Path'
            overallProgress.value = res.data.progress || 0
            modules.value = res.data.modules || []
        }
    } catch (error) {
        console.error('[v0] Failed to load learning path:', error.message)
    } finally {
        isLoading.value = false
    }
})
</script>
