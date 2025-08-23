// src/services/UserService.js
class UserService {
    constructor() {
        this.baseURL = import.meta.env.VITE_API_URL;
    }

    async request(endpoint, options = {}) {
        try {
            const headers = {};

            const token = localStorage.getItem('accessToken');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            if (options.body && typeof options.body === 'string') {
                headers['Content-Type'] = 'application/json';
            }

            const response = await fetch(`${this.baseURL}${endpoint}`, {
                headers: { ...headers, ...(options.headers || {}) },
                ...options,
                credentials: 'include',
            });

            const contentType = response.headers.get('content-type');

            if (!response.ok) {
                let errorMessage = `Request failed with status ${response.status}`;
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || errorMessage;
                }
                return { error: errorMessage, success: false };
            }

            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                return { ...data, success: true };
            }

            return { error: 'Invalid response format: expected JSON.', success: false };
        } catch (error) {
            return { error: error.message || 'Network error', success: false };
        }
    }

    // Add to src/services/UserService.js
    async getCurrentUser() {
        return this.request('/users/current-user');
    }


    // Get user channel profile by username
    async getUserChannelProfile(username) {
        if (!username) {
            return { error: 'Username is required', success: false };
        }

        return this.request(`/users/c/${username}`);
    }

    // Update user profile
    async updateUserProfile(userData) {
        return this.request('/users/update-account', {
            method: 'PATCH',
            body: JSON.stringify(userData)
        });
    }

    // Update user avatar
    async updateUserAvatar(avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);

        return this.request('/users/avatar', {
            method: 'PATCH',
            body: formData
        });
    }

    // Update user cover image
    async updateUserCoverImage(coverImageFile) {
        const formData = new FormData();
        formData.append('coverImage', coverImageFile);

        return this.request('/users/cover-image', {
            method: 'PATCH',
            body: formData
        });
    }

    // Add to UserService.js
    async updateAccountDetails(userData) {
        return this.request('/users/update-account', {
            method: 'PATCH',
            body: JSON.stringify(userData)
        });
    }

    async updateAvatar(avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);

        return this.request('/users/avatar', {
            method: 'PATCH',
            body: formData
        });
    }

}

const userService = new UserService();
export default userService;
