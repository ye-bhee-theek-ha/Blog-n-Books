import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk to fetch initial blogs for homepage
export const fetchHomepageBlogs = createAsyncThunk(
    'blogs/fetchHomepageBlogs',
    async (_, { rejectWithValue }) => {
        try {
            // Use GET /api/blogs endpoint with pagination
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/blogs`, {
                params: { page: 1, limit: 10 } // Example: Fetch first 10 blogs
            });
            return response.data; // Expects { blogs: [], pagination: {} }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch blogs');
        }
    }
);

export const createBlog = createAsyncThunk(
    'blogs/createBlog',
    async (blogData, { rejectWithValue }) => {
        const token = localStorage.getItem('token');
        if (!token) return rejectWithValue('Authentication required');
        try {
            // Use POST /api/blogs endpoint [cite: Backend API Documentation]
            const response = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/api/blogs`,
                blogData, // Send the prepared data object
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return response.data; // Return the newly created blog object
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create blog');
        }
    }
);

export const toggleBlogLike = createAsyncThunk(
    'blogs/toggleBlogLike',
    async (blogId, { rejectWithValue }) => {
        const token = localStorage.getItem('token');
        if (!token) return rejectWithValue('Authentication required');
        try {
            // Use POST /api/blogs/:id/like endpoint [cite: Backend API Documentation]
            const response = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/api/blogs/${blogId}/like`,
                {}, // Empty body
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Return necessary data to update state
            return { blogId, ...response.data }; // e.g., { blogId, likesCount, isLiked } [cite: Backend API Documentation]
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || `Failed to toggle like for blog ${blogId}`);
        }
    }
);

const initialState = {
    homepageItems: [],
    homepagePagination: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    allItems: [],
    blogDetails: {},
    // You might add states for all blogs, single blog view, liked status map, etc.
};

const blogsSlice = createSlice({
    name: 'blogs',
    initialState,
    reducers: {
        updateBlogLikeStatus: (state, action) => {
            const { blogId, isLiked, likesCount } = action.payload;
            const updateItem = (item) => {
                if (item && item.id === blogId) {
                    item.isLiked = isLiked;
                    item.likes = likesCount;
                }
            };
            state.homepageItems.forEach(updateItem);
            state.allItems?.forEach(updateItem); // Update other lists if they exist
            if (state.blogDetails?.[blogId]) {
                state.blogDetails[blogId].isLiked = isLiked;
                state.blogDetails[blogId].likes = likesCount;
            }
       },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHomepageBlogs.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchHomepageBlogs.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.homepageItems = action.payload.blogs;
                state.homepagePagination = action.payload.pagination;
                state.error = null;
            })
            .addCase(fetchHomepageBlogs.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // ADD: createBlog cases
            .addCase(createBlog.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createBlog.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.allItems?.unshift(action.payload);
                state.error = null;
            })
            .addCase(createBlog.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // ADD: toggleBlogLike cases
            .addCase(toggleBlogLike.pending, (state, action) => {
                // Optionally track loading status per blog ID
                // state.likeStatusById = state.likeStatusById || {};
                // state.likeStatusById[action.meta.arg] = { loading: true };
            })
            .addCase(toggleBlogLike.fulfilled, (state, action) => {
                // Use the reducer to update state consistently
                blogsSlice.caseReducers.updateBlogLikeStatus(state, action);
                // Reset loading status if tracked per ID
                // state.likeStatusById[action.payload.blogId] = { loading: false };
            })
            .addCase(toggleBlogLike.rejected, (state, action) => {
                console.error("Like toggle failed:", action.payload);
                // Reset loading status and potentially store error per ID
                // state.likeStatusById = state.likeStatusById || {};
                // state.likeStatusById[action.meta.arg] = { loading: false, error: action.payload };
            });
    },
});
export const { updateBlogLikeStatus } = blogsSlice.actions; // Keep existing export
export default blogsSlice.reducer;
