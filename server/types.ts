import { Types } from "mongoose";

export interface IUser {
    username: string,
    email: string,
    password: string,
    profilePicture: string,
    isAdmin: boolean,
    createdAt: Date,
    updatedAt: Date,
}

export interface IComment {
    content: string,
    postId: string,
    userId: string,
    likes: Array<string>,
    numberOfLikes: number,
    createdAt?: string;
    updatedAt?: string;
    user?: IUser;
}

export interface IPost {
    userId: Types.ObjectId,
    content: string,
    title: string,
    image: string,
    category: string,
    slug: string,
}

export interface TokenPayload {
    id: string;
    isAdmin?: boolean;
}

export interface IErrorResponse {
    success: boolean;
    statusCode: number;
    message: string;
}

export interface IUserRegisterRequest {
    username: string, 
    email: string, 
    password: string
}

export interface IUserLoginRequest {
    username: string, 
    email: string, 
}

export interface IUserId {
    id: number,
    isAdmin: boolean
}