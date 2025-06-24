import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    status: null,
    loading: false,
};

export const registerUser = createAsyncThunk(
    'user/registerUser',
    async ({ username, email, password }, { rejectWithValue }) => {
        try {
            const res = await fetch('/api/auth/signup', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
                credentials: 'include',
            });

            const data = await res.json();

            if (!res.ok) {
                return rejectWithValue(data);
            }

            return data
        } catch (error) {
            return rejectWithValue({ message: error.message || 'Something went wrong' })
        }
    }
);

export const signInUser = createAsyncThunk(
    'user/signInUser',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const res = await fetch('/api/auth/signin', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });

            const data = await res.json();

            console.log('data overall', data);

            if (!res.ok || data.success === false) {
                return rejectWithValue(data);
            }

            return data;
        } catch (error) {
            return rejectWithValue({ message: error.message || 'Something went wrong' })
        }
    }
)

export const signInGoogle = createAsyncThunk(
    'user/signInGoogle',
    async ({ name, email, googlePhotoUrl }, { rejectWithValue }) => {
        try {
            const res = await fetch('/api/auth/google', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, googlePhotoUrl }),
                credentials: 'include',
            });

            const data = await res.json();

            if (!res.ok || data.success === false) {
                return rejectWithValue(data);
            }

            return data;
        } catch (error) {
            return rejectWithValue({ message: error.message || 'Something went wrong' })
        }
    }
);

export const updateUser = createAsyncThunk(
    'user/updateUser',
    async ({ formData, currentUserId }, { rejectWithValue }) => {
        try {
            const res = await fetch(`/api/user/update/${currentUserId}`, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok || data.success === false) {
                return rejectWithValue(data);
            }
            return data;
        } catch (error) {
            return rejectWithValue({ message: error.message || 'Something went wrong' })
        }
    }
);

export const updateUserPhoto = createAsyncThunk(
    'user/updateUserPhoto',
    async ({ imageFormData }, { rejectWithValue }) => {
        try {
            const res = await fetch(`/api/user/avatar`, {
                method: "POST",
                body: imageFormData
            });

            const data = await res.json();

            if (!res.ok || data.success === false) {
                return rejectWithValue(data);
            }

            return data;
        } catch (error) {
            return rejectWithValue({ message: error.message || 'Something went wrong' })
        }
    }
);

export const deleteUser = createAsyncThunk(
    'user/deleteUser',
    async ({ currentUserId }, { rejectWithValue }) => {
        try {
            const res = await fetch(`/api/user/delete/${currentUserId}`, {
                method: "DELETE",
                credentials: 'include',
            });

            const data = await res.json();

            if (!res.ok || data.success === false) {
                return rejectWithValue(data);
            }

            return data; // ?
        } catch (error) {
            return rejectWithValue({ message: error.message || 'Something went wrong' })
        }
    }
);

export const signOutUser = createAsyncThunk(
    'user/signOutUser',
    async (_, { rejectWithValue }) => {
        try {
            const res = await fetch('api/user/signout', {
                method: "POST",
                credentials: 'include',
            });
            console.log('res from redux signOut', res)

            const data = res.json();
            console.log('data from redux signOut', data)

            if (!res.ok) {
                console.log(data.message);
            }

            return data;
        } catch (error) {
            return rejectWithValue({ message: error.message || 'Something went wrong' })
        }
    }
);

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signOutSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.status = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;

                state.currentUser = action.payload.newUser;
                state.status = action.payload?.message;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.status = action.payload?.message
            })

            .addCase(signInUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(signInUser.fulfilled, (state, action) => {
                state.loading = false;

                state.currentUser = action.payload;
                state.status = action.payload?.message;
            })
            .addCase(signInUser.rejected, (state, action) => {
                state.loading = false;
                state.status = action.payload?.message || "Sign in failed";
            })

            .addCase(signInGoogle.pending, (state) => {
                state.loading = true;
            })
            .addCase(signInGoogle.fulfilled, (state, action) => {
                state.loading = false;
                state.currentUser = action.payload;
                state.status = action.payload?.message || "Signed in successfully";
            })
            .addCase(signInGoogle.rejected, (state, action) => {
                state.loading = false;
                state.status = action.payload?.message || "Sign in failed";
            })

            .addCase(updateUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                state.currentUser = action.payload;
                state.status = action.payload?.message || "Update is successful";
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.status = action.payload?.message || "Something went wrong";
            })

            .addCase(updateUserPhoto.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateUserPhoto.fulfilled, (state, action) => {
                state.loading = false;
                state.currentUser = action.payload;
                state.status = action.payload?.message || "User's photo is updated successfuly";
            })
            .addCase(updateUserPhoto.rejected, (state, action) => {
                state.loading = false;
                state.status = action.payload?.message || "Something went wrong";
            })

            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.currentUser = null;
                state.status = action.payload?.message || "User's photo is updated successfuly";
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.status = action.payload?.message || "Something went wrong";
            })
            
            .addCase(signOutUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(signOutUser.fulfilled, (state, action) => {
                state.loading = false;
                state.currentUser = null;
                state.status = action.payload?.message || "User's photo is updated successfuly";
            })
            .addCase(signOutUser.rejected, (state, action) => {
                state.loading = false;
                state.status = action.payload?.message || "Something went wrong";
            })
    }
});

export const checkIsAuth = state => Boolean(state.user.currentUser);

export const { signOutSuccess } = userSlice.actions;

export default userSlice.reducer;