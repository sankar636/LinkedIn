import { Schema } from "mongoose";
import mongoose from "mongoose";

const postSchema = new Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    image: {
        type: String 
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    comments: [{
        content: {
            type: String,
            trim: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    }],
    hashtags: [{
        type: String,
        trim: true
    }],
    isEdited: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    });

const Post = mongoose.model("Post", postSchema);

export default Post;