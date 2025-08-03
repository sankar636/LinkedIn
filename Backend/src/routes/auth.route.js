import { Router } from "express";
import { registerUser, loginUser, logoutUser } from "../controller/auth.controller.js";
import { body } from "express-validator";
import verifyJWT from "../middleware/auth.middleware.js";

const router = Router();

router.route('/register').post(
    [
        body('firstname').notEmpty().withMessage('First name is required'),
        body('lastName').notEmpty().withMessage('Last name is required'),
        body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
        body('email').isEmail().withMessage('Invalid email address'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    ],
    registerUser
);

router.route('/login').post(
    [
        body('username')
            .optional()
            .isLength({ min: 3 })
            .withMessage('Username must be at least 3 characters'),
        body('email')
            .optional()
            .isEmail()
            .withMessage('Invalid email address'),
        body().custom((_, { req }) => {
            if (!req.body.username && !req.body.email) {
                throw new Error('Either email or username is required');
            }
            return true;
        }),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters')
    ],
    loginUser
);

router.route('/logout').post(
    verifyJWT,
    logoutUser
)


export default router;
