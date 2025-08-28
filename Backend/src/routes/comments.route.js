import { body, param } from "express-validator";
import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import { addComment, deleteComment, getComments } from "../controller/comments.controller.js";

const router = Router();

// Add Comment
router.route('/').post(
    verifyJWT,
    [
        body('postId')
            .notEmpty().withMessage('Post ID is required')
            .isMongoId().withMessage('Valid Post ID is required'),
        body('content')
            .notEmpty().withMessage('Comment content is required')
            .isLength({ max: 500 }).withMessage('Comment cannot exceed 500 characters')
            .trim()
    ],
    addComment
);

// Delete Comment
router.route('/:commentId').delete(
    verifyJWT,
    [
        param('commentId')
            .notEmpty().withMessage('Comment ID is required')
            .isMongoId().withMessage('Valid Comment ID is required')
    ],
    deleteComment
);

// Get Comments for a Post
router.route('/post/:postId').get(
    [
        param('postId')
            .notEmpty().withMessage('Post ID is required')
            .isMongoId().withMessage('Valid Post ID is required'),
        body('page')
            .optional()
            .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
        body('limit')
            .optional()
            .isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
    ],
    getComments
);

export default router;