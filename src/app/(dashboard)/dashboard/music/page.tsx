'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import PageBreadCrumb from '@/components/common/PageBreadCrumb';
import ButtonAction from '@/components/ui/button/ButtonAction';
import AlertMessage from '@/components/ui/alert/AlertMessage';
import BadgeStatus from '@/components/ui/badge/BadgeStatus';
import MusicTable from '@/components/admin/music/MusicTable';
import MusicFormModal from '@/components/admin/music/MusicFormModal';
import DeleteMusicModal from '@/components/admin/music/DeleteMusicModal';
import MusicFilters from '@/components/admin/music/MusicFilters';
import AudioPreviewPlayer from '@/components/admin/tracks/AudioPreviewPlayer';
import Pagination from '@/components/tables/Pagination';
import {
  fetchAdminMusic,
  createMusic,
  updateMusic,
  deleteMusic,
  setCurrentMusic,
  setFilters,
  setPage,
  setLimit,
  clearError,
} from '@/_core/features/adminMusicSlice';
import type { Audio } from '@/lib/admin-api-client';
import { PlusIcon, MusicIcon } from '@/icons';

const MusicPage = () => {
  const dispatch = useAppDispatch();
  const {
    music,
    currentMusic,
    loading,
    creating,
    updating,
    deleting,
    error,
    metadata,
    filters,
  } = useAppSelector((state) => state.adminMusic);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [playingMusicId, setPlayingMusicId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAdminMusic());
  }, [dispatch, filters]);

  const handleApplyFilters = (newFilters: { section: string; search: string }) => {
    dispatch(setFilters({ ...newFilters, page: 1 }));
  };

  const handleCreateMusic = async (musicData: Omit<Audio, 'id'>) => {
    const result = await dispatch(createMusic(musicData));
    if (createMusic.fulfilled.match(result)) {
      setIsCreateModalOpen(false);
      setSuccessMessage('Music uploaded successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleUpdateMusic = async (musicData: Omit<Audio, 'id'>) => {
    if (currentMusic?.id) {
      const result = await dispatch(updateMusic({ id: currentMusic.id, data: musicData }));
      if (updateMusic.fulfilled.match(result)) {
        setIsEditModalOpen(false);
        setSuccessMessage('Music updated successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    }
  };

  const handleDeleteMusic = async () => {
    if (currentMusic?.id) {
      const result = await dispatch(deleteMusic(currentMusic.id));
      if (deleteMusic.fulfilled.match(result)) {
        setIsDeleteModalOpen(false);
        setSuccessMessage('Music deleted successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    }
  };

  const handleEdit = (musicItem: any) => {
    dispatch(setCurrentMusic(musicItem));
    setIsEditModalOpen(true);
  };

  const handleDelete = (musicItem: any) => {
    dispatch(setCurrentMusic(musicItem));
    setIsDeleteModalOpen(true);
  };

  const handlePlayMusic = (musicItem: any) => {
    if (currentAudio) {
      currentAudio.pause();
    }

    if (musicItem.url) {
      if (playingMusicId === musicItem.id) {
        setPlayingMusicId(null);
        setCurrentAudio(null);
      } else {
        const audio = new Audio(musicItem.url);
        audio.play();
        setCurrentAudio(audio);
        setPlayingMusicId(musicItem.id);

        audio.addEventListener('ended', () => {
          setCurrentAudio(null);
          setPlayingMusicId(null);
        });
      }
    }
  };

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
  };

  const handleLimitChange = (limit: number) => {
    dispatch(setLimit(limit));
  };

  return (
    <>
      <PageBreadCrumb pageTitle="Music Library" />

      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold text-black dark:text-white">
              Music Library
            </h2>
            <BadgeStatus variant="info" size="sm">
              <MusicIcon className="h-4 w-4 mr-1" />
              Music Section
            </BadgeStatus>
          </div>
          <ButtonAction
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            Upload Music
          </ButtonAction>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <AlertMessage
            type="success"
            message={successMessage}
            onClose={() => setSuccessMessage(null)}
          />
        )}
        {error && (
          <AlertMessage
            type="error"
            message={error}
            onClose={() => dispatch(clearError())}
          />
        )}

        {/* Filters */}
        <MusicFilters
          filters={filters}
          onApplyFilters={handleApplyFilters}
        />

        {/* Table */}
        <MusicTable
          music={music as any}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPlay={handlePlayMusic}
          loading={loading}
        />

        {/* Pagination */}
        {metadata && music.length > 0 && (
          <div className="flex justify-center">
            <Pagination
              currentPage={metadata.currentPage}
              totalPages={metadata.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {/* Audio Preview Player - Hidden but plays audio */}
        {playingMusicId && currentAudio && (
          <div className="fixed bottom-4 right-4 z-50 max-w-sm">
            <AudioPreviewPlayer
              src={currentAudio.src}
              isPlaying={!!playingMusicId}
              onPlayStateChange={(playing) => {
                if (!playing) {
                  currentAudio.pause();
                  setPlayingMusicId(null);
                  setCurrentAudio(null);
                }
              }}
            />
          </div>
        )}

        {/* Modals */}
        <MusicFormModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateMusic}
          loading={creating}
        />

        <MusicFormModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            dispatch(setCurrentMusic(null));
          }}
          onSubmit={handleUpdateMusic}
          music={currentMusic}
          loading={updating}
        />

        <DeleteMusicModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            dispatch(setCurrentMusic(null));
          }}
          onConfirm={handleDeleteMusic}
          music={currentMusic}
          loading={deleting}
          error={error}
        />
      </div>
    </>
  );
};

export default MusicPage;
