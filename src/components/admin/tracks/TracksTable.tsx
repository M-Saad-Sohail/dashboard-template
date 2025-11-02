'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import BadgeStatus from '@/components/ui/badge/BadgeStatus';
import { Audio } from '@/types/album';
import { PlayIcon, PencilIcon, TrashIcon } from '@/icons';
import DataTable, { Column } from '@/components/ui/table/DataTable';

// Extend Audio interface to include optional createdAt field
interface ExtendedAudio extends Audio {
  createdAt?: string;
}

interface TracksTableProps {
  tracks: Audio[];
  selectedTracks: string[];
  onToggleTrackSelection: (trackId: string) => void;
  onToggleAllSelection: (trackIds: string[]) => void;
  onEdit: (track: Audio) => void;
  onDelete: (track: Audio) => void;
  onPlay: (track: Audio) => void;
  loading?: boolean;
  showBulkActions?: boolean;
}

const TracksTable: React.FC<TracksTableProps> = ({
  tracks,
  selectedTracks,
  onToggleTrackSelection,
  onToggleAllSelection,
  onEdit,
  onDelete,
  onPlay,
  loading,
  showBulkActions = true,
}) => {
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handlePlay = (track: Audio) => {
    if (playingTrackId === track.id) {
      setPlayingTrackId(null);
    } else {
      setPlayingTrackId(track.id || null);
      onPlay(track);
    }
  };

  // Define columns for the DataTable
  const columns: Column<ExtendedAudio>[] = [
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
      header: 'Album',
      accessor: 'album.title',
      cell: (value, row) => (
        row.album?.title ? (
          <Link
            href={`/dashboard/albums/${row.albumId}`}
            className="text-primary hover:underline"
          >
            {row.album.title}
          </Link>
        ) : (
          <span className="text-gray-400">-</span>
        )
      ),
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
        value ? (
          <button
            onClick={() => handlePlay(row)}
            className="hover:text-primary transition-colors flex items-center gap-2"
            title={playingTrackId === row.id ? "Stop preview" : "Play preview"}
          >
            <PlayIcon className={`h-5 w-5 ${playingTrackId === row.id ? 'text-primary' : ''}`} />
          </button>
        ) : (
          <span className="text-gray-400">-</span>
        )
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
      header: 'Created',
      accessor: 'createdAt',
      cell: (value) => (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {formatDate(value)}
        </p>
      ),
      sortable: true,
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
            onClick={() => onDelete(row)}
            className="hover:text-danger transition-colors"
            title="Delete track"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      ),
      className: 'text-center',
      headerClassName: 'text-center',
    },
  ];

  const handleRowSelectionChange = (selectedIds: string[]) => {
    // Clear all current selections
    selectedTracks.forEach(id => {
      if (!selectedIds.includes(id)) {
        onToggleTrackSelection(id);
      }
    });
    // Add new selections
    selectedIds.forEach(id => {
      if (!selectedTracks.includes(id)) {
        onToggleTrackSelection(id);
      }
    });
  };

  return (
    <DataTable
      columns={columns}
      data={tracks as ExtendedAudio[]}
      loading={loading}
      emptyMessage="No tracks found. Create your first track!"
      pageSize={10}
      searchable={true}
      searchPlaceholder="Search tracks..."
      containerClassName="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
      className="w-full"
      selectable={showBulkActions}
      selectedRows={selectedTracks}
      onRowSelectionChange={handleRowSelectionChange}
      getRowId={(row) => row.id || ''}
    />
  );
};

export default TracksTable;