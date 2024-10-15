import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // Initialize with an empty array
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      // Check if the item is already in the wishlist before adding
      const exists = state.items.some(item => item.product_id === action.payload.product_id);
      if (!exists) {
        state.items.push(action.payload); // Add new item to the wishlist
      }
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter(item => item.product_id !== action.payload); // Remove item by product_id
    },
    clearWishlist: (state) => {
      state.items = []; // Clear all wishlist items
    },
    setWishlist: (state, action) => {
      state.items = action.payload; // Set the entire wishlist
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist, setWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
