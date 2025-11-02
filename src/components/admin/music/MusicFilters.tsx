'use client';

import React, { useState } from 'react';
import Select from '@/components/form/Select';
import InputField from '@/components/form/input/InputField';
import ButtonAction from '@/components/ui/button/ButtonAction';

interface MusicFiltersProps {
  filters: {
    section: string;
    search: string;
  };
  onApplyFilters: (filters: { section: string; search: string }) => void;
}

const MusicFilters: React.FC<MusicFiltersProps> = ({ filters, onApplyFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApply = () => {
    onApplyFilters(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      section: 'RenewMe',
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

  return (
    <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark mb-6">
      <div className="flex items-center gap-3 text-primary mb-4">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm font-medium">Music is different from meditation tracks</p>
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 items-end">
        <Select
          options={sectionOptions}
          value={localFilters.section}
          onChange={(value) => setLocalFilters(prev => ({ ...prev, section: value }))}
        />

        <InputField
          name="search"
          type="text"
          placeholder="Search by title or artist..."
          value={localFilters.search}
          onChange={(e) => setLocalFilters(prev => ({ ...prev, search: e.target.value }))}
        />

        <div className="flex gap-2">
          <ButtonAction
            variant="primary"
            onClick={handleApply}
            className="flex-1"
          >
            Apply Filters
          </ButtonAction>
          <ButtonAction
            variant="secondary"
            onClick={handleReset}
          >
            Reset
          </ButtonAction>
        </div>
      </div>
    </div>
  );
};

export default MusicFilters;
