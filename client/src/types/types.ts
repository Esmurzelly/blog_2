export interface IUser {
    _id: string;
    username: string;
    email: string;
    password: string;
    profilePicture: string;
    isAdmin?: boolean
    message?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IComment {
    _id: string;
    content: string;
    postId: string | number;
    userId: string | number;
    likes: Array<string>;
    numberOfLikes: number;
    createdAt?: Date
    updatedAt?: Date
    user?: IUser;
}

export interface IPost {
    _id?: string;
    userId: string;
    content: string;
    title: string;
    image?: string;
    category?: string;
    slug?: string;
    createdAt?: Date
    updatedAt?: Date
}

export interface RejectError {
  message: string;
}