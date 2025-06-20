import axiosInstance from './axiosConfig';

export const mealPlanService = {
  generateMealPlan: async () => {
    const response = await axiosInstance.post('/generate-meal-plan');
    return response;
  },

  getMealPlan: async () => {
    const response = await axiosInstance.get('/meal-plan');
    return response;
  },
};