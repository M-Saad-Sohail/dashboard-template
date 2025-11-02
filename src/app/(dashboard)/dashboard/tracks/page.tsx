'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import PageBreadCrumb from '@/components/common/PageBreadCrumb';
import ButtonAction from '@/components/ui/button/ButtonAction';
import AlertMessage from '@/components/ui/alert/AlertMessage';
import TracksTable from '@/components/admin/tracks/TracksTable';
import TrackFormModal from '@/components/admin/tracks/TrackFormModal';
import DeleteTrackModal from '@/components/admin/tracks/DeleteTrackModal';
import TrackFilters from '@/components/admin/tracks/TrackFilters';
import BulkActionsBar from '@/components/admin/tracks/BulkActionsBar';
import AudioPreviewPlayer from '@/components/admin/tracks/AudioPreviewPlayer';
import Pagination from '@/components/tables/Pagination';
import {
  fetchAdminTracks,
  createTrack,
  updateTrack,
  deleteTrack,
  bulkDeleteTracks,
  bulkUpdateTracks,
  setCurrentTrack,
  setFilters,
  setPage,
  setLimit,
  clearError,
  toggleTrackSelection,
  setSelectedTracks,
  clearSelectedTracks,
} from '@/_core/features/adminTracksSlice';
import { fetchAdminAlbums } from '@/_core/features/adminAlbumsSlice';
import type { Audio } from '@/types/album';
import { PlusIcon } from '@/icons';

const TracksPage = () => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const editTrackId = searchParams.get('edit');

  const {
    tracks,
    currentTrack,
    loading,
    creating,
    updating,
    deleting,
    error,
    metadata,
    filters,
    selectedTracks,
  } = useAppSelector((state) => state.adminTracks);
  const { albums } = useAppSelector((state) => state.adminAlbums);
  const { authToken } = useAppSelector((state) => state.auth);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAdminTracks({ token: authToken }));
    dispatch(fetchAdminAlbums({ token: authToken }));
  }, [dispatch, filters, authToken]);

  // Handle edit parameter from URL
  useEffect(() => {
    if (editTrackId && tracks.length > 0) {
      const trackToEdit = tracks.find(t => t.id === editTrackId);
      if (trackToEdit) {
        handleEdit(trackToEdit);
      }
    }
  }, [editTrackId, tracks]);

  const handleApplyFilters = (newFilters: Omit<typeof filters, 'page' | 'limit'>) => {
    dispatch(setFilters({ ...newFilters, page: 1 }));
  };

  const handleCreateTrack = async (trackData: Omit<Audio, 'id'>) => {
    const result = await dispatch(createTrack({ trackData, token: authToken }));
    if (createTrack.fulfilled.match(result)) {
      setIsCreateModalOpen(false);
      setSuccessMessage('Track created successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleUpdateTrack = async (trackData: Omit<Audio, 'id'>) => {
    if (currentTrack?.id) {
      const result = await dispatch(updateTrack({ id: currentTrack.id, data: trackData, token: authToken }));
      if (updateTrack.fulfilled.match(result)) {
        setIsEditModalOpen(false);
        setSuccessMessage('Track updated successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    }
  };

  const handleDeleteTrack = async () => {
    if (currentTrack?.id) {
      const result = await dispatch(deleteTrack({ id: currentTrack.id, token: authToken }));
      if (deleteTrack.fulfilled.match(result)) {
        setIsDeleteModalOpen(false);
        setSuccessMessage('Track deleted successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedTracks.length > 0 && window.confirm(`Delete ${selectedTracks.length} selected tracks?`)) {
      const result = await dispatch(bulkDeleteTracks({ trackIds: selectedTracks, token: authToken }));
      if (bulkDeleteTracks.fulfilled.match(result)) {
        setSuccessMessage(`${selectedTracks.length} tracks deleted successfully!`);
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    }
  };

  const handleMarkAsReleased = async () => {
    if (selectedTracks.length > 0) {
      const result = await dispatch(bulkUpdateTracks({ 
        ids: selectedTracks, 
        updates: { released: true },
        token: authToken 
      }));
      if (bulkUpdateTracks.fulfilled.match(result)) {
        setSuccessMessage(`${selectedTracks.length} tracks marked as released!`);
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    }
  };

  const handleMarkAsPremium = async () => {
    if (selectedTracks.length > 0) {
      const result = await dispatch(bulkUpdateTracks({ 
        ids: selectedTracks, 
        updates: { premium: true },
        token: authToken 
      }));
      if (bulkUpdateTracks.fulfilled.match(result)) {
        setSuccessMessage(`${selectedTracks.length} tracks marked as premium!`);
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    }
  };

  const handleEdit = (track: Audio) => {
    dispatch(setCurrentTrack(track));
    setIsEditModalOpen(true);
  };

  const handleDelete = (track: Audio) => {
    dispatch(setCurrentTrack(track));
    setIsDeleteModalOpen(true);
  };

  const handlePlayTrack = (track: Audio) => {
    if (currentAudio) {
      currentAudio.pause();
    }

    if (track.preview) {
      if (playingTrackId === track.id) {
        setPlayingTrackId(null);
        setCurrentAudio(null);
      } else {
        const audio = new Audio(track.preview);
        audio.play();
        setCurrentAudio(audio);
        setPlayingTrackId(track.id || null);

        audio.addEventListener('ended', () => {
          setCurrentAudio(null);
          setPlayingTrackId(null);
        });
      }
    }
  };

  const handleToggleAllSelection = (trackIds: string[]) => {
    if (selectedTracks.length === trackIds.length) {
      dispatch(clearSelectedTracks());
    } else {
      dispatch(setSelectedTracks(trackIds));
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
      <PageBreadCrumb pageTitle="Tracks Library" />

      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-black dark:text-white">
            Tracks Library
          </h2>
          <ButtonAction
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            Create Track
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
        <TrackFilters
          filters={filters}
          onApplyFilters={handleApplyFilters}
        />

        {/* Bulk Actions Bar */}
        <BulkActionsBar
          selectedCount={selectedTracks.length}
          onBulkDelete={handleBulkDelete}
          onMarkAsReleased={handleMarkAsReleased}
          onMarkAsPremium={handleMarkAsPremium}
          onClearSelection={() => dispatch(clearSelectedTracks())}
          loading={updating || deleting}
        />

        {/* Table */}
        <TracksTable
          tracks={tracks}
          selectedTracks={selectedTracks}
          onToggleTrackSelection={(id) => dispatch(toggleTrackSelection(id))}
          onToggleAllSelection={handleToggleAllSelection}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPlay={handlePlayTrack}
          loading={loading}
        />

        {/* Pagination */}
        {metadata && tracks.length > 0 && (
          <div className="flex justify-center">
            <Pagination
              currentPage={metadata.currentPage}
              totalPages={metadata.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {/* Audio Preview Player - Hidden but plays audio */}
        {playingTrackId && currentAudio && (
          <div className="fixed bottom-4 right-4 z-50 max-w-sm">
            <AudioPreviewPlayer
              src={currentAudio.src}
              isPlaying={!!playingTrackId}
              onPlayStateChange={(playing) => {
                if (!playing) {
                  currentAudio.pause();
                  setPlayingTrackId(null);
                  setCurrentAudio(null);
                }
              }}
            />
          </div>
        )}

        {/* Modals */}
        <TrackFormModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateTrack}
          albums={albums}
          loading={creating}
        />

        <TrackFormModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            dispatch(setCurrentTrack(null));
          }}
          onSubmit={handleUpdateTrack}
          track={currentTrack}
          albums={albums}
          loading={updating}
        />

        <DeleteTrackModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            dispatch(setCurrentTrack(null));
          }}
          onConfirm={handleDeleteTrack}
          track={currentTrack}
          loading={deleting}
          error={error}
        />
      </div>
    </>
  );
};

export default TracksPage;
