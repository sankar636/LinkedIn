import { body } from "express-validator";
import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import { getCurrentUser } from "../controller/user.controller.js";


const router = Router();

router.route('/currentuser').get(
    verifyJWT,
    getCurrentUser
)

export default router