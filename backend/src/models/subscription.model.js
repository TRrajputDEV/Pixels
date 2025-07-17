import mongoose, { Schema } from "mongoose";
const subscriptionSchema = new mongoose.Schema({

    subscriber: {
        type: Schema.Types.ObjectId, // jo subscribe kr rha  h uski ID - tushar
        ref: "User"
    },
    channel: {
        type: Schema.Types.ObjectId, // hitesh sir ka channel
        ref: "User"
    }
    
},{timestamps: true})


export const Subscription = mongoose.model("Subscription", subscriptionSchema)