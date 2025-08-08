class ApiError extends Error {
    constructor(type, status, message) {
        super(message);
        this.name = 'ApiError';
        this.type = type;
        this.status = status;
    }
}

class ApiService {
    constructor() {
        this.baseURL = 'http://localhost:8000/api/v1';
        this.retryDelays = [1000, 2000, 4000];
    }

    // Make the Request - handles both JSON and FormData
    async requestWithRetry(endpoint, options = {}, maxRetries = 3) {
        let lastError;

        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                const response = await this.makeRequest(endpoint, options);
                
                // If successful, return response
                if (response.ok || response.status < 500) {
                    return response;
                }
                
                // Server error, retry if not last attempt
                if (attempt < maxRetries - 1) {
                    await this.delay(this.retryDelays[attempt] || 4000);
                    continue;
                }
                
            } catch (error) {
                lastError = error;
                
                // Network error, retry if not last attempt
                if (attempt < maxRetries - 1 && this.isNetworkError(error)) {
                    await this.delay(this.retryDelays[attempt] || 4000);
                    continue;
                }
                
                throw error;
            }
        }
        
        throw lastError || new Error('Max retries exceeded');
    }

    async makeRequest(endpoint, options) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        const token = localStorage.getItem('accessToken');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            ...options,
            headers,
            credentials: 'include'
        };

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, config);
            
            // Handle specific HTTP errors
            if (response.status === 401) {
                this.handleUnauthorized();
                throw new ApiError('Unauthorized', 401, 'Please sign in again');
            }
            
            if (response.status === 403) {
                throw new ApiError('Forbidden', 403, 'You don\'t have permission to perform this action');
            }
            
            if (response.status === 404) {
                throw new ApiError('Not Found', 404, 'The requested resource was not found');
            }
            
            if (response.status >= 500) {
                throw new ApiError('Server Error', response.status, 'Server is temporarily unavailable');
            }

            return response;
            
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            
            if (!navigator.onLine) {
                throw new ApiError('Network Error', 0, 'No internet connection');
            }
            
            throw new ApiError('Network Error', 0, 'Failed to connect to server');
        }
    }

    async request(endpoint, options = {}) {
        try {
            const response = await this.requestWithRetry(endpoint, options);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new ApiError(
                    errorData.type || 'Request Failed',
                    response.status,
                    errorData.message || `Request failed with status ${response.status}`
                );
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                return { ...data, success: true };
            }

            return { success: true };
            
        } catch (error) {
            console.error('API Request Error:', error);
            
            return {
                error: error.message || 'An unexpected error occurred',
                success: false,
                status: error.status || 0,
                type: error.type || 'Unknown Error'
            };
        }
    }

    handleUnauthorized() {
        // Clear auth data
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        // Redirect to login if not already there
        if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
        }
    }

    isNetworkError(error) {
        return (
            error.name === 'TypeError' ||
            error.message.includes('fetch') ||
            error.message.includes('network') ||
            !navigator.onLine
        );
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
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
export {ApiError}
