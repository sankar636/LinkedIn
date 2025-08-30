import { body } from "express-validator";
import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import { getCurrentUser, updateProfile, getUserAccountProfile } from "../controller/user.controller.js";


const router = Router();

router.route('/currentuser').get(
    verifyJWT,
    getCurrentUser
)

router.route('/updateprofile').put(
    verifyJWT,
    updateProfile
);

router.route('/profile/:username').get(
    verifyJWT, 
    getUserAccountProfile
);

export default router