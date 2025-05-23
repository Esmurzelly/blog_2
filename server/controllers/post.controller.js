import Post from "../models/post.model.js";
import { createError } from "../utils/error.js"
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

export const create = async (req, res, next) => {
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

        if (image && image.name) {
            const newPostWithImage = new Post({
                ...req.body,
                slug,
                userId: req.user.id,
                image,
            });

            const postImageName = uuidv4() + '.jpg';
            image.mv(`${POST_IMAGE_STORAGE}` + postImageName);
            newPostWithImage.image = postImageName;

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
        next(error)
    }
}