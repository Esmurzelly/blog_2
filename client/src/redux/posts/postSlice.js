import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    posts: [],
    currentPost: null,
    totalPosts: 0,
    lastMonthPosts: 0,
    status: null,
    loading: false,
};

export const getPosts = createAsyncThunk(
    'posts/getPosts',
    async ({ searchQuery }, { rejectWithValue }) => {
        try {
            // const res = await fetch(`/api/post/getposts?${searchQuery}&limit=${limit}&slug=${slug}`);
            const res = await fetch(`/api/post/getposts?${searchQuery}`);

            if (!res.ok) {
                return;
            }

            const data = await res.json();

            return data;
        } catch (error) {
            return rejectWithValue({ message: error.message || 'Something went wrong' })
        }
    }
);

export const getCurrentPost = createAsyncThunk(
    'posts/getCurrentPost',
    async ({ postSlug }, { rejectWithValue }) => {
        try {
            const res = await fetch(`/api/post/getposts?slug=${postSlug}`);

            const data = await res.json();

            if (!res.ok) {
                return;
            }

            return data;
        } catch (error) {
            return rejectWithValue({ message: error.message || 'Something went wrong' })
        }
    }
);

export const createPost = createAsyncThunk(
    'posts/createPost',
    async ({ form }, { rejectWithValue }) => {
        try {
            const res = await fetch('/api/post/create', {
                method: "POST",
                body: form,
                credentials: "include"
            });

            const data = await res.json();

            if (!res.ok) {
                return;
            };

            return data;
        } catch (error) {
            return rejectWithValue({ message: error.message || 'Something went wrong' })
        }
    }
);

export const updatePost = createAsyncThunk(
    'posts/updatePost',
    async ({ form, formDataId, currentUserId }, { rejectWithValue }) => {
        try {
            const res = await fetch(`/api/post/updatepost/${formDataId}/${currentUserId}`, {
                method: "PUT",
                body: form,
            });

            const data = await res.json();

            if (!res.ok) {
                return;
            };

            return data;
        } catch (error) {
            return rejectWithValue({ message: error.message || 'Something went wrong' })
        }
    }
);

export const deletePost = createAsyncThunk(
    'posts/deletePost',
    async ({ postId, currentUserId }, { rejectWithValue }) => {
        try {
            const res = await fetch(`/api/post/deletepost/${postId}/${currentUserId}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (!res.ok) {
                return;
            }

            return data;
        } catch (error) {
            return rejectWithValue({ message: error.message || 'Something went wrong' })
        }
    }
)

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPosts.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPosts.fulfilled, (state, action) => {
                state.loading = false;

                state.posts = action.payload.posts;
                state.totalPosts = action.payload.totalPost;
                state.lastMonthPosts = action.payload.lastMonthPosts;
            })
            .addCase(getPosts.rejected, (state, action) => {
                state.loading = false;
                state.status = action.payload?.message || "Something went wrong..."
            })

            .addCase(getCurrentPost.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCurrentPost.fulfilled, (state, action) => {
                state.loading = false;
                state.currentPost = action.payload.posts[0];
            })
            .addCase(getCurrentPost.rejected, (state, action) => {
                state.loading = false;
                state.status = action.payload?.message || "Something went wrong..."
            })

            .addCase(createPost.pending, (state) => {
                state.loading = true;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = [...state.posts, action.payload];
            })
            .addCase(createPost.rejected, (state, action) => {
                state.loading = false;
                state.status = action.payload?.message || "Something went wrong..."
            })

            .addCase(updatePost.pending, (state) => {
                state.loading = true;
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                state.loading = false;
                state.currentPost = action.payload;
            })
            .addCase(updatePost.rejected, (state, action) => {
                state.loading = false;
                state.status = action.payload?.message || "Something went wrong..."
            })

            .addCase(deletePost.pending, (state) => {
                state.loading = true;
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.loading = false;

                const deletedPostId = action.payload.postId;

                if (deletedPostId) {
                    state.posts = state.posts.filter(post => post._id !== deletedPostId)
                } else {
                    console.error('No valid data received after post delete.');
                }
            })
            .addCase(deletePost.rejected, (state, action) => {
                state.loading = false;
                state.status = action.payload?.message || "Something went wrong..."
            })
    }
})

export const { } = postSlice.actions;

export default postSlice.reducer;