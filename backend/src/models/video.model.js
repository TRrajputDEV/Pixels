// src/models/video.model.js - Enhanced version
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import mongoose, { Schema } from "mongoose";

const VideoSchema = new mongoose.Schema(
    {
        videoFile: {
            type: String, // Will store Cloudinary public_id for new uploads
            required: true
        },
        videoUrl: {
            type: String, // Keep original URL for backward compatibility
            required: false
        },
        thumbnail: {
            type: String,
            required: true,   
        },
        title: {
            type: String,
            required: true,   
        },
        description: {
            type: String,
            required: true,   
        },
        duration: {
            type: Number,
            required: true,   
        },
        view: {
            type: Number,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        // New security fields
        cloudinaryPublicId: {
            type: String, // Store public_id for signed URL generation
            required: false
        },
        videoSize: {
            type: Number, // File size in bytes
            default: 0
        },
        videoFormat: {
            type: String, // mp4, webm, etc.
            default: "mp4"
        }
    },
    {
        timestamps: true
    }
)

VideoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", VideoSchema)
