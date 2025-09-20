import { body } from "express-validator";
import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import { getCurrentUser, updateProfile, getUserAccountProfile, followUser, getFollowUser, getProfileById,updateProfileImage, updateCoverImage
   } from "../controller/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";

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

router.route('/profileImage').patch(verifyJWT, upload.single('profileImage'), updateProfileImage)
router.route('/coverImage').patch(verifyJWT, upload.single('coverImage'), updateCoverImage)

export default router