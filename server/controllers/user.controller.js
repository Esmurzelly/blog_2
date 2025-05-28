import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js"
import User from "../models/user.model.js";
import { v4 as uuidv4 } from 'uuid';


export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return next(createError(403, 'You are not allowed to update this user!'));
    }

    try {
        const updateFields = {};

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

        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error)
    }
}

export const uploadAvatar = async (req, res, next) => {
    const IMAGE_STORAGE = process.env.IMAGE_STORAGE;

    try {
        const file = req.files.file;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const avatarName = uuidv4() + '.jpg';
        file.mv(`${IMAGE_STORAGE}` + avatarName);
        user.profilePicture = avatarName;

        await user.save();
        const { password, ...rest } = user._doc;
        return res.json(rest);
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.userId) return next(createError(403, 'You are not allowed to delete this user'));

    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json('User has been successfuly deleted');
    } catch (error) {
        next(error);
    }
};

export const signout = async (req, res, next) => {
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