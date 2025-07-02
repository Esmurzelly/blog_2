import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { createError } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { IUser, IUserLoginRequest, IUserRegisterRequest } from '../types.js';


export const signup = async (req: Request<IUserRegisterRequest>, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password || username === '' || email === '' || password === '') {
        return next(createError(400, "All field are required"))
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User<Partial<IUser>>({ username, email, password: hashedPassword });

    const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET as string,
        { expiresIn: "1d" }
    );

    try {
        await newUser.save();

        res.status(201).cookie('access_token', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            maxAge: 24 * 60 * 60 * 1000,
        }).json({
            newUser,
            message: "Registration is successful"
        });
    } catch (error) {
        next(error)
    }
}

export const signin = async (req: Request<IUserLoginRequest>, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password || email === '' || password === '') {
        return next(createError(400, "All field are required"))
    }

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) return next(createError(404, "User is not found"));

        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(createError(400, "Invalid password"));

        const token = jwt.sign(
            { id: validUser._id, isAdmin: validUser.isAdmin },
            process.env.JWT_SECRET as string,
            { expiresIn: "1d" }
        );
        
        // @ts-ignore
        const { password: pass, ...rest } = validUser._doc;

        res.status(200).cookie('access_token', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            maxAge: 24 * 60 * 60 * 1000,
        }).json(rest);
    } catch (error) {
        next(error)
    }
};

export const google = async (req, res, next) => {
    const { name, email, googlePhotoUrl } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user) {
            const token = jwt.sign(
                { id: user._id, isAdmin: user.isAdmin },
                process.env.JWT_SECRET as string
            );
            
            // @ts-ignore
            const { password, ...rest } = user._doc;

            res.status(200).cookie('access_token', token, {
                httpOnly: true,
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                maxAge: 24 * 60 * 60 * 1000,
            }).json(rest);
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

            const newUser = new User({
                username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl
            });

            await newUser.save();

            const token = jwt.sign(
                { id: newUser._id, isAdmin: newUser.isAdmin },
                process.env.JWT_SECRET as string
            );

            // @ts-ignore
            const { password, ...rest } = newUser._doc;

            res.status(200).cookie('access_token', token, {
                httpOnly: true,
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                maxAge: 24 * 60 * 60 * 1000,
            }).json(rest)
        }
    } catch (error) {
        next(error)
    }
}