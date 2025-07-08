import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { IComment } from "../../types/types";

interface CommentState {
    comments: IComment[];
    totalComments: number;
    lastMonthComments: number;
    status: string | null;
    loading: boolean;
}


interface CreateCommentArgs {
    contentComment: string;
    postId: string | number | undefined;
    currentUserId: string | number;
}
interface CreateCommentResponse {
    newComment: IComment;
    message: string;
}

interface GetCommentsResponse {
    comments: IComment[],
    totalComments: number,
    lastMonthComments: number,
}

interface GetCommentsArgs {
    startIndex: string | number;
    limit?: string | number;
}

interface GetPostCommentsResponse {
    comment: IComment;
    comments: IComment[];
}

interface EditCommentArgs {
    commentId: string | number;
    editedContent: string
}

interface UpdateLikeComment {
    comment: IComment;
    numberOfLikes: number;
    likes: Array<string>
}

interface RejectError {
  message: string;
}


const initialState: CommentState = {
    comments: [],
    totalComments: 0,
    lastMonthComments: 0,
    status: null,
    loading: false,
}

export const createComment = createAsyncThunk<CreateCommentResponse, CreateCommentArgs>(
    'comment/createComment',
    async ({ contentComment, postId, currentUserId }, { rejectWithValue }) => {
        try {
            const res = await fetch('/api/comment/create', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: contentComment,
                    postId,
                    userId: currentUserId
                })
            })

            if (!res.ok) {
                return rejectWithValue({ message: 'Something went wrong' });
            }

            const data = await res.json();

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || 'Something went wrong' })
        }
    }
);

export const getComments = createAsyncThunk<GetCommentsResponse, GetCommentsArgs>(
    'comment/getComments',
    async ({ startIndex = 0, limit = 9 }, { rejectWithValue }) => {
        try {
            const res = await fetch(`/api/comment/getcomments?startIndex=${startIndex}&limit=${limit}`);

            if (!res.ok) {
                return rejectWithValue({ message: 'Something went wrong' });
            }

            const data = await res.json();

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || 'Something went wrong' })
        }
    }
)

export const getPostComments = createAsyncThunk<GetPostCommentsResponse, { postId: string | number | undefined }>(
    'comment/getPostComments',
    async ({ postId }, { rejectWithValue }) => {
        try {
            const res = await fetch(`/api/comment/getPostComments/${postId}`);

            if (!res.ok) {
                return rejectWithValue({ message: 'Something went wrong' });
            }

            const data = await res.json();
            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || 'Something went wrong' })
        }
    }
);

export const addLikeComment = createAsyncThunk<UpdateLikeComment, { commentId: string | number }>(
    'comment/addLikeComment',
    async ({ commentId }, { rejectWithValue }) => {
        try {
            const res = await fetch(`/api/comment/likeComment/${commentId}`, {
                method: "PUT",
            });

            if (!res.ok) {
                return rejectWithValue({ message: 'Something went wrong' });
            }

            const data = await res.json();
            return data; // comment / numberOfLikes
        } catch (error: any) {
            return rejectWithValue({ message: error.message || 'Something went wrong' })
        }
    }
);

export const editComment = createAsyncThunk<IComment, EditCommentArgs>(
    'comment/editComment',
    async ({ commentId, editedContent }, { rejectWithValue }) => {
        try {
            const res = await fetch(`/api/comment/editComment/${commentId}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: editedContent
                })
            });

            if (!res.ok) {
                return rejectWithValue({ message: 'Something went wrong' });
            }

            const data = await res.json();

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || 'Something went wrong' })
        }
    }
);

export const deleteComments = createAsyncThunk<{ commentId: number | string, message: string }, { commentIdDelete: string | number | null }>(
    'comment/deleteComments',
    async ({ commentIdDelete }, { rejectWithValue }) => {
        try {
            const res = await fetch(`/api/comment/deleteComment/${commentIdDelete}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                return rejectWithValue({ message: 'Something went wrong' });
            }

            const data = await res.json();

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || 'Something went wrong' })
        }
    }

);


const commentSlice = createSlice({
    name: 'comment',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getComments.pending, (state) => {
                state.loading = true;
            })
            .addCase(getComments.fulfilled, (state, action: PayloadAction<GetCommentsResponse>) => {
                state.loading = false;

                state.comments = action.payload.comments;
                state.totalComments = action.payload.totalComments;
                state.lastMonthComments = action.payload.lastMonthComments;
            })
            .addCase(getComments.rejected, (state, action) => {
                state.loading = false;
                state.status = (action.payload as RejectError)?.message || "Something went wrong..."
            })

            .addCase(getPostComments.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPostComments.fulfilled, (state, action: PayloadAction<any>) => { // ?
                state.loading = false;
                state.comments = action.payload.comments;
            })
            .addCase(getPostComments.rejected, (state, action) => {
                state.loading = false;
                state.status = (action.payload as RejectError)?.message || "Something went wrong..."
            })

            .addCase(createComment.pending, (state) => {
                state.loading = true;
            })
            .addCase(createComment.fulfilled, (state, action: PayloadAction<CreateCommentResponse>) => { // ?
                state.loading = false;
                state.comments = [action.payload.newComment, ...state.comments];
                state.status = action.payload.message;
            })
            .addCase(createComment.rejected, (state, action) => {
                state.loading = false;
                state.status = (action.payload as RejectError)?.message || "Something went wrong..."
            })

            .addCase(editComment.pending, (state) => {
                state.loading = true;
            })
            .addCase(editComment.fulfilled, (state, action: PayloadAction<IComment>) => {
                state.loading = false;

                state.comments.filter(commentItem => commentItem._id === action.payload._id ? commentItem.content = action.payload.content : commentItem)
            })
            .addCase(editComment.rejected, (state, action) => {
                state.loading = false;
                state.status = (action.payload as RejectError)?.message || "Something went wrong..."
            })

            .addCase(addLikeComment.pending, (state) => {
                state.loading = true;
            })
            .addCase(addLikeComment.fulfilled, (state, action: PayloadAction<UpdateLikeComment>) => {
                state.loading = false;

                const updatedComment = action.payload;
                // @ts-ignore
                const commentItem = action.payload.comment;
                console.log('state.comments', state.comments);
                const index = state.comments.findIndex(c => c._id === commentItem._id);

                console.log('index', index);

                if(index !== -1) {
                    state.comments[index].numberOfLikes = updatedComment.numberOfLikes;
                    state.comments[index].likes = updatedComment.likes;
                }
            })
            .addCase(addLikeComment.rejected, (state, action) => {
                state.loading = false;
                state.status = (action.payload as RejectError)?.message || "Something went wrong..."
            })

            .addCase(deleteComments.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteComments.fulfilled, (state, action: PayloadAction<{ commentId: string | number | null }>) => {
                state.loading = false;
                const deletedCommentId = action.payload.commentId;

                if (deletedCommentId) {
                    state.comments = state.comments.filter(commentItem => commentItem._id !== deletedCommentId);
                } else {
                    console.error('No valid data received after post delete.');
                }
            })
            .addCase(deleteComments.rejected, (state, action) => {
                state.loading = false;
                state.status = (action.payload as RejectError)?.message || "Something went wrong..."
            })
    }
});

export const { } = commentSlice.actions;

export default commentSlice.reducer;