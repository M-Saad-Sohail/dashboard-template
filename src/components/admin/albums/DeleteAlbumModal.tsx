'use client';

import React from 'react';
import Modal from '@/components/ui/modal';
import ButtonAction from '@/components/ui/button/ButtonAction';
import AlertMessage from '@/components/ui/alert/AlertMessage';
import { AudioAlbum } from '@/types/album';

interface DeleteAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  album: AudioAlbum | null;
  loading?: boolean;
  error?: string | null;
}

const DeleteAlbumModal: React.FC<DeleteAlbumModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  album,
  loading,
  error,
}) => {
  if (!album) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="px-6 py-6">
        <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
          Delete Album?
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to delete '{album.title}'? This action cannot be undone.
        </p>

        {error && (
          <div className="mb-4">
            <AlertMessage 
              type="error" 
              message={error}
              dismissible={false}
            />
          </div>
        )}

        <div className="flex justify-end gap-3">
          <ButtonAction
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </ButtonAction>
          <ButtonAction
            type="button"
            variant="danger"
            onClick={onConfirm}
            loading={loading}
          >
            Delete
          </ButtonAction>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteAlbumModal;
