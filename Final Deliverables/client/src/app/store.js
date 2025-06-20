import { configureStore } from '@reduxjs/toolkit';
import authSlice from './features/authSlice';
import mealPlanSlice from './features/mealPlanSlice';
import nutritionSlice from './features/nutritionSlice';
import coachSlice from './features/coachSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    mealPlan: mealPlanSlice,
    nutrition: nutritionSlice,
    coach: coachSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});