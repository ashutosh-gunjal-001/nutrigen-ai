import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoCalendarOutline, 
  IoSearchOutline, 
  IoChatbubbleOutline,
  IoTrendingUpOutline,
  IoCheckmarkCircleOutline,
  IoAlertCircleOutline
} from 'react-icons/io5';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import axiosInstance from '../api/axiosConfig';

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [streak, setStreak] = useState(null);
  const [isLogging, setIsLogging] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState('');

  const showMessage = (msg, isError = false) => {
    setMessage(msg);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const res = await axiosInstance.get('/streak');
        setStreak(res.streak);
      } catch (err) {
        console.error('Failed to fetch streak:', err);
      }
    };

    fetchStreak();
  }, []);

  const handleLogMeal = async () => {
    if (isLogging) return;
    setIsLogging(true);
    try {
      await axiosInstance.post('/log-meal');
      const res = await axiosInstance.get('/streak');
      setStreak(res.streak);
      showMessage('Meal logged successfully! 🎉');
    } catch (err) {
      console.error('Failed to log meal:', err);
      showMessage('Failed to log meal. Please try again.', true);
    } finally {
      setIsLogging(false);
    }
  };

  const quickActions = [
    {
      title: 'Generate Meal Plan',
      description: 'Create a personalized weekly meal plan',
      icon: IoCalendarOutline,
      link: '/meal-planner',
      color: 'from-primary to-primary-light',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Analyze Food',
      description: 'Get detailed nutritional insights',
      icon: IoSearchOutline,
      link: '/insights',
      color: 'from-secondary to-secondary-light',
      bgColor: 'bg-secondary/10'
    },
    {
      title: 'Ask Coach',
      description: 'Get personalized nutrition advice',
      icon: IoChatbubbleOutline,
      link: '/coach',
      color: 'from-primary-light to-secondary',
      bgColor: 'bg-gradient-to-r from-primary/10 to-secondary/10'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 rounded-lg ${
                message.includes('success') 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' 
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
              }`}
            >
              <div className="flex items-center">
                {message.includes('success') ? (
                  <IoCheckmarkCircleOutline className="h-5 w-5 mr-2" />
                ) : (
                  <IoAlertCircleOutline className="h-5 w-5 mr-2" />
                )}
                <span>{message}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name || 'there'}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Here's your nutrition journey at a glance. Ready to make today healthier?
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mb-8"
        >
          <Card className="dark:bg-gray-800 flex items-center justify-between p-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Current Streak</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {streak === null ? 'Loading...' : `${streak} day${streak === 1 ? '' : 's'}`}
              </p>
            </div>
            <IoTrendingUpOutline className="h-10 w-10 text-primary dark:text-primary-300" />
          </Card>
          <Button onClick={handleLogMeal} disabled={isLogging} className="mt-4">
            {isLogging ? 'Logging...' : 'Log Today\'s Meal'}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card key={index} className="group cursor-pointer dark:bg-gray-800" hover>
                <Link to={action.link} className="block">
                  <div className={`${action.bgColor} rounded-lg p-4 mb-4 group-hover:scale-105 transition-transform duration-200`}>
                    <Icon className="h-8 w-8 text-primary dark:text-primary-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{action.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{action.description}</p>
                </Link>
              </Card>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;