'use client';

import React from 'react';

interface BadgeStatusProps {
  variant: 'success' | 'warning' | 'error' | 'info' | 'default';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

const BadgeStatus: React.FC<BadgeStatusProps> = ({
  variant,
  size = 'md',
  children,
}) => {
  const baseStyles =
    'inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium';

  const sizeStyles = {
    sm: 'text-xs',
    md: 'text-sm',
  };

  const variantStyles = {
    success:
      'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500',
    warning:
      'bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-orange-400',
    error:
      'bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500',
    info: 'bg-blue-light-50 text-blue-light-500 dark:bg-blue-light-500/15 dark:text-blue-light-500',
    default: 'bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-white/80',
  };

  const sizeClass = sizeStyles[size];
  const colorStyles = variantStyles[variant];

  return (
    <span className={`${baseStyles} ${sizeClass} ${colorStyles}`}>
      {children}
    </span>
  );
};

export default BadgeStatus;
