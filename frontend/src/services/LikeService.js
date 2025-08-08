// src/services/LikeService.js
class LikeService {
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

            // Only set Content-Type for JSON requests
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

    // ===== LIKE OPERATIONS =====

    // Toggle like on video
    async toggleVideoLike(videoId) {
        if (!videoId) {
            return { error: 'Video ID is required', success: false };
        }

        return this.request(`/likes/toggle/v/${videoId}`, {
            method: 'POST'
        });
    }

    // Toggle like on comment
    async toggleCommentLike(commentId) {
        if (!commentId) {
            return { error: 'Comment ID is required', success: false };
        }

        return this.request(`/likes/toggle/c/${commentId}`, {
            method: 'POST'
        });
    }

    // Get user's liked videos
    async getLikedVideos(params = {}) {
        const queryString = new URLSearchParams();
        
        // Add query parameters
        if (params.page) queryString.append('page', params.page);
        if (params.limit) queryString.append('limit', params.limit);

        const endpoint = queryString.toString() 
            ? `/likes/videos?${queryString}` 
            : `/likes/videos`;

        return this.request(endpoint);
    }
}

const likeService = new LikeService();
export default likeService;
