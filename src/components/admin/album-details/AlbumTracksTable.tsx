'use client';

import React, { useState } from 'react';
import BadgeStatus from '@/components/ui/badge/BadgeStatus';
import { Audio } from '@/types/album';
import { PlayIcon, PencilIcon, TrashIcon, CheckIcon, CloseIcon } from '@/icons';
import DataTable, { Column } from '@/components/ui/table/DataTable';

interface AlbumTracksTableProps {
  tracks: Audio[];
  onEdit: (track: Audio) => void;
  onRemove: (track: Audio) => void;
  onPlay: (track: Audio) => void;
  loading?: boolean;
}

const AlbumTracksTable: React.FC<AlbumTracksTableProps> = ({
  tracks,
  onEdit,
  onRemove,
  onPlay,
  loading,
}) => {
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePlay = (track: Audio) => {
    if (playingTrackId === track.id) {
      setPlayingTrackId(null);
    } else {
      setPlayingTrackId(track.id || null);
      onPlay(track);
    }
  };

  // Add index to tracks for the # column
  const tracksWithIndex = tracks.map((track, index) => ({
    ...track,
    index: index + 1,
  }));

  // Define columns for the DataTable
  const columns: Column<Audio & { index: number }>[] = [
    {
      header: '#',
      accessor: 'index',
      cell: (value) => (
        <p className="text-black dark:text-white">{value}</p>
      ),
      className: 'xl:pl-7.5',
    },
    {
      header: 'Title',
      accessor: 'title',
      cell: (value) => (
        <p className="text-black dark:text-white font-medium">{value}</p>
      ),
      sortable: true,
    },
    {
      header: 'Artist',
      accessor: 'artist',
      cell: (value) => (
        <p className="text-gray-600 dark:text-gray-400">{value || '-'}</p>
      ),
      sortable: true,
    },
    {
      header: 'Duration',
      accessor: 'duration',
      cell: (value) => (
        <p className="text-black dark:text-white">{formatDuration(value)}</p>
      ),
      sortable: true,
    },
    {
      header: 'Preview',
      accessor: 'preview',
      cell: (value, row) => (
        <div className="flex items-center gap-2">
          {value ? (
            <>
              <CheckIcon className="h-4 w-4 text-success" />
              <button
                onClick={() => handlePlay(row)}
                className="hover:text-primary transition-colors"
                title={playingTrackId === row.id ? "Stop preview" : "Play preview"}
              >
                <PlayIcon className={`h-5 w-5 ${playingTrackId === row.id ? 'text-primary' : ''}`} />
              </button>
            </>
          ) : (
            <CloseIcon className="h-4 w-4 text-gray-400" />
          )}
        </div>
      ),
    },
    {
      header: 'Premium',
      accessor: 'premium',
      cell: (value) => (
        value ? (
          <BadgeStatus variant="success">Premium</BadgeStatus>
        ) : (
          <BadgeStatus variant="default">Free</BadgeStatus>
        )
      ),
    },
    {
      header: 'Status',
      accessor: 'released',
      cell: (value) => (
        value ? (
          <BadgeStatus variant="success">Published</BadgeStatus>
        ) : (
          <BadgeStatus variant="warning">Draft</BadgeStatus>
        )
      ),
    },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (value, row) => (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => onEdit(row)}
            className="hover:text-primary transition-colors"
            title="Edit track"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onRemove(row)}
            className="hover:text-danger transition-colors"
            title="Remove from album"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      ),
      className: 'text-center',
      headerClassName: 'text-center',
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={tracksWithIndex}
      loading={loading}
      emptyMessage="No tracks in this album yet."
      pageSize={10}
      searchable={false}
      containerClassName="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
      className="w-full"
    />
  );
};

export default AlbumTracksTable;