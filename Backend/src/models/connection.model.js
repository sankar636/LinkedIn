import { Schema } from "mongoose"
import mongoose from "mongoose"

const connectionSchema = new Schema({
    requester: {
        // The user who send the request
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    recipient: {
        // The user who receive the request
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "ignored", "blocked"],
        default: "pending",
        required: true,
    },
})

const Connection  = mongoose.model("Connection", connectionSchema);

export default Connection