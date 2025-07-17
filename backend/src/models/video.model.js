import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import mongoose, { Schema } from "mongoose";


const VideoSchema = new mongoose.Schema(
    {
        videoFile: {
            type: String, // url from cloudnaryy
            required: true
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
        }

    },
    {
        timestamps: true
    }
)

VideoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", VideoSchema)