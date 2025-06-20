import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = true,
  padding = 'p-6',
  shadow = 'shadow-lg',
  border = true,
  ...props 
}) => {
  const baseClasses = `
    bg-white dark:bg-gray-800 
    rounded-2xl 
    ${shadow} 
    ${border ? 'border border-gray-100 dark:border-gray-700' : ''} 
    transition-all duration-300 
    ${padding}
  `;
  
  const hoverClasses = hover ? 'hover:shadow-xl hover:-translate-y-1 dark:hover:shadow-2xl' : '';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className={`${baseClasses} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;