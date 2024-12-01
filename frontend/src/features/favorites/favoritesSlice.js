import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for favorites operations
export const addToFavorites = createAsyncThunk(
  'favorites/addToFavorites',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/favorites/add-favorite', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId })
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromFavorites = createAsyncThunk(
  'favorites/removeFromFavorites',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/favorites/remove-favorite/${postId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/favorites/get-favorites', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    items: [],
    loading: false,
    error: null,
    message: null,
    count: 0
  },
  reducers: {
    clearMessage: (state) => {
      state.message = null;
    }
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
  }
});

export const { clearMessage } = favoritesSlice.actions;
export default favoritesSlice.reducer;