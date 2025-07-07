import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { IPost, RejectError } from "../../types/types";



interface PostState {
    posts: IPost[],
    currentPost: IPost | null,
    totalPosts: number,
    lastMonthPosts: number,
    status: string | null,
    loading: boolean,
}

interface GetPostsResponse {
    posts: IPost[];
    totalPost: number;
    lastMonthPosts: number;
}

interface GetCurrentPostResponse {
    posts: IPost[];
}

interface GetCurrentPostArgs {
    postId: string;
}

interface UpdatePostArgs {
    form: FormData;
    formDataId: string | number;
    currentUserId: string | number;
}

interface DeletePostArgs {
    postId: string | number;
    currentUserId: string | number | null;
}

const initialState: PostState = {
    posts: [],
    currentPost: null,
    totalPosts: 0,
    lastMonthPosts: 0,
    status: null,
    loading: false,
};

export const getPosts = createAsyncThunk<GetPostsResponse, { searchQuery: string }>(
    'posts/getPosts',
    async ({ searchQuery }, { rejectWithValue }) => {
        try {
            // const res = await fetch(`/api/post/getposts?${searchQuery}&limit=${limit}&slug=${slug}`);
            const res = await fetch(`/api/post/getposts?${searchQuery}`);

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

export const getCurrentPost = createAsyncThunk<GetCurrentPostResponse, GetCurrentPostArgs>(
    'posts/getCurrentPost',
    async ({ postId }, { rejectWithValue }) => {
        try {
            const res = await fetch(`/api/post/getposts?postId=${postId}`);

            const data = await res.json();

            if (!res.ok) {
                return rejectWithValue({ message: 'Something went wrong' });
            }

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || 'Something went wrong' })
        }
    }
);

export const createPost = createAsyncThunk<IPost, { form: FormData }>(
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
                return rejectWithValue({ message: 'Something went wrong' });
            };

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || 'Something went wrong' })
        }
    }
);

export const updatePost = createAsyncThunk<IPost, UpdatePostArgs>(
    'posts/updatePost',
    async ({ form, formDataId, currentUserId }, { rejectWithValue }) => {
        try {
            const res = await fetch(`/api/post/updatepost/${formDataId}/${currentUserId}`, {
                method: "PUT",
                body: form,
            });

            const data = await res.json();

            if (!res.ok) {
                return rejectWithValue({ message: 'Something went wrong' });
            };

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || 'Something went wrong' })
        }
    }
);

export const deletePost = createAsyncThunk<{ postId: string }, DeletePostArgs>(
    'posts/deletePost',
    async ({ postId, currentUserId }, { rejectWithValue }) => {
        try {
            const res = await fetch(`/api/post/deletepost/${postId}/${currentUserId}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (!res.ok) {
                return rejectWithValue({ message: 'Something went wrong' });
            }

            return data;
        } catch (error: any) {
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
            .addCase(getPosts.fulfilled, (state, action: PayloadAction<GetPostsResponse>) => {
                state.loading = false;

                state.posts = action.payload.posts;
                state.totalPosts = action.payload.totalPost;
                state.lastMonthPosts = action.payload.lastMonthPosts;
            })
            .addCase(getPosts.rejected, (state, action) => {
                state.loading = false;
                state.status = (action.payload as RejectError)?.message || "Something went wrong..."
            })

            .addCase(getCurrentPost.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCurrentPost.fulfilled, (state, action: PayloadAction<GetCurrentPostResponse>) => {
                state.loading = false;
                state.currentPost = action.payload.posts[0];
            })
            .addCase(getCurrentPost.rejected, (state, action) => {
                state.loading = false;
                state.status = (action.payload as RejectError)?.message || "Something went wrong..."
            })

            .addCase(createPost.pending, (state) => {
                state.loading = true;
            })
            .addCase(createPost.fulfilled, (state, action: PayloadAction<IPost>) => {
                state.loading = false;
                state.posts = [...state.posts, action.payload];
            })
            .addCase(createPost.rejected, (state, action) => {
                state.loading = false;
                state.status = (action.payload as RejectError)?.message || "Something went wrong..."
            })

            .addCase(updatePost.pending, (state) => {
                state.loading = true;
            })
            .addCase(updatePost.fulfilled, (state, action: PayloadAction<IPost>) => {
                state.loading = false;
                state.currentPost = action.payload;
            })
            .addCase(updatePost.rejected, (state, action) => {
                state.loading = false;
                state.status = (action.payload as RejectError)?.message || "Something went wrong..."
            })

            .addCase(deletePost.pending, (state) => {
                state.loading = true;
            })
            .addCase(deletePost.fulfilled, (state, action: PayloadAction<{ postId: string }>) => {
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
                state.status = (action.payload as RejectError)?.message || "Something went wrong..."
            })
    }
})

// export const { } = postSlice.actions;

export default postSlice.reducer;