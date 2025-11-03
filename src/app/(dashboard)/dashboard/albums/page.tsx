'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { useRouter } from 'next/navigation';
import PageBreadCrumb from '@/components/common/PageBreadCrumb';
import ButtonAction from '@/components/ui/button/ButtonAction';
import AlertMessage from '@/components/ui/alert/AlertMessage';
import AlbumsTable from '@/components/admin/albums/AlbumsTable';
import AlbumFormModal from '@/components/admin/albums/AlbumFormModal';
import DeleteAlbumModal from '@/components/admin/albums/DeleteAlbumModal';
import AlbumFilters from '@/components/admin/albums/AlbumFilters';
import Pagination from '@/components/tables/Pagination';
import { 
  fetchAdminAlbums, 
  createAlbum, 
  updateAlbum, 
  deleteAlbum,
  setCurrentAlbum,
  setFilters,
  setPage,
  setLimit,
  clearError
} from '@/_core/features/adminAlbumsSlice';
import { AudioAlbum } from '@/types/album';
import { PlusIcon } from '@/icons';

const AlbumsPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Get auth token
  const { authToken, isAuthenticated } = useAppSelector((state) => state.auth);
  
  const { 
    albums, 
    currentAlbum, 
    loading, 
    creating, 
    updating, 
    deleting,
    error, 
    metadata, 
    filters 
  } = useAppSelector((state) => state.adminAlbums);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/signin');
    }
  }, [isAuthenticated, router]);

  // Fetch albums when filters change or token is available
  useEffect(() => {
    if (authToken) {
      dispatch(fetchAdminAlbums({ token: authToken }));
    }
  }, [dispatch, authToken, filters]);

  const handleApplyFilters = (newFilters: { section: string; groupBy: string; search: string }) => {
    dispatch(setFilters({ ...newFilters, page: 1 }));
  };

  const handleCreateAlbum = async (albumData: Omit<AudioAlbum, 'id'> & {
    coverPortraitFile?: File;
    coverLandscapeFile?: File;
  }) => {
    const result = await dispatch(createAlbum({ albumData, token: authToken }));
    if (createAlbum.fulfilled.match(result)) {
      setIsCreateModalOpen(false);
      // Toast notification shown automatically
    }
  };

  const handleUpdateAlbum = async (albumData: Omit<AudioAlbum, 'id'> & {
    coverPortraitFile?: File;
    coverLandscapeFile?: File;
  }) => {
    if (currentAlbum?.id) {
      const result = await dispatch(updateAlbum({ id: currentAlbum.id, data: albumData, token: authToken }));
      if (updateAlbum.fulfilled.match(result)) {
        setIsEditModalOpen(false);
        // Toast notification shown automatically
      }
    }
  };

  const handleDeleteAlbum = async () => {
    if (currentAlbum?.id) {
      const result = await dispatch(deleteAlbum({ id: currentAlbum.id, token: authToken }));
      if (deleteAlbum.fulfilled.match(result)) {
        setIsDeleteModalOpen(false);
        // Toast notification shown automatically
      }
    }
  };

  const handleEdit = (album: AudioAlbum) => {
    dispatch(setCurrentAlbum(album));
    setIsEditModalOpen(true);
  };

  const handleDelete = (album: AudioAlbum) => {
    dispatch(setCurrentAlbum(album));
    setIsDeleteModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
  };

  const handleLimitChange = (limit: number) => {
    dispatch(setLimit(limit));
  };

  return (
    <>
      <PageBreadCrumb pageTitle="Meditation Albums" />

      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-black dark:text-white">
            Meditation Albums
          </h2>
          <ButtonAction
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            Create Album
          </ButtonAction>
        </div>

        {/* Error Messages (Success handled by toast) */}
        {error && (
          <AlertMessage 
            type="error" 
            message={error}
            onClose={() => dispatch(clearError())}
          />
        )}

        {/* Filters */}
        <AlbumFilters 
          filters={filters}
          onApplyFilters={handleApplyFilters}
        />

        {/* Table */}
        <AlbumsTable
          albums={albums}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />

        {/* Pagination */}
        {metadata && albums.length > 0 && (
          <div className="flex justify-center">
            <Pagination
              currentPage={metadata.currentPage}
              totalPages={metadata.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {/* Modals */}
        <AlbumFormModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateAlbum}
          loading={creating}
        />

        <AlbumFormModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            dispatch(setCurrentAlbum(null));
          }}
          onSubmit={handleUpdateAlbum}
          album={currentAlbum}
          loading={updating}
        />

        <DeleteAlbumModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            dispatch(setCurrentAlbum(null));
          }}
          onConfirm={handleDeleteAlbum}
          album={currentAlbum}
          loading={deleting}
          error={error}
        />
      </div>
    </>
  );
};

export default AlbumsPage;
