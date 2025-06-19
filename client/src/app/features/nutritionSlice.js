import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { nutritionService } from '../../api/nutritionService';

const initialState = {
  searchResults: [],
  selectedFood: null,
  nutritionData: null,
  scanResult: null,
  searchHistory: [],
  isLoading: false,
  error: null,
};

export const searchFood = createAsyncThunk(
  'nutrition/search',
  async (query, { rejectWithValue }) => {
    try {
      const response = await nutritionService.searchFood(query);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Search failed');
    }
  }
);

export const getNutritionData = createAsyncThunk(
  'nutrition/getData',
  async (foodId, { rejectWithValue }) => {
    try {
      const response = await nutritionService.getNutritionData(foodId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get nutrition data');
    }
  }
);

export const scanBarcode = createAsyncThunk(
  'nutrition/scanBarcode',
  async (barcode, { rejectWithValue }) => {
    try {
      const response = await nutritionService.scanBarcode(barcode);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Barcode scan failed');
    }
  }
);

const nutritionSlice = createSlice({
  name: 'nutrition',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    addToHistory: (state, action) => {
      const exists = state.searchHistory.find(item => item.id === action.payload.id);
      if (!exists) {
        state.searchHistory.unshift(action.payload);
        if (state.searchHistory.length > 10) {
          state.searchHistory.pop();
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchFood.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchFood.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchFood.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getNutritionData.fulfilled, (state, action) => {
        state.selectedFood = action.payload.food;
        state.nutritionData = action.payload.nutrition;
      })
      .addCase(scanBarcode.fulfilled, (state, action) => {
        state.scanResult = action.payload;
      });
  },
});

export const { clearError, clearSearchResults, addToHistory } = nutritionSlice.actions;
export default nutritionSlice.reducer;