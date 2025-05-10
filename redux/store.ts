import { configureStore } from '@reduxjs/toolkit';
import homeScreenReducer from './slices_for_features/homeScreenLoading';

const store = configureStore({
    reducer: { // singular (reducer) because it is now one combines reducer
        home_screen: homeScreenReducer, // name of the slice
    },
    devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools in development mode
})

export default store;