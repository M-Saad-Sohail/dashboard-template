'use client';

import React from 'react';
import Image from 'next/image';
import BadgeStatus from '@/components/ui/badge/BadgeStatus';
import { Audio } from '@/types/album';
import { PencilIcon, TrashIcon } from '@/icons';
import DataTable, { Column } from '@/components/ui/table/DataTable';

// Extend Audio interface for music-specific fields
interface MusicItem extends Audio {
  genre?: string;
  coverArt?: string;
  playCount?: number;
}

interface MusicTableProps {
  music: MusicItem[];
  onEdit: (music: MusicItem) => void;
  onDelete: (music: MusicItem) => void;
  loading?: boolean;
}

const MusicTable: React.FC<MusicTableProps> = ({
  music,
  onEdit,
  onDelete,
  loading,
}) => {

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Define columns for the DataTable
  const columns: Column<MusicItem>[] = [
    {
      header: 'Cover Art',
      accessor: 'coverArt',
      cell: (value, row) => (
        <div className="relative h-14 w-14">
          {value ? (
            <Image
              src={value}
              alt={row.title}
              width={60}
              height={60}
              className="rounded object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded bg-gray-3 dark:bg-gray-700">
              <span className="text-xs text-gray-6 dark:text-gray-400">No Art</span>
            </div>
          )}
        </div>
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
      header: 'Album',
      accessor: 'album.title',
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
            title="Edit music"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(row)}
            className="hover:text-danger transition-colors"
            title="Delete music"
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
      data={music}
      loading={loading}
      emptyMessage="No music found. Upload your first music track!"
      pageSize={10}
      searchable={true}
      searchPlaceholder="Search music..."
      containerClassName="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
      className="w-full"
    />
  );
};

export default MusicTable;