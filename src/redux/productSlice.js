import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
    name: 'products',
    initialState: {
        items: [],
        currentProduct: null, // Field for the current product
        loading: false,       // Loading state
    },
    reducers: {
        setProducts: (state, action) => {
            state.items = action.payload;
        },
        fetchProductById: (state, action) => {
            const productId = action.payload;
            // Find the product by ID and set it as the current product
            state.currentProduct = state.items.find(item => item.id === productId) || null;
        },
        clearCurrentProduct: (state) => {
            state.currentProduct = null; // Clear the current product
        },
        setLoading: (state, action) => {
            state.loading = action.payload; // Set loading state
        },
    },
});

export const { setProducts, fetchProductById, clearCurrentProduct, setLoading } = productSlice.actions;
export default productSlice.reducer;
