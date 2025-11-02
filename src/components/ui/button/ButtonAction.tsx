'use client';

import React, { ReactNode } from 'react';

interface ButtonActionProps {
  children: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'danger' | 'link';
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const ButtonAction: React.FC<ButtonActionProps> = ({
  children,
  type = 'button',
  size = 'md',
  variant = 'primary',
  onClick,
  disabled = false,
  loading = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-5 py-3 text-sm',
    lg: 'px-6 py-3.5 text-base',
  };

  const variantClasses = {
    primary:
      'bg-brand-500 text-white shadow-sm hover:bg-brand-600 disabled:bg-brand-300 dark:bg-brand-500 dark:hover:bg-brand-600',
    secondary:
      'bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-700',
    danger:
      'bg-error-500 text-white shadow-sm hover:bg-error-600 disabled:bg-error-300 dark:bg-error-500 dark:hover:bg-error-600',
    link: 'text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-500',
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center font-medium gap-2 rounded-lg transition-colors ${className} ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${
        isDisabled ? 'cursor-not-allowed opacity-50' : ''
      }`}
      onClick={onClick}
      disabled={isDisabled}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default ButtonAction;
