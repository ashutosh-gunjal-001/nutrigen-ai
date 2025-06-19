import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoHomeOutline, IoArrowBackOutline, IoWarningOutline } from 'react-icons/io5';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="text-center max-w-md mx-auto px-6 py-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl"
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 mb-6"
        >
          <IoWarningOutline className="h-10 w-10 text-red-500 dark:text-red-400" />
        </motion.div>
        
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Page Not Found</h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Button 
            as={Link} 
            to="/" 
            variant="primary"
            className="group flex items-center justify-center"
          >
            <IoHomeOutline className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
            Go Home
          </Button>
          <Button 
            onClick={() => window.history.back()} 
            variant="outline"
            className="group flex items-center justify-center"
          >
            <IoArrowBackOutline className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
            Go Back
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;