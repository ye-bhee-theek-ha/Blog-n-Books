import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// --- Async Thunks ---
export const fetchHomepageBooks = createAsyncThunk(
    'books/fetchHomepageBooks',
    async (_, { rejectWithValue }) => {
        try {
            // Use GET /api/books/homepage endpoint [cite: Backend API Documentation]
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/booksHomePage`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch homepage books');
        }
    }
);

// ADDED: Thunk to create/upload a book
export const createBook = createAsyncThunk(
    'books/createBook',
    async (formData, { rejectWithValue, getState }) => { // Receive FormData
        const token = getState().auth.token; // Get token from auth state
        if (!token) return rejectWithValue('Authentication required');
        try {
            // Use POST /api/books endpoint with multipart/form-data [cite: Backend API Documentation]
            const response = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/api/books`,
                formData, // Send FormData directly
                {
                    headers: {
                        // Axios sets Content-Type automatically for FormData
                        Authorization: `Bearer ${token}`
                    },
                }
            );
            return response.data; // Return the newly created book object
        } catch (error) {
            console.error("Book upload error:", error.response?.data); // Log detailed error
            return rejectWithValue(error.response?.data?.message || 'Failed to upload book');
        }
    }
);

// ADDED: Thunk to toggle like status for a book
export const toggleBookLike = createAsyncThunk(
    'books/toggleBookLike',
    async (bookId, { rejectWithValue, getState }) => {
        const token = getState().auth.token;
        if (!token) return rejectWithValue('Authentication required');
        try {
            // Use POST /api/books/:id/like endpoint [cite: Backend API Documentation]
            const response = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/api/books/${bookId}/like`,
                {}, // Empty body
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Return necessary data to update state
            return { bookId, ...response.data }; // e.g., { bookId, likesCount, isLiked } [cite: Backend API Documentation]
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || `Failed to toggle like for book ${bookId}`);
        }
    }
);


// --- Slice Definition ---
const initialState = {
    homepageItems: [],
    allItems: [], // For full library view
    bookDetails: {}, // For single book view caching
    status: 'idle', // General status for list fetching
    error: null,
    // Status tracking for specific operations
    creationStatus: 'idle',
    creationError: null,
    // likeStatusById: {}, // Optional: Track like status per book
};

const booksSlice = createSlice({
    name: 'books',
    initialState,
    reducers: {
        // Reducer to update like status consistently across different lists
        updateBookLikeStatus: (state, action) => {
             const { bookId, isLiked, likesCount } = action.payload;
             const updateItem = (item) => {
                 // Ensure item exists and has an id or _id property
                 if (item && (item.id === bookId || item._id === bookId)) {
                     item.isLiked = isLiked;
                     // Ensure the likes property exists before updating
                     // API for GET /books returns likesCount, POST returns likesCount
                     item.likes = likesCount;
                     item.likesCount = likesCount; // Update both if unsure which is used
                 }
             };
             state.homepageItems.forEach(updateItem);
             state.allItems?.forEach(updateItem);
             if (state.bookDetails?.[bookId]) {
                 state.bookDetails[bookId].isLiked = isLiked;
                 state.bookDetails[bookId].likes = likesCount;
                 state.bookDetails[bookId].likesCount = likesCount;
             }
        },
        // Reducer to clear creation status (optional, e.g., after showing message)
        resetCreationStatus: (state) => {
            state.creationStatus = 'idle';
            state.creationError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // --- Fetch Homepage Books ---
            .addCase(fetchHomepageBooks.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchHomepageBooks.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.homepageItems = action.payload;
                state.error = null;
            })
            .addCase(fetchHomepageBooks.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // --- Create Book ---
            .addCase(createBook.pending, (state) => {
                state.creationStatus = 'loading';
                state.creationError = null; // Clear previous errors
            })
            .addCase(createBook.fulfilled, (state, action) => {
                state.creationStatus = 'succeeded';
                // Optionally add the new book to the 'allItems' list if needed
                // state.allItems?.unshift(action.payload);
            })
            .addCase(createBook.rejected, (state, action) => {
                state.creationStatus = 'failed';
                state.creationError = action.payload;
            })
            // --- Toggle Book Like ---
            .addCase(toggleBookLike.pending, (state, action) => {
                // Optional: state.likeStatusById[action.meta.arg] = { loading: true };
            })
            .addCase(toggleBookLike.fulfilled, (state, action) => {
                // Use the reducer to update state
                booksSlice.caseReducers.updateBookLikeStatus(state, action);
                // Optional: state.likeStatusById[action.payload.bookId] = { loading: false };
            })
            .addCase(toggleBookLike.rejected, (state, action) => {
                console.error("Book like toggle failed:", action.payload);
                // Optional: state.likeStatusById[action.meta.arg] = { loading: false, error: action.payload };
            });
            // TODO: Add cases for fetching all books, single book details etc.
    },
});

// Export actions and reducer
export const { updateBookLikeStatus, resetCreationStatus } = booksSlice.actions;
export default booksSlice.reducer;

