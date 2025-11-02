'use client';

import React from 'react';
import Modal from '@/components/ui/modal';
import ButtonAction from '@/components/ui/button/ButtonAction';
import AlertMessage from '@/components/ui/alert/AlertMessage';
import { Audio } from '@/types/album';

interface DeleteMusicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  music: Audio | null;
  loading?: boolean;
  error?: string | null;
}

const DeleteMusicModal: React.FC<DeleteMusicModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  music,
  loading,
  error,
}) => {
  if (!music) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="px-6 py-6">
        <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
          Delete Music?
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to delete '{music.title}'? This action cannot be undone.
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

export default DeleteMusicModal;
