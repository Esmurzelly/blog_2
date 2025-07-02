import { Schema, model } from "mongoose";
import { IPost } from "../types.js";

const postSchema = new Schema<IPost>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
            unique: true,
        },
        image: {
            type: String,
            default: "https://simplybuiltsites.com/wp-content/uploads/how-to-write-a-blog-post.png",
        },
        category: {
            type: String,
            default: "uncategorized"
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        }
    }, { timestamps: true }
);

const Post = model<IPost>("Post", postSchema);

export default Post;