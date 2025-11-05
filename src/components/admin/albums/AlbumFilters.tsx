'use client';

import React, { useState } from 'react';
import Select from '@/components/form/Select';
import InputField from '@/components/form/input/InputField';
import ButtonAction from '@/components/ui/button/ButtonAction';

interface AlbumFiltersProps {
  filters: {
    section: string;
    groupBy: string;
    search: string;
  };
  onApplyFilters: (filters: { section: string; groupBy: string; search: string }) => void;
}

const AlbumFilters: React.FC<AlbumFiltersProps> = ({ filters, onApplyFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApply = () => {
    onApplyFilters(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      section: 'RenewMe',
      groupBy: 'None',
      search: '',
    };
    setLocalFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  const sectionOptions = [
    { value: 'RenewMe', label: 'RenewMe' },
    { value: 'Premium', label: 'Premium' },
    { value: 'Free', label: 'Free' },
  ];

  const groupByOptions = [
    { value: 'None', label: 'None' },
    { value: 'Category', label: 'Category' },
    { value: 'Artist', label: 'Artist' },
    { value: 'Released', label: 'Released' },
  ];

  return (
    <div className="rounded-sm border border-gray-200 bg-white p-4 pb-12 shadow-default dark:border-gray-600 dark:bg-gray-900 mb-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 items-end">
        <Select
          label="Section"
          value={localFilters.section}
          onChange={(value) => setLocalFilters(prev => ({ ...prev, section: value }))}
          options={sectionOptions}
        />

        <Select
          label="Group By"
          value={localFilters.groupBy}
          onChange={(value) => setLocalFilters(prev => ({ ...prev, groupBy: value }))}
          options={groupByOptions}
        />

        <InputField
          label="Search"
          type="text"
          placeholder="Search by title or slug..."
          value={localFilters.search}
          onChange={(e) => setLocalFilters(prev => ({ ...prev, search: e.target.value }))}
        />

        <div className="mb-4.5">
          <div className="flex gap-2">
            <ButtonAction
              variant="primary"
              onClick={handleApply}
              className="flex-1 h-11"
            >
              Apply Filters
            </ButtonAction>
            <ButtonAction
              variant="secondary"
              onClick={handleReset}
              className="h-11"
            >
              Reset
            </ButtonAction>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumFilters;
