'use client';

import React from 'react';
import Select from '@/components/form/Select';
import { AudioAlbum } from '@/types/album';

interface AlbumSelectorProps {
  albums: AudioAlbum[];
  currentAlbumSlug: string;
  onAlbumChange: (slug: string) => void;
  loading?: boolean;
}

const AlbumSelector: React.FC<AlbumSelectorProps> = ({
  albums,
  currentAlbumSlug,
  onAlbumChange,
  loading,
}) => {
  const options = albums.map(album => ({
    value: album.slug,
    label: album.title,
  }));

  return (
    <div className="w-full md:w-64">
      <Select
        label="Select Album"
        value={currentAlbumSlug}
        onChange={onAlbumChange}
        options={options}
        disabled={loading}
        placeholder="Choose an album..."
      />
    </div>
  );
};

export default AlbumSelector;
