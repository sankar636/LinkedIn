import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { validationResult } from "express-validator";


const registerUser = AsyncHandler(async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, username, password, firstname, lastname } = req.body;

    const fields = { email, username, password, firstname, lastname };

    for (const [key, value] of Object.entries(fields)) {
        if (!value?.trim()) {
            throw new ApiError(400, `${key} is required`);
        }
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    const user = await User.create({
        firstname,
        lastname,
        email,
        password,
        username: username.toLowerCase()
    });

    const createdUser = await User.findById(user._id).select("-password");
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(200, "User Registered Successfully", createdUser)
    );
});

const loginUser = AsyncHandler(async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body);
    
    const { email, username, password } = req.body

    if (!username && !email) {
        throw new ApiError(400, "Enter Username or email")
    }

    const user = await User.findOne(
        {
            $or: [{ username }, { email }]
        }
    )

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password");
    }

    const token = user.generateToken();
    res.cookie("token", token, {
        httpOnly: true,
        secure: false
    });

    return res.status(200).json(
        new ApiResponse(200, "User logged in successfully", { user: user, token })
    );
});

const logoutUser = AsyncHandler(async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
    });

    return res.status(200).json(
        new ApiResponse(200, "User Logged out successfully", { data: null })
    );
});
  

export { registerUser, loginUser, logoutUser };
