import { createSlice } from '@reduxjs/toolkit';

const shippingSlice = createSlice({
    name: 'shipping',
    initialState: {
        areas: [],
        loading: false,
        error: null,
    },
    reducers: {
        fetchShippingAreasStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchShippingAreasSuccess(state, action) {
            state.loading = false;
            state.areas = action.payload;
        },
        fetchShippingAreasFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        addShippingArea(state, action) {
            state.areas.push(action.payload);
        },
        createShippingArea(state, action) { // New reducer for creating a shipping area
            state.areas.push(action.payload);
        },
        updateShippingArea: (state, action) => {
            const index = state.areas.findIndex(area => area.id === action.payload.id);
            if (index !== -1) {
                state.areas[index] = action.payload;
            }
        },
        deleteShippingArea: (state, action) => {
            state.areas = state.areas.filter(area => area.id !== action.payload);
        },
        changeStatus: (state, action) => {
            const index = state.areas.findIndex(area => area.id === action.payload.id);
            if (index !== -1) {
                state.areas[index].active = action.payload.active;
            }
        },
    },
});

export const {
    fetchShippingAreasStart,
    fetchShippingAreasSuccess,
    fetchShippingAreasFailure,
    addShippingArea,
    createShippingArea, // Export the new action
    updateShippingArea,
    deleteShippingArea,
    changeStatus
} = shippingSlice.actions;

export default shippingSlice.reducer;
