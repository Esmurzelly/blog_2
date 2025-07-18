import Comment from "../models/comment.model.js";
import { createError } from "../utils/error.js";
import { NextFunction, Request, Response } from 'express';
import { IComment, IUserId } from "../types.js";

interface IRequestWithUser extends Request {
    user: IUserId
}

export const createComment = async (req: IRequestWithUser, res: Response, next: NextFunction) => {
    try {
        const { content, postId, userId } = req.body;

        if (userId !== req.user.id) return next(createError(403, 'You are not allowed to create this comment'));

        const newComment = new Comment<Partial<IComment>>({
            content,
            postId,
            userId,
        });

        await newComment.save();

        res.status(200).json({
            newComment,
            message: "You created the comment successfuly"
        });
    } catch (error) {
        next(error)
    }
}

export const getPostComments = async (req, res, next) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: -1 });
        res.status(200).json({
            comments,
            message: "You got the posts successfuly"
        });
    } catch (error) {
        next(error)
    }
}

export const likeComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);

        if (!comment) return next(createError(404, 'Comment not found'));

        const userIndex = comment.likes.indexOf(req.user.id);

        if (userIndex === -1) {
            comment.numberOfLikes += 1;
            comment.likes.push(req.user.id); // add like
        } else {
            comment.numberOfLikes -= 1;
            comment.likes.splice(userIndex, 1); // remove like
        }

        await comment.save();
        res.status(200).json({
            comment,
            numberOfLikes: comment.numberOfLikes
        });
    } catch (error) {
        next(error)
    }
}

export const editComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);

        if (!comment) return next(createError(404, 'Comment not found'));
        if (comment.userId !== req.user.id && !req.user.isAdmin) return next(createError(403, 'You are not allowed to edit this comment'));

        const editedComment = await Comment.findByIdAndUpdate(
            req.params.commentId,
            {
                content: req.body.content
            }, { new: true }
        );

        res.status(200).json(editedComment);
    } catch (error) {
        next(error)
    }
}

export const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);

        if (!comment) return next(createError(404, 'Comment not found'));
        if (comment.userId !== req.user.id && !req.user.isAdmin) return next(403, "You are not allowed to delete this comment");

        await Comment.findByIdAndDelete(req.params.commentId);
        res.status(200).json({
            commentId: req.params.commentId,
            message: 'Comment has been deleted'
        });
    } catch (error) {
        next(error)
    }
}

export const getcomments = async (req, res, next) => {
    if (!req.user.isAdmin) return next(createError(403, "You are not allowed to get all comments"));

    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'desc' ? -1 : 1;

        const comments = await Comment.find()
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const totalComments = await Comment.countDocuments();

        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        const lastMonthComments = await Comment.countDocuments({ createdAt: { $gte: oneMonthAgo } });

        res.status(200).json({
            comments,
            totalComments,
            lastMonthComments
        });
    } catch (error) {
        next(error)
    }
}