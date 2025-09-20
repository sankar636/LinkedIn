import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import { sendMessage, getMessage } from "../controller/chat.controller.js"

const router = Router();

router.route('/:id').get(
    verifyJWT,
    getMessage
)

router.route('/send/:id').post(
    verifyJWT,
    sendMessage
)

export default router