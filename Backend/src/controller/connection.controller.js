import { AsyncHandler } from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Connection from "../models/connection.model.js";
import { sendMessageToUser, getReceiverSocketId } from "../socket.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

const connectUser = AsyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { id: recipientId } = req.params;

    if (userId.toString() === recipientId) {
        throw new ApiError(400, "You cannot connect with yourself.");
    }

    const user = await User.findById(userId).select('-password');

    if (!user) {
        throw new ApiError(400, "User not found")
    }
    const recipientUser = await User.findById(recipientId).select('-password');
    if (!recipientUser) {
        throw new ApiError(400, "The user you are trying to connect with was not found.")
    }
    const existingConnection = await Connection.findOne({
        $or: [
            { requester: userId, recipient: recipientId },
            { requester: recipientId, recipient: userId },
        ],
    });

    if (existingConnection) {
        return res.status(201).json(
            new ApiResponse(201, "Connection Already established", existingConnection)
        );
    }

    const connection = await Connection.create({
        requester: userId,
        recipient: recipientId,
        status: "pending",
    });

    if (!connection) {
        throw new ApiError(500, "Connection could not be created");
    }
    const populatedConnection = await Connection.findById(connection._id)
        .populate("requester", "username firstname lastname profileImage")
        .populate("recipient", "username firstname lastname profileImage");

    // Check if the recipient is currently online
    const recipientSocketId = getReceiverSocketId(recipientId);
    const isRecipientOnline = !!recipientSocketId;

    const notification = await Notification.create({
        receiver: recipientId,
        sender: userId,
        content: "Connection_Request",
        isNew: !isRecipientOnline,
    })
    if (!notification) {
        throw new ApiError(500, "Notification could not be created");
    }
    // console.log("Notification", notification);
    

    if (isRecipientOnline) {
        const populatedNotification = await Notification.findById(notification._id)
            .populate("sender", "firstname lastname username");
        sendMessageToUser(recipientId, {
            event: 'connection-request', 
            data: populatedNotification
        });
    }

    return res.status(201).json(
        new ApiResponse(201, "Connection request sent successfully", populatedConnection)
    );
});

const acceptConnection = AsyncHandler(async (req, res) => {
    const userId = req.user._id; // The one accepting
    const { id: requestedUserId } = req.params; // The one who sent the request
      
    const connection = await Connection.findOneAndUpdate(
        {
            requester: requestedUserId,
            recipient: userId,
            status: { $in: ["pending", "ignored"] } // Can accept a previously ignored request
        },
        { $set: { status: "accepted" } },
        { new: true }
    );

    if (!connection) {
        throw new ApiError(404, "Connection request not found or already accepted.");
    }
    const recipientSocketId = getReceiverSocketId(requestedUserId);
    const isRecipientOnline = !!recipientSocketId;
    const notification = await Notification.create(
        {
            receiver: requestedUserId,
            sender: userId,
            content: "Request_Accepted",
            isNew: !isRecipientOnline
        }
    )
    if (!notification) {
        throw new ApiError(500, "Notification could not be created");
    }
    if (isRecipientOnline) {
        const populatedNotification = await Notification.findById(notification._id)
            .populate("sender", "firstname lastname username");
        console.log(populatedNotification);
        sendMessageToUser(requestedUserId, {
            event: 'Request_Accepted', 
            data: populatedNotification
        });
    }
    return res.status(200).json(
        new ApiResponse(200, "Connection accepted successfully", connection)
    );
});

// Ignore a connection request
const ignoreConnection = AsyncHandler(async (req, res) => {
    const userId = req.user._id; // The one ignoring
    const { id: ignoreUserId } = req.params; // The one who sent the request
    console.log(userId);
    console.log(ignoreUserId);
    const connection = await Connection.findOneAndUpdate(
        {
            requester: ignoreUserId,
            recipient: userId,
            status: "pending"
        },
        { $set: { status: "ignored" } },
        { new: true }
    );

    if (!connection) {
        throw new ApiError(404, "Pending connection request not found.");
    }

    return res.status(200).json(
        new ApiResponse(200, "Connection ignored successfully", connection)
    );
});

// Get all connections and requests for the logged-in user
const getConnections = AsyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Find any connection document where the user is either the requester or recipient
    const connections = await Connection.find({
        $or: [{ requester: userId }, { recipient: userId }]
    })
        .populate("requester", "username firstname lastname profileImage")
        .populate("recipient", "username firstname lastname profileImage");
    // console.log(connections);

    return res.status(200).json(
        new ApiResponse(200, "All connections fetched successfully", connections)
    );
});

export {
    connectUser,
    acceptConnection,
    getConnections, // Make sure your route points to this
    ignoreConnection
};