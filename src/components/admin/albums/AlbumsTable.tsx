'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AudioAlbum } from '@/types/album';
import BadgeStatus from '@/components/ui/badge/BadgeStatus';
import { PencilIcon, TrashIcon } from '@/icons';
import DataTable, { Column } from '@/components/ui/table/DataTable';

interface AlbumsTableProps {
  albums: AudioAlbum[];
  onEdit: (album: AudioAlbum) => void;
  onDelete: (album: AudioAlbum) => void;
  loading?: boolean;
}

const AlbumsTable: React.FC<AlbumsTableProps> = ({ albums, onEdit, onDelete, loading }) => {
  // Define columns for the DataTable
  const columns: Column<AudioAlbum>[] = [
    {
      header: 'Cover',
      accessor: 'coverPortrait',
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
              <span className="text-xs text-gray-6 dark:text-gray-400">No Image</span>
            </div>
          )}
        </div>
      ),
      className: 'xl:pl-7.5',
    },
    {
      header: 'Title',
      accessor: 'title',
      cell: (value, row) => (
        <Link 
          href={`/dashboard/albums/${row.slug}`}
          className="text-black dark:text-white hover:text-primary"
        >
          {value}
        </Link>
      ),
      sortable: true,
    },
    {
      header: 'Slug',
      accessor: 'slug',
      cell: (value) => (
        <p className="text-sm text-gray-600 dark:text-gray-400">{value}</p>
      ),
    },
    {
      header: 'Description',
      accessor: 'description',
      cell: (value) => (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {value ? (
            value.length > 50 
              ? `${value.substring(0, 50)}...` 
              : value
          ) : '-'}
        </p>
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
      header: 'Tracks',
      accessor: 'tracks',
      cell: (value) => (
        <p className="text-black dark:text-white">{value?.length || 0}</p>
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
            className="hover:text-primary"
            title="Edit album"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(row)}
            className="hover:text-danger"
            title="Delete album"
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
      data={albums}
      loading={loading}
      emptyMessage="No albums found. Create your first album!"
      pageSize={10}
      searchable={true}
      searchPlaceholder="Search albums..."
      containerClassName="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
      className="w-full"
    />
  );
};

export default AlbumsTable;