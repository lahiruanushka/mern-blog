import { createSlice } from "@reduxjs/toolkit";
import { REHYDRATE } from 'redux-persist';

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
  _persistRehydrated: false, // Add this flag to track rehydration
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    deleteUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signoutSuccess: (state) => {
      state.currentUser = null;
      state.error = null;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  // Add extra reducers to handle rehydration
  extraReducers: (builder) => {
    builder.addCase(REHYDRATE, (state, action) => {
      // Only update state if we have persisted user data
      if (action.payload?.user) {
        return {
          ...state,
          ...action.payload.user,
          _persistRehydrated: true,
          loading: false,
        };
      }
      // If no user data in persisted state, just mark as rehydrated
      return {
        ...state,
        _persistRehydrated: true,
        loading: false,
      };
    });
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
  clearError,
} = userSlice.actions;

export default userSlice.reducer;
