import mongoose from "mongoose";
import Notification from "../models/notification.model.js";
import ApiError from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";

const getNotifications = AsyncHandler(async (req, res) => {
    const userId = req.user._id;

    const notifications = await Notification.find({ receiver: userId })
        .populate("sender", "firstname lastname profilePic headLine username")
        .populate({
            path: "post",
            select: "description comments",
            populate: {
                path: "comments",
                select: "content"
            }
        })
        .sort({ createdAt: -1 });
    if (!notifications) {
        throw new ApiError(400, "Error wiile getting notification")
    }
    return res
        .status(200)
        .json(new ApiResponse(200, "Notifications fetched successfully", notifications));
});

const markAllNotificationsAsRead = AsyncHandler(async (req, res) => {
    const userId = req.user._id;

    await Notification.updateMany(
        { receiver: userId, read: false },
        { $set: { read: true } }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, "All notifications marked as read", {}));
});

const markNotificationRead = AsyncHandler(async (req, res) => {
    const userId = req.user._id
    if (!userId) {
        throw new ApiError(500, "User not found ")
    }
    const { id } = req.params
    await Notification.findByIdAndUpdate(
        id,
        { $set: { read: true } }
    );

    return res.status(200).json(new ApiResponse(200, "Notification marked as read", {}))
})

const checkAndClearNotifications = AsyncHandler(async (req, res) => {

    const newNotifications = await Notification.find({
        receiver: req.user._id,
        isNew: true,
    });

    if (newNotifications.length === 0) {
        return res
            .status(200)
            .json(new ApiResponse(200, { total: 0 }, "No new notifications"));
    }

    const summary = { total: newNotifications.length };
    newNotifications.forEach(notification => {
        const key = notification.content.charAt(0).toLowerCase() + notification.content.slice(1).replace(/_([a-z])/g, (g) => g[1].toUpperCase());
        summary[key] = (summary[key] || 0) + 1;
    });
    const notificationIds = newNotifications.map(n => n._id);
    await Notification.updateMany(
        { _id: { $in: notificationIds } },
        { $set: { isNew: false } }
    );
    return res
        .status(200)
        .json(new ApiResponse(200, "New notification summary fetched and cleared.", summary));
})

export { getNotifications, markAllNotificationsAsRead, markNotificationRead, checkAndClearNotifications };