import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk to fetch all tags
export const fetchTags = createAsyncThunk(
    'tags/fetchTags',
    async (_, { rejectWithValue }) => {
        try {
            // Use GET /api/tags endpoint
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/tags`);
            return response.data; // Expects an array of tag objects [{ _id: "...", name: "..." }]
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch tags');
        }
    }
);

export const createTag = createAsyncThunk(
    'tags/createTag',
    async (tagData, { rejectWithValue }) => { // tagData should be { name: "New Tag Name" }
        const token = localStorage.getItem('token');
        if (!token) return rejectWithValue('Authentication required');
        try {
            // Use POST /api/tags endpoint [cite: Backend API Documentation]
            const response = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/api/tags`,
                tagData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return response.data; // Return the newly created tag object { _id, name } [cite: Backend API Documentation]
        } catch (error) {
            // Handle conflict (409) or other errors [cite: Backend API Documentation]
            return rejectWithValue(error.response?.data?.message || 'Failed to create tag');
        }
    }
);


const initialState = {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

const tagsSlice = createSlice({
    name: 'tags',
    initialState,
    reducers: {
      // Add reducer to add a tag locally after successful creation via POST /api/tags if needed
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTags.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
                state.error = null;
            })
            .addCase(fetchTags.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchTags.pending, (state) => { state.status = 'loading'; })

            // ADD: createTag cases
            .addCase(createTag.pending, (state) => {
                // state.creationStatus = 'loading';
            })
            .addCase(createTag.fulfilled, (state, action) => {
                // state.creationStatus = 'succeeded';
                // Add the new tag to the items list if it's not already there
                if (!state.items.find(tag => tag._id === action.payload._id)) {
                    state.items.push(action.payload);
                }
                // state.creationError = null;
            })
            .addCase(createTag.rejected, (state, action) => {
                // state.creationStatus = 'failed';
                // state.creationError = action.payload;
                console.error("Tag creation failed:", action.payload); // Log error
            });
    },
});

export default tagsSlice.reducer;
