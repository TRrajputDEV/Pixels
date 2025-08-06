// src/controllers/like.controller.js
import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {Video} from "../models/video.model.js"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params

    // Validate video ID
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    // Check if video exists
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    // Check if user already liked this video
    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: req.user._id
    })

    let isLiked = false
    let message = ""

    if (existingLike) {
        // Unlike the video
        await Like.findByIdAndDelete(existingLike._id)
        isLiked = false
        message = "Video unliked successfully"
    } else {
        // Like the video
        await Like.create({
            video: videoId,
            likedBy: req.user._id
        })
        isLiked = true
        message = "Video liked successfully"
    }

    // Get updated like count
    const likeCount = await Like.countDocuments({ video: videoId })

    return res
        .status(200)
        .json(new ApiResponse(200, {
            isLiked,
            likeCount
        }, message))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params

    // Validate comment ID
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID")
    }

    // Check if comment exists
    const comment = await Comment.findById(commentId)
    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    // Check if user already liked this comment
    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id
    })

    let isLiked = false
    let message = ""

    if (existingLike) {
        // Unlike the comment
        await Like.findByIdAndDelete(existingLike._id)
        isLiked = false
        message = "Comment unliked successfully"
    } else {
        // Like the comment
        await Like.create({
            comment: commentId,
            likedBy: req.user._id
        })
        isLiked = true
        message = "Comment liked successfully"
    }

    // Get updated like count
    const likeCount = await Like.countDocuments({ comment: commentId })

    return res
        .status(200)
        .json(new ApiResponse(200, {
            isLiked,
            likeCount
        }, message))
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params

    // Validate tweet ID
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID")
    }

    // Note: You'll need to uncomment this when you have Tweet model
    // const tweet = await Tweet.findById(tweetId)
    // if (!tweet) {
    //     throw new ApiError(404, "Tweet not found")
    // }

    // Check if user already liked this tweet
    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user._id
    })

    let isLiked = false
    let message = ""

    if (existingLike) {
        // Unlike the tweet
        await Like.findByIdAndDelete(existingLike._id)
        isLiked = false
        message = "Tweet unliked successfully"
    } else {
        // Like the tweet
        await Like.create({
            tweet: tweetId,
            likedBy: req.user._id
        })
        isLiked = true
        message = "Tweet liked successfully"
    }

    // Get updated like count
    const likeCount = await Like.countDocuments({ tweet: tweetId })

    return res
        .status(200)
        .json(new ApiResponse(200, {
            isLiked,
            likeCount
        }, message))
})

const getLikedVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query

    // Build aggregation pipeline to get liked videos with video details
    const pipeline = [
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(req.user._id),
                video: { $exists: true, $ne: null } // Only get video likes
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videoDetails"
            }
        },
        {
            $unwind: "$videoDetails"
        },
        {
            $lookup: {
                from: "users",
                localField: "videoDetails.owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullname: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$owner"
        },
        {
            $addFields: {
                "videoDetails.owner": "$owner"
            }
        },
        {
            $replaceRoot: {
                newRoot: {
                    $mergeObjects: [
                        "$videoDetails",
                        {
                            likedAt: "$createdAt"
                        }
                    ]
                }
            }
        },
        {
            $sort: { likedAt: -1 } // Most recently liked first
        }
    ]

    // Apply pagination
    const options = {
        page: parseInt(page),
        limit: parseInt(limit)
    }

    const likedVideos = await Like.aggregatePaginate(
        Like.aggregate(pipeline),
        options
    )

    return res
        .status(200)
        .json(new ApiResponse(200, likedVideos, "Liked videos fetched successfully"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}
