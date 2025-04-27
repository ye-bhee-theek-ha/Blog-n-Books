import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUserProfile = createAsyncThunk(
    'auth/fetchUserProfile',
    async (_, { rejectWithValue }) => {
        const token = localStorage.getItem('token');
        if (!token) {
            return rejectWithValue('No token found');
        }
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/users/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return { user: response.data.user, token };
        } catch (error) {
            localStorage.removeItem('token');
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/users/login`, credentials);
            const { token, ...user } = response.data;
            localStorage.setItem('token', token);
            return { user, token };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

// ADDED: Thunk for user registration
export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData, { rejectWithValue }) => {
        try {
            // Use POST /api/users/register endpoint
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/users/register`, userData);
            const { token, ...user } = response.data; // API returns user object and token
            localStorage.setItem('token', token); // Store token
            return { user, token };
        } catch (error) {
            // Handle potential errors like user already exists (400) or validation errors (400)
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    }
);

export const toggleUserRole = createAsyncThunk(
    'auth/toggleUserRole',
    async (_, { rejectWithValue, getState }) => {
        const token = getState().auth.token; // Get token from current state
        if (!token) return rejectWithValue('Authentication required');
        try {
            // Use POST /api/users/toggleRole endpoint [cite: src/screens/Profile/Profile.jsx]
            const response = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/api/users/toggleRole`,
                {}, // Empty body
                { headers: { Authorization: `Bearer ${token}` } }
            );
             // API likely returns the new role string or the updated user object
             // Assuming it returns the new role string directly based on Profile.jsx logic attempt
            return response.data; // Expecting the new role string e.g., "author" or "user"
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to toggle role');
        }
    }
);


const initialState = {
    user: null,
    token: localStorage.getItem('token') || null,
    isLoggedIn: !!localStorage.getItem('token'),
    role: null,
    status: 'idle',
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('token');
            state.user = null;
            state.token = null;
            state.isLoggedIn = false;
            state.role = null;
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch User Profile Cases
            .addCase(fetchUserProfile.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isLoggedIn = true;
                state.role = action.payload.user.role;
                state.error = null;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
                state.user = null;
                state.token = null;
                state.isLoggedIn = false;
                state.role = null;
            })
            // Login User Cases
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isLoggedIn = true;
                state.role = action.payload.user.role;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
                state.user = null;
                state.token = null;
                state.isLoggedIn = false;
                state.role = null;
            })
            // ADDED: Register User Cases
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isLoggedIn = true;
                state.role = action.payload.user.role; // Default role is 'user'
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
                state.user = null;
                state.token = null;
                state.isLoggedIn = false;
                state.role = null;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;