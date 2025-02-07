import { configureStore } from "@reduxjs/toolkit";
import conferenceReducer from "./slices/conferenceSlice";

// The store configuration remains the same as in JavaScript.
export const store = configureStore({
  reducer: {
    conference: conferenceReducer,
  },
});

// Define RootState type to use in selectors
export type RootState = ReturnType<typeof store.getState>;

// Define AppDispatch type to use in dispatch
export type AppDispatch = typeof store.dispatch;
