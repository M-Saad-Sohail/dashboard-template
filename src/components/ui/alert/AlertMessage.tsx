'use client';

import React from 'react';

interface AlertMessageProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
  dismissible?: boolean;
}

const AlertMessage: React.FC<AlertMessageProps> = ({
  type,
  message,
  onClose,
  dismissible = true,
}) => {
  const variantClasses = {
    success: {
      container:
        'border-success-500 bg-success-50 dark:border-success-500/30 dark:bg-success-500/15',
      icon: 'text-success-500',
    },
    error: {
      container:
        'border-error-500 bg-error-50 dark:border-error-500/30 dark:bg-error-500/15',
      icon: 'text-error-500',
    },
    warning: {
      container:
        'border-warning-500 bg-warning-50 dark:border-warning-500/30 dark:bg-warning-500/15',
      icon: 'text-warning-500',
    },
    info: {
      container:
        'border-blue-light-500 bg-blue-light-50 dark:border-blue-light-500/30 dark:bg-blue-light-500/15',
      icon: 'text-blue-light-500',
    },
  };

  const icons = {
    success: (
      <svg className="fill-current" width="20" height="20" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    ),
    error: (
      <svg className="fill-current" width="20" height="20" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
      </svg>
    ),
    warning: (
      <svg className="fill-current" width="20" height="20" viewBox="0 0 24 24">
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
      </svg>
    ),
    info: (
      <svg className="fill-current" width="20" height="20" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
      </svg>
    ),
  };

  return (
    <div
      className={`rounded-lg border p-4 ${variantClasses[type].container} relative`}
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 ${variantClasses[type].icon}`}>
          {icons[type]}
        </div>

        <div className="flex-1">
          <p className="text-sm text-gray-700 dark:text-gray-300">{message}</p>
        </div>

        {dismissible && onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default AlertMessage;
