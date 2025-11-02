import React from 'react';

const PlayIcon: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
  );
};

export default PlayIcon;
