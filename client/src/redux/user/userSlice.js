import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
    currentUser: null,
    token: null,
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
            });

            const data = await res.json();

            if (!res.ok) {
                return rejectWithValue(data);
            }

            if (data.token) {
                window.localStorage.setItem("access_token", data.token);
            };

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
            });

            const data = await res.json();

            if (!res.ok || data.success === false) {
                return rejectWithValue(data);
            }

            if (data.token) {
                window.localStorage.setItem("access_token", data.token);
            };

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
                body: JSON.stringify({ name, email, googlePhotoUrl })
            });

            const data = await res.json();

            if (!res.ok || data.success === false) {
                return rejectWithValue(data);
            }

            if (data.token) {
                window.localStorage.setItem("access_token", data.token);
            };

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
                toast.error(data.message);
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
                method: "DELETE"
            });

            console.log('res from redux Delete', res)

            const data = await res.json();
            console.log('data from redux Delete', data)

            if (!res.ok || data.success === false) {
                return rejectWithValue(data);
            }
            
            return data; // ?
        } catch (error) {
            return rejectWithValue({ message: error.message || 'Something went wrong' })
        }
    }
);

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        // signInStart: (state) => {
        //     state.loading = true;
        //     state.status = null;
        // },
        // signInSuccess: (state, action) => {
        //     state.currentUser = action.payload;
        //     state.loading = false;
        //     state.status = null;
        // },
        // signInFailure: (state, action) => {
        //     state.loading = false;
        //     state.status = action.payload;
        // },

        // updateStart: (state) => {
        //     state.loading = true;
        //     state.status = null;
        // },
        // updateSuccess: (state, action) => {
        //     state.currentUser = action.payload;
        //     state.loading = false;
        //     state.status = null;
        // },
        // updateFailure: (state, action) => {
        //     state.loading = false;
        //     state.status = action.payload;
        // },

        // deleteUserStart: (state) => {
        //     state.loading = true;
        //     state.status = null;
        // },
        // deleteUserSuccess: (state, action) => {
        //     state.currentUser = null;
        //     state.loading = false;
        //     state.status = null;
        // },
        // deleteUserFailure: (state, action) => {
        //     state.loading = false;
        //     state.status = action.payload;
        // },

        signOutSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.status = null;
            state.token = null;
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
                state.token = action.payload.token;
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
                state.token = action.payload.token;
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
                state.token = action.payload.token;
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
    }
});

export const checkIsAuth = state => Boolean(state.user.token);

export const {
    signInStart,
    signInSuccess,
    signInFailure,
    updateStart,
    updateSuccess,
    updateFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signOutSuccess
} = userSlice.actions;

export default userSlice.reducer;