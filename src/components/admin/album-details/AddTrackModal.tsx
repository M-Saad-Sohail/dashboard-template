'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/modal';
import ButtonAction from '@/components/ui/button/ButtonAction';
import InputField from '@/components/form/input/InputField';
import BadgeStatus from '@/components/ui/badge/BadgeStatus';
import { Audio } from '@/types/album';
import { CheckIcon, PlusIcon } from '@/icons';

interface AddTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (trackIds: string[]) => void;
  availableTracks: Audio[];
  existingTrackIds: string[];
  loading?: boolean;
}

const AddTrackModal: React.FC<AddTrackModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  availableTracks,
  existingTrackIds,
  loading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setSelectedTracks([]);
    }
  }, [isOpen]);

  const filteredTracks = availableTracks.filter(track => 
    track.id && !existingTrackIds.includes(track.id) &&
    (track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (track.artist && track.artist.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const toggleTrackSelection = (trackId: string) => {
    setSelectedTracks(prev => 
      prev.includes(trackId) 
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    );
  };

  const handleAdd = () => {
    if (selectedTracks.length > 0) {
      onAdd(selectedTracks);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="px-6 py-6">
        <h3 className="text-xl font-semibold text-black dark:text-white mb-6">
          Add Tracks to Album
        </h3>

        <div className="mb-6">
          <InputField
            placeholder="Search tracks by title or artist..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {selectedTracks.length} track(s) selected
          </p>

          <div className="max-h-96 overflow-y-auto border border-stroke dark:border-strokedark rounded">
            {filteredTracks.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                {searchTerm ? 'No tracks found matching your search.' : 'No available tracks to add.'}
              </div>
            ) : (
              <div className="divide-y divide-stroke dark:divide-strokedark">
                {filteredTracks.map((track) => (
                  <div
                    key={track.id}
                    className={`p-4 hover:bg-gray-2 dark:hover:bg-meta-4 cursor-pointer transition-colors ${
                      track.id && selectedTracks.includes(track.id) ? 'bg-primary/10' : ''
                    }`}
                    onClick={() => track.id && toggleTrackSelection(track.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-black dark:text-white mb-1">
                          {track.title}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>{track.artist || 'Unknown Artist'}</span>
                          <span>•</span>
                          <span>{formatDuration(track.duration)}</span>
                            {track.premium && (
                              <>
                                <span>•</span>
                                <BadgeStatus variant="success" size="sm">Premium</BadgeStatus>
                              </>
                            )}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          track.id && selectedTracks.includes(track.id) 
                            ? 'bg-primary border-primary' 
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {track.id && selectedTracks.includes(track.id) && (
                            <CheckIcon className="h-3 w-3 text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Don't see the track you're looking for?</span>
            <ButtonAction
              variant="link"
              size="sm"
              onClick={() => window.location.href = '/dashboard/tracks'}
            >
              Create New Track
            </ButtonAction>
          </div>

          <div className="flex gap-3">
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
              variant="primary"
              onClick={handleAdd}
              loading={loading}
              disabled={selectedTracks.length === 0}
              className="flex items-center gap-2"
            >
              <PlusIcon className="h-4 w-4" />
              Add {selectedTracks.length > 0 && `(${selectedTracks.length})`}
            </ButtonAction>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddTrackModal;
