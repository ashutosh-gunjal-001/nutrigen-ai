import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  IoSearchOutline,
  IoChevronBackOutline,
  IoNutritionOutline,
} from 'react-icons/io5';
const searchFoodAPI = async (query) => {
  const response = await fetch(`https://nutri-gen-3.onrender.com/api/nutrition/search?q=${query}`);
  if (!response.ok) {
    throw new Error('Failed to fetch search results.');
  }
  return response.json();
};

const getNutritionDataAPI = async (fdcId) => {
  const response = await fetch(`https://nutri-gen-3.onrender.com/api/nutrition/food/${fdcId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch nutrition data.');
  }
  return response.json();
};

import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import NutritionPieChart from '../components/ui/NutritionPieChart';

const InsightsPage = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [nutritionData, setNutritionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    if (nutritionData) {
      document.getElementById('details-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [nutritionData]);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setNutritionData(null);
    setSelectedFood(null);

    try {
      const results = await searchFoodAPI(query.trim());
      setSearchResults(results);
      if (!searchHistory.find(item => item.name.toLowerCase() === query.toLowerCase())) {
        setSearchHistory(prev => [{ id: Date.now(), name: query }, ...prev.slice(0, 4)]);
      }
    } catch (err) {
      setError(err.message);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFood = async (food) => {
    setIsLoading(true);
    setError(null);
    setSelectedFood(food);
    setSearchResults([]);

    try {
      const data = await getNutritionDataAPI(food.id);
      setNutritionData(data.nutrients);
    } catch (err) {
      setError(err.message);
      setNutritionData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistoryClick = (item) => {
    setQuery(item.name);
    handleSearchSubmit({ preventDefault: () => {} });
  };

  const clearSelection = () => {
    setSelectedFood(null);
    setNutritionData(null);
    setQuery('');
  };

  const macroChartData = nutritionData
    ? {
        Protein: nutritionData.protein || 0,
        Carbs: nutritionData.carbs || 0,
        Fat: nutritionData.fat || 0,
        Fiber: nutritionData.fiber || 0,
      }
    : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-block bg-gradient-to-r from-primary to-secondary text-white rounded-full p-4 mb-4">
            <IoNutritionOutline className="h-10 w-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">Nutritional Insights</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Search any food to get an instant, detailed nutritional breakdown. Make smarter choices, effortlessly.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="flex gap-2 items-center justify-center mb-4">
            <Input
              className="w-full md:w-96 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              placeholder='e.g., "1 cup of cooked quinoa"'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              icon={IoSearchOutline}
            />
            <Button type="submit" variant="primary" size="lg" disabled={isLoading}>
              {isLoading && !selectedFood ? <Spinner size="sm" color="white" /> : 'Search'}
            </Button>
          </form>

          {searchHistory.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {searchHistory.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleHistoryClick(item)}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary-light hover:text-primary-dark dark:hover:bg-gray-700 transition-all duration-200 shadow-sm"
                >
                  {item.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8">
          {error && (
            <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg">{error}</div>
          )}

          {isLoading && (
            <div className="flex justify-center py-10">
              <Spinner size="lg" color="primary" />
            </div>
          )}

          {!isLoading && searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {searchResults.map((food) => (
                <motion.div
                  key={food.id}
                  whileHover={{ scale: 1.03, boxShadow: '0px 10px 20px rgba(0,0,0,0.1)' }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Card
                    className="cursor-pointer p-5 flex flex-col h-full dark:bg-gray-800"
                    onClick={() => handleSelectFood(food)}
                  >
                    <div className="flex-grow">
                      <h3 className="font-semibold text-lg text-primary-dark dark:text-primary-300 mb-1">{food.name}</h3>
                      {food.brand && (
                        <p className="text-sm text-gray-500 font-medium bg-gray-100 dark:bg-gray-700 dark:text-gray-300 inline-block px-2 py-0.5 rounded">
                          {food.brand}
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-3">{food.dataType}</p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {!isLoading && nutritionData && selectedFood && (
            <motion.div
              id="details-section"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Button variant="outline" size="sm" className="mb-6 mx-auto flex items-center" onClick={clearSelection}>
                <IoChevronBackOutline className="mr-2" /> New Search
              </Button>
              <Card padding="p-6 md:p-8" className="shadow-2xl">
                <div className="flex flex-col lg:flex-row lg:space-x-12">
                  <div className="flex-1 mb-8 lg:mb-0">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{selectedFood.name}</h2>
                    {selectedFood.brand && <p className="text-md text-gray-500 dark:text-gray-300 mb-6">{selectedFood.brand}</p>}
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      {[ 
                        { label: 'Calories', value: nutritionData.calories, unit: 'kcal', color: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300' },
                        { label: 'Protein', value: nutritionData.protein, unit: 'g', color: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' },
                        { label: 'Carbs', value: nutritionData.carbs, unit: 'g', color: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300' },
                        { label: 'Fat', value: nutritionData.fat, unit: 'g', color: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300' },
                      ].map((item) => (
                        <div key={item.label} className={`p-4 rounded-xl text-center ${item.color}`}>
                          <div className="text-sm font-medium opacity-80">{item.label}</div>
                          <div className="text-2xl font-bold">
                            {item.value ?? 'N/A'}
                            <span className="text-sm font-normal ml-1">{item.unit}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {macroChartData && <NutritionPieChart data={macroChartData} />}
                  </div>

                  {nutritionData.micronutrients && Object.keys(nutritionData.micronutrients).length > 0 && (
                    <div className="flex-1 lg:pl-8 lg:border-l lg:border-gray-200 dark:lg:border-gray-700">
                      <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Micronutrient Details</h3>
                      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-3 -mr-3">
                        {Object.entries(nutritionData.micronutrients).map(([key, val]) => (
                          <div key={key} className="flex justify-between items-center text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                            <span className="capitalize text-gray-600 dark:text-gray-300">{key.replace(/_/g, ' ').toLowerCase()}</span>
                            <span className="font-bold text-gray-900 dark:text-gray-200">{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          )}

          {!isLoading && !error && searchResults.length === 0 && !selectedFood && (
             <div className="text-center py-16 px-4">
                <IoSearchOutline className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-500"/>
                <h3 className="mt-2 text-lg font-medium text-gray-800 dark:text-white">Ready to explore?</h3>
                <p className="mt-1 text-gray-500 dark:text-gray-300">Enter a food or drink above to begin your nutritional journey.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InsightsPage;