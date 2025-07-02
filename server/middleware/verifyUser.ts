import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { createError } from '../utils/error.js';
import { TokenPayload } from '../types.js';

interface AuthenticatedRequest extends Request {
    user?: TokenPayload;
}

export const verifyUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.access_token;

    if (!token) return next(createError(401, "Unauthorized"));

    jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
        if (err) return next(createError(401, "Unauthorized"));
        req.user = user as TokenPayload;
        next();
    });
};