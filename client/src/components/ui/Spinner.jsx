import React from 'react';

const Spinner = ({ size = 'md', color = 'primary' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const colors = {
    primary: 'border-primary',
    secondary: 'border-secondary',
    white: 'border-white',
    gray: 'border-gray-500',
  };

  return (
    <div className={`${sizes[size]} ${colors[color]} border-2 border-t-transparent rounded-full animate-spin`} />
  );
};

export default Spinner;