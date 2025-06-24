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
    async ({ searchQuery, slug }, { rejectWithValue }) => {
        try {
            // const res = await fetch(`/api/post/getposts?${searchQuery}&limit=${limit}&slug=${slug}`);
            const res = await fetch(`/api/post/getposts?${searchQuery}`);

            if (!res.ok) {
                setLoading(false);
                return;
            }

            const data = await res.json();

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

                // if(action.meta.arg.searchQuery?.includes('startIndex=0')) {
                //     state.posts = action.payload.posts;
                // } else {
                //     state.posts = [...state.posts, ...action.payload.posts]
                // }

                state.totalPosts = action.payload.totalPost;
                state.lastMonthPosts = action.payload.lastMonthPosts;
            })
            .addCase(getPosts.rejected, (state, action) => {
                state.loading = false;

                state.status = action.payload?.message || "Something went wrong..."
            })
    }
})

export const { } = postSlice.actions;

export default postSlice.reducer;