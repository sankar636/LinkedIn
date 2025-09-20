import mongoose, { Schema} from "mongoose";

const chatSchema = new Schema({
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
        required: true
    }
},{timestamps: true})

chatSchema.index({ createdAt: -1 });

const Chat = mongoose.model("Chat", chatSchema)

export default Chat;

