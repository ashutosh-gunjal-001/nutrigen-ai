import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IoCalendarOutline } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { mealPlanService } from '../api/mealPlanService';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

const MealPlannerPage = () => {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [meals, setMeals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        setLoading(true);
        const data = await mealPlanService.getMealPlan();
        setMeals(data.mealPlan);
        setError(null);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setMeals(null);
        } else {
          setError('Failed to fetch meal plan.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMealPlan();
    }
  }, [user]);

  const handleGeneratePlan = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await mealPlanService.generateMealPlan();
      setMeals(data.meal_plan.mealPlan);
    } catch (err) {
      setError('Plan will updated in while');
    } finally {
      setLoading(false);
    }
  };

  const calculateDailyNutrition = (day) => {
    if (!meals || !meals[day]) {
      return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    }
    return Object.values(meals[day]).reduce(
      (acc, meal) => ({
        calories: acc.calories + (meal.calories || 0),
        protein: acc.protein + (meal.protein || 0),
        carbs: acc.carbs + (meal.carbs || 0),
        fat: acc.fat + (meal.fat || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const currentDayKey = daysOfWeek[selectedDay];
  const dailyNutrition = calculateDailyNutrition(currentDayKey);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <div className="bg-primary/10 dark:bg-primary/20 rounded-full p-4 w-16 h-16 mx-auto mb-4">
              <IoCalendarOutline className="h-8 w-8 text-primary dark:text-primary-300" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Meal Planner</h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Here is your personalized weekly meal plan. You can generate a new one at any time.
            </p>
          </div>

          <div className="text-center mb-6">
            <button
              onClick={handleGeneratePlan}
              disabled={loading}
              className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600"
            >
              {loading ? 'Generating...' : 'Create New Plan'}
            </button>
          </div>

          {error && <div className="text-center text-red-500 dark:text-red-400 mb-4">{error}</div>}

          <div className="flex overflow-x-auto pb-2 mb-6 scrollbar-hide">
            {daysOfWeek.map((day, index) => (
              <button
                key={day}
                onClick={() => setSelectedDay(index)}
                className={`flex-1 min-w-[120px] py-3 px-2 mx-1 rounded-lg transition-colors ${
                  selectedDay === index
                    ? 'bg-primary text-white dark:bg-primary-600'
                    : 'bg-white hover:bg-gray-100 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200'
                }`}
              >
                <div className="text-sm font-medium">{day.substring(0, 3)}</div>
                <div className="text-lg font-bold">
                  {new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + index)).getDate()}
                </div>
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">{currentDayKey}</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                <div className="text-sm text-blue-600 dark:text-blue-300 font-medium">Calories</div>
                <div className="text-2xl font-bold dark:text-white">{dailyNutrition.calories}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">kcal</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                <div className="text-sm text-green-600 dark:text-green-300 font-medium">Protein</div>
                <div className="text-2xl font-bold dark:text-white">{dailyNutrition.protein}g</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">grams</div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg">
                <div className="text-sm text-yellow-600 dark:text-yellow-300 font-medium">Carbs</div>
                <div className="text-2xl font-bold dark:text-white">{dailyNutrition.carbs}g</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">grams</div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
                <div className="text-sm text-red-600 dark:text-red-300 font-medium">Fat</div>
                <div className="text-2xl font-bold dark:text-white">{dailyNutrition.fat}g</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">grams</div>
              </div>
            </div>

            {loading && !meals && (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-300">Loading your meal plan...</p>
              </div>
            )}

            {!loading && !meals && (
              <div className="text-center py-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">No Meal Plan Found</h3>
                <p className="text-gray-600 dark:text-gray-300">Click "Create New Plan" to get started.</p>
              </div>
            )}

            {meals && meals[currentDayKey] && (
              <div className="space-y-4">
                {mealTypes.map((mealType) => {
                  const meal = meals[currentDayKey][mealType];
                  if (!meal) return null;

                  return (
                    <div key={mealType} className="border rounded-lg overflow-hidden dark:border-gray-700">
                      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 border-b dark:border-gray-600">
                        <h3 className="font-medium text-gray-700 dark:text-gray-200 capitalize">{mealType}</h3>
                      </div>
                      <div className="divide-y dark:divide-gray-700">
                        <div className="px-4 py-3 bg-white dark:bg-gray-800">
                          <div className="font-medium text-gray-900 dark:text-white">{meal.name}</div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Ingredients: {meal.ingredients}</p>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            {meal.calories} cal • P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fat}g
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MealPlannerPage;