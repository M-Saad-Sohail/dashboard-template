'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import BadgeStatus from '@/components/ui/badge/BadgeStatus';
import { Audio } from '@/lib/admin-api-client';
import { PlayIcon, PencilIcon, TrashIcon, CheckIcon } from '@/icons';

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
      setPlayingTrackId(track.id);
      onPlay(track);
    }
  };

  const isAllSelected = tracks.length > 0 && tracks.every(track => selectedTracks.includes(track.id));
  const isSomeSelected = selectedTracks.length > 0 && !isAllSelected;

  if (loading) {
    return (
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="px-4 py-6 md:px-6 xl:px-7.5">
          <div className="animate-pulse">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="mb-4 flex items-center gap-4">
                <div className="h-4 w-full rounded bg-gray-300 dark:bg-gray-700"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="px-4 py-16 text-center md:px-6 xl:px-7.5">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No tracks found. Create your first track!
          </p>
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
              {showBulkActions && (
                <th className="px-4 py-4 font-medium text-black dark:text-white xl:pl-7.5">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    indeterminate={isSomeSelected}
                    onChange={() => onToggleAllSelection(tracks.map(t => t.id))}
                    className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </th>
              )}
              <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white">
                Title
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                Artist
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                Album
              </th>
              <th className="min-w-[100px] px-4 py-4 font-medium text-black dark:text-white">
                Duration
              </th>
              <th className="min-w-[100px] px-4 py-4 font-medium text-black dark:text-white">
                Preview
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Premium
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Status
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                Created
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {tracks.map((track) => (
              <tr key={track.id} className={selectedTracks.includes(track.id) ? 'bg-gray-2 dark:bg-meta-4' : ''}>
                {showBulkActions && (
                  <td className="border-b border-stroke px-4 py-5 dark:border-strokedark xl:pl-7.5">
                    <input
                      type="checkbox"
                      checked={selectedTracks.includes(track.id)}
                      onChange={() => onToggleTrackSelection(track.id)}
                      className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </td>
                )}
                <td className="border-b border-stroke px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white font-medium">{track.title}</p>
                </td>
                <td className="border-b border-stroke px-4 py-5 dark:border-strokedark">
                  <p className="text-gray-600 dark:text-gray-400">{track.artist || '-'}</p>
                </td>
                <td className="border-b border-stroke px-4 py-5 dark:border-strokedark">
                  {track.album?.title ? (
                    <Link
                      href={`/dashboard/albums/${track.albumId}`}
                      className="text-primary hover:underline"
                    >
                      {track.album.title}
                    </Link>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="border-b border-stroke px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">{formatDuration(track.duration)}</p>
                </td>
                <td className="border-b border-stroke px-4 py-5 dark:border-strokedark">
                  {track.preview ? (
                    <button
                      onClick={() => handlePlay(track)}
                      className="hover:text-primary transition-colors flex items-center gap-2"
                      title={playingTrackId === track.id ? "Stop preview" : "Play preview"}
                    >
                      <PlayIcon className={`h-5 w-5 ${playingTrackId === track.id ? 'text-primary' : ''}`} />
                    </button>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="border-b border-stroke px-4 py-5 dark:border-strokedark">
                  {track.premium ? (
                    <BadgeStatus variant="success">Premium</BadgeStatus>
                  ) : (
                    <BadgeStatus variant="default">Free</BadgeStatus>
                  )}
                </td>
                <td className="border-b border-stroke px-4 py-5 dark:border-strokedark">
                  {track.released ? (
                    <BadgeStatus variant="success">Published</BadgeStatus>
                  ) : (
                    <BadgeStatus variant="warning">Draft</BadgeStatus>
                  )}
                </td>
                <td className="border-b border-stroke px-4 py-5 dark:border-strokedark">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(track.createdAt)}
                  </p>
                </td>
                <td className="border-b border-stroke px-4 py-5 dark:border-strokedark">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => onEdit(track)}
                      className="hover:text-primary transition-colors"
                      title="Edit track"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onDelete(track)}
                      className="hover:text-danger transition-colors"
                      title="Delete track"
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

export default TracksTable;
