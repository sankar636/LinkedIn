import { AsyncHandler } from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import { validationResult } from "express-validator";

const getCurrentUser = AsyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized access");
  }

  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "User fetched successfully", { user }));
});

const updateProfile = AsyncHandler(async (req, res) => {
  const { skills, headLine, education, location, gender, experience } = req.body;

  if (!req.user) {
    throw new ApiError(401, "Unauthorized access");
  }

  // Prepare update object
  const updateFields = {};

  if (skills !== undefined) updateFields.skills = Array.isArray(skills) ? skills : [];
  if (headLine !== undefined) updateFields.headLine = headLine;
  if (education !== undefined) updateFields.education = Array.isArray(education) ? education : [];
  if (location !== undefined) updateFields.location = location;
  if (gender !== undefined) updateFields.gender = gender;
  if (experience !== undefined) updateFields.experience = Array.isArray(experience) ? experience : [];

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updateFields },
    { new: true, runValidators: true }
  ).select("-password");

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(
    new ApiResponse(200, "Profile updated successfully", { user: updatedUser })
  );
});

const getUserAccountProfile = AsyncHandler(async (req, res) => {
  const { username } = req.params;
  if (!username?.trim()) {
    throw new ApiError(404, "username is not defined");
  }

  const user = await User.findOne({ username }).select("-password");

  const posts = await Post.find({ author: user._id }).sort({ createdAt: -1 })

  if (!user) {
    throw new ApiError(404, "user not Found");
  }

  return res.status(200).json(
    new ApiResponse(200, "user fatched successfully", { user, posts })
  );

})

const followUser = AsyncHandler(async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const userId = req.user._id;
  const { id } = req.params;
  console.log(id);

  const user = await User.findById(userId).select("-password");
  const followingUser = await User.findById(id).select("-password");


  if (!user) {
    throw new ApiError(400, "No user found");
  }
  if (!followingUser) {
    throw new ApiError(400, "No following User found");
  }
  if (userId.toString() === id.toString()) {
    throw new ApiError(400, "You cannot follow yourself");
  }

  if (!user.following.includes(followingUser._id)) {
    user.following.push(followingUser._id);
    followingUser.followers.push(user._id);
    await user.save();
    await followingUser.save();
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "User followed successfully", {following: user.following, 
      followers: user.followers }));
})

const getFollowUser = AsyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId).select("-password").populate("followers", "firstname lastname username headLine profileImage").populate("following", "firstname lastname username headLine profileImage")

  if (!user) {
    throw new ApiError(404, "user not Found");
  }
  const followers = user.followers;
  const following = user.following;

  return res.status(200).json(
    new ApiResponse(200, "user fatched successfully", { followers, following })
  );
})
export {
  getCurrentUser,
  updateProfile,
  getUserAccountProfile,
  followUser,
  getFollowUser
}
