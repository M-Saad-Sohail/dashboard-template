'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import PageBreadCrumb from '@/components/common/PageBreadCrumb';
import ButtonAction from '@/components/ui/button/ButtonAction';
import AlertMessage from '@/components/ui/alert/AlertMessage';
import AlbumInfoCard from '@/components/admin/album-details/AlbumInfoCard';
import AlbumSelector from '@/components/admin/album-details/AlbumSelector';
import AlbumTracksTable from '@/components/admin/album-details/AlbumTracksTable';
import AddTrackModal from '@/components/admin/album-details/AddTrackModal';
import AlbumFormModal from '@/components/admin/albums/AlbumFormModal';
import {
  fetchAlbumBySlug,
  fetchAllAlbumsForDropdown,
  addTrackToAlbum,
  removeTrackFromAlbum,
  clearError,
} from '@/_core/features/adminAlbumDetailsSlice';
import { updateAlbum } from '@/_core/features/adminAlbumsSlice';
import { fetchAdminTracks } from '@/_core/features/adminTracksSlice';
import type { Audio, AudioAlbum } from '@/lib/admin-api-client';
import { PlusIcon } from '@/icons';

interface PageProps {
  params: { slug: string };
}

const AlbumDetailsPage = ({ params }: PageProps) => {
  const { slug } = params;
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const { album, tracks, allAlbums, loading, updating, error } = useAppSelector(
    (state) => state.adminAlbumDetails
  );
  const { tracks: allTracks } = useAppSelector((state) => state.adminTracks);
  const { updating: updatingAlbum } = useAppSelector((state) => state.adminAlbums);

  const [isAddTrackModalOpen, setIsAddTrackModalOpen] = useState(false);
  const [isEditAlbumModalOpen, setIsEditAlbumModalOpen] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAlbumBySlug(slug));
    dispatch(fetchAllAlbumsForDropdown());
    dispatch(fetchAdminTracks());
  }, [dispatch, slug]);

  const handleAlbumChange = (newSlug: string) => {
    router.push(`/dashboard/albums/${newSlug}`);
  };

  const handleAddTracks = async (trackIds: string[]) => {
    if (album?.id) {
      for (const trackId of trackIds) {
        await dispatch(addTrackToAlbum({ albumId: album.id, trackId }));
      }
      setIsAddTrackModalOpen(false);
      setSuccessMessage(`Added ${trackIds.length} track(s) to album!`);
      setTimeout(() => setSuccessMessage(null), 3000);
      // Refresh album data
      dispatch(fetchAlbumBySlug(slug));
    }
  };

  const handleRemoveTrack = async (track: Audio) => {
    if (album?.id && window.confirm(`Remove "${track.title}" from this album?`)) {
      const result = await dispatch(removeTrackFromAlbum({ albumId: album.id, trackId: track.id || '' }));
      if (removeTrackFromAlbum.fulfilled.match(result)) {
        setSuccessMessage('Track removed from album!');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    }
  };

  const handleEditTrack = (track: Audio) => {
    // Navigate to tracks page with track pre-selected for editing
    router.push(`/dashboard/tracks?edit=${track.id}`);
  };

  const handlePlayTrack = (track: Audio) => {
    if (currentAudio) {
      currentAudio.pause();
    }

    if (track.preview) {
      const audio = new Audio(track.preview);
      audio.play();
      setCurrentAudio(audio);
      
      audio.addEventListener('ended', () => {
        setCurrentAudio(null);
      });
    }
  };

  const handleUpdateAlbum = async (albumData: Omit<AudioAlbum, 'id'>) => {
    if (album?.id) {
      const result = await dispatch(updateAlbum({ id: album.id, data: albumData }));
      if (updateAlbum.fulfilled.match(result)) {
        setIsEditAlbumModalOpen(false);
        setSuccessMessage('Album updated successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
        // Refresh album data
        dispatch(fetchAlbumBySlug(slug));
      }
    }
  };

  const existingTrackIds = tracks.map(track => track.id);

  return (
    <>
      <PageBreadCrumb pageTitle={album?.title || 'Album Details'} />

      <div className="flex flex-col gap-6">
        {/* Header with Album Selector */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <AlbumSelector
            albums={allAlbums}
            currentAlbumSlug={slug}
            onAlbumChange={handleAlbumChange}
            loading={loading}
          />
          <ButtonAction
            variant="primary"
            onClick={() => setIsAddTrackModalOpen(true)}
            className="flex items-center gap-2"
            disabled={!album}
          >
            <PlusIcon className="h-4 w-4" />
            Add Track to Album
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

        {/* Album Info */}
        <AlbumInfoCard
          album={album}
          onEdit={() => setIsEditAlbumModalOpen(true)}
          loading={loading}
        />

        {/* Tracks Table */}
        <div>
          <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
            Album Tracks
          </h3>
          <AlbumTracksTable
            tracks={tracks}
            onEdit={handleEditTrack}
            onRemove={handleRemoveTrack}
            onPlay={handlePlayTrack}
            loading={loading}
          />
        </div>

        {/* Modals */}
        <AddTrackModal
          isOpen={isAddTrackModalOpen}
          onClose={() => setIsAddTrackModalOpen(false)}
          onAdd={handleAddTracks}
          availableTracks={allTracks}
          existingTrackIds={existingTrackIds.filter(id => id !== undefined) as string[]}
          loading={updating}
        />

        <AlbumFormModal
          isOpen={isEditAlbumModalOpen}
          onClose={() => setIsEditAlbumModalOpen(false)}
          onSubmit={handleUpdateAlbum}
          album={album}
          loading={updatingAlbum}
        />
      </div>
    </>
  );
};

export default AlbumDetailsPage;
