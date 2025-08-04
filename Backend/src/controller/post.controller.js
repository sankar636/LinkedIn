import { AsyncHandler } from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import { validationResult } from "express-validator";

// Create Post
const createPost = AsyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { description, hashtags } = req.body;
    const image = req.file?.path; // Assuming you're using multer for file uploads

    if (!description?.trim()) {
        throw new ApiError(400, "Post description is required");
    }

    const post = await Post.create({
        description,
        author: req.user._id,
        image: image || undefined,
        hashtags: hashtags?.split(",").map(tag => tag.trim()) || []
    });

    const createdPost = await Post.findById(post._id).populate({
        path: "author",
        select: "username firstname lastname profileImage"
    });

    if (!createdPost) {
        throw new ApiError(500, "Something went wrong while creating the post");
    }

    return res.status(201).json(
        new ApiResponse(201, "Post created successfully", createdPost)
    );
});

// Update Post
const updatePost = AsyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { postId } = req.params;
    const { description, hashtags } = req.body;
    const image = req.file?.path;

    if (!description?.trim()) {
        throw new ApiError(400, "Post description is required");
    }

    const post = await Post.findOne({ _id: postId, author: req.user._id });

    if (!post) {
        throw new ApiError(404, "Post not found or you're not authorized to edit");
    }

    post.description = description;
    post.isEdited = true;
    if (image) post.image = image;
    if (hashtags) post.hashtags = hashtags.split(",").map(tag => tag.trim());

    const updatedPost = await post.save();
    const populatedPost = await Post.findById(updatedPost._id).populate({
        path: "author",
        select: "username firstname lastname profileImage"
    });

    return res.status(200).json(
        new ApiResponse(200, "Post updated successfully", populatedPost)
    );
});

// Delete Post
const deletePost = AsyncHandler(async (req, res) => {
    const { postId } = req.params;

    const post = await Post.findOneAndDelete({ 
        _id: postId, 
        author: req.user._id 
    });

    if (!post) {
        throw new ApiError(404, "Post not found or you're not authorized to delete");
    }

    return res.status(200).json(
        new ApiResponse(200, "Post deleted successfully", {})
    );
});

const getAllPosts = AsyncHandler(async (req, res) => {
    const posts = await Post.find()
      .populate("author", "firstname lastname username headLine profileImage")
      .sort({ createdAt: -1 });
  
    return res
      .status(200)
      .json(new ApiResponse(200, "All posts fetched successfully", { posts }));
  });
  
  // Get posts of a specific user (Profile page)
const getUserPosts = AsyncHandler(async (req, res) => {
    const userId = req.params.userId;
  
    const posts = await Post.find({ author: userId })
      .populate("author", "firstname lastname username headLine profileImage")
      .sort({ createdAt: -1 });
  
    return res
      .status(200)
      .json(new ApiResponse(200, "User posts fetched successfully", { posts }));
  });

export { createPost, updatePost, deletePost, getAllPosts, getUserPosts };