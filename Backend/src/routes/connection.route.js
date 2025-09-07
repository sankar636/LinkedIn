import { Router } from "express";
import { param } from "express-validator";
import { connectUser, acceptConnection, getConnections, ignoreConnection } from "../controller/connection.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";

const router = Router();

router.route('/connect/:id').post( // id:  onnectedUserid
    verifyJWT,
    [
        param('id').isMongoId().withMessage('Invalid User ID format')
    ],
    connectUser
);

router.route('/accept/:id').post( // id: requestingUserId
    verifyJWT,
    [
        param('id').isMongoId().withMessage('Invalid User ID format')
    ],
    acceptConnection
);


router.route('/ignore/:id').post(
    verifyJWT,
    [
        param('id').isMongoId().withMessage('Invalid User ID Format')
    ],
    ignoreConnection
)

router.route('/getConnections').get(
    verifyJWT,
    getConnections
)
export default router;