'use client';

import React from 'react';
import Image from 'next/image';
import BadgeStatus from '@/components/ui/badge/BadgeStatus';
import ButtonAction from '@/components/ui/button/ButtonAction';
import { AudioAlbum } from '@/types/album';
import { PencilIcon } from '@/icons';

interface AlbumInfoCardProps {
  album: AudioAlbum | null;
  onEdit: () => void;
  loading?: boolean;
}

const AlbumInfoCard: React.FC<AlbumInfoCardProps> = ({ album, onEdit, loading }) => {
  if (loading) {
    return (
      <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="animate-pulse">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="h-50 w-50 rounded bg-gray-300 dark:bg-gray-700"></div>
            <div className="flex-1 space-y-4">
              <div className="h-6 w-48 rounded bg-gray-300 dark:bg-gray-700"></div>
              <div className="h-4 w-full rounded bg-gray-300 dark:bg-gray-700"></div>
              <div className="h-4 w-3/4 rounded bg-gray-300 dark:bg-gray-700"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <p className="text-gray-500 dark:text-gray-400">No album data available.</p>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Album Cover */}
        <div className="flex-shrink-0">
          {album.coverPortrait ? (
            <Image
              src={album.coverPortrait}
              alt={album.title}
              width={200}
              height={200}
              className="rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-50 w-50 items-center justify-center rounded-lg bg-gray-3 dark:bg-gray-700">
              <span className="text-lg text-gray-6 dark:text-gray-400">No Cover</span>
            </div>
          )}
        </div>

        {/* Album Details */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold text-black dark:text-white mb-2">
                {album.title}
              </h2>
              <div className="flex items-center gap-3 mb-4">
                {album.premium ? (
                  <BadgeStatus variant="success">Premium</BadgeStatus>
                ) : (
                  <BadgeStatus variant="default">Free</BadgeStatus>
                )}
                {album.released ? (
                  <BadgeStatus variant="success">Published</BadgeStatus>
                ) : (
                  <BadgeStatus variant="warning">Draft</BadgeStatus>
                )}
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {album.tracks?.length || 0} tracks
                </span>
              </div>
            </div>
            <ButtonAction
              variant="secondary"
              size="sm"
              onClick={onEdit}
              className="flex items-center gap-2"
            >
              <PencilIcon className="h-4 w-4" />
              Edit Album
            </ButtonAction>
          </div>

          {album.description && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {album.description}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Slug
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {album.slug}
              </p>
            </div>
            {album.coverSmallLandscape && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Landscape Cover
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  Available
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumInfoCard;
