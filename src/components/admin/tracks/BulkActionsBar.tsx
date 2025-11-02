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
    <div className="sticky top-0 z-10 flex items-center justify-between gap-4 rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark mb-4">
      <div className="flex items-center gap-4">
        <p className="text-black dark:text-white font-medium">
          {selectedCount} track{selectedCount !== 1 ? 's' : ''} selected
        </p>
        
        <div className="h-4 w-px bg-stroke dark:bg-strokedark"></div>

        <div className="flex items-center gap-2">
          <ButtonAction
            variant="secondary"
            size="sm"
            onClick={onMarkAsReleased}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <CheckIcon className="h-4 w-4" />
            Mark as Released
          </ButtonAction>

          <ButtonAction
            variant="secondary"
            size="sm"
            onClick={onMarkAsPremium}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <CheckIcon className="h-4 w-4" />
            Make Premium
          </ButtonAction>

          <ButtonAction
            variant="danger"
            size="sm"
            onClick={onBulkDelete}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <TrashIcon className="h-4 w-4" />
            Delete Selected
          </ButtonAction>
        </div>
      </div>

      <ButtonAction
        variant="secondary"
        size="sm"
        onClick={onClearSelection}
        disabled={loading}
        className="flex items-center gap-2"
      >
        <CloseIcon className="h-4 w-4" />
        Clear Selection
      </ButtonAction>
    </div>
  );
};

export default BulkActionsBar;
