class ApiService {
    constructor() {
        this.baseURL = 'http://localhost:8000/api/v1';
    }

    // Make the Request - handles both JSON and FormData
    async request(endpoint, options = {}) {
        try {
            const headers = {};

            // Only set Content-Type for JSON requests, let browser set it for FormData
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
                } else {
                    const text = await response.text();
                    console.warn("Non-JSON error response:", text);
                }
                return { error: errorMessage };
            }

            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            } else {
                return { error: 'Invalid response format: expected JSON.' };
            }
        } catch (error) {
            return { error: error.message || 'Network error' };
        }
    }

    // ===== AUTHENTICATION METHODS =====

    // User Registration with file uploads (avatar required, coverImage optional)
    async register(userData) {
        const formData = new FormData();

        // Add text fields
        formData.append('fullname', userData.fullname);
        formData.append('email', userData.email);
        formData.append('username', userData.username);
        formData.append('password', userData.password);

        // Add files
        if (userData.avatar) {
            formData.append('avatar', userData.avatar);
        }
        if (userData.coverImage) {
            formData.append('coverImage', userData.coverImage);
        }

        return this.request('/users/register', {
            method: 'POST',
            body: formData
        });
    }

    // User Login
    async login(credentials) {
        return this.request('/users/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    }

    // User Logout
    async logout() {
        return this.request('/users/logout', {
            method: 'POST',
        });
    }

    // Refresh Access Token
    async refreshToken(refreshToken = null) {
        const body = refreshToken ? JSON.stringify({ refreshToken }) : undefined;
        return this.request('/users/refresh-token', {
            method: 'POST',
            body
        });
    }

    // ===== USER PROFILE METHODS =====

    // Get Current User
    async getCurrentUser() {
        return this.request('/users/current-user');
    }

    // Change Password
    async changePassword(passwordData) {
        return this.request('/users/change-password', {
            method: 'POST',
            body: JSON.stringify(passwordData)
        });
    }

    // Update Account Details (fullname, email)
    async updateAccountDetails(userData) {
        return this.request('/users/update-account', {
            method: 'PATCH',
            body: JSON.stringify(userData)
        });
    }

    // Update User Avatar
    // src/services/ApiService.js
    // Update these methods to use the correct field names:

    // Update User Avatar - use 'avatar' field name
    // src/services/ApiService.js
    // Update these methods with the EXACT endpoint paths:

    async updateAvatar(avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile); // Field name must match multer config

        console.log('Uploading avatar:', avatarFile.name); // Debug log

        return this.request('/users/avatar', { // Make sure this matches your route
            method: 'PATCH',
            body: formData
            // Don't set Content-Type header - let browser set it for FormData
        });
    }

    async updateCoverImage(coverImageFile) {
        const formData = new FormData();
        formData.append('coverImage', coverImageFile); // Field name must match multer config

        console.log('Uploading cover image:', coverImageFile.name); // Debug log

        return this.request('/users/cover-image', { // Make sure this matches your route
            method: 'PATCH',
            body: formData
            // Don't set Content-Type header - let browser set it for FormData
        });
    }



    // Get User Channel Profile
    async getUserChannelProfile(username) {
        return this.request(`/users/c/${username}`);
    }

    // Get Watch History
    async getWatchHistory() {
        return this.request('/users/history');
    }

    // ===== HELPER METHODS FOR FRONTEND =====

    // Check if user is authenticated (helper method)
    async checkAuth() {
        const result = await this.getCurrentUser();
        return !result.error;
    }

    // Upload multiple files helper (for registration)
    createRegistrationFormData(userData, avatarFile, coverImageFile = null) {
        return {
            fullname: userData.fullname,
            email: userData.email,
            username: userData.username,
            password: userData.password,
            avatar: avatarFile,
            coverImage: coverImageFile
        };
    }

    // Add this method to your ApiService class
    async changePassword(passwordData) {
        return this.request('/users/change-password', {
            method: 'POST',
            body: JSON.stringify(passwordData)
        });
    }

}

const apiService = new ApiService();
export default apiService;
