// src/services/SubscriptionService.js - UPDATED
class SubscriptionService {
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

    // Toggle subscription to a channel
    async toggleSubscription(channelId) {
        if (!channelId) {
            return { error: 'Channel ID is required', success: false };
        }

        return this.request(`/subscriptions/c/${channelId}`, {
            method: 'POST'
        });
    }

    // FIXED: Get list of channels user has subscribed to
    async getSubscribedChannels(params = {}) {
        const queryString = new URLSearchParams();
        if (params.page) queryString.append('page', params.page);
        if (params.limit) queryString.append('limit', params.limit);

        const endpoint = queryString.toString() 
            ? `/subscriptions/channels?${queryString}` 
            : `/subscriptions/channels`;

        return this.request(endpoint);
    }

    // FIXED: Get subscribers of a channel
    async getChannelSubscribers(channelId, params = {}) {
        if (!channelId) {
            return { error: 'Channel ID is required', success: false };
        }

        const queryString = new URLSearchParams();
        if (params.page) queryString.append('page', params.page);
        if (params.limit) queryString.append('limit', params.limit);

        const endpoint = queryString.toString() 
            ? `/subscriptions/subscribers/${channelId}?${queryString}` 
            : `/subscriptions/subscribers/${channelId}`;

        return this.request(endpoint);
    }
}

const subscriptionService = new SubscriptionService();
export default subscriptionService;
