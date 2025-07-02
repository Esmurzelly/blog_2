import { Request, Response, NextFunction } from "express";
import { IErrorResponse } from "../types.js";

export const errorHandler = (err: any, req: Request, res: Response<IErrorResponse>, next: NextFunction): void => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    })
}