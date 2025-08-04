import { body } from "express-validator";
import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import { createPost, updatePost, deletePost, getAllPosts, getUserPosts } from "../controller/post.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

// Create Post
router.route('/create').post(
    verifyJWT,
    upload.single("image"),
    [
        body('description')
            .notEmpty().withMessage('Post description is required')
            .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
        body('hashtags')
            .optional()
            .isString().withMessage('Hashtags must be comma separated string')
    ],
    createPost
);

// Update Post
router.route('/update/:postId').patch(
    verifyJWT,
    upload.single("image"),
    [
        body('description')
            .notEmpty().withMessage('Post description is required')
            .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
        body('hashtags')
            .optional()
            .isString().withMessage('Hashtags must be comma separated string')
    ],
    updatePost
);

// Delete Post
router.route('/delete/:postId').delete(
    verifyJWT,
    deletePost
);

router.get("/all", getAllPosts);
router.get("/user/:userId", getUserPosts);


export default router