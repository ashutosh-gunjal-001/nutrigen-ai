import React from 'react';
import { motion } from 'framer-motion';
import { IoPersonOutline, IoScaleOutline, IoRestaurantOutline, IoFitnessOutline, IoWalkOutline, IoWarningOutline } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import Card from '../components/ui/Card';

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const health = user?.healthDetails || {};

  const healthDetails = [
    { icon: <IoPersonOutline className="h-5 w-5" />, label: 'Age', value: health.age || 'Not set' },
    { icon: <IoPersonOutline className="h-5 w-5" />, label: 'Gender', value: health.gender || 'Not set' },
    { icon: <IoScaleOutline className="h-5 w-5" />, label: 'Height', value: health.height ? `${health.height} cm` : 'Not set' },
    { icon: <IoScaleOutline className="h-5 w-5" />, label: 'Weight', value: health.weight ? `${health.weight} kg` : 'Not set' },
    { icon: <IoRestaurantOutline className="h-5 w-5" />, label: 'Diet Preference', value: health.dietPreference || 'Not set' },
    { icon: <IoFitnessOutline className="h-5 w-5" />, label: 'Goal', value: health.goal || 'Not set' },
    { icon: <IoWalkOutline className="h-5 w-5" />, label: 'Activity Level', value: health.activityLevel || 'Not set' },
    { icon: <IoWarningOutline className="h-5 w-5" />, label: 'Allergies', value: health.allergies || 'None' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="text-center">
            <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-r from-primary to-secondary p-1 mb-4">
              <div className="h-full w-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                <IoPersonOutline className="h-12 w-12 text-gray-600 dark:text-gray-300" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {user?.name || 'User'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">{user?.email}</p>
          </div>

          <div className="grid gap-6">
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Health Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {healthDetails.map((item, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                      {item.icon}
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    <p className="mt-1 text-gray-900 dark:text-white font-medium">{item.value}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;