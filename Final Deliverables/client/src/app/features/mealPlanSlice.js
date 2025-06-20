import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mealPlanService } from '../../api/mealPlanService';

const initialState = {
  currentPlan: null,
  generatedPlans: [],
  groceryList: [],
  isLoading: false,
  error: null,
};

export const generateMealPlan = createAsyncThunk(
  'mealPlan/generate',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await mealPlanService.generatePlan(formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate meal plan');
    }
  }
);

export const saveMealPlan = createAsyncThunk(
  'mealPlan/save',
  async (planData, { rejectWithValue }) => {
    try {
      const response = await mealPlanService.savePlan(planData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to save meal plan');
    }
  }
);

const mealPlanSlice = createSlice({
  name: 'mealPlan',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateGroceryList: (state, action) => {
      state.groceryList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateMealPlan.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateMealPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPlan = action.payload.plan;
        state.groceryList = action.payload.groceryList;
      })
      .addCase(generateMealPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(saveMealPlan.fulfilled, (state, action) => {
        state.generatedPlans.push(action.payload);
      });
  },
});

export const { clearError, updateGroceryList } = mealPlanSlice.actions;
export default mealPlanSlice.reducer;