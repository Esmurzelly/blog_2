import Post from "../models/post.model.js";
import { createError } from "../utils/error.js"
import { v4 as uuidv4 } from 'uuid';
import { NextFunction, Request, Response } from 'express';
import { IPost, IUserId } from "../types.js";
import { UploadedFile } from "express-fileupload";
import { ParsedQs } from 'qs'

interface IRequestWithUserAndFiles extends Request<
    Record<string, any>,
    any,
    any,
    ParsedQs
> {
    user: IUserId;
    files?: {
        [fieldname: string]: UploadedFile | UploadedFile[];
    };
}

interface IGetPostsQuery extends ParsedQs {
    startIndex?: string;
    limit?: string;
    sort?: string;
    userId?: string;
    category?: string;
    slug?: string;
    postId?: string;
    searchTerm?: string;
}

interface IDeletePostParams {
    userId: string;
    postId: string;
}

interface IUpdatePostParams {
    userId: string;
    postId: string;
}

interface IUpdatePostBody {
    title?: string;
    content?: string;
    category?: string;
    image?: string;
}


export const create = async (
    req: IRequestWithUserAndFiles,
    res: Response,
    next: NextFunction
) => {
    try {
        const image = req?.files?.image;
        const POST_IMAGE_STORAGE = process.env.POST_IMAGE_STORAGE;

        if (!req.user.isAdmin) return next(createError(403, 'You are not allowed to create a post'));
        if (!req.body.title || !req.body.content) next(createError(400, 'Please provide all required fields'));

        const slug = req.body.title
            .split(' ')
            .join('-')
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]/g, '-');

        let imageFile: UploadedFile | undefined;

        if (Array.isArray(image)) {
            imageFile = image[0];
        } else {
            imageFile = image;
        }

        if (imageFile && imageFile.name) {
            const postImageName = uuidv4() + '.jpg';
            await imageFile.mv(`${POST_IMAGE_STORAGE}` + postImageName);

            const newPostWithImage = new Post({
                ...req.body,
                slug,
                userId: req.user.id,
                image: postImageName,
            });

            await newPostWithImage.save();

            res.status(201).json(newPostWithImage);
        } else {
            const newPost = new Post({
                ...req.body,
                slug,
                userId: req.user.id,
            });

            const savedPost = await newPost.save();
            res.status(201).json(savedPost);
        }
    } catch (error) {
        next(error);
    }
}

export const getPosts = async (
    req: Request<{}, any, any, IGetPostsQuery>,
    res: Response,
    next: NextFunction

) => {
    try {
        const startIndex = parseInt(req.query.startIndex ?? "0");
        const limit = parseInt(req.query.limit ?? "9");
        const sortDirection = req.query.sort === 'asc' ? 1 : -1;

        const posts = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm, $options: "i" } },
                    { content: { $regex: req.query.searchTerm, $options: "i" } },
                ]
            })
        }).sort({ updatedAt: sortDirection }).skip(startIndex).limit(limit);

        const totalPost = await Post.countDocuments();

        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthPosts = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });

        res.status(200).json({
            posts,
            totalPost,
            lastMonthPosts,
        });
    } catch (error) {
        next(error);
    }
}

export const deletePost = async (
    req: Request<IDeletePostParams, any, any, ParsedQs> & { user: IUserId },
    res: Response,
    next: NextFunction
) => {
    if (!req.user.isAdmin || req.user.id.toString() !== req.params.userId) {
        return next(createError(403, 'You are not allowed to delete this post'));
    }

    try {
        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json({
            postId: req.params.postId,
            message: 'The post has been deleted'
        });
    } catch (error) {
        next(error)
    }
}

export const updatePost = async (
    req: Request<
        IUpdatePostParams,
        any,
        IUpdatePostBody,
        ParsedQs
    > & { user: IUserId; files?: { [fieldname: string]: UploadedFile | UploadedFile[] } },
    res: Response,
    next: NextFunction
) => {
    const POST_IMAGE_STORAGE = process.env.POST_IMAGE_STORAGE;
    const file = req?.files?.image;

    if (!req.user.isAdmin || req.user.id.toString() !== req.params.userId) {
        return next(createError(403, 'You are not allowed to update this post'));
    }

    try {
        const updatedFields: IUpdatePostBody = {
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
        };

        let imageFile: UploadedFile | undefined;

        if (Array.isArray(file)) {
            imageFile = file[0];
        } else {
            imageFile = file;
        }

        if (imageFile) {
            const imageName = uuidv4() + '.jpg';
            await imageFile.mv(`${POST_IMAGE_STORAGE}` + imageName);
            updatedFields.image = imageName;
        }

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.postId,
            { $set: updatedFields },
            { new: true }
        );

        res.status(200).json(updatedPost);
    } catch (error) {
        next(error)
    }
}