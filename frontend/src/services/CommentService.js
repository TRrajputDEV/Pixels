// src/services/CommentService.js
class CommentService {
    constructor() {
        this.baseURL = 'http://localhost:8000/api/v1';
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

    // ===== COMMENT OPERATIONS =====

    // Get all comments for a video
    async getVideoComments(videoId, params = {}) {
        const queryString = new URLSearchParams();
        
        // Add query parameters
        if (params.page) queryString.append('page', params.page);
        if (params.limit) queryString.append('limit', params.limit);

        const endpoint = queryString.toString() 
            ? `/comments/${videoId}?${queryString}` 
            : `/comments/${videoId}`;

        return this.request(endpoint);
    }

    // Add a comment to a video
    async addComment(videoId, commentData) {
        if (!videoId) {
            return { error: 'Video ID is required', success: false };
        }

        if (!commentData.content || !commentData.content.trim()) {
            return { error: 'Comment content is required', success: false };
        }

        return this.request(`/comments/${videoId}`, {
            method: 'POST',
            body: JSON.stringify(commentData)
        });
    }

    // Update a comment
    async updateComment(commentId, commentData) {
        if (!commentId) {
            return { error: 'Comment ID is required', success: false };
        }

        if (!commentData.content || !commentData.content.trim()) {
            return { error: 'Comment content is required', success: false };
        }

        return this.request(`/comments/c/${commentId}`, {
            method: 'PATCH',
            body: JSON.stringify(commentData)
        });
    }

    // Delete a comment
    async deleteComment(commentId) {
        if (!commentId) {
            return { error: 'Comment ID is required', success: false };
        }

        return this.request(`/comments/c/${commentId}`, {
            method: 'DELETE'
        });
    }
}

const commentService = new CommentService();
export default commentService;
