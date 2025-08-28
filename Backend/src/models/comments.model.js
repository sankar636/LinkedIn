import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    content: {
      type: String,
      trim: true,
      required: true,
      maxlength: 1000,
    },
    isEdited: { type: Boolean, default: false },
  },
  { timestamps: true }
);

commentSchema.index({ post: 1, createdAt: -1 });

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
