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
        },
        tags: {
            type: [String],
            default: [],
            index: true  // For efficient searching
        },
        mood: {
            type: String,
            enum: ['funny', 'educational', 'chill', 'exciting', 'inspiring', 'random', null],
            default: null,
            index: true
        },
        category: {
            type: String,
            enum: ['tech', 'comedy', 'music', 'gaming', 'lifestyle', 'education', 'sports', 'cooking', 'fitness', 'other'],
            default: 'other',
            index: true
        },
        duration_category: {
            type: String,
            enum: ['short', 'medium', 'long'],  // <5min, 5-20min, >20min
            index: true
        },
        intent_keywords: {
            type: [String],
            default: []  // Auto-generated from title/description
        }
    },
    {
        timestamps: true
    }
)

VideoSchema.index({ 
    title: 'text', 
    description: 'text', 
    tags: 'text',
    intent_keywords: 'text'
});


// Pre-save middleware to auto-categorize duration
VideoSchema.pre('save', function(next) {
    if (this.duration) {
        if (this.duration < 300) { // < 5 minutes
            this.duration_category = 'short';
        } else if (this.duration < 1200) { // < 20 minutes
            this.duration_category = 'medium';
        } else {
            this.duration_category = 'long';
        }
    }
    next();
});

VideoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", VideoSchema)
