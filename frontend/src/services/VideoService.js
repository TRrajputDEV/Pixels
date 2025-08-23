// src/services/VideoService.js
class VideoService {
    constructor() {
        this.baseURL = import.meta.env.VITE_API_URL;
    }
    // Get token from localStorage (matching your existing auth system)
    getAuthHeaders() {
        const token = localStorage.getItem('accessToken');
        const headers = {};

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    // Make authenticated requests with token
    // src/services/VideoService.js
    // Update the request method to handle missing auth gracefully

    async request(endpoint, options = {}) {
        try {
            const headers = {};

            // Get token from localStorage (don't throw error if missing)
            const token = localStorage.getItem('accessToken');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            // Note: No auth header if no token - let backend decide what to allow

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


    // ===== VIDEO CRUD OPERATIONS =====

    // Upload video method

    // NEW: Get secure streaming URL
    async getStreamingUrl(videoId) {
        if (!videoId) {
            return { error: 'Video ID is required', success: false };
        }
        return this.request(`/videos/${videoId}/stream`);
    }

    // Enhanced getVideoById with optional secure streaming
    async getVideoById(videoId, options = {}) {
        if (!videoId) {
            return { error: 'Video ID is required', success: false };
        }

        try {
            // Request secure URLs if specified
            const queryParams = options.secure ? '?secure=true' : '';
            const result = await this.request(`/videos/${videoId}${queryParams}`);

            if (result.success && result.data) {
                // If backend indicates secure streaming, get the actual signed URL
                if (result.data.secureStream && result.data.videoFile.startsWith('/api')) {
                    const streamResult = await this.getStreamingUrl(videoId);
                    if (streamResult.success && streamResult.data?.streamingUrl) {
                        result.data.videoFile = streamResult.data.streamingUrl;
                        result.data.streamingExpiresAt = streamResult.data.expiresAt;
                    } else {
                        // Fallback - could revert to direct URL or show error
                        return { error: "Unable to load video securely", success: false };
                    }
                }
            }

            return result;
        } catch (error) {
            return { error: error.message, success: false };
        }
    }




    async uploadVideo(videoData) {
        const formData = new FormData();

        // Add text fields
        formData.append('title', videoData.title);
        formData.append('description', videoData.description);

        // Add files with exact field names your backend expects
        if (videoData.videoFile) {
            formData.append('videoFile', videoData.videoFile);
        }
        if (videoData.thumbnail) {
            formData.append('thumbnail', videoData.thumbnail);
        }
        return this.request('/videos', {
            method: 'POST',
            body: formData
        });
    }

    // Get all videos with optional filters
    async getAllVideos(params = {}) {
        const queryString = new URLSearchParams();

        // Add query parameters
        if (params.page) queryString.append('page', params.page);
        if (params.limit) queryString.append('limit', params.limit);
        if (params.query) queryString.append('query', params.query);
        if (params.sortBy) queryString.append('sortBy', params.sortBy);
        if (params.sortType) queryString.append('sortType', params.sortType);
        if (params.userId) queryString.append('userId', params.userId);

        const endpoint = queryString.toString() ? `/videos?${queryString}` : '/videos';
        return this.request(endpoint);
    }

    // Update video details
    async updateVideo(videoId, updateData) {
        if (!videoId) {
            return { error: 'Video ID is required', success: false };
        }

        // Check if we have a thumbnail file to update
        if (updateData.thumbnail && typeof updateData.thumbnail !== 'string') {
            const formData = new FormData();

            if (updateData.title) formData.append('title', updateData.title);
            if (updateData.description) formData.append('description', updateData.description);
            formData.append('thumbnail', updateData.thumbnail);

            return this.request(`/videos/${videoId}`, {
                method: 'PATCH',
                body: formData
            });
        } else {
            // Text-only update
            return this.request(`/videos/${videoId}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    title: updateData.title,
                    description: updateData.description
                })
            });
        }
    }

    // Delete video
    async deleteVideo(videoId) {
        if (!videoId) {
            return { error: 'Video ID is required', success: false };
        }
        return this.request(`/videos/${videoId}`, {
            method: 'DELETE'
        });
    }

    // Toggle publish status
    async togglePublishStatus(videoId) {
        if (!videoId) {
            return { error: 'Video ID is required', success: false };
        }
        return this.request(`/videos/toggle/publish/${videoId}`, {
            method: 'PATCH'
        });
    }

    // ===== HELPER METHODS =====

    // Search videos
    async searchVideos(query, options = {}) {
        return this.getAllVideos({
            query,
            page: options.page || 1,
            limit: options.limit || 20,
            sortBy: options.sortBy || 'createdAt',
            sortType: options.sortType || 'desc'
        });
    }

    // Get user's videos
    async getUserVideos(userId, options = {}) {
        return this.getAllVideos({
            userId,
            page: options.page || 1,
            limit: options.limit || 20,
            sortBy: options.sortBy || 'createdAt',
            sortType: options.sortType || 'desc'
        });
    }

    // Get trending videos (most viewed recently)
    async getTrendingVideos(options = {}) {
        return this.getAllVideos({
            sortBy: 'view',
            sortType: 'desc',
            page: options.page || 1,
            limit: options.limit || 20
        });
    }

    // Get latest videos
    async getLatestVideos(options = {}) {
        return this.getAllVideos({
            sortBy: 'createdAt',
            sortType: 'desc',
            page: options.page || 1,
            limit: options.limit || 20
        });
    }

    // Get video by ID for watch page
    async getVideoById(videoId) {
        if (!videoId) {
            return { error: 'Video ID is required', success: false };
        }
        return this.request(`/videos/${videoId}`);
    }

    // Increment view count when video is watched
    async incrementViews(videoId) {
        if (!videoId) {
            return { error: 'Video ID is required', success: false };
        }
        // The view increment happens automatically in your backend getVideoById
        return this.getVideoById(videoId);
    }

    async searchVideos(query, params = {}) {
        if (!query || !query.trim()) {
            return { error: 'Search query is required', success: false };
        }

        const queryString = new URLSearchParams();

        // Add search query
        queryString.append('query', query.trim());

        // Add other parameters
        if (params.page) queryString.append('page', params.page);
        if (params.limit) queryString.append('limit', params.limit);
        if (params.sortBy) queryString.append('sortBy', params.sortBy);
        if (params.sortType) queryString.append('sortType', params.sortType);
        if (params.userId) queryString.append('userId', params.userId);

        const endpoint = `/videos?${queryString}`;
        return this.request(endpoint);
    }

    // Get search suggestions (optional - for autocomplete)
    async getSearchSuggestions(query) {
        if (!query || query.trim().length < 2) {
            return { success: true, data: [] };
        }

        return this.searchVideos(query, { limit: 5 });
    }

    async updateVideo(videoId, videoData) {
        if (!videoId) {
            return { error: 'Video ID is required', success: false };
        }

        return this.request(`/videos/${videoId}`, {
            method: 'PATCH',
            body: JSON.stringify(videoData)
        });
    }

    // Update video thumbnail
    async updateVideoThumbnail(videoId, thumbnailFile) {
        if (!videoId || !thumbnailFile) {
            return { error: 'Video ID and thumbnail file are required', success: false };
        }

        const formData = new FormData();
        formData.append('thumbnail', thumbnailFile);

        return this.request(`/videos/${videoId}`, {
            method: 'PATCH',
            body: formData
        });
    }

    // Toggle publish status
    async togglePublishStatus(videoId) {
        if (!videoId) {
            return { error: 'Video ID is required', success: false };
        }

        return this.request(`/videos/toggle/publish/${videoId}`, {
            method: 'PATCH'
        });
    }



}

const videoService = new VideoService();
export default videoService;
