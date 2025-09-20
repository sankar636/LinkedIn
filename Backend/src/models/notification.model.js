import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
    {
        receiver: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true
        },
        sender: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true
        },
        content: {
            type: String,
            required: true,
            enum: [
                "Connection_Request",
                "Request_Accepted",
                "Post_Like",
                "New_Comment"
            ]
        },
        post: {
            type: mongoose.Types.ObjectId,
            ref: "Post"
        },
        read: {
            type: Boolean,
            default: false
        },
        comment: {
            type: String,
        },
        isNew: {
            type: Boolean,
            default: true,
        }
    },
    { timestamps: true }
);

notificationSchema.index({ createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;