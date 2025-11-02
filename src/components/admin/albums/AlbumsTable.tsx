'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AudioAlbum } from '@/lib/admin-api-client';
import BadgeStatus from '@/components/ui/badge/BadgeStatus';
import { PencilIcon, TrashIcon } from '@/icons';

interface AlbumsTableProps {
  albums: AudioAlbum[];
  onEdit: (album: AudioAlbum) => void;
  onDelete: (album: AudioAlbum) => void;
  loading?: boolean;
}

const AlbumsTable: React.FC<AlbumsTableProps> = ({ albums, onEdit, onDelete, loading }) => {
  // Loading skeleton
  if (loading) {
    return (
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="px-4 py-6 md:px-6 xl:px-7.5">
          <div className="animate-pulse">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="mb-4 flex items-center gap-4">
                <div className="h-14 w-14 rounded bg-gray-300 dark:bg-gray-700"></div>
                <div className="flex-1">
                  <div className="h-4 w-48 rounded bg-gray-300 dark:bg-gray-700 mb-2"></div>
                  <div className="h-3 w-64 rounded bg-gray-300 dark:bg-gray-700"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (albums.length === 0) {
    return (
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="px-4 py-16 text-center md:px-6 xl:px-7.5">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No albums found. Create your first album!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white xl:pl-7.5">
                Cover
              </th>
              <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white">
                Title
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                Slug
              </th>
              <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white">
                Description
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Premium
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Status
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Tracks
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {albums.map((album, index) => (
              <tr key={album.id || index}>
                <td className="border-b border-stroke px-4 py-5 dark:border-strokedark xl:pl-7.5">
                  <div className="relative h-14 w-14">
                    {album.coverPortrait ? (
                      <Image
                        src={album.coverPortrait}
                        alt={album.title}
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
                </td>
                <td className="border-b border-stroke px-4 py-5 dark:border-strokedark">
                  <Link 
                    href={`/dashboard/albums/${album.slug}`}
                    className="text-black dark:text-white hover:text-primary"
                  >
                    {album.title}
                  </Link>
                </td>
                <td className="border-b border-stroke px-4 py-5 dark:border-strokedark">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{album.slug}</p>
                </td>
                <td className="border-b border-stroke px-4 py-5 dark:border-strokedark">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {album.description ? (
                      album.description.length > 50 
                        ? `${album.description.substring(0, 50)}...` 
                        : album.description
                    ) : '-'}
                  </p>
                </td>
                <td className="border-b border-stroke px-4 py-5 dark:border-strokedark">
                  {album.premium ? (
                    <BadgeStatus variant="success">Premium</BadgeStatus>
                  ) : (
                    <BadgeStatus variant="default">Free</BadgeStatus>
                  )}
                </td>
                <td className="border-b border-stroke px-4 py-5 dark:border-strokedark">
                  {album.released ? (
                    <BadgeStatus variant="success">Published</BadgeStatus>
                  ) : (
                    <BadgeStatus variant="warning">Draft</BadgeStatus>
                  )}
                </td>
                <td className="border-b border-stroke px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">{album.tracks?.length || 0}</p>
                </td>
                <td className="border-b border-stroke px-4 py-5 dark:border-strokedark">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => onEdit(album)}
                      className="hover:text-primary"
                      title="Edit album"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onDelete(album)}
                      className="hover:text-danger"
                      title="Delete album"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AlbumsTable;
