// src/services/DashboardService.js
class DashboardService {
    constructor() {
        this.baseURL = import.meta.env.VITE_API_URL;
    }

    // Make authenticated requests
    async request(endpoint, options = {}) {
        try {
            const headers = {};

            // Get token from localStorage
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
            } else {
                return { error: 'Invalid response format: expected JSON.', success: false };
            }
        } catch (error) {
            return { error: error.message || 'Network error', success: false };
        }
    }

    // Get channel statistics
    async getChannelStats() {
        return this.request('/dashboard/stats');
    }

    // Get channel videos with pagination and filtering
    async getChannelVideos(params = {}) {
        const queryString = new URLSearchParams();

        if (params.page) queryString.append('page', params.page);
        if (params.limit) queryString.append('limit', params.limit);
        if (params.sortBy) queryString.append('sortBy', params.sortBy);
        if (params.sortType) queryString.append('sortType', params.sortType);
        if (params.status) queryString.append('status', params.status);

        const endpoint = queryString.toString()
            ? `/dashboard/videos?${queryString}`
            : '/dashboard/videos';

        return this.request(endpoint);
    }
}

const dashboardService = new DashboardService();
export default dashboardService;
