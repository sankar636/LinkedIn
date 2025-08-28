import Comment from "../models/comments.model.js";
import Post from "../models/post.model.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { validationResult } from "express-validator";


export const addComment = AsyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, "Validation failed", { errors: errors.array() });
  }

  const userId = req.user._id;
  const { postId, content } = req.body;

  if (!content?.trim()) {
    throw new ApiError(400, "Content is required");
  }

  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, "Post not found");
  console.log(post.author);
  console.log(userId);
  console.log(post.author == userId);

  const comment = await Comment.create({ post: postId, user: userId, content }); 

  if (!comment) throw new ApiError(404, "comment not created");

  post.comments.push(comment._id);

  // OPTIONAL: maintain a counter on Post
  if (post.commentCount !== undefined) {
    post.commentCount += 1;
    await post.save();
  }

  const populated = await Comment.findById(comment._id)
    .populate("user", "firstname lastname profilePic")
    .lean();

  if (!populated) throw new ApiError(404, "comment not populated");

  return res
    .status(201)
    .json(new ApiResponse(201, "Comment added successfully", { comment: populated }));
});


export const deleteComment = AsyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId).populate("post", "author commentCount");
  if (!comment) throw new ApiError(404, "Comment not found");


  await Post.updateOne(
    { _id: comment.post._id },
    {
      $pull: { comments: commentId },
      $inc: { commentCount: -1 }
    }
  );
  await Comment.deleteOne({ _id: commentId });
  return res
    .status(200)
    .json(new ApiResponse(200, "Comment deleted successfully", {}));
});


export const getComments = AsyncHandler(async (req, res) => {
  const { postId } = req.params;
  const page = Math.max(parseInt(req.query.page || "1", 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || "10", 10), 1), 50);
  const skip = (page - 1) * limit;

  const postExists = await Post.exists({ _id: postId });
  if (!postExists) throw new ApiError(404, "Post not found");

  const [items, total] = await Promise.all([
    Comment.find({ post: postId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "firstname lastname profilePic")
      .lean(),
    Comment.countDocuments({ post: postId }),
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Comments fetched successfully",
        {
          comments: items,
          page,
          limit,
          total,
          hasMore: skip + items.length < total,
        }
      )
    );
}); 