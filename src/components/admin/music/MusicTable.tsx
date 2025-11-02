'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import BadgeStatus from '@/components/ui/badge/BadgeStatus';
import { Audio } from '@/types/album';
import { PlayIcon, PencilIcon, TrashIcon } from '@/icons';

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
  onPlay: (music: MusicItem) => void;
  loading?: boolean;
}

const MusicTable: React.FC<MusicTableProps> = ({
  music,
  onEdit,
  onDelete,
  onPlay,
  loading,
}) => {
  const [playingMusicId, setPlayingMusicId] = useState<string | null>(null);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePlay = (musicItem: MusicItem) => {
    if (playingMusicId === musicItem.id) {
      setPlayingMusicId(null);
    } else {
      setPlayingMusicId(musicItem.id || null);
      onPlay(musicItem);
    }
  };

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
                  <div className="h-3 w-32 rounded bg-gray-300 dark:bg-gray-700"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (music.length === 0) {
    return (
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="px-4 py-16 text-center md:px-6 xl:px-7.5">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No music found. Upload your first music track!
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
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white xl:pl-7.5">
                Cover Art
              </th>
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
                Genre
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Play Count
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Premium
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Status
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {music.map((item, index) => (
              <tr key={item.id || index}>
                <td className="border-b border-stroke px-4 py-5 dark:border-strokedark xl:pl-7.5">
                  <div className="relative h-14 w-14">
                    {item.coverArt ? (
                      <Image
                        src={item.coverArt}
                        alt={item.title}
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
                </td>
                <td className="border-b border-stroke px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white font-medium">{item.title}</p>
                </td>
                <td className="border-b border-stroke px-4 py-5 dark:border-strokedark">
                  <p className="text-gray-600 dark:text-gray-400">{item.artist || '-'}</p>
                </td>
                <td className="border-b border-stroke px-4 py-5 dark:border-strokedark">
                  <p className="text-gray-600 dark:text-gray-400">
                    {item.album?.title || '-'}
                  </p>
                </td>
                <td className="border-b border-stroke px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">{formatDuration(item.duration)}</p>
                </td>
                <td className="border-b border-stroke px-4 py-5 dark:border-strokedark">
                  <p className="text-gray-600 dark:text-gray-400">{item.genre || '-'}</p>
                </td>
                <td className="border-b border-stroke px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">{item.playCount || 0}</p>
                </td>
                <td className="border-b border-stroke px-4 py-5 dark:border-strokedark">
                  {item.premium ? (
                    <BadgeStatus variant="success">Premium</BadgeStatus>
                  ) : (
                    <BadgeStatus variant="default">Free</BadgeStatus>
                  )}
                </td>
                <td className="border-b border-stroke px-4 py-5 dark:border-strokedark">
                  {item.released ? (
                    <BadgeStatus variant="success">Published</BadgeStatus>
                  ) : (
                    <BadgeStatus variant="warning">Draft</BadgeStatus>
                  )}
                </td>
                <td className="border-b border-stroke px-4 py-5 dark:border-strokedark">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => handlePlay(item)}
                      className="hover:text-primary transition-colors"
                      title={playingMusicId === item.id ? "Stop" : "Play"}
                    >
                      <PlayIcon className={`h-5 w-5 ${playingMusicId === item.id ? 'text-primary' : ''}`} />
                    </button>
                    <button
                      onClick={() => onEdit(item)}
                      className="hover:text-primary transition-colors"
                      title="Edit music"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onDelete(item)}
                      className="hover:text-danger transition-colors"
                      title="Delete music"
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

export default MusicTable;
