import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { IUser, RejectError } from "../../types/types";
import { RootState } from "../store";

interface UserState {
    currentUser: IUser | null,
    users: IUser[] | null,
    totalUsers: number,
    lastMonthUsers: number,
    status: string | null | undefined,
    loading: boolean,
}

interface CreateUserArgs {
    username: string;
    email: string;
    password: string;
}

interface SignInUserArgs {
    email: string;
    password: string;
}

interface SignInGoogleArgs {
    name: string;
    email: string;
    googlePhotoUrl: string;
}

interface GetUsersArgs {
    startIndex: number | undefined;
    limit?: number | undefined;
}

interface UpdateUserArgs {
    formData: Record<string, any>,
    currentUserId: string | number;
}

interface RegisterUserResponse {
    newUser: IUser;
    message: string | null
}

interface GetUserResponse {
    user: IUser
}

interface GetUsersResponse {
    users: IUser[] | null,
    totalUsers: number,
    lastMonthUsers: number,
}

interface UpdateUserResponse {
    currentUser: IUser;
    message?: string
    error?: string
}


const initialState: UserState = {
    currentUser: null,
    users: [],
    totalUsers: 0,
    lastMonthUsers: 0,
    status: null,
    loading: false,
};

export const registerUser = createAsyncThunk<RegisterUserResponse, CreateUserArgs>(
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
        } catch (error: any) {
            return rejectWithValue({ message: error.message || 'Something went wrong' })
        }
    }
);

export const signInUser = createAsyncThunk<IUser, SignInUserArgs>(
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

            if (!res.ok || data.success === false) {
                return rejectWithValue(data);
            }

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || 'Something went wrong' })
        }
    }
)

export const signInGoogle = createAsyncThunk<IUser, SignInGoogleArgs>(
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
        } catch (error: any) {
            return rejectWithValue({ message: error.message || 'Something went wrong' })
        }
    }
);

export const getUser = createAsyncThunk<GetUserResponse, { commentUserId: string | number }>(
    'user/getUser',
    async ({ commentUserId }, { rejectWithValue }) => {
        try {
            const res = await fetch(`/api/user/getuser/${commentUserId}`);

            if (!res.ok) {
                return rejectWithValue(res.status);
            }

            const data = await res.json();

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || 'Something went wrong' })

        }
    }
);

export const getUsers = createAsyncThunk<GetUsersResponse, GetUsersArgs>(
    'user/getUsers',
    async ({ startIndex = 0, limit = 9 }, { rejectWithValue }) => {
        try {
            const res = await fetch(`/api/user/getusers?startIndex=${startIndex}&limit=${limit}`);

            if (!res.ok) {
                return rejectWithValue(res.status);
            }

            const data = await res.json();

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || 'Something went wrong' })
        }
    }
)

export const updateUser = createAsyncThunk<UpdateUserResponse, UpdateUserArgs>(
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
        } catch (error: any) {
            return rejectWithValue({ message: error.message || 'Something went wrong' })
        }
    }
);

export const updateUserPhoto = createAsyncThunk<IUser, { imageFormData: FormData }>(
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
        } catch (error: any) {
            return rejectWithValue({ message: error.message || 'Something went wrong' })
        }
    }
);

export const deleteUser = createAsyncThunk<{ deletedUserId: string | number, message: string }, { currentUserId: string | number }>(
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

            return data;
        } catch (error: any) {
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

            const data = res.json();

            if (!res.ok) {
                return rejectWithValue(data);
            }

            return data;
        } catch (error: any) {
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
            .addCase(registerUser.fulfilled, (state, action: PayloadAction<RegisterUserResponse>) => {
                state.loading = false;

                state.currentUser = action.payload.newUser;
                state.status = action.payload?.message;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.status = (action.payload as RejectError)?.message || "Something went wrong..."
            })

            .addCase(signInUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(signInUser.fulfilled, (state, action: PayloadAction<IUser>) => {
                state.loading = false;

                state.currentUser = action.payload;
                state.status = action.payload?.message;
            })
            .addCase(signInUser.rejected, (state, action) => {
                state.loading = false;
                state.status = (action.payload as RejectError)?.message || "Something went wrong..."
            })

            .addCase(signInGoogle.pending, (state) => {
                state.loading = true;
            })
            .addCase(signInGoogle.fulfilled, (state, action: PayloadAction<IUser>) => {
                state.loading = false;
                state.currentUser = action.payload;
                state.status = action.payload?.message || "Signed in successfully";
            })
            .addCase(signInGoogle.rejected, (state, action) => {
                state.loading = false;
                state.status = (action.payload as RejectError)?.message || "Something went wrong..."
            })

            .addCase(getUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(getUser.fulfilled, (state, action: PayloadAction<GetUserResponse>) => {
                state.loading = false;
                state.currentUser = action.payload.user;
            })
            .addCase(getUser.rejected, (state, action) => {
                state.loading = false;
                state.status = (action.payload as RejectError)?.message || "Something went wrong..."
            })

            .addCase(getUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(getUsers.fulfilled, (state, action: PayloadAction<GetUsersResponse>) => {
                state.loading = false;

                state.users = action.payload.users;
                state.totalUsers = action.payload.totalUsers;
                state.lastMonthUsers = action.payload.lastMonthUsers;
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.loading = false;
                state.status = (action.payload as RejectError)?.message || "Something went wrong..."
            })

            .addCase(updateUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateUser.fulfilled, (state, action: PayloadAction<UpdateUserResponse>) => {
                state.loading = false;

                state.currentUser = action.payload.currentUser;
                state.status = action.payload?.message || "Update is successful";
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.status = (action.payload as RejectError)?.message || "Something went wrong..."
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
                state.status = (action.payload as RejectError)?.message || "Something went wrong..."
            })

            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteUser.fulfilled, (state, action: PayloadAction<{ deletedUserId: string | number, message: string | null | undefined }>) => {
                state.loading = false;

                const deletedUserId = action.payload.deletedUserId;

                if (state.currentUser?._id === deletedUserId) {
                    state.currentUser = null;
                } else {
                    if (state.users) {
                        state.users = state.users.filter(user => user._id !== deletedUserId);
                    }
                }
                state.status = action.payload?.message || "User is deleted successfuly";
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.status = (action.payload as RejectError)?.message || "Something went wrong..."
            })

            .addCase(signOutUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(signOutUser.fulfilled, (state, action) => {
                state.loading = false;
                state.currentUser = null;
                state.status = action.payload?.message || "You signed out successfuly";
            })
            .addCase(signOutUser.rejected, (state, action) => {
                state.loading = false;
                state.status = (action.payload as RejectError)?.message || "Something went wrong..."
            })
    }
});

export const checkIsAuth = (state: RootState) => Boolean(state.user.currentUser);

export const { signOutSuccess } = userSlice.actions;

export default userSlice.reducer;