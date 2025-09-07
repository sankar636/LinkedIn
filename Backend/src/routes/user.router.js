import { body } from "express-validator";
import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import { getCurrentUser, updateProfile, getUserAccountProfile, followUser, getFollowUser, getProfileById } from "../controller/user.controller.js";


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
router.route('/profileById/:id').get(
    verifyJWT, 
    getProfileById
);

router.route('/:id/follow').post(
    verifyJWT,
    followUser
)

router.route('/followUser').get(
    verifyJWT,
    getFollowUser
)

export default router