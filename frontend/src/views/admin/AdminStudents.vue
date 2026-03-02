<template>
    <div class="space-y-8 custom-font-poppins animate-in fade-in duration-700 text-black dark:text-white transition-colors">
        <!-- Header -->
        <header class="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 dark:border-white/10 pb-8">
            <div>
                <div class="flex items-center gap-2 mb-3">
                    <div class="h-1 w-8 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-full shadow-[0_2px_10px_rgba(139,92,246,0.4)]"></div>
                    <span class="text-[9px] font-black tracking-[0.3em] text-purple-600 dark:text-purple-400 uppercase italic">Student Management</span>
                </div>
                <h1 class="text-3xl md:text-4xl font-[900] text-black dark:text-white uppercase tracking-tighter leading-tight italic">
                    Students <span class="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-500 bg-clip-text text-transparent">Directory</span>
                </h1>
            </div>

            <div class="flex items-center gap-3">
                <!-- Bulk Actions -->
                <div v-if="selectedStudents.length > 0" class="flex items-center gap-2">
                    <span class="text-[10px] font-bold text-slate-500">{{ selectedStudents.length }} selected</span>
                    <button 
                        @click="showBulkActionModal = true" 
                        class="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 rounded-xl text-[10px] font-bold text-white uppercase"
                    >
                        <ZapIcon class="h-3 w-3" />
                        Bulk Actions
                    </button>
                    <button 
                        @click="selectedStudents = []" 
                        class="p-2 bg-slate-100 dark:bg-white/5 rounded-xl hover:bg-slate-200 dark:hover:bg-white/10"
                    >
                        <XIcon class="h-4 w-4 text-slate-500" />
                    </button>
                </div>
                <button 
                    @click="exportStudents" 
                    :disabled="isExporting"
                    class="flex items-center gap-2 px-5 py-3 bg-purple-600 hover:bg-purple-700 border border-purple-500 rounded-2xl shadow-lg hover:shadow-purple-500/20 transition-all group disabled:opacity-50"
                >
                    <DownloadIcon class="h-4 w-4 text-white" :class="{ 'animate-pulse': isExporting }" />
                    <span class="text-[10px] font-[900] tracking-widest text-white uppercase italic">{{ isExporting ? 'Generating...' : 'Export PDF' }}</span>
                </button>
                <button 
                    @click="refreshStudents" 
                    class="flex items-center gap-2 px-5 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl hover:border-purple-500/50 transition-all group"
                >
                    <RefreshCwIcon class="h-4 w-4 text-slate-500 group-hover:rotate-180 transition-transform duration-500" />
                    <span class="text-[10px] font-[900] tracking-widest text-slate-600 dark:text-gray-300 uppercase italic">Refresh</span>
                </button>
            </div>
        </header>

        <!-- Stats Overview -->
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div class="bg-white dark:bg-[#0d0d15]/60 border border-slate-200 dark:border-white/10 rounded-2xl p-5">
                <div class="flex items-center gap-3 mb-2">
                    <div class="p-2 rounded-xl bg-purple-500/10">
                        <UsersIcon class="h-5 w-5 text-purple-600" />
                    </div>
                    <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total</span>
                </div>
                <p class="text-2xl font-[900] text-black dark:text-white">{{ studentStats.total }}</p>
            </div>
            <div class="bg-white dark:bg-[#0d0d15]/60 border border-slate-200 dark:border-white/10 rounded-2xl p-5">
                <div class="flex items-center gap-3 mb-2">
                    <div class="p-2 rounded-xl bg-green-500/10">
                        <CheckCircleIcon class="h-5 w-5 text-green-600" />
                    </div>
                    <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active</span>
                </div>
                <p class="text-2xl font-[900] text-black dark:text-white">{{ studentStats.active }}</p>
            </div>
            <div class="bg-white dark:bg-[#0d0d15]/60 border border-slate-200 dark:border-white/10 rounded-2xl p-5">
                <div class="flex items-center gap-3 mb-2">
                    <div class="p-2 rounded-xl bg-amber-500/10">
                        <PauseCircleIcon class="h-5 w-5 text-amber-600" />
                    </div>
                    <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Suspended</span>
                </div>
                <p class="text-2xl font-[900] text-black dark:text-white">{{ studentStats.suspended }}</p>
            </div>
            <div class="bg-white dark:bg-[#0d0d15]/60 border border-slate-200 dark:border-white/10 rounded-2xl p-5">
                <div class="flex items-center gap-3 mb-2">
                    <div class="p-2 rounded-xl bg-red-500/10">
                        <BanIcon class="h-5 w-5 text-red-600" />
                    </div>
                    <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Banned</span>
                </div>
                <p class="text-2xl font-[900] text-black dark:text-white">{{ studentStats.banned }}</p>
            </div>
            <div class="bg-white dark:bg-[#0d0d15]/60 border border-slate-200 dark:border-white/10 rounded-2xl p-5">
                <div class="flex items-center gap-3 mb-2">
                    <div class="p-2 rounded-xl bg-fuchsia-500/10">
                        <TrendingUpIcon class="h-5 w-5 text-fuchsia-600" />
                    </div>
                    <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Avg XP</span>
                </div>
                <p class="text-2xl font-[900] text-black dark:text-white">{{ studentStats.avgXp.toLocaleString() }}</p>
            </div>
        </div>

        <!-- Students Table Card -->
        <div class="bg-white/90 dark:bg-[#0d0d15]/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 shadow-lg">
            <!-- Search and Filters -->
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <div class="flex items-center gap-3">
                    <div class="h-6 w-1 bg-purple-600 rounded-full"></div>
                    <h3 class="text-lg font-[900] text-black dark:text-white uppercase tracking-tighter italic">All Students</h3>
                    <span class="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-[8px] font-[900] uppercase tracking-widest rounded-full italic">
                        {{ pagination.total }} Total
                    </span>
                </div>
                <div class="flex items-center gap-3 w-full md:w-auto">
                    <div class="relative flex-1 md:flex-initial">
                        <input 
                            v-model="searchQuery" 
                            @input="searchStudentsDebounced"
                            type="text" 
                            placeholder="Search by name or email..." 
                            class="pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-black dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/50 w-full md:w-72"
                        />
                        <SearchIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    </div>
                    <select 
                        v-model="filterStatus" 
                        @change="fetchStudents(1)"
                        class="px-4 py-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:border-purple-500/50"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                        <option value="banned">Banned</option>
                        <option value="deactivated">Deactivated</option>
                    </select>
                </div>
            </div>
            
            <!-- Loading State -->
            <div v-if="isLoading" class="flex items-center justify-center py-16">
                <div class="relative h-10 w-10 text-purple-600">
                    <div class="absolute inset-0 rounded-full border-2 border-current opacity-10"></div>
                    <div class="absolute inset-0 rounded-full border-2 border-t-transparent animate-spin"></div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="students.length === 0" class="text-center py-16">
                <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                    <UsersIcon class="h-10 w-10 text-slate-300 dark:text-slate-600" />
                </div>
                <h4 class="text-lg font-bold text-black dark:text-white mb-2">No Students Found</h4>
                <p class="text-slate-400 text-sm italic">{{ searchQuery ? 'Try adjusting your search terms' : 'No students have registered yet' }}</p>
            </div>
            
            <!-- Table -->
            <div v-else class="overflow-x-auto" :class="{ 'overflow-visible': activeActionMenu !== null }">
                <table class="w-full">
                    <thead>
                        <tr class="border-b border-slate-200 dark:border-white/10">
                            <th class="py-3 px-2 w-10">
                                <input 
                                    type="checkbox" 
                                    :checked="selectedStudents.length === students.length && students.length > 0"
                                    @change="toggleSelectAll"
                                    class="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                                />
                            </th>
                            <th class="text-left py-3 px-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                            <th class="text-left py-3 px-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Title</th>
                            <th class="text-center py-3 px-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Level</th>
                            <th class="text-right py-3 px-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">XP</th>
                            <th class="text-center py-3 px-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Account Status</th>
                            <th class="text-center py-3 px-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr 
                            v-for="student in students" 
                            :key="student.id" 
                            class="border-b border-slate-100 dark:border-white/5 hover:bg-purple-500/5 transition-colors"
                            :class="{ 'bg-purple-500/10': selectedStudents.includes(student.id) }"
                        >
                            <td class="py-4 px-2">
                                <input 
                                    type="checkbox" 
                                    :checked="selectedStudents.includes(student.id)"
                                    @change="toggleSelectStudent(student.id)"
                                    class="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                                />
                            </td>
                            <td class="py-4 px-4">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center text-white text-xs font-bold uppercase shadow-lg">
                                        {{ getInitials(student.name) }}
                                    </div>
                                    <div>
                                        <p class="text-sm font-bold text-black dark:text-white">{{ student.name }}</p>
                                        <p class="text-[10px] text-slate-400">{{ student.email }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="py-4 px-4">
                                <span class="px-3 py-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-bold rounded-full">
                                    {{ student.title }}
                                </span>
                            </td>
                            <td class="py-4 px-4 text-center">
                                <span class="inline-flex items-center justify-center w-8 h-8 bg-slate-100 dark:bg-white/10 rounded-full text-sm font-bold text-black dark:text-white">
                                    {{ student.level }}
                                </span>
                            </td>
                            <td class="py-4 px-4 text-right">
                                <span class="text-sm font-bold text-yellow-600 dark:text-yellow-400">{{ student.xp.toLocaleString() }} XP</span>
                            </td>
                            <td class="py-4 px-4 text-center">
                                <span :class="getAccountStatusClass(student.account_status)">
                                    {{ formatAccountStatus(student.account_status) }}
                                </span>
                            </td>
                            <td class="py-4 px-4 text-center">
                                <div class="relative inline-block">
                                    <button 
                                        @click.stop="toggleActionMenu(student.id, $event)"
                                        data-action-button
                                        class="group flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10 hover:from-purple-500/20 hover:to-fuchsia-500/20 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-200"
                                    >
                                        <span class="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide">Actions</span>
                                        <MoreVerticalIcon class="h-3.5 w-3.5 text-purple-500 group-hover:rotate-90 transition-transform duration-200" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <!-- Pagination -->
            <div v-if="pagination.totalPages > 1" class="flex flex-col md:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-white/10">
                <p class="text-xs text-slate-400">
                    Showing {{ (pagination.page - 1) * pagination.limit + 1 }} - {{ Math.min(pagination.page * pagination.limit, pagination.total) }} of {{ pagination.total }} students
                </p>
                <div class="flex items-center gap-2">
                    <button 
                        @click="fetchStudents(1)" 
                        :disabled="pagination.page <= 1"
                        class="p-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl hover:border-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronsLeftIcon class="h-4 w-4 text-slate-500" />
                    </button>
                    <button 
                        @click="fetchStudents(pagination.page - 1)" 
                        :disabled="pagination.page <= 1"
                        class="px-4 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:border-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Previous
                    </button>
                    <span class="px-4 py-2 text-xs font-bold text-black dark:text-white">
                        {{ pagination.page }} / {{ pagination.totalPages }}
                    </span>
                    <button 
                        @click="fetchStudents(pagination.page + 1)" 
                        :disabled="pagination.page >= pagination.totalPages"
                        class="px-4 py-2 bg-purple-600 border border-purple-500 rounded-xl text-xs font-bold text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Next
                    </button>
                    <button 
                        @click="fetchStudents(pagination.totalPages)" 
                        :disabled="pagination.page >= pagination.totalPages"
                        class="p-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl hover:border-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronsRightIcon class="h-4 w-4 text-slate-500" />
                    </button>
                </div>
            </div>
        </div>

        <!-- Status Change Confirmation Modal -->
        <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div v-if="showStatusModal" class="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50" @click.self="closeModals">
                <Transition
                    enter-active-class="transition duration-300 ease-out"
                    enter-from-class="opacity-0 scale-95 translate-y-4"
                    enter-to-class="opacity-100 scale-100 translate-y-0"
                    leave-active-class="transition duration-200 ease-in"
                    leave-from-class="opacity-100 scale-100 translate-y-0"
                    leave-to-class="opacity-0 scale-95 translate-y-4"
                    appear
                >
                    <div class="bg-white dark:bg-[#12121a] border border-slate-200 dark:border-white/10 rounded-3xl p-8 w-full max-w-md mx-4 shadow-2xl shadow-purple-500/10">
                        <!-- Icon Header -->
                        <div class="flex flex-col items-center text-center mb-6">
                            <div :class="getStatusModalIconClass()" class="mb-4">
                                <component :is="getStatusModalIcon()" class="h-8 w-8" :class="getStatusModalIconColor()" />
                            </div>
                            <h3 class="text-xl font-black text-black dark:text-white uppercase tracking-tight">{{ getStatusModalTitle() }}</h3>
                            <p class="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xs">
                                {{ getStatusModalMessage() }}
                            </p>
                        </div>

                        <!-- Warning Box for destructive actions -->
                        <div v-if="targetStatus === 'banned'" class="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3">
                            <AlertTriangleIcon class="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p class="text-xs text-red-600 dark:text-red-400">This action is permanent and will prevent the user from accessing their account.</p>
                        </div>

                        <div class="mb-6">
                            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Reason (Optional)</label>
                            <textarea 
                                v-model="statusReason"
                                rows="3"
                                placeholder="Enter reason for this action..."
                                class="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border-2 border-slate-200 dark:border-white/10 rounded-2xl text-sm text-black dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors"
                            ></textarea>
                        </div>
                        <div class="flex items-center gap-3">
                            <button 
                                @click="closeModals"
                                class="flex-1 px-5 py-3.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                @click="confirmStatusChange"
                                :disabled="isUpdating"
                                :class="getStatusModalButtonClass()"
                                class="flex-1"
                            >
                                <LoaderIcon v-if="isUpdating" class="h-4 w-4 animate-spin" />
                                <span>{{ isUpdating ? 'Processing...' : 'Confirm' }}</span>
                            </button>
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>

        <!-- Suspend Modal with Date Picker -->
        <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div v-if="showSuspendModal" class="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50" @click.self="closeModals">
                <Transition
                    enter-active-class="transition duration-300 ease-out"
                    enter-from-class="opacity-0 scale-95 translate-y-4"
                    enter-to-class="opacity-100 scale-100 translate-y-0"
                    leave-active-class="transition duration-200 ease-in"
                    leave-from-class="opacity-100 scale-100 translate-y-0"
                    leave-to-class="opacity-0 scale-95 translate-y-4"
                    appear
                >
                    <div class="bg-white dark:bg-[#12121a] border border-slate-200 dark:border-white/10 rounded-3xl p-8 w-full max-w-md mx-4 shadow-2xl shadow-amber-500/10">
                        <!-- Icon Header -->
                        <div class="flex flex-col items-center text-center mb-6">
                            <div class="p-4 rounded-2xl bg-amber-500/10 mb-4">
                                <PauseCircleIcon class="h-8 w-8 text-amber-600" />
                            </div>
                            <h3 class="text-xl font-black text-black dark:text-white uppercase tracking-tight">Suspend Account</h3>
                            <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">
                                Temporarily suspend <span class="font-bold text-amber-600">{{ selectedStudent?.name }}</span>'s account.
                            </p>
                        </div>

                        <div class="space-y-4 mb-6">
                            <div>
                                <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Suspension End Date *</label>
                                <input 
                                    type="date" 
                                    v-model="suspendUntilDate"
                                    :min="minSuspendDate"
                                    class="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border-2 border-slate-200 dark:border-white/10 rounded-2xl text-sm text-black dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Reason</label>
                                <textarea 
                                    v-model="statusReason"
                                    rows="3"
                                    placeholder="Enter reason for suspension..."
                                    class="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border-2 border-slate-200 dark:border-white/10 rounded-2xl text-sm text-black dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-colors"
                                ></textarea>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <button 
                                @click="closeModals"
                                class="flex-1 px-5 py-3.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                @click="confirmSuspend"
                                :disabled="isUpdating || !suspendUntilDate"
                                class="flex-1 px-5 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-2xl text-sm font-bold text-white disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all"
                            >
                                <LoaderIcon v-if="isUpdating" class="h-4 w-4 animate-spin" />
                                <span>{{ isUpdating ? 'Processing...' : 'Suspend Account' }}</span>
                            </button>
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>

        <!-- Bulk Action Modal -->
        <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div v-if="showBulkActionModal" class="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50" @click.self="closeModals">
                <Transition
                    enter-active-class="transition duration-300 ease-out"
                    enter-from-class="opacity-0 scale-95 translate-y-4"
                    enter-to-class="opacity-100 scale-100 translate-y-0"
                    leave-active-class="transition duration-200 ease-in"
                    leave-from-class="opacity-100 scale-100 translate-y-0"
                    leave-to-class="opacity-0 scale-95 translate-y-4"
                    appear
                >
                    <div class="bg-white dark:bg-[#12121a] border border-slate-200 dark:border-white/10 rounded-3xl p-8 w-full max-w-md mx-4 shadow-2xl shadow-purple-500/10">
                        <!-- Icon Header -->
                        <div class="flex flex-col items-center text-center mb-6">
                            <div class="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 mb-4">
                                <ZapIcon class="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 class="text-xl font-black text-black dark:text-white uppercase tracking-tight">Bulk Actions</h3>
                            <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">
                                Apply action to <span class="font-bold text-purple-600">{{ selectedStudents.length }}</span> selected students.
                            </p>
                        </div>

                        <div class="space-y-4 mb-6">
                            <div>
                                <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Action</label>
                                <select 
                                    v-model="bulkAction"
                                    class="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border-2 border-slate-200 dark:border-white/10 rounded-2xl text-sm text-black dark:text-white focus:outline-none focus:border-purple-500 transition-colors"
                                >
                                    <option value="">Select action...</option>
                                    <option value="active">Reactivate Accounts</option>
                                    <option value="deactivated">Deactivate Accounts</option>
                                    <option value="suspended">Suspend Accounts</option>
                                    <option value="banned">Ban Accounts</option>
                                </select>
                            </div>
                            <div v-if="bulkAction === 'suspended'">
                                <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Suspension End Date *</label>
                                <input 
                                    type="date" 
                                    v-model="suspendUntilDate"
                                    :min="minSuspendDate"
                                    class="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border-2 border-slate-200 dark:border-white/10 rounded-2xl text-sm text-black dark:text-white focus:outline-none focus:border-purple-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Reason (Optional)</label>
                                <textarea 
                                    v-model="statusReason"
                                    rows="2"
                                    placeholder="Enter reason..."
                                    class="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border-2 border-slate-200 dark:border-white/10 rounded-2xl text-sm text-black dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors"
                                ></textarea>
                            </div>
                        </div>

                        <!-- Warning for destructive bulk actions -->
                        <div v-if="bulkAction === 'banned'" class="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3">
                            <AlertTriangleIcon class="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p class="text-xs text-red-600 dark:text-red-400">You are about to ban {{ selectedStudents.length }} accounts. This action is permanent.</p>
                        </div>

                        <div class="flex items-center gap-3">
                            <button 
                                @click="closeModals"
                                class="flex-1 px-5 py-3.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                @click="confirmBulkAction"
                                :disabled="isUpdating || !bulkAction || (bulkAction === 'suspended' && !suspendUntilDate)"
                                class="flex-1 px-5 py-3.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 rounded-2xl text-sm font-bold text-white disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 transition-all"
                            >
                                <LoaderIcon v-if="isUpdating" class="h-4 w-4 animate-spin" />
                                <span>{{ isUpdating ? 'Processing...' : 'Apply Action' }}</span>
                            </button>
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </div>

    <!-- Teleported Action Menu Dropdown -->
    <Teleport to="body">
        <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
        >
            <div 
                v-if="activeActionMenu && activeMenuStudent"
                data-action-dropdown
                class="fixed w-56 bg-white dark:bg-[#1a1a2e] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl shadow-purple-500/10 overflow-hidden"
                :style="dropdownPosition"
                style="z-index: 99999;"
            >
                <div class="p-2 border-b border-slate-100 dark:border-white/5">
                    <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2">Account Actions</p>
                </div>
                <div class="p-2 space-y-1">
                    <button 
                        v-if="activeMenuStudent.account_status !== 'active'"
                        @click="openStatusModal(activeMenuStudent, 'active')"
                        class="w-full px-3 py-2.5 text-left text-sm rounded-xl bg-green-500/5 hover:bg-green-500/15 border border-transparent hover:border-green-500/20 flex items-center gap-3 transition-all group"
                    >
                        <div class="p-1.5 rounded-lg bg-green-500/10 group-hover:bg-green-500/20">
                            <ShieldCheckIcon class="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                            <p class="font-bold text-green-700 dark:text-green-400">Reactivate</p>
                            <p class="text-[10px] text-green-600/70 dark:text-green-500/70">Restore account access</p>
                        </div>
                    </button>
                    <button 
                        v-if="activeMenuStudent.account_status === 'active'"
                        @click="openStatusModal(activeMenuStudent, 'deactivated')"
                        class="w-full px-3 py-2.5 text-left text-sm rounded-xl bg-slate-500/5 hover:bg-slate-500/15 border border-transparent hover:border-slate-500/20 flex items-center gap-3 transition-all group"
                    >
                        <div class="p-1.5 rounded-lg bg-slate-500/10 group-hover:bg-slate-500/20">
                            <PowerOffIcon class="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div>
                            <p class="font-bold text-slate-700 dark:text-slate-300">Deactivate</p>
                            <p class="text-[10px] text-slate-500/70">Disable account temporarily</p>
                        </div>
                    </button>
                    <button 
                        v-if="activeMenuStudent.account_status !== 'suspended'"
                        @click="openSuspendModal(activeMenuStudent)"
                        class="w-full px-3 py-2.5 text-left text-sm rounded-xl bg-amber-500/5 hover:bg-amber-500/15 border border-transparent hover:border-amber-500/20 flex items-center gap-3 transition-all group"
                    >
                        <div class="p-1.5 rounded-lg bg-amber-500/10 group-hover:bg-amber-500/20">
                            <PauseCircleIcon class="h-4 w-4 text-amber-600" />
                        </div>
                        <div>
                            <p class="font-bold text-amber-700 dark:text-amber-400">Suspend</p>
                            <p class="text-[10px] text-amber-600/70 dark:text-amber-500/70">Temporary restriction</p>
                        </div>
                    </button>
                    <button 
                        v-if="activeMenuStudent.account_status !== 'banned'"
                        @click="openStatusModal(activeMenuStudent, 'banned')"
                        class="w-full px-3 py-2.5 text-left text-sm rounded-xl bg-red-500/5 hover:bg-red-500/15 border border-transparent hover:border-red-500/20 flex items-center gap-3 transition-all group"
                    >
                        <div class="p-1.5 rounded-lg bg-red-500/10 group-hover:bg-red-500/20">
                            <ShieldOffIcon class="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                            <p class="font-bold text-red-700 dark:text-red-400">Ban Account</p>
                            <p class="text-[10px] text-red-600/70 dark:text-red-500/70">Permanent restriction</p>
                        </div>
                    </button>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import {
    UsersIcon,
    SearchIcon,
    DownloadIcon,
    RefreshCwIcon,
    CheckCircleIcon,
    ClockIcon,
    TrendingUpIcon,
    ChevronsLeftIcon,
    ChevronsRightIcon,
    MoreVerticalIcon,
    BanIcon,
    PauseCircleIcon,
    PowerOffIcon,
    ZapIcon,
    XIcon,
    LoaderIcon,
    AlertTriangleIcon,
    ShieldOffIcon,
    ShieldCheckIcon
} from 'lucide-vue-next';
import api from '@/utils/api';
import { useToastStore } from '@/stores/toast';

const toast = useToastStore();

const isLoading = ref(false);
const isExporting = ref(false);
const isUpdating = ref(false);
const students = ref([]);
const searchQuery = ref('');
const filterStatus = ref('all');
const pagination = ref({
    total: 0,
    page: 1,
    limit: 15,
    totalPages: 0
});

// Selection state
const selectedStudents = ref([]);
const activeActionMenu = ref(null);

// Modal state
const showStatusModal = ref(false);
const showSuspendModal = ref(false);
const showBulkActionModal = ref(false);
const selectedStudent = ref(null);
const targetStatus = ref('');
const statusReason = ref('');
const suspendUntilDate = ref('');
const bulkAction = ref('');
const dropdownPosition = ref({});

let searchDebounceTimer = null;

// Get the student whose action menu is currently open
const activeMenuStudent = computed(() => {
    if (!activeActionMenu.value) return null;
    return students.value.find(s => s.id === activeActionMenu.value);
});

const minSuspendDate = computed(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
});

const studentStats = computed(() => {
    const active = students.value.filter(s => s.account_status === 'active').length;
    const suspended = students.value.filter(s => s.account_status === 'suspended').length;
    const banned = students.value.filter(s => s.account_status === 'banned').length;
    const totalXp = students.value.reduce((sum, s) => sum + (s.xp || 0), 0);
    return {
        total: pagination.value.total,
        active: active,
        suspended: suspended,
        banned: banned,
        avgXp: students.value.length > 0 ? Math.round(totalXp / students.value.length) : 0
    };
});

const fetchStudents = async (page = 1) => {
    isLoading.value = true;
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: pagination.value.limit.toString()
        });
        
        if (searchQuery.value.trim()) {
            params.append('search', searchQuery.value.trim());
        }
        
        if (filterStatus.value !== 'all') {
            params.append('status', filterStatus.value);
        }
        
        const response = await api.get(`/api/v1/admin/students?${params}`);
        
        if (response.data?.students) {
            students.value = response.data.students;
            pagination.value = response.data.pagination;
        }
    } catch (error) {
        console.error('Failed to fetch students:', error);
        students.value = [];
    } finally {
        isLoading.value = false;
    }
};

const searchStudentsDebounced = () => {
    if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer);
    }
    searchDebounceTimer = setTimeout(() => {
        fetchStudents(1);
    }, 300);
};

const refreshStudents = () => {
    fetchStudents(pagination.value.page);
};

const exportStudents = async () => {
    isExporting.value = true;
    try {
        const response = await api.get('/api/v1/admin/students/export', {
            responseType: 'blob',
            headers: {
                'Accept': 'application/pdf'
            }
        });
        
        // Check if response is an error
        const contentType = response.headers['content-type'];
        if (contentType && contentType.includes('application/json')) {
            const text = await response.data.text();
            const errorData = JSON.parse(text);
            throw new Error(errorData.message || 'Failed to generate report');
        }
        
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const today = new Date().toISOString().split('T')[0];
        link.setAttribute('download', `ProtectEd_Students_${today}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        toast.addToast('Students exported successfully!', 'success', 3000);
    } catch (error) {
        console.error('Failed to export students:', error);
        if (error.response?.data instanceof Blob) {
            try {
                const text = await error.response.data.text();
                const errorData = JSON.parse(text);
                toast.addToast(errorData.message || 'Failed to export. Please try again.', 'error', 5000);
            } catch {
                toast.addToast('Failed to export. Please try again.', 'error', 5000);
            }
        } else {
            toast.addToast(error.message || 'Failed to export. Please try again.', 'error', 5000);
        }
    } finally {
        isExporting.value = false;
    }
};

const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2);
};

const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Selection methods
const toggleSelectAll = () => {
    if (selectedStudents.value.length === students.value.length) {
        selectedStudents.value = [];
    } else {
        selectedStudents.value = students.value.map(s => s.id);
    }
};

const toggleSelectStudent = (id) => {
    const index = selectedStudents.value.indexOf(id);
    if (index > -1) {
        selectedStudents.value.splice(index, 1);
    } else {
        selectedStudents.value.push(id);
    }
};

// Action menu
const toggleActionMenu = (studentId, event) => {
    if (activeActionMenu.value === studentId) {
        activeActionMenu.value = null;
        return;
    }
    
    // Calculate position based on button location
    const button = event?.currentTarget || event?.target;
    if (button) {
        const rect = button.getBoundingClientRect();
        const dropdownWidth = 224; // 14rem = 224px
        const dropdownHeight = 280; // Approximate height
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        
        // Check if dropdown would go off screen to the right
        let left = rect.left;
        if (left + dropdownWidth > viewportWidth) {
            left = rect.right - dropdownWidth;
        }
        
        // Check if dropdown would go off screen at the bottom - show above if needed
        let top = rect.bottom + 8;
        if (top + dropdownHeight > viewportHeight) {
            top = rect.top - dropdownHeight - 8;
        }
        
        dropdownPosition.value = {
            top: `${top}px`,
            left: `${left}px`
        };
    }
    
    activeActionMenu.value = studentId;
};

const closeActionMenu = () => {
    activeActionMenu.value = null;
};

// Handle click outside for action menu
const handleClickOutside = (event) => {
    // Check if click is on dropdown or action button
    const isDropdown = event.target.closest('[data-action-dropdown]');
    const isActionButton = event.target.closest('[data-action-button]');
    
    if (!isDropdown && !isActionButton) {
        activeActionMenu.value = null;
    }
};

// Close dropdown on scroll
const handleScroll = () => {
    if (activeActionMenu.value !== null) {
        activeActionMenu.value = null;
    }
};

// Account status helpers
const getAccountStatusClass = (status) => {
    const base = 'px-2.5 py-1 text-[9px] font-bold uppercase rounded-full';
    switch (status) {
        case 'active':
            return `${base} bg-green-500/10 text-green-600 dark:text-green-400`;
        case 'suspended':
            return `${base} bg-amber-500/10 text-amber-600 dark:text-amber-400`;
        case 'banned':
            return `${base} bg-red-500/10 text-red-600 dark:text-red-400`;
        case 'deactivated':
            return `${base} bg-slate-500/10 text-slate-600 dark:text-slate-400`;
        default:
            return `${base} bg-slate-500/10 text-slate-600 dark:text-slate-400`;
    }
};

const formatAccountStatus = (status) => {
    if (!status) return 'Active';
    return status.charAt(0).toUpperCase() + status.slice(1);
};

// Modal methods
const openStatusModal = (student, status) => {
    selectedStudent.value = student;
    targetStatus.value = status;
    statusReason.value = '';
    showStatusModal.value = true;
    closeActionMenu();
};

const openSuspendModal = (student) => {
    selectedStudent.value = student;
    statusReason.value = '';
    suspendUntilDate.value = '';
    showSuspendModal.value = true;
    closeActionMenu();
};

const closeModals = () => {
    showStatusModal.value = false;
    showSuspendModal.value = false;
    showBulkActionModal.value = false;
    selectedStudent.value = null;
    targetStatus.value = '';
    statusReason.value = '';
    suspendUntilDate.value = '';
    bulkAction.value = '';
};

const getStatusModalIcon = () => {
    switch (targetStatus.value) {
        case 'active': return CheckCircleIcon;
        case 'banned': return BanIcon;
        case 'deactivated': return PowerOffIcon;
        default: return CheckCircleIcon;
    }
};

const getStatusModalIconClass = () => {
    const base = 'p-4 rounded-2xl';
    switch (targetStatus.value) {
        case 'active': return `${base} bg-green-500/10`;
        case 'banned': return `${base} bg-red-500/10`;
        case 'deactivated': return `${base} bg-slate-500/10`;
        default: return `${base} bg-purple-500/10`;
    }
};

const getStatusModalTitle = () => {
    switch (targetStatus.value) {
        case 'active': return 'Reactivate Account';
        case 'banned': return 'Ban Account';
        case 'deactivated': return 'Deactivate Account';
        default: return 'Update Account Status';
    }
};

const getStatusModalMessage = () => {
    const name = selectedStudent.value?.name || 'this user';
    switch (targetStatus.value) {
        case 'active': return `Are you sure you want to reactivate ${name}'s account? They will regain full access to the platform.`;
        case 'banned': return `Are you sure you want to permanently ban ${name}'s account? This action will prevent them from accessing the platform.`;
        case 'deactivated': return `Are you sure you want to deactivate ${name}'s account? They will lose access until reactivated.`;
        default: return `Update ${name}'s account status?`;
    }
};

const getStatusModalButtonClass = () => {
    const base = 'px-5 py-3.5 rounded-2xl text-sm font-bold text-white disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg transition-all';
    switch (targetStatus.value) {
        case 'active': return `${base} bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-green-500/25`;
        case 'banned': return `${base} bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 shadow-red-500/25`;
        case 'deactivated': return `${base} bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 shadow-slate-500/25`;
        default: return `${base} bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 shadow-purple-500/25`;
    }
};

const getStatusModalIconColor = () => {
    switch (targetStatus.value) {
        case 'active': return 'text-green-600';
        case 'banned': return 'text-red-600';
        case 'deactivated': return 'text-slate-600';
        default: return 'text-purple-600';
    }
};

// API calls for status changes
const confirmStatusChange = async () => {
    if (!selectedStudent.value || !targetStatus.value) return;
    
    isUpdating.value = true;
    try {
        await api.put(`/api/v1/admin/users/${selectedStudent.value.id}/status`, {
            status: targetStatus.value,
            reason: statusReason.value || undefined
        });
        
        // Update local state
        const index = students.value.findIndex(s => s.id === selectedStudent.value.id);
        if (index > -1) {
            students.value[index].account_status = targetStatus.value;
        }
        
        // Save status for toast message before closing modals
        const statusLabels = {
            active: 'reactivated',
            banned: 'banned',
            deactivated: 'deactivated',
            suspended: 'suspended'
        };
        const statusMessage = statusLabels[targetStatus.value] || targetStatus.value;
        
        closeModals();
        
        // Show toast notification
        toast.addToast(`Account ${statusMessage} successfully!`, 'success', 4000);
    } catch (error) {
        console.error('Failed to update user status:', error);
        toast.addToast(error.response?.data?.message || 'Failed to update status. Please try again.', 'error', 5000);
    } finally {
        isUpdating.value = false;
    }
};

const confirmSuspend = async () => {
    if (!selectedStudent.value || !suspendUntilDate.value) return;
    
    isUpdating.value = true;
    try {
        await api.put(`/api/v1/admin/users/${selectedStudent.value.id}/status`, {
            status: 'suspended',
            reason: statusReason.value || undefined,
            suspended_until: suspendUntilDate.value
        });
        
        // Update local state
        const index = students.value.findIndex(s => s.id === selectedStudent.value.id);
        if (index > -1) {
            students.value[index].account_status = 'suspended';
        }
        
        // Save date for toast before closing modals
        const suspendDate = new Date(suspendUntilDate.value).toLocaleDateString();
        
        closeModals();
        toast.addToast(`Account suspended until ${suspendDate}!`, 'warning', 4000);
    } catch (error) {
        console.error('Failed to suspend user:', error);
        toast.addToast(error.response?.data?.message || 'Failed to suspend account. Please try again.', 'error', 5000);
    } finally {
        isUpdating.value = false;
    }
};

const confirmBulkAction = async () => {
    if (!bulkAction.value || selectedStudents.value.length === 0) return;
    if (bulkAction.value === 'suspended' && !suspendUntilDate.value) return;
    
    const count = selectedStudents.value.length;
    isUpdating.value = true;
    try {
        await api.post('/api/v1/admin/users/bulk-status', {
            userIds: selectedStudents.value,
            status: bulkAction.value,
            reason: statusReason.value || undefined,
            suspended_until: bulkAction.value === 'suspended' ? suspendUntilDate.value : undefined
        });
        
        // Update local state
        students.value.forEach(student => {
            if (selectedStudents.value.includes(student.id)) {
                student.account_status = bulkAction.value;
            }
        });
        
        // Save values for toast before closing modals
        const actionLabels = {
            active: 'reactivated',
            banned: 'banned',
            deactivated: 'deactivated',
            suspended: 'suspended'
        };
        const actionMessage = actionLabels[bulkAction.value] || bulkAction.value;
        
        selectedStudents.value = [];
        closeModals();
        
        toast.addToast(`${count} account(s) ${actionMessage} successfully!`, 'success', 4000);
    } catch (error) {
        console.error('Failed to update users:', error);
        toast.addToast(error.response?.data?.message || 'Failed to update accounts. Please try again.', 'error', 5000);
    } finally {
        isUpdating.value = false;
    }
};

onMounted(() => {
    fetchStudents();
    document.addEventListener('click', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
    window.removeEventListener('scroll', handleScroll, true);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700;1,900&display=swap');

.custom-font-poppins {
    font-family: 'Poppins', sans-serif !important;
}
</style>
