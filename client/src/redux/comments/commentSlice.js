import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    comments: [],
    // currentComment: null,
    totalComments: 0,
    lastMonthComments: 0,
    status: null,
    loading: false,
}

export const createComment = createAsyncThunk(
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
                return rejectWithValue(response.status);
            }

            const data = await res.json();

            return data;
        } catch (error) {
            return rejectWithValue({ message: error.message || 'Something went wrong' })
        }
    }
);

export const getComments = createAsyncThunk(
    'comment/getComments',
    async ({ startIndex = 0, limit = 9 }, { rejectWithValue }) => {
        try {
            const res = await fetch(`/api/comment/getcomments?startIndex=${startIndex}&limit=${limit}`);

            if (!res.ok) {
                return rejectWithValue(response.status);
            }

            const data = await res.json();

            return data;
        } catch (error) {
            return rejectWithValue({ message: error.message || 'Something went wrong' })
        }
    }
)

export const getPostComments = createAsyncThunk(
    'comment/getPostComments',
    async ({ postId }, { rejectWithValue }) => {
        try {
            const res = await fetch(`/api/comment/getPostComments/${postId}`);

            if (!res.ok) {
                return rejectWithValue(response.status);
            }

            const data = await res.json();
            return data;
        } catch (error) {
            return rejectWithValue({ message: error.message || 'Something went wrong' })
        }
    }
);

export const addLikeComment = createAsyncThunk(
    'comment/addLikeComment',
    async ({ commentId }, { rejectWithValue }) => {
        try {
            const res = await fetch(`/api/comment/likeComment/${commentId}`, {
                method: "PUT",
            });

            if (!res.ok) {
                return rejectWithValue(response.status);
            }

            const data = await res.json();
            return data; // comment / numberOfLikes
        } catch (error) {
            return rejectWithValue({ message: error.message || 'Something went wrong' })
        }
    }
);

export const editComment = createAsyncThunk(
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
                return rejectWithValue(response.status);
            }

            const data = await res.json();

            return data;
        } catch (error) {
            return rejectWithValue({ message: error.message || 'Something went wrong' })
        }
    }
);

export const deleteComments = createAsyncThunk(
    'comment/deleteComments',
    async ({ commentIdDelete }, { rejectWithValue }) => {
        try {
            const res = await fetch(`/api/comment/deleteComment/${commentIdDelete}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                return rejectWithValue(response.status);
            }

            const data = await res.json();

            return data;
        } catch (error) {
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
            .addCase(getComments.fulfilled, (state, action) => {
                state.loading = false;

                state.comments = action.payload.comments;
                state.totalComments = action.payload.totalComments;
                state.lastMonthComments = action.payload.lastMonthComments;
            })
            .addCase(getComments.rejected, (state, action) => {
                state.loading = false;
                state.status = action.payload?.message || "Something went wrong..."
            })

            .addCase(getPostComments.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPostComments.fulfilled, (state, action) => {
                state.loading = false;
                state.comments = action.payload.comments;
            })
            .addCase(getPostComments.rejected, (state, action) => {
                state.loading = false;
                state.status = action.payload?.message || "Something went wrong..."
            })

            .addCase(createComment.pending, (state) => {
                state.loading = true;
            })
            .addCase(createComment.fulfilled, (state, action) => {
                state.loading = false;
                state.comments = [action.payload.newComment, ...state.comments];
                state.status = action.payload.message;
            })
            .addCase(createComment.rejected, (state, action) => {
                state.loading = false;
                state.status = action.payload?.message || "Something went wrong..."
            })

            .addCase(editComment.pending, (state) => {
                state.loading = true;
            })
            .addCase(editComment.fulfilled, (state, action) => {
                state.loading = false;
                
                state.comments.filter(commentItem => commentItem._id === action.payload._id ? commentItem.content = action.payload.content : commentItem) // ?
            })
            .addCase(editComment.rejected, (state, action) => {
                state.loading = false;
                state.status = action.payload?.message || "Something went wrong..."
            })

            .addCase(addLikeComment.pending, (state) => {
                state.loading = true;
            })
            .addCase(addLikeComment.fulfilled, (state, action) => {
                state.loading = false;

                const updatedComment = action.payload.comment;
                state.comments = state.comments.map(commentItem =>
                    commentItem._id === updatedComment._id
                        ? { ...commentItem, numberOfLikes: action.payload.numberOfLikes, likes: updatedComment.likes }
                        : commentItem
                );
            })
            .addCase(addLikeComment.rejected, (state, action) => {
                state.loading = false;
                state.status = action.payload?.message || "Something went wrong..."
            })

            .addCase(deleteComments.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteComments.fulfilled, (state, action) => {
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
                state.status = action.payload?.message || "Something went wrong..."
            })
    }
});

export const { } = commentSlice.actions;

export default commentSlice.reducer;