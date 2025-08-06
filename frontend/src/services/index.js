// src/services/index.js
import apiService from './ApiService.js'
import videoService from './VideoService.js'
import commentService from './CommentService.js'
import likeService from './LikeService.js'

export {
    apiService,
    videoService,
    commentService,
    likeService
}

export default {
    api: apiService,
    video: videoService,
    comment: commentService,
    like: likeService
}
