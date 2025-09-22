import { Router } from 'express';
import { getNotifications, markAllNotificationsAsRead, markNotificationRead, checkAndClearNotifications } from '../controller/notification.controller.js'
import  verifyJWT  from '../middleware/auth.middleware.js'; 

const router = Router();


router.route("/").get(verifyJWT, getNotifications);
router.route("/mark-read").post(verifyJWT, markAllNotificationsAsRead);
router.route('/:id/read').patch(verifyJWT, markNotificationRead)
router.route('/check-and-clear').post(verifyJWT, checkAndClearNotifications)

export default router;