'use client';

import React, { useState } from 'react';
import Select from '@/components/form/Select';
import InputField from '@/components/form/input/InputField';
import ButtonAction from '@/components/ui/button/ButtonAction';
import { setFilters } from '@/_core/features/adminTracksSlice';
import { useAppDispatch } from '@/hooks/useRedux';

interface TrackFiltersProps {
  filters: {
    section: string;
    groupBy: string;
    search: string;
    released: string;
    premium: string;
  };
  onApplyFilters: (filters: {
    section: string;
    groupBy: string;
    search: string;
    released: string;
    premium: string;
    page?: number;
    limit?: number;
  }) => void;
}

const TrackFilters: React.FC<TrackFiltersProps> = ({ filters, onApplyFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const dispatch = useAppDispatch();
  const handleApply = () => {
    onApplyFilters(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      section: 'RenewMe',
      groupBy: 'Sleep',
      search: '',
      released: 'all',
      premium: 'all',
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
    { value: 'Sleep', label: 'Sleep' },
    { value: 'Confidence', label: 'Boost Confidence' },
    { value: 'Affirmations', label: 'Affirmations' },
    { value: 'Meditations', label: 'Meditations' },
  ];

  const releasedOptions = [
    { value: 'all', label: 'All' },
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
  ];

  const premiumOptions = [
    { value: 'all', label: 'All' },
    { value: 'premium', label: 'Premium' },
    { value: 'free', label: 'Free' },
  ];

  return (
    <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark mb-6 dark:bg-gray-900">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 items-end">
        <Select
          options={sectionOptions}
          onChange={(value) => setLocalFilters(prev => ({ ...prev, section: value }))}
        />

        <Select
          options={groupByOptions}
          onChange={(value) => dispatch(setFilters({ groupBy: value }))}
        />

        <InputField
          name="search"
          type="text"
          placeholder="Search by title or artist..."
          value={localFilters.search}
          onChange={(e) => setLocalFilters(prev => ({ ...prev, search: e.target.value }))}
        />

        <Select
          onChange={(value) => setLocalFilters(prev => ({ ...prev, released: value }))}
          options={releasedOptions}
        />

        <Select
          onChange={(value) => setLocalFilters(prev => ({ ...prev, premium: value }))}
          options={premiumOptions}
        />

        <div className="flex gap-2">
          <ButtonAction
            variant="primary"
            onClick={handleApply}
            className="flex-1"
          >
            Apply
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

export default TrackFilters;
