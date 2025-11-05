'use client';

import React from 'react';
import ButtonAction from '@/components/ui/button/ButtonAction';
import { TrashIcon, CheckIcon, CloseIcon } from '@/icons';

interface BulkActionsBarProps {
  selectedCount: number;
  onBulkDelete: () => void;
  onMarkAsReleased: () => void;
  onMarkAsPremium: () => void;
  onClearSelection: () => void;
  loading?: boolean;
}

const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  onBulkDelete,
  onMarkAsReleased,
  onMarkAsPremium,
  onClearSelection,
  loading,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="sticky top-0 z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-sm border border-gray-200 bg-white p-4 shadow-default dark:border-gray-600 dark:bg-gray-900 mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="text-black dark:text-white font-medium text-sm sm:text-base">
          {selectedCount} track{selectedCount !== 1 ? 's' : ''} selected
        </p>
        
        <div className="hidden sm:block h-4 w-px bg-gray-200 dark:bg-gray-600"></div>

        <div className="flex flex-wrap items-center gap-2">
          <ButtonAction
            variant="secondary"
            size="sm"
            onClick={onMarkAsReleased}
            disabled={loading}
            className="flex items-center gap-2 text-xs sm:text-sm"
          >
            <CheckIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Mark as Released</span>
            <span className="sm:hidden">Released</span>
          </ButtonAction>

          <ButtonAction
            variant="secondary"
            size="sm"
            onClick={onMarkAsPremium}
            disabled={loading}
            className="flex items-center gap-2 text-xs sm:text-sm"
          >
            <CheckIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Make Premium</span>
            <span className="sm:hidden">Premium</span>
          </ButtonAction>

          <ButtonAction
            variant="danger"
            size="sm"
            onClick={onBulkDelete}
            disabled={loading}
            className="flex items-center gap-2 text-xs sm:text-sm"
          >
            <TrashIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Delete Selected</span>
            <span className="sm:hidden">Delete</span>
          </ButtonAction>
        </div>
      </div>

      <ButtonAction
        variant="secondary"
        size="sm"
        onClick={onClearSelection}
        disabled={loading}
        className="flex items-center gap-2 text-xs sm:text-sm w-full sm:w-auto justify-center"
      >
        <CloseIcon className="h-4 w-4" />
        Clear Selection
      </ButtonAction>
    </div>
  );
};

export default BulkActionsBar;
