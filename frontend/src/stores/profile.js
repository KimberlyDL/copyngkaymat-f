// src/stores/profile.js
import { defineStore } from 'pinia';
import api from '@/utils/api';
import * as cloudflare from '@/utils/cloudflare';
import { useToast } from '@/utils/useToast';
import { useAuthStore } from './auth';

export const useProfileStore = defineStore('profile', {
    state: () => ({
        profile: null,
        privacySettings: null,
        notificationSettings: null,
        guardians: [],
        isLoading: false,
        isUploading: false,
        uploadProgress: 0,
        error: null
    }),

    getters: {
        /**
         * Get avatar URL with optional size transformation
         */
        avatarUrl: (state) => (size = 200) => {
            if (!state.profile?.avatar_url) {
                const authStore = useAuthStore();
                const name = state.profile?.display_name || authStore.user?.name || 'User';
                return cloudflare.getDefaultAvatar(name, size);
            }
            return cloudflare.getAvatarUrl(state.profile.avatar_url, size);
        },

        /**
         * Check if profile is complete
         */
        isProfileComplete: (state) => {
            if (!state.profile) return false;

            return !!(
                state.profile.display_name &&
                state.profile.date_of_birth &&
                state.profile.sex &&
                state.profile.emergency_contact_name
            );
        },

        /**
         * Get profile completion percentage
         */
        profileCompletionPercentage: (state) => {
            if (!state.profile) return 0;

            const fields = [
                'display_name',
                'bio',
                'date_of_birth',
                'sex',
                'phone_number',
                'emergency_contact_name',
                'emergency_contact_relationship',
                'emergency_contact_phone'
            ];

            const completedFields = fields.filter(field => {
                const value = state.profile[field];
                return value !== null && value !== undefined && value !== '';
            });

            return Math.round((completedFields.length / fields.length) * 100);
        }
    },

    actions: {
        /**
         * Fetch user profile
         */
        async fetchProfile(userId) {
            this.isLoading = true;
            this.error = null;

            try {
                const response = await api.get(`/api/v1/users/${userId}/profile`);
                this.profile = response.data;

                // If profile has nested structure, flatten it
                if (response.data.profile) {
                    this.profile = {
                        ...response.data,
                        ...response.data.profile,
                        // Flatten address
                        address_line1: response.data.profile.address?.line1,
                        address_line2: response.data.profile.address?.line2,
                        city: response.data.profile.address?.city,
                        province: response.data.profile.address?.province,
                        postal_code: response.data.profile.address?.postal_code,
                        country: response.data.profile.address?.country,
                        // Flatten emergency contact
                        emergency_contact_name: response.data.profile.emergency_contact?.name,
                        emergency_contact_relationship: response.data.profile.emergency_contact?.relationship,
                        emergency_contact_phone: response.data.profile.emergency_contact?.phone
                    };
                }

                return this.profile;
            } catch (err) {
                this.error = err.response?.data?.message || 'Failed to load profile';
                console.error('Profile fetch error:', err);
                throw err;
            } finally {
                this.isLoading = false;
            }
        },

        /**
         * Update user profile
         */
        async updateProfile(profileData) {
            const toast = useToast();

            try {
                // Transform flat data to nested structure expected by backend
                const payload = {
                    display_name: profileData.display_name,
                    bio: profileData.bio,
                    date_of_birth: profileData.date_of_birth,
                    sex: profileData.sex,
                    gender_identity: profileData.gender_identity,
                    phone_number: profileData.phone_number,
                    address: {
                        line1: profileData.address_line1,
                        line2: profileData.address_line2,
                        city: profileData.city,
                        province: profileData.province,
                        postal_code: profileData.postal_code,
                        country: profileData.country || 'Philippines'
                    },
                    emergency_contact: {
                        name: profileData.emergency_contact_name,
                        relationship: profileData.emergency_contact_relationship,
                        phone: profileData.emergency_contact_phone
                    }
                };

                const response = await api.put('/api/v1/users/profile', payload);

                // Update local state
                if (response.data.profile) {
                    Object.assign(this.profile, profileData);
                }

                toast.success('Profile updated successfully');
                return true;
            } catch (err) {
                const errorMessage = err.response?.data?.message || 'Failed to update profile';

                // Handle validation errors
                if (err.response?.data?.errors) {
                    const errors = err.response.data.errors;
                    const errorMessages = errors.map(e => e.message || e.msg).join(', ');
                    toast.error(errorMessages);
                } else {
                    toast.error(errorMessage);
                }

                console.error('Profile update error:', err);
                return false;
            }
        },

        /**
         * Upload avatar image
         */
        async uploadAvatar(file) {
            const toast = useToast();

            // Validate file using Cloudflare utility
            const validation = cloudflare.validateFile(file, 'avatar');
            if (!validation.valid) {
                toast.error(validation.errors[0]);
                return false;
            }

            this.isUploading = true;
            this.uploadProgress = 0;

            try {
                // Upload via Cloudflare utility (with progress tracking)
                // const result = await cloudflare.uploadWithProgress(
                //     file,
                //     '/api/v1/users/avatar',
                //     (progress) => {
                //         this.uploadProgress = progress;
                //     }
                // );

                const result = await cloudflare.uploadWithProgress(
                    file,
                    '/api/v1/users/avatar',
                    (progress) => {
                        this.uploadProgress = progress;
                    },
                    'avatar' // <--- CRITICAL FIX: Tell the utility to name this field 'avatar'
                );

                // Update local state
                if (this.profile) {
                    this.profile.avatar_url = result.avatar_url;
                }

                // Update auth store user avatar as well
                const authStore = useAuthStore();
                if (authStore.user) {
                    authStore.user.avatar_url = result.avatar_url;
                }

                toast.success('Avatar updated successfully');
                return true;
            } catch (err) {
                const errorMessage = err.message || 'Failed to upload avatar';
                toast.error(errorMessage);
                console.error('Avatar upload error:', err);
                return false;
            } finally {
                this.isUploading = false;
                this.uploadProgress = 0;
            }
        },

        /**
         * Delete avatar
         */
        async deleteAvatar() {
            const toast = useToast();

            try {
                const result = await cloudflare.deleteAvatar();

                // Update local state with default avatar
                if (this.profile) {
                    this.profile.avatar_url = result.avatar_url;
                }

                // Update auth store as well
                const authStore = useAuthStore();
                if (authStore.user) {
                    authStore.user.avatar_url = result.avatar_url;
                }

                toast.success('Avatar removed successfully');
                return true;
            } catch (err) {
                toast.error('Failed to remove avatar');
                console.error('Avatar delete error:', err);
                return false;
            }
        },

        /**
         * Fetch privacy settings
         */
        async fetchPrivacySettings() {
            try {
                const response = await api.get('/api/v1/users/settings/privacy');
                this.privacySettings = response.data;
                return this.privacySettings;
            } catch (err) {
                console.error('Privacy settings fetch failed:', err);
                throw err;
            }
        },

        /**
         * Update privacy settings
         */
        async updatePrivacySettings(data) {
            const toast = useToast();

            try {
                await api.put('/api/v1/users/settings/privacy', data);
                this.privacySettings = data;
                toast.success('Privacy settings updated');
                return true;
            } catch (err) {
                toast.error('Failed to update privacy settings');
                return false;
            }
        },

        /**
         * Fetch notification settings
         */
        async fetchNotificationSettings() {
            try {
                const response = await api.get('/api/v1/users/settings/notifications');
                this.notificationSettings = response.data;
                return this.notificationSettings;
            } catch (err) {
                console.error('Notification settings fetch failed:', err);
                throw err;
            }
        },

        /**
         * Update notification settings
         */
        async updateNotificationSettings(data) {
            const toast = useToast();

            try {
                await api.put('/api/v1/users/settings/notifications', data);
                this.notificationSettings = data;
                toast.success('Notification preferences updated');
                return true;
            } catch (err) {
                toast.error('Failed to update notification settings');
                return false;
            }
        },

        /**
         * Fetch guardians
         */
        async fetchGuardians() {
            try {
                const response = await api.get('/api/v1/users/guardians');
                this.guardians = response.data.guardians || [];
                return this.guardians;
            } catch (err) {
                console.error('Guardians fetch failed:', err);
                throw err;
            }
        },

        /**
         * Add guardian
         */
        async addGuardian(guardianData) {
            const toast = useToast();

            try {
                const response = await api.post('/api/v1/users/guardians', guardianData);
                this.guardians.push(response.data.guardian);
                toast.success('Guardian added successfully');
                return true;
            } catch (err) {
                toast.error('Failed to add guardian');
                return false;
            }
        },

        /**
         * Update guardian
         */
        async updateGuardian(guardianId, guardianData) {
            const toast = useToast();

            try {
                const response = await api.put(`/api/v1/users/guardians/${guardianId}`, guardianData);
                const index = this.guardians.findIndex(g => g.id === guardianId);
                if (index !== -1) {
                    this.guardians[index] = response.data.guardian;
                }
                toast.success('Guardian updated successfully');
                return true;
            } catch (err) {
                toast.error('Failed to update guardian');
                return false;
            }
        },

        /**
         * Delete guardian
         */
        async deleteGuardian(guardianId) {
            const toast = useToast();

            try {
                await api.delete(`/api/v1/users/guardians/${guardianId}`);
                this.guardians = this.guardians.filter(g => g.id !== guardianId);
                toast.success('Guardian removed successfully');
                return true;
            } catch (err) {
                toast.error('Failed to remove guardian');
                return false;
            }
        },

        /**
         * Deactivate account
         */
        async deactivateAccount() {
            const toast = useToast();

            try {
                await api.post('/api/v1/users/account/deactivate');
                toast.success('Account deactivated. You can reactivate by logging in.');

                // Logout after deactivation
                const authStore = useAuthStore();
                await authStore.logout();

                return true;
            } catch (err) {
                toast.error('Failed to deactivate account');
                return false;
            }
        },

        /**
         * Request account deletion
         */
        async requestAccountDeletion(password, reason = '') {
            const toast = useToast();

            try {
                await api.post('/api/v1/users/account/delete', {
                    password,
                    reason
                });

                toast.warning('Account scheduled for deletion in 30 days');
                return true;
            } catch (err) {
                const errorMessage = err.response?.data?.message || 'Failed to request account deletion';
                toast.error(errorMessage);
                return false;
            }
        },

        /**
         * Cancel account deletion
         */
        async cancelAccountDeletion() {
            const toast = useToast();

            try {
                await api.post('/api/v1/users/account/cancel-deletion');
                toast.success('Account deletion cancelled');
                return true;
            } catch (err) {
                toast.error('Failed to cancel account deletion');
                return false;
            }
        },

        /**
         * Get account deletion status
         */
        async getDeletionStatus() {
            try {
                const response = await api.get('/api/v1/users/account/deletion-status');
                return response.data;
            } catch (err) {
                console.error('Failed to get deletion status:', err);
                return null;
            }
        },

        /**
         * Reset store state
         */
        $reset() {
            this.profile = null;
            this.privacySettings = null;
            this.notificationSettings = null;
            this.guardians = [];
            this.isLoading = false;
            this.isUploading = false;
            this.uploadProgress = 0;
            this.error = null;
        }
    }
});