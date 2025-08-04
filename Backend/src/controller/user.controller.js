import { AsyncHandler } from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/user.model.js";

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

export {
    getCurrentUser,
    updateProfile
}
