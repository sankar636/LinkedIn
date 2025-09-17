import { Server } from "socket.io";
import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import User from "./models/user.model.js";

const userSocketMap = {}

let io;

function initializeSocket(server) {
    io = new Server(server, {
        cors: {
            // origin: 'http://localhost:5173',
            origin: 'https://linked-in-iota-snowy.vercel.app',
            methods: ['GET', 'POST'],
        },
        transports: ['websocket', 'polling'],
        path: '/socket.io'
    });
    io.use(async (socket, next) => { //  authentication middleware
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error("Authentication error: No token provided."));
            }

            const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
            const user = await User.findById(decoded._id).select("-password");

            if (!user) {
                return next(new Error("Authentication error: User not found."));
            }

            socket.user = user;
            next();
        } catch (error) {
            console.error("Socket authentication error:", error.message);
            next(new Error("Authentication error: Invalid token."));
        }
    });

    io.on('connection', (socket) => {
        const userId = socket.user._id.toString();
        console.log(`✅ Client connected: ${socket.id}, User: ${userId}`);
        userSocketMap[userId] = socket.id;
        io.emit("getOnlineUsers", Object.keys(userSocketMap));

        socket.on("disconnect", () =>{
            console.log(`client disConnected: ${socket.id}, User: ${userId}`);
            delete userSocketMap[userId]
            io.emit("getOnlineUsers", Object.keys(userSocketMap))
        })
    });

}

const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

const sendMessageToUser  = ( receiverId, messageObject ) => {
    const socketId = getReceiverSocketId(receiverId);
    console.log(`socketId: ${socketId} receiverId: ${receiverId}`);    
    if (socketId) {
        io.to(socketId).emit(messageObject.event, messageObject.data);
        console.log(`Emitted event '${messageObject.event}' to user ${receiverId}`);
    } else {
        console.log(`User ${receiverId} is not online.`);
    }
}


export { initializeSocket, sendMessageToUser , getReceiverSocketId, io }