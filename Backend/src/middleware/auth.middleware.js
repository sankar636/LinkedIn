import jwt from 'jsonwebtoken'
import ApiError from '../utils/ApiError.js'
import { AsyncHandler } from '../utils/AsyncHandler.js'
import User from '../models/user.model.js'

const verifyJWT = AsyncHandler(async(req, res, next) => {
    try {
        const token = req.cookies?.token || req.header('Authorization').replace('Bearer ', '')        
        if(!token){
            throw new ApiError(400,"Unauthorized request")
        }

        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
                
        const user = await User.findById(decodedToken?._id).select('-password')

        if(!user){
            throw new ApiError(401, "Invalid token")
        }

        req.user = user
        
        next()
    } catch (error) {
        throw new ApiError(401,"Invalid Token")
    }
})

export default verifyJWT