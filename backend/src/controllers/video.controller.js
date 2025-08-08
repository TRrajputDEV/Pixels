// src/controllers/video.controller.js - SECURED VERSION
import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { Like } from "../models/like.model.js"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { 
    uploadOnCloudinary, 
    uploadLargeVideoOnCloudinary, 
    generateSecureUrl,
    deleteFromCloudinary 
} from "../utils/cloudinary.js"

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query

    // Build aggregation pipeline
    const pipeline = []

    // Match stage for search query
    if (query) {
        pipeline.push({
            $match: {
                $or: [
                    { title: { $regex: query, $options: "i" } },
                    { description: { $regex: query, $options: "i" } }
                ]
            }
        })
    }

    // Match by user if userId provided
    if (userId) {
        pipeline.push({
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        })
    }

    // Match only published videos
    pipeline.push({
        $match: { isPublished: true }
    })

    // Lookup owner details
    pipeline.push({
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
    })

    pipeline.push({
        $unwind: "$owner"
    })

    // Sort stage
    const sortStage = {}
    if (sortBy && sortType) {
        sortStage[sortBy] = sortType === "desc" ? -1 : 1
    } else {
        sortStage.createdAt = -1  // Default sort by newest
    }
    pipeline.push({ $sort: sortStage })

    // Apply pagination
    const options = {
        page: parseInt(page),
        limit: parseInt(limit)
    }

    const videos = await Video.aggregatePaginate(
        Video.aggregate(pipeline),
        options
    )

    return res
        .status(200)
        .json(new ApiResponse(200, videos, "Videos fetched successfully"))
})

const publishAVideo = asyncHandler(async (req, res) => {
    // Debug logs
    console.log('=== SECURE UPLOAD DEBUG ===');
    console.log('Body:', req.body);
    console.log('Files:', req.files);
    console.log('Has videoFile:', !!req.files?.videoFile?.[0]);
    console.log('Has thumbnail:', !!req.files?.thumbnail?.[0]);
    console.log('========================');

    const { title, description, isPublic = false } = req.body

    // Validate required fields
    if (!title || !description) {
        throw new ApiError(400, "Title and description are required")
    }

    // Check if files are uploaded
    if (!req.files?.videoFile || !req.files?.thumbnail) {
        throw new ApiError(400, "Video file and thumbnail are required")
    }

    // Get file paths
    const videoFileLocalPath = req.files.videoFile[0]?.path
    const thumbnailLocalPath = req.files.thumbnail[0]?.path

    if (!videoFileLocalPath || !thumbnailLocalPath) {
        throw new ApiError(400, "Video file and thumbnail are required")
    }

    try {
        // Determine security level based on user preference or content type
        const accessMode = isPublic === "true" ? "public" : "private"; // 🔐 Secure by default

        // Check file size to determine upload method
        const videoStats = require('fs').statSync(videoFileLocalPath);
        const fileSizeInMB = videoStats.size / (1024 * 1024);
        
        console.log(`📊 Video file size: ${fileSizeInMB.toFixed(2)}MB`);

        // Upload video file (use large upload for files > 100MB)
        const videoFile = fileSizeInMB > 100 
            ? await uploadLargeVideoOnCloudinary(videoFileLocalPath, accessMode)
            : await uploadOnCloudinary(videoFileLocalPath, "video", accessMode);

        // Upload thumbnail as private
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath, "image", "private");

        if (!videoFile || !thumbnail) {
            throw new ApiError(400, "Failed to upload files to cloudinary")
        }

        console.log('🔐 Secure upload completed:', {
            videoId: videoFile.public_id,
            thumbnailId: thumbnail.public_id,
            accessMode
        });

        // Create video document with secure references
        const video = await Video.create({
            title,
            description,
            duration: videoFile.duration || 0,
            videoFile: {
                public_id: videoFile.public_id,
                secure_url: videoFile.secure_url,
                access_mode: accessMode
            },
            thumbnail: {
                public_id: thumbnail.public_id,
                secure_url: thumbnail.secure_url,
                access_mode: "private"
            },
            owner: req.user?._id,
            isPublished: true
        })

        const createdVideo = await Video.findById(video._id).populate(
            "owner",
            "username fullname avatar"
        )

        if (!createdVideo) {
            throw new ApiError(500, "Something went wrong while uploading video")
        }

        return res
            .status(201)
            .json(new ApiResponse(201, createdVideo, "Video uploaded securely"))

    } catch (error) {
        console.error('❌ Secure upload failed:', error);
        throw new ApiError(500, `Upload failed: ${error.message}`)
    }
})

// 🔐 NEW: Generate secure URL endpoint for protected videos
const getVideoSecureUrl = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { duration = 3600 } = req.query // Default 1 hour

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    // Check if user has permission to view this video
    // You can add your own access control logic here
    const canAccess = video.isPublished || 
                     video.owner.toString() === req.user?._id.toString();

    if (!canAccess) {
        throw new ApiError(403, "You don't have permission to access this video")
    }

    try {
        // Generate secure URLs for video and thumbnail
        const videoSecureUrl = generateSecureUrl(video.videoFile.public_id, {
            resourceType: "video",
            expiresAt: Math.floor(Date.now() / 1000) + parseInt(duration),
            accessMode: video.videoFile.access_mode
        });

        const thumbnailSecureUrl = generateSecureUrl(video.thumbnail.public_id, {
            resourceType: "image",
            expiresAt: Math.floor(Date.now() / 1000) + parseInt(duration),
            accessMode: video.thumbnail.access_mode
        });

        return res.status(200).json(new ApiResponse(
            200,
            {
                videoUrl: videoSecureUrl,
                thumbnailUrl: thumbnailSecureUrl,
                expiresIn: parseInt(duration),
                expiresAt: new Date(Date.now() + parseInt(duration) * 1000)
            },
            "Secure URLs generated successfully"
        ));

    } catch (error) {
        console.error('❌ Failed to generate secure URLs:', error);
        throw new ApiError(500, "Failed to generate secure access URLs")
    }
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const video = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId)
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
            $addFields: {
                owner: "$owner"
            }
        }
    ])

    if (!video?.length) {
        throw new ApiError(404, "Video not found")
    }

    // Increment view count
    await Video.findByIdAndUpdate(videoId, {
        $inc: { view: 1 }
    })

    const videoData = video[0];

    // 🔐 For private/authenticated videos, generate secure URLs automatically
    if (videoData.videoFile?.access_mode !== "public") {
        try {
            const videoSecureUrl = generateSecureUrl(videoData.videoFile.public_id, {
                resourceType: "video",
                accessMode: videoData.videoFile.access_mode
            });

            const thumbnailSecureUrl = generateSecureUrl(videoData.thumbnail.public_id, {
                resourceType: "image", 
                accessMode: videoData.thumbnail.access_mode
            });

            // Add secure URLs to response
            videoData.secureVideoUrl = videoSecureUrl;
            videoData.secureThumbnailUrl = thumbnailSecureUrl;
            videoData.urlExpiresIn = 3600; // 1 hour

        } catch (error) {
            console.warn('⚠️ Could not generate secure URLs:', error.message);
        }
    }

    return res
        .status(200)
        .json(new ApiResponse(200, videoData, "Video fetched successfully"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title, description } = req.body

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    if (!title && !description && !req.file) {
        throw new ApiError(400, "At least one field is required to update")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    // Check if user owns the video
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You don't have permission to update this video")
    }

    // Prepare update object
    const updateFields = {}
    if (title) updateFields.title = title
    if (description) updateFields.description = description

    // Handle thumbnail update with secure upload
    if (req.file) {
        const thumbnailLocalPath = req.file?.path
        
        // 🔐 Upload new thumbnail securely
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath, "image", "private")

        if (!thumbnail) {
            throw new ApiError(400, "Failed to upload thumbnail")
        }

        // 🗑️ Delete old thumbnail from Cloudinary
        if (video.thumbnail?.public_id) {
            await deleteFromCloudinary(video.thumbnail.public_id, "image");
        }

        updateFields.thumbnail = {
            public_id: thumbnail.public_id,
            secure_url: thumbnail.secure_url,
            access_mode: "private"
        }
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        { $set: updateFields },
        { new: true }
    ).populate("owner", "username fullname avatar")

    return res
        .status(200)
        .json(new ApiResponse(200, updatedVideo, "Video updated successfully"))
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    // Validate video ID
    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    // Find the video
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    // Check if user owns the video
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You don't have permission to delete this video")
    }

    try {
        // 🗑️ Delete files from Cloudinary first
        if (video.videoFile?.public_id) {
            await deleteFromCloudinary(video.videoFile.public_id, "video");
            console.log('🗑️ Deleted video from Cloudinary:', video.videoFile.public_id);
        }

        if (video.thumbnail?.public_id) {
            await deleteFromCloudinary(video.thumbnail.public_id, "image");
            console.log('🗑️ Deleted thumbnail from Cloudinary:', video.thumbnail.public_id);
        }

        // Delete the video from database
        await Video.findByIdAndDelete(videoId)

        // Delete associated likes and comments
        await Like.deleteMany({ video: videoId })
        await Comment.deleteMany({ video: videoId })

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Video and associated files deleted successfully"))

    } catch (error) {
        console.error('❌ Delete error:', error);
        throw new ApiError(500, "Error deleting video: " + error.message)
    }
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    // Check if user owns the video
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You don't have permission to modify this video")
    }

    video.isPublished = !video.isPublished
    await video.save()

    return res
        .status(200)
        .json(new ApiResponse(200, video, "Video publish status updated successfully"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    getVideoSecureUrl,  // 🔐 NEW: Secure URL generation
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
