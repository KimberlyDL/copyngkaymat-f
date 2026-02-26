<template>
    <div class="space-y-6">
        <div class="bg-white dark:bg-abyss-800 rounded-xl p-8 border border-sun-200 dark:border-abyss-700">
            <router-link :to="{ name: 'user.dashboard' }" class="text-kaitoke-green-600 hover:underline text-sm font-medium mb-4 inline-block">
                ← Back to Dashboard
            </router-link>
            
            <h1 class="text-3xl font-bold text-abyss-900 dark:text-platinum-50 mb-2">
                🏆 Leaderboard
            </h1>
            <p class="text-platinum-600 dark:text-platinum-300 mb-6">
                See how you rank among other learners and stay motivated!
            </p>

            <!-- Leaderboard Table -->
            <div v-if="isLoading" class="text-center py-8">
                <p class="text-platinum-600 dark:text-platinum-400">Loading leaderboard...</p>
            </div>
            <div v-else class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="border-b border-sun-100 dark:border-abyss-700">
                            <th class="text-left py-3 px-4 font-semibold text-platinum-600 dark:text-platinum-400">Rank</th>
                            <th class="text-left py-3 px-4 font-semibold text-platinum-600 dark:text-platinum-400">Learner</th>
                            <th class="text-left py-3 px-4 font-semibold text-platinum-600 dark:text-platinum-400">Level</th>
                            <th class="text-right py-3 px-4 font-semibold text-platinum-600 dark:text-platinum-400">Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(learner, index) in learners" :key="learner.id"
                            :class="[
                                'border-b border-sun-100 dark:border-abyss-700 last:border-0',
                                index === 0 ? 'bg-sun-50 dark:bg-sun-900/10' : ''
                            ]">
                            <td class="py-3 px-4 font-bold text-abyss-900 dark:text-platinum-100">
                                {{ index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}` }}
                            </td>
                            <td class="py-3 px-4">
                                <div class="flex items-center gap-2">
                                    <div class="w-8 h-8 rounded-full bg-kaitoke-green-200 dark:bg-kaitoke-green-800 flex items-center justify-center text-sm font-bold">
                                        {{ learner.initials || 'U' }}
                                    </div>
                                    <span class="text-abyss-900 dark:text-platinum-100">{{ learner.name }}</span>
                                </div>
                            </td>
                            <td class="py-3 px-4 text-platinum-600 dark:text-platinum-400">{{ learner.level }}</td>
                            <td class="py-3 px-4 text-right font-bold text-abyss-900 dark:text-platinum-100">{{ learner.points }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/utils/api'

const learners = ref([])
const isLoading = ref(true)

onMounted(async () => {
    try {
        const res = await api.get('/api/v1/leaderboard')
        if (res.data?.learners) {
            learners.value = res.data.learners
        }
    } catch (error) {
        console.error('[v0] Failed to load leaderboard:', error.message)
    } finally {
        isLoading.value = false
    }
})
</script>
