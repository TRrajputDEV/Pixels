// src/services/AnalyticsService.js
class AnalyticsService {
    constructor() {
        this.baseURL = 'http://localhost:8000/api/v1';
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

    // Get comprehensive analytics data
    async getAnalytics(dateRange = '30d') {
        return this.request(`/dashboard/stats?range=${dateRange}`);
    }

    // Get video performance analytics
    async getVideoAnalytics(params = {}) {
        const queryString = new URLSearchParams();
        
        if (params.videoId) queryString.append('videoId', params.videoId);
        if (params.dateRange) queryString.append('range', params.dateRange);
        if (params.page) queryString.append('page', params.page);
        if (params.limit) queryString.append('limit', params.limit);

        const endpoint = queryString.toString() 
            ? `/dashboard/videos?${queryString}` 
            : '/dashboard/videos';

        return this.request(endpoint);
    }

    // Get audience insights
    async getAudienceInsights(dateRange = '30d') {
        return this.request(`/analytics/audience?range=${dateRange}`);
    }

    // Get engagement metrics
    async getEngagementMetrics(dateRange = '30d') {
        return this.request(`/analytics/engagement?range=${dateRange}`);
    }
}

const analyticsService = new AnalyticsService();
export default analyticsService;
