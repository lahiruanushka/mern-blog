import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import favoriteService from "../../services/favoriteService";

// Async thunks for favorites operations
export const addToFavorites = createAsyncThunk(
  "favorites/addToFavorites",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await favoriteService.addToFavorites(postId);

      if (!response.success) {
        return rejectWithValue(
          response.message || "Failed to add to favorites"
        );
      }

      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromFavorites = createAsyncThunk(
  "favorites/removeFromFavorites",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await favoriteService.removeFromFavorites(postId);

      if (!response.success) {
        return rejectWithValue(
          response.message || "Failed to remove from favorites"
        );
      }

      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchFavorites = createAsyncThunk(
  "favorites/fetchFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const response = await favoriteService.getFavorites();

      if (!response.success) {
        return rejectWithValue(response.message || "Failed to fetch favorites");
      }

      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    items: [],
    loading: false,
    error: null,
    message: null,
    count: 0,
  },
  reducers: {
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add to Favorites
      .addCase(addToFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(addToFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.favorites;
        state.message = action.payload.message;
        state.count = action.payload.favorites.length;
        state.error = null;
      })
      .addCase(addToFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = null;
      })

      // Remove from Favorites
      .addCase(removeFromFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.favorites;
        state.message = action.payload.message;
        state.count = action.payload.favorites.length;
        state.error = null;
      })
      .addCase(removeFromFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = null;
      })

      // Fetch Favorites
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.favorites;
        state.message = action.payload.message;
        state.count = action.payload.count;
        state.error = null;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = null;
      });
  },
});

export const { clearMessage } = favoritesSlice.actions;
export default favoritesSlice.reducer;
