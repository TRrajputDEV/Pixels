// src/controllers/dashboard.controller.js
import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    const channelId = req.user._id

    try {
        // Get channel stats using aggregation pipeline
        const channelStats = await Video.aggregate([
            {
                // Match all videos by current user
                $match: {
                    owner: new mongoose.Types.ObjectId(channelId)
                }
            },
            {
                // Group all user videos to calculate totals
                $group: {
                    _id: null,
                    totalVideos: { $sum: 1 },
                    totalViews: { $sum: "$view" },
                    totalVideoDuration: { $sum: "$duration" }
                }
            }
        ])

        // Get total subscribers (people who subscribed TO this user)
        const totalSubscribers = await Subscription.countDocuments({
            channel: channelId
        })

        // Get total subscriptions (people this user subscribed to)
        const totalSubscriptions = await Subscription.countDocuments({
            subscriber: channelId
        })

        // Get total likes across all user's videos
        const totalLikes = await Like.countDocuments({
            video: {
                $in: await Video.find({ owner: channelId }).distinct('_id')
            }
        })

        // Get total likes user has given
        const totalLikesGiven = await Like.countDocuments({
            likedBy: channelId
        })

        // Prepare stats object with default values
        const videoStats = channelStats[0] || {
            totalVideos: 0,
            totalViews: 0,
            totalVideoDuration: 0
        }

        // Calculate additional metrics
        const averageViewsPerVideo = videoStats.totalVideos > 0
            ? Math.round(videoStats.totalViews / videoStats.totalVideos)
            : 0

        const stats = {
            // Core metrics
            totalVideos: videoStats.totalVideos,
            totalViews: videoStats.totalViews,
            totalSubscribers: totalSubscribers,
            totalLikes: totalLikes,

            // Additional metrics
            totalSubscriptions: totalSubscriptions,
            totalLikesGiven: totalLikesGiven,
            averageViewsPerVideo: averageViewsPerVideo,
            totalVideoDuration: videoStats.totalVideoDuration,

            // Engagement metrics
            engagementRate: videoStats.totalViews > 0
                ? ((totalLikes / videoStats.totalViews) * 100).toFixed(2)
                : 0,

            // Growth indicators (placeholder for future implementation)
            subscribersGrowth: 0, // This would require historical data
            viewsGrowth: 0, // This would require historical data

            // Content metrics
            videosThisMonth: 0, // Will be calculated below
            videosThisWeek: 0   // Will be calculated below
        }

        // Get recent video upload stats
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))

        const recentStats = await Video.aggregate([
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(channelId),
                    createdAt: { $gte: startOfMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    videosThisMonth: { $sum: 1 },
                    videosThisWeek: {
                        $sum: {
                            $cond: [
                                { $gte: ["$createdAt", startOfWeek] },
                                1,
                                0
                            ]
                        }
                    }
                }
            }
        ])

        if (recentStats[0]) {
            stats.videosThisMonth = recentStats[0].videosThisMonth
            stats.videosThisWeek = recentStats[0].videosThisWeek
        }

        return res
            .status(200)
            .json(new ApiResponse(
                200,
                stats,
                "Channel stats retrieved successfully"
            ))

    } catch (error) {
        throw new ApiError(500, "Error fetching channel stats: " + error.message)
    }
})

const getChannelVideos = asyncHandler(async (req, res) => {
    const channelId = req.user._id
    const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortType = 'desc',
        status = 'all' // all, published, unpublished
    } = req.query

    try {
        // Build match conditions
        const matchConditions = {
            owner: new mongoose.Types.ObjectId(channelId)
        }

        // Filter by publish status if specified
        if (status === 'published') {
            matchConditions.isPublished = true
        } else if (status === 'unpublished') {
            matchConditions.isPublished = false
        }

        // Build aggregation pipeline
        const pipeline = [
            {
                $match: matchConditions
            },
            {
                // Get like count for each video
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "video",
                    as: "likes"
                }
            },
            {
                // Get comment count for each video (if you have comments)
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "video",
                    as: "comments"
                }
            },
            {
                // Add computed fields
                $addFields: {
                    likeCount: { $size: "$likes" },
                    commentCount: { $size: "$comments" },
                    // Calculate engagement score
                    engagementScore: {
                        $add: [
                            "$view",
                            { $multiply: [{ $size: "$likes" }, 5] },
                            { $multiply: [{ $size: "$comments" }, 10] }
                        ]
                    }
                }
            },
            {
                // Remove the arrays we don't need
                $project: {
                    likes: 0,
                    comments: 0
                }
            },
            {
                // Sort by specified criteria
                $sort: {
                    [sortBy]: sortType === 'desc' ? -1 : 1
                }
            }
        ]

        // Apply pagination
        const options = {
            page: parseInt(page),
            limit: parseInt(limit)
        }

        const result = await Video.aggregatePaginate(
            Video.aggregate(pipeline),
            options
        )

        // Format the response data
        const formattedVideos = result.docs.map(video => ({
            _id: video._id,
            title: video.title,
            description: video.description,
            thumbnail: video.thumbnail,
            videoFile: video.videoFile,
            duration: video.duration,
            view: video.view,
            isPublished: video.isPublished,
            createdAt: video.createdAt,
            updatedAt: video.updatedAt,

            // Engagement metrics
            likeCount: video.likeCount,
            commentCount: video.commentCount,
            engagementScore: video.engagementScore,

            // Performance indicators
            performance: {
                views: video.view,
                likes: video.likeCount,
                comments: video.commentCount,
                engagementRate: video.view > 0
                    ? ((video.likeCount / video.view) * 100).toFixed(2)
                    : 0
            }
        }))

        const responseData = {
            videos: formattedVideos,
            pagination: {
                currentPage: result.page,
                totalPages: result.totalPages,
                totalVideos: result.totalDocs,
                videosPerPage: result.limit,
                hasNextPage: result.hasNextPage,
                hasPrevPage: result.hasPrevPage
            },
            summary: {
                totalVideos: result.totalDocs,
                publishedVideos: formattedVideos.filter(v => v.isPublished).length,
                unpublishedVideos: formattedVideos.filter(v => !v.isPublished).length,
                totalViews: formattedVideos.reduce((sum, v) => sum + v.view, 0),
                totalLikes: formattedVideos.reduce((sum, v) => sum + v.likeCount, 0),
                totalComments: formattedVideos.reduce((sum, v) => sum + v.commentCount, 0)
            }
        }

        return res
            .status(200)
            .json(new ApiResponse(
                200,
                responseData,
                "Channel videos retrieved successfully"
            ))

    } catch (error) {
        throw new ApiError(500, "Error fetching channel videos: " + error.message)
    }
})

export {
    getChannelStats,
    getChannelVideos
}
