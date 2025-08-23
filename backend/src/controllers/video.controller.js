// src/controllers/video.controller.js - Enhanced with secure streaming
import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import {
    uploadOnCloudinary,
    generateSignedVideoUrl,
    generateStreamingUrl
} from "../utils/cloudinary.js"
import fs from 'fs'

// HTTPS Helper Function - add this after imports
const secureVideoUrls = (video) => {
    if (!video) return video;
    
    const ensureHttps = (url) => {
        if (!url || typeof url !== 'string') return url;
        return url.replace(/^http:\/\//, 'https://');
    };
    
    const secureVideo = { ...video };
    
    if (secureVideo.videoFile) {
        secureVideo.videoFile = ensureHttps(secureVideo.videoFile);
    }
    if (secureVideo.thumbnail) {
        secureVideo.thumbnail = ensureHttps(secureVideo.thumbnail);
    }
    if (secureVideo.owner) {
        secureVideo.owner = {
            ...secureVideo.owner,
            avatar: ensureHttps(secureVideo.owner.avatar),
            coverImage: ensureHttps(secureVideo.owner.coverImage)
        };
    }
    
    return secureVideo;
};


// NEW: Secure video streaming endpoint
const streamVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // Check if video is published (unless user is owner)
    if (!video.isPublished) {
        if (!req.user || video.owner.toString() !== req.user._id.toString()) {
            throw new ApiError(403, "Video is not published");
        }
    }

    console.log("=== STREAM ENDPOINT DEBUG ===");
    console.log("Video ID:", videoId);
    console.log("Video title:", video.title);
    console.log("Has cloudinaryPublicId:", !!video.cloudinaryPublicId);
    console.log("VideoFile:", video.videoFile);

    try {
        let streamingUrl;

        // Handle both new videos (with public_id) and existing videos (with full URLs)
        if (video.cloudinaryPublicId) {
            // New secure method for videos with stored public_id
            streamingUrl = generateSignedVideoUrl(video.cloudinaryPublicId, {
                expiresIn: 3600, // 1 hour
                quality: "auto"
            });
        } else if (video.videoFile && video.videoFile.includes('cloudinary.com')) {
            // Existing videos - extract public_id from URL
            const publicId = extractPublicIdFromUrl(video.videoFile);
            if (publicId) {
                streamingUrl = generateSignedVideoUrl(publicId, {
                    expiresIn: 3600
                });
            } else {
                // Fallback to original URL if public_id extraction fails
                streamingUrl = video.videoFile;
            }
        } else {
            // Direct public_id stored in videoFile (some edge cases)
            streamingUrl = generateSignedVideoUrl(video.videoFile, {
                expiresIn: 3600
            });
        }

        console.log("Generated streaming URL:", !!streamingUrl);

        if (!streamingUrl) {
            throw new ApiError(500, "Failed to generate streaming URL");
        }

        return res.status(200).json(
            new ApiResponse(200, {
                streamingUrl,
                expiresAt: new Date(Date.now() + 3600 * 1000).toISOString()
            }, "Streaming URL generated successfully")
        );

    } catch (error) {
        console.error("Streaming error:", error);
        throw new ApiError(500, "Failed to generate streaming URL");
    }
});

// Enhanced publishAVideo to store public_id
const publishAVideo = asyncHandler(async (req, res) => {
    console.log('=== UPLOAD DEBUG ===');
    console.log('Body:', req.body);
    console.log('Files:', req.files);

    const { title, description } = req.body;

    // Validate required fields
    if (!title || !description) {
        throw new ApiError(400, "Title and description are required");
    }

    // Check if files are uploaded
    if (!req.files?.videoFile || !req.files?.thumbnail) {
        throw new ApiError(400, "Video file and thumbnail are required");
    }

    // Access the first objects from the arrays
    const videoFileObj = req.files.videoFile[0];
    const thumbnailObj = req.files.thumbnail[0];

    console.log('Video file object:', videoFileObj);
    console.log('Thumbnail object:', thumbnailObj);

    // Extract local file paths correctly
    const videoFileLocalPath = videoFileObj.path;
    const thumbnailLocalPath = thumbnailObj.path;

    console.log('Video file path:', videoFileLocalPath);
    console.log('Thumbnail path:', thumbnailLocalPath);

    if (!videoFileLocalPath || !thumbnailLocalPath) {
        throw new ApiError(400, "Could not determine file paths");
    }

    // Normalize Windows paths to POSIX style
    const normalizedVideoPath = videoFileLocalPath.replace(/\\/g, '/');
    const normalizedThumbnailPath = thumbnailLocalPath.replace(/\\/g, '/');

    console.log('Normalized video path:', normalizedVideoPath);
    console.log('Normalized thumbnail path:', normalizedThumbnailPath);

    // Check if files exist before upload
    if (!fs.existsSync(normalizedVideoPath)) {
        throw new ApiError(400, `Video file not found on server: ${normalizedVideoPath}`);
    }
    if (!fs.existsSync(normalizedThumbnailPath)) {
        throw new ApiError(400, `Thumbnail file not found on server: ${normalizedThumbnailPath}`);
    }

    try {
        // Upload video to Cloudinary
        console.log('Uploading video to Cloudinary...');
        const videoFile = await uploadOnCloudinary(normalizedVideoPath, "video");

        // Upload thumbnail to Cloudinary
        console.log('Uploading thumbnail to Cloudinary...');
        const thumbnail = await uploadOnCloudinary(normalizedThumbnailPath, "image");

        if (!videoFile || !thumbnail) {
            throw new ApiError(400, "Failed to upload files to Cloudinary");
        }

        console.log('Cloudinary upload success');
        console.log('Video public_id:', videoFile.public_id);
        console.log('Video url:', videoFile.url);
        console.log('Thumbnail url:', thumbnail.url);

        // Create video document in MongoDB with security metadata
        const video = await Video.create({
            title,
            description,
            duration: videoFile.duration || 0,
            videoFile: videoFile.url,
            thumbnail: thumbnail.url,
            owner: req.user?._id,
            isPublished: true,
            cloudinaryPublicId: videoFile.public_id,
            videoSize: videoFile.bytes || 0,
            videoFormat: videoFile.format || "mp4",
        });

        const createdVideo = await Video.findById(video._id).populate(
            "owner",
            "username fullname avatar"
        );

        if (!createdVideo) {
            throw new ApiError(500, "Video creation failed");
        }

        console.log('Video created successfully:', createdVideo.title);

        return res
            .status(201)
            .json(new ApiResponse(201, createdVideo, "Video uploaded successfully"));

    } catch (error) {
        console.error("Upload failure:", error);

        // Cleanup local files on error
        if (fs.existsSync(normalizedVideoPath)) fs.unlinkSync(normalizedVideoPath);
        if (fs.existsSync(normalizedThumbnailPath)) fs.unlinkSync(normalizedThumbnailPath);

        throw error;
    }
});


// Enhanced getVideoById with secure URL option
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { secure } = req.query // Optional query parameter to request secure URL

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
        }
    ])

    if (!video?.length) {
        throw new ApiError(404, "Video not found")
    }

    const videoData = video[0];

    console.log("=== GET VIDEO DEBUG ===");
    console.log("Video ID:", videoId);
    console.log("Secure param:", secure);
    console.log("Has cloudinaryPublicId:", !!videoData.cloudinaryPublicId);

    // If secure parameter is requested, use streaming endpoint
    if (secure === 'true') {
        videoData.videoFile = `/api/v1/videos/${videoId}/stream`;
        videoData.secureStream = true;
    }
    // Otherwise, use direct URLs (current working approach)

    // Increment view count
    await Video.findByIdAndUpdate(videoId, {
        $inc: { view: 1 }
    })

    return res
        .status(200)
        .json(new ApiResponse(200, videoData, "Video fetched successfully"))
})



// NEW: Progressive video streaming with range support
const streamVideoWithRange = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const range = req.headers.range;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (!video.isPublished) {
        if (!req.user || video.owner.toString() !== req.user._id.toString()) {
            throw new ApiError(403, "Video is not published");
        }
    }

    try {
        // Generate signed URL for this request
        const signedUrl = generateSignedVideoUrl(video.cloudinaryPublicId || video.videoFile, {
            expiresIn: 300 // 5 minutes for this chunk
        });

        if (!signedUrl) {
            throw new ApiError(500, "Failed to generate video URL");
        }

        // If range request, handle partial content
        if (range && video.videoSize) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : video.videoSize - 1;
            const chunkSize = (end - start) + 1;

            res.writeHead(206, {
                'Content-Range': `bytes ${start}-${end}/${video.videoSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunkSize,
                'Content-Type': 'video/mp4',
                'Cache-Control': 'no-cache',
                'X-Video-URL': signedUrl // Send signed URL in header
            });
        } else {
            res.writeHead(200, {
                'Content-Type': 'video/mp4',
                'Cache-Control': 'no-cache',
                'X-Video-URL': signedUrl
            });
        }

        // Redirect to signed Cloudinary URL
        return res.redirect(signedUrl);

    } catch (error) {
        console.error("Range streaming error:", error);
        throw new ApiError(500, "Failed to stream video");
    }
});

// Keep existing methods unchanged
const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query

    const pipeline = []

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

    if (userId) {
        pipeline.push({
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        })
    }

    pipeline.push({
        $match: { isPublished: true }
    })

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

    const sortStage = {}
    if (sortBy && sortType) {
        sortStage[sortBy] = sortType === "desc" ? -1 : 1
    } else {
        sortStage.createdAt = -1
    }
    pipeline.push({ $sort: sortStage })

    const options = {
        page: parseInt(page),
        limit: parseInt(limit)
    }

    const videos = await Video.aggregatePaginate(
        Video.aggregate(pipeline),
        options
    )

    // Replace video URLs with streaming endpoints for all videos
    if (videos.docs) {
        videos.docs = videos.docs.map(video => ({
            ...video,
            videoFile: `/api/v1/videos/${video._id}/stream`,
            secureStream: true
        }));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, videos, "Videos fetched successfully"))
})

// Keep other existing methods unchanged...
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

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You don't have permission to update this video")
    }

    const updateFields = {}
    if (title) updateFields.title = title
    if (description) updateFields.description = description

    if (req.file) {
        const thumbnailLocalPath = req.file?.path
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

        if (!thumbnail) {
            throw new ApiError(400, "Failed to upload thumbnail")
        }

        updateFields.thumbnail = thumbnail.url
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

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You don't have permission to delete this video")
    }

    try {
        await Video.findByIdAndDelete(videoId)
        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Video deleted successfully"))

    } catch (error) {
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

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You don't have permission to modify this video")
    }

    video.isPublished = !video.isPublished
    await video.save()

    return res
        .status(200)
        .json(new ApiResponse(200, video, "Video publish status updated successfully"))
})


// Add to video.controller.js
const getTrendingVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;

    const trendingVideos = await Video.aggregate([
        {
            $match: {
                isPublished: true  // Only published videos
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
            $sort: {
                views: -1,      // Primary sort: most views
                createdAt: -1   // Secondary sort: newest first for ties
            }
        },
        {
            $limit: parseInt(limit)
        }
    ]);

    // Apply HTTPS fixes to all video URLs
    const secureVideos = trendingVideos.map(video => secureVideoUrls(video));

    return res
        .status(200)
        .json(new ApiResponse(200, secureVideos, "Trending videos fetched successfully"));
});

// Add to video.controller.js
const getExploreVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, category, query, sortBy = 'createdAt', sortType = 'desc' } = req.query;

    const pipeline = [];

    // Match published videos
    pipeline.push({
        $match: {
            isPublished: true
        }
    });

    // Add search functionality
    if (query) {
        pipeline.push({
            $match: {
                $or: [
                    { title: { $regex: query, $options: "i" } },
                    { description: { $regex: query, $options: "i" } }
                ]
            }
        });
    }

    // Add category filter if you have categories in future
    if (category && category !== 'all') {
        pipeline.push({
            $match: {
                category: category
            }
        });
    }

    // Lookup owner info
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
    });

    pipeline.push({
        $unwind: "$owner"
    });

    // Sort videos
    const sortStage = {};
    if (sortBy && sortType) {
        sortStage[sortBy] = sortType === "desc" ? -1 : 1;
    } else {
        sortStage.createdAt = -1;
    }
    pipeline.push({ $sort: sortStage });

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: parseInt(limit) });

    const exploreVideos = await Video.aggregate(pipeline);

    // Apply HTTPS fixes
    const secureVideos = exploreVideos.map(video => secureVideoUrls(video));

    return res
        .status(200)
        .json(new ApiResponse(200, {
            videos: secureVideos,
            page: parseInt(page),
            hasMore: secureVideos.length === parseInt(limit)
        }, "Explore videos fetched successfully"));
});


export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    streamVideo,
    streamVideoWithRange,
    getTrendingVideos,
    getExploreVideos
}
