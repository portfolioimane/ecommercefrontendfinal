import { createSlice } from '@reduxjs/toolkit';

const reviewsSlice = createSlice({
    name: 'reviews',
    initialState: {
        productReviews: [], // Array to hold reviews
    },
    reducers: {
        setReviews: (state, action) => {
            state.productReviews = action.payload; // Corrected to reference productReviews
        },
        // Action to add a new review
        addReview: (state, action) => {
            state.productReviews.push(action.payload);
        },
        // Action to clear all reviews
        clearReviews: (state) => {
            state.productReviews = [];
        },
    },
});

// Export actions
export const { addReview, clearReviews, setReviews } = reviewsSlice.actions;

// Export reducer
export default reviewsSlice.reducer;
