import { AsyncHandler } from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getReceiverSocketId, io } from "../socket.js";
import Chat from "../models/chat.model.js";
import User from "../models/user.model.js";
import Conversation from "../models/conversection.model.js";


const sendMessage = AsyncHandler(async (req, res) => {
    const content = req.body.content
    const senderId = req.user._id;
    const { id: recipientId } = req.params;

    if (senderId.toString() === recipientId) {
        throw new ApiError(400, "You cannot send Message with yourself.");
    }

    const user = await User.findById(senderId).select('-password');

    if (!user) {
        throw new ApiError(400, "User not found")
    }

    const recipientUser = await User.findById(recipientId).select('-password');

    if (!recipientUser) {
        throw new ApiError(400, "The user you are trying to connect with was not found.")
    }

    let conversation = await Conversation.findOne({
        participants: { $all: [senderId, recipientId] }
    })
    
    if (!conversation) {
        conversation = await Conversation.create({
            participants: [senderId, recipientId],
        });
    }

    const newChat = new Chat({
        sender: senderId,
        receiver: recipientId,
        content
    })

    await newChat.save()

    const receiverSocktId = getReceiverSocketId(recipientId);
    if (receiverSocktId) {
        io.to(receiverSocktId).emit("newChat", newChat);
    }

    return res.status(201).json(new ApiResponse(201, "Message sent successfully", newChat));
});

const getMessage = AsyncHandler(async (req, res) => {
    const { id: userToChatWithId } = req.params;
    const senderId = req.user._id;

    const chats = await Chat.find({
        $or: [
            { sender: senderId, receiver: userToChatWithId },
            { sender: userToChatWithId, receiver: senderId },
        ],
    }).sort({ createdAt: "asc" });
    if (!chats) {
        throw new ApiError("Error while find chat", 500)
    }

    return res.status(200).json(new ApiResponse(200, "Messages fetched", chats));
})

export { sendMessage, getMessage };
