import { createSlice } from '@reduxjs/toolkit';

const reviewSlice = createSlice({
    name: 'reviewsadmin',
    initialState: { items: [] },
    reducers: {
        setReviews: (state, action) => {
            state.items = action.payload;
        },
        addReview: (state, action) => {
            state.items.push(action.payload);
        },
        deleteReview: (state, action) => {
            state.items = state.items.filter(review => review.id !== action.payload);
        },
        updateReview: (state, action) => {
            const index = state.items.findIndex(review => review.id === action.payload.id);
            if (index !== -1) {
                // Merge the existing review with the new data
                state.items[index] = { 
                    ...state.items[index], 
                    ...action.payload.data 
                };
            }
        },
        featureReview: (state, action) => {
            const index = state.items.findIndex(review => review.id === action.payload.id);
            if (index !== -1) {
                // Mark the review as featured
                state.items[index].is_featured = true; // or whatever property you want to use for featured
            }
        },
    },
});

export const { setReviews, addReview, deleteReview, updateReview, featureReview } = reviewSlice.actions;
export default reviewSlice.reducer;
