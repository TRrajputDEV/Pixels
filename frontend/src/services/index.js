// src/services/index.js
import apiService from './ApiService.js'
import videoService from './VideoService.js'
import commentService from './CommentService.js'

export {
    apiService,
    videoService,
    commentService
}

export default {
    api: apiService,
    video: videoService,
    comment: commentService
}
