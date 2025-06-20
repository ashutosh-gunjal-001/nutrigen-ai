import axiosInstance from './axiosConfig';

export const nutritionService = {
  searchFood: async (query) => {
    const response = await axiosInstance.get(`/nutrition/search?q=${encodeURIComponent(query)}`);
    return response;
  },

  getNutritionData: async (foodId) => {
    const response = await axiosInstance.get(`/nutrition/food/${foodId}`);
    return response;
  },

  scanBarcode: async (barcode) => {
    const response = await axiosInstance.post('/nutrition/scan', { barcode });
    return response;
  },

  askCoach: async (message, context = {}) => {
    const response = await axiosInstance.post('/coach/ask', { message, context });
    return response;
  },

  analyzeFood: async (foodDescription) => {
    const response = await axiosInstance.post('/nutrition/analyze', { description: foodDescription });
    return response;
  },
};