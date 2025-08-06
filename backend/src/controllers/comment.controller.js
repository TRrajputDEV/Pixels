// src/controllers/comment.controller.js
import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js"
import { Video } from "../models/video.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query

    // Validate video ID
    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    // Check if video exists
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    // Build aggregation pipeline for comments with user details
    const pipeline = [
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
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
            $sort: { createdAt: -1 } // Latest comments first
        }
    ]

    // Apply pagination
    const options = {
        page: parseInt(page),
        limit: parseInt(limit)
    }

    const comments = await Comment.aggregatePaginate(
        Comment.aggregate(pipeline),
        options
    )

    return res
        .status(200)
        .json(new ApiResponse(200, comments, "Comments fetched successfully"))
})

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { content } = req.body

    // Validate video ID
    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    // Validate content
    if (!content || content.trim().length === 0) {
        throw new ApiError(400, "Comment content is required")
    }

    if (content.trim().length > 1000) {
        throw new ApiError(400, "Comment cannot exceed 1000 characters")
    }

    // Check if video exists
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    // Create comment
    const comment = await Comment.create({
        content: content.trim(),
        video: videoId,
        owner: req.user._id
    })

    // Fetch the created comment with owner details
    const createdComment = await Comment.aggregate([
        {
            $match: {
                _id: comment._id
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
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
        }
    ])

    if (!createdComment || createdComment.length === 0) {
        throw new ApiError(500, "Something went wrong while creating comment")
    }

    return res
        .status(201)
        .json(new ApiResponse(201, createdComment[0], "Comment added successfully"))
})

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const { content } = req.body

    // Validate comment ID
    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID")
    }

    // Validate content
    if (!content || content.trim().length === 0) {
        throw new ApiError(400, "Comment content is required")
    }

    if (content.trim().length > 1000) {
        throw new ApiError(400, "Comment cannot exceed 1000 characters")
    }

    // Find the comment
    const comment = await Comment.findById(commentId)
    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    // Check if user owns the comment
    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You don't have permission to update this comment")
    }

    // Update comment
    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {
                content: content.trim()
            }
        },
        { new: true }
    ).populate("owner", "username fullname avatar")

    return res
        .status(200)
        .json(new ApiResponse(200, updatedComment, "Comment updated successfully"))
})

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params

    // Validate comment ID
    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID")
    }

    // Find the comment
    const comment = await Comment.findById(commentId)
    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    // Check if user owns the comment OR owns the video (video owner can delete any comment)
    const video = await Video.findById(comment.video)
    const canDelete = comment.owner.toString() === req.user._id.toString() ||
        video?.owner.toString() === req.user._id.toString()

    if (!canDelete) {
        throw new ApiError(403, "You don't have permission to delete this comment")
    }

    // Delete comment
    await Comment.findByIdAndDelete(commentId)

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Comment deleted successfully"))
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}
