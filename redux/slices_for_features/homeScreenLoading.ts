import { createSlice } from '@reduxjs/toolkit';

// Defining and initialing the global state variable for home screen loading
const initialState = {loading: false};

const homeScreenSlice = createSlice({
  name: 'home_screen', // name of the slice. Helps in debugging
  initialState,
  reducers: { // plural (reducers)
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    // Add more action reducers here if needed
  },
});

// action creators exported to use in any react component 
export const { setLoading } = homeScreenSlice.actions; // exported for react componenents

// reducer exported to use in the store
export default homeScreenSlice.reducer; // exported for store