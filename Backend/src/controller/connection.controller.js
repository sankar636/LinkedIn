import { AsyncHandler } from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Connection from "../models/connection.model.js";

// Send a connection request
const connectUser = AsyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { id: recipientId } = req.params;

    // 1. Check for self-connection first
    if (userId.toString() === recipientId) {
        throw new ApiError(400, "You cannot connect with yourself.");
    }

    // 2. Check if a connection already exists
    const existingConnection = await Connection.findOne({
        $or: [
            { requester: userId, recipient: recipientId },
            { requester: recipientId, recipient: userId },
        ],
    });

    if(existingConnection){
        return res.status(201).json(
            new ApiResponse(201, "Connection Already established", existingConnection)
        );
    }

    // 3. Create the new connection
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

    return res.status(201).json(
        new ApiResponse(201, "Connection request sent successfully", populatedConnection)
    );
});

// Accept a connection request
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

    return res.status(200).json(
        new ApiResponse(200, "Connection accepted successfully", connection)
    );
});

// Ignore a connection request
const ignoreConnection = AsyncHandler(async (req, res) => {
    const userId = req.user._id; // The one ignoring
    const { id:ignoreUserId } = req.params; // The one who sent the request
    console.log(userId);
    console.log(ignoreUserId);  
    // Find a PENDING request sent by ignoreUserId to the current user
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