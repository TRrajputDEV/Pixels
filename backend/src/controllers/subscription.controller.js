// src/controllers/subscription.controller.js - FIXED VERSION
import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    const subscriberId = req.user._id

    // Validate channelId
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID")
    }

    // Check if channel (user) exists
    const channel = await User.findById(channelId)
    if (!channel) {
        throw new ApiError(404, "Channel not found")
    }

    // Prevent users from subscribing to themselves
    if (channelId === subscriberId.toString()) {
        throw new ApiError(400, "You cannot subscribe to your own channel")
    }

    try {
        // Check if subscription already exists
        const existingSubscription = await Subscription.findOne({
            subscriber: subscriberId,
            channel: channelId
        })

        if (existingSubscription) {
            // Unsubscribe: Delete the subscription
            await Subscription.findByIdAndDelete(existingSubscription._id)
            
            return res
                .status(200)
                .json(new ApiResponse(
                    200, 
                    { 
                        subscribed: false,
                        action: "unsubscribed" 
                    }, 
                    "Successfully unsubscribed from channel"
                ))
        } else {
            // Subscribe: Create new subscription
            const newSubscription = await Subscription.create({
                subscriber: subscriberId,
                channel: channelId
            })

            return res
                .status(200)
                .json(new ApiResponse(
                    200, 
                    { 
                        subscribed: true,
                        action: "subscribed",
                        subscription: newSubscription
                    }, 
                    "Successfully subscribed to channel"
                ))
        }
    } catch (error) {
        throw new ApiError(500, "Error toggling subscription: " + error.message)
    }
})

// FIXED: Controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params  // CHANGED: was subscriberId, now channelId
    const { page = 1, limit = 10 } = req.query

    // Validate channelId
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID")
    }

    // Check if channel exists
    const channel = await User.findById(channelId)
    if (!channel) {
        throw new ApiError(404, "Channel not found")
    }

    try {
        // Get subscribers with pagination
        const subscribers = await Subscription.aggregate([
            {
                $match: {
                    channel: new mongoose.Types.ObjectId(channelId)
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "subscriber",
                    foreignField: "_id",
                    as: "subscriberInfo",
                    pipeline: [
                        {
                            $project: {
                                fullname: 1,
                                username: 1,
                                avatar: 1,
                                createdAt: 1
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    subscriberInfo: {
                        $first: "$subscriberInfo"
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    subscriberInfo: 1,
                    subscribedAt: "$createdAt"
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $skip: (parseInt(page) - 1) * parseInt(limit)
            },
            {
                $limit: parseInt(limit)
            }
        ])

        // Get total count
        const totalSubscribers = await Subscription.countDocuments({
            channel: channelId
        })

        return res
            .status(200)
            .json(new ApiResponse(
                200,
                {
                    subscribers,
                    totalSubscribers,
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalSubscribers / parseInt(limit)),
                    hasNextPage: parseInt(page) < Math.ceil(totalSubscribers / parseInt(limit)),
                    hasPrevPage: parseInt(page) > 1
                },
                "Channel subscribers fetched successfully"
            ))

    } catch (error) {
        throw new ApiError(500, "Error fetching subscribers: " + error.message)
    }
})

// FIXED: Controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    // FIXED: Get subscriberId from authenticated user, not from params
    const subscriberId = req.user._id
    const { page = 1, limit = 10 } = req.query

    // Validate subscriberId (it comes from authenticated user, should be valid)
    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber ID")
    }

    try {
        // Get subscribed channels with pagination
        const subscribedChannels = await Subscription.aggregate([
            {
                $match: {
                    subscriber: new mongoose.Types.ObjectId(subscriberId)
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "channel",
                    foreignField: "_id",
                    as: "channelInfo",
                    pipeline: [
                        {
                            $project: {
                                fullname: 1,
                                username: 1,
                                avatar: 1,
                                coverImage: 1,
                                createdAt: 1
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    channelInfo: {
                        $first: "$channelInfo"
                    }
                }
            },
            // Get subscriber count for each channel
            {
                $lookup: {
                    from: "subscriptions",
                    localField: "channel",
                    foreignField: "channel",
                    as: "channelSubscribers"
                }
            },
            {
                $addFields: {
                    subscriberCount: {
                        $size: "$channelSubscribers"
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    channelInfo: 1,
                    subscriberCount: 1,
                    subscribedAt: "$createdAt"
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $skip: (parseInt(page) - 1) * parseInt(limit)
            },
            {
                $limit: parseInt(limit)
            }
        ])

        // Get total count
        const totalSubscriptions = await Subscription.countDocuments({
            subscriber: subscriberId
        })

        return res
            .status(200)
            .json(new ApiResponse(
                200,
                {
                    subscribedChannels,
                    totalSubscriptions,
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalSubscriptions / parseInt(limit)),
                    hasNextPage: parseInt(page) < Math.ceil(totalSubscriptions / parseInt(limit)),
                    hasPrevPage: parseInt(page) > 1
                },
                "Subscribed channels fetched successfully"
            ))

    } catch (error) {
        throw new ApiError(500, "Error fetching subscribed channels: " + error.message)
    }
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}
