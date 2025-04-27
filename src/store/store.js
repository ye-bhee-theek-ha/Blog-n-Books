import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import tagsReducer from './slices/tagsSlice';
import blogsReducer from './slices/blogsSlice';
import booksReducer from './slices/booksSlice';


export const store = configureStore({
    reducer: {
        auth: authReducer,
        tags: tagsReducer,
        blogs: blogsReducer,
        books: booksReducer,
    },
});