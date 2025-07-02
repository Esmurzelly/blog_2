import { Schema, model } from "mongoose";
import { IComment } from "../types.js";

const commentSchema = new Schema<IComment>({
    content: {
        type: String,
        required: true,
    },
    postId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    likes: { // which user likes the current comment
        type: [String],
        default: [],
    },
    numberOfLikes: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

const Comment = model<IComment>('Comment', commentSchema);

export default Comment;