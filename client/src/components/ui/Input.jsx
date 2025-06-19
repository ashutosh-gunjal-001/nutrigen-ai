import React from 'react';

const Input = ({ 
  label, 
  error, 
  icon: Icon,
  className = '',
  type = 'text',
  ...props 
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className={`h-5 w-5 ${error ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`} />
          </div>
        )}
        <input
          type={type}
          className={`
            w-full
            px-4
            py-2.5
            text-base
            text-gray-900
            dark:text-white
            bg-white
            dark:bg-gray-700
            border
            ${error 
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400'
            }
            rounded-lg
            shadow-sm
            focus:outline-none
            focus:ring-2
            focus:ring-opacity-50
            transition
            duration-200
            ${Icon ? 'pl-10' : 'pl-4'}
            ${error ? 'pr-10' : ''}
            ${className}
            disabled:opacity-50
            disabled:cursor-not-allowed
            dark:placeholder-gray-400
          `}
          {...props}
        />
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Input;