import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js"
import User from "../models/user.model.js";
import { v4 as uuidv4 } from 'uuid';
import { NextFunction, Request, Response } from 'express';
import { IPost, IUserId } from "../types.js";
import { UploadedFile } from "express-fileupload";
import { ParsedQs } from 'qs'

interface IUpdateUserParams {
    userId: string;
}

interface IUpdateUserBody {
    password?: string;
    username?: string;
    email?: string;
    profilePicture?: string;
}

interface IUploadAvatarRequest extends Request<
    {},
    any,
    any,
    ParsedQs
> {
    user: IUserId;
    files?: {
        [fieldname: string]: UploadedFile | UploadedFile[];
    };
}

interface IDeleteUserParams {
    userId: string;
}

interface IGetUsersQuery extends ParsedQs {
    startIndex?: string;
    limit?: string;
    sort?: string;
}

interface IGetUserParams {
    userId: string;
}

interface IRequestWithUserAndParams<TParams = {}, TBody = {}> extends Request<TParams, any, TBody, ParsedQs> {
    user: IUserId;
    files?: {
        [fieldname: string]: UploadedFile | UploadedFile[];
    };
}


export const updateUser = async (
    req: IRequestWithUserAndParams<IUpdateUserParams, IUpdateUserBody>,
    res: Response,
    next: NextFunction
) => {
    if (req.user.id.toString() !== req.params.userId) {
        return next(createError(403, 'You are not allowed to update this user!'));
    }

    try {
        const updateFields: Partial<IUpdateUserBody> = {};

        if (req.body.password) {
            if (req.body.password.length < 6) {
                return next(createError(400, 'Password must be at least 6 characters!'));
            }
            updateFields.password = bcrypt.hashSync(req.body.password, 10);
        }

        if (req.body.username) {
            if (req.body.username.length <= 7 || req.body.username.length >= 20) {
                return next(createError(400, 'Username must be between 7 and 20 characters!'));
            }
            if (req.body.username.includes(" ")) {
                return next(createError(400, 'Username cannot contain spaces!'));
            }
            if (req.body.username !== req.body.username.toLowerCase()) {
                return next(createError(400, 'Username must be lower case!'));
            }
            if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
                return next(createError(400, 'Username can only contain letters and numbers!'));
            }
            updateFields.username = req.body.username;
        }


        if (req.body.email) updateFields.email = req.body.email;
        if (req.body.profilePicture) updateFields.profilePicture = req.body.profilePicture;

        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            { $set: updateFields },
            { new: true }
        );

        // @ts-ignore
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error)
    }
}

export const uploadAvatar = async (
    req: IUploadAvatarRequest,
    res: Response,
    next: NextFunction
) => {
    const IMAGE_STORAGE = process.env.IMAGE_STORAGE;

    try {
        const file = req.files?.file;
        if (!file) return next(createError(400, 'No file uploaded'));

        let avatarFile: UploadedFile;

        if (Array.isArray(file)) {
            avatarFile = file[0];
        } else {
            avatarFile = file;
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const avatarName = uuidv4() + '.jpg';
        await avatarFile.mv(`${IMAGE_STORAGE}` + avatarName);

        user.profilePicture = avatarName;
        await user.save();

        // @ts-ignore
        const { password, ...rest } = user._doc;
        return res.json(rest);
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (
    req: IRequestWithUserAndParams<IDeleteUserParams>,
    res: Response,
    next: NextFunction
) => {
    if (req.user.id.toString() !== req.params.userId && !req.user.isAdmin) return next(createError(403, 'You are not allowed to delete this user'));

    console.log('req.user.id', req.user.id);
    console.log('req.params.userId', req.params.userId);

    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json({
            deletedUserId: req.params.userId,
            message: 'User has been successfuly deleted',
        });
    } catch (error) {
        next(error);
    }
};

export const signout = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        res
            .clearCookie('access_token')
            .status(200)
            .json('User has been signed out')
    } catch (error) {
        next(error)
    }
}

export const getUsers = async (req, res, next) => {
    if (!req.user.isAdmin) next(createError(403, 'You are not allowed to see all users'));

    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'asc' ? 1 : -1;

        const userList = await User.find()
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const usersWithoutPassword = userList.map((user) => {

            // @ts-ignore
            const { password, ...rest } = user._doc;
            return rest;
        })

        const totalUsers = await User.countDocuments();

        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthUsers = await User.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        });

        res.status(200).json({
            users: usersWithoutPassword,
            totalUsers,
            lastMonthUsers
        });
    } catch (error) {
        next(error)
    }
}

export const getUser = async (
    req: IRequestWithUserAndParams<IGetUserParams>,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await User.findById(req.params.userId);

        if (!user) return next(createError(404, 'User not found'));
        
        // @ts-ignore
        const { password, ...rest } = user._doc;
        res.status(200).json({
            user: rest
        });
    } catch (error) {
        next(error)
    }
}