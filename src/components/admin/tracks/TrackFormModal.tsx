'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/modal';
import ButtonAction from '@/components/ui/button/ButtonAction';
import InputField from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import Switch from '@/components/form/switch/Switch';
import { Audio, AudioAlbum } from '@/types/album';

interface TrackFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Audio, 'id'>) => void;
  track?: Audio | null;
  albums?: AudioAlbum[];
  loading?: boolean;
}

const TrackFormModal: React.FC<TrackFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  track,
  albums = [],
  loading,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    albumId: '',
    track: '',
    duration: 0,
    premium: false,
    released: false,
    preview: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [durationInput, setDurationInput] = useState({ minutes: 0, seconds: 0 });

  useEffect(() => {
    if (track) {
      setFormData({
        title: track.title || '',
        artist: track.artist || '',
        albumId: track.albumId || '',
        track: track.track || '',
        duration: track.duration || 0,
        premium: track.premium || false,
        released: track.released || false,
        preview: track.preview || '',
      });
    } else {
      setFormData({
        title: '',
        artist: '',
        albumId: '',
        track: '',
        duration: 0,
        premium: false,
        released: false,
        preview: '',
      });
      setDurationInput({ minutes: 0, seconds: 0 });
    }
    setErrors({});
  }, [track, isOpen]);

  const albumOptions = [
    { value: '', label: 'No Album' },
    ...albums.map(album => ({
      value: album.id || '',
      label: album.title,
    })),
  ];

  const handleDurationChange = (field: 'minutes' | 'seconds', value: string) => {
    const numValue = parseInt(value) || 0;
    const newDuration = { ...durationInput, [field]: numValue };
    setDurationInput(newDuration);
    
    // Calculate total duration in seconds
    const totalSeconds = newDuration.minutes * 60 + newDuration.seconds;
    setFormData(prev => ({ ...prev, duration: totalSeconds }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title || formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.track) {
      newErrors.track = 'Track URL is required';
    } else if (!isValidUrl(formData.track)) {
      newErrors.track = 'Please enter a valid Track URL';
    }

    if (formData.duration === 0) {
      newErrors.duration = 'Duration is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData as Omit<Audio, 'id'>);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="px-6 py-6">
        <h3 className="text-xl font-semibold text-black dark:text-white mb-6">
          {track ? `Edit Track: ${track.title}` : 'Create Track'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            name="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            error={!!errors.title}
            placeholder="Enter track title"
          />

          <InputField
            name="artist"
            value={formData.artist}
            onChange={(e) => setFormData(prev => ({ ...prev, artist: e.target.value }))}
            placeholder="Enter artist name (optional)"
          />

          <Select
            value={formData.albumId}
            onChange={(value) => setFormData(prev => ({ ...prev, albumId: value }))}
            options={albumOptions}
            placeholder="Select an album (optional)"
          />

          <InputField 
            name="track"
            value={formData.track}
            onChange={(e) => setFormData(prev => ({ ...prev, track: e.target.value }))}
            error={!!errors.track}
            placeholder="https://example.com/audio.mp3"
          />

          <InputField
            name="preview"
            value={formData.preview || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, preview: e.target.value }))}
            error={!!errors.preview || formData.preview === null}
            placeholder="https://example.com/preview.mp3"
          />

          <div>
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Duration <span className="text-danger">*</span>
            </label>
            <div className="flex items-center gap-2">
              <InputField
                type="number"
                value={durationInput.minutes}
                onChange={(e) => handleDurationChange('minutes', e.target.value)}
                placeholder="0"
                min="0"
                className="w-20"
              />
              <span className="text-black dark:text-white">min</span>
              <InputField
                type="number"
                value={durationInput.seconds}
                onChange={(e) => handleDurationChange('seconds', e.target.value)}
                placeholder="0"
                min="0"
                max="59"
                className="w-20"
              />
              <span className="text-black dark:text-white">sec</span>
            </div>
            {errors.duration && (
              <p className="mt-1 text-xs text-danger">{errors.duration}</p>
            )}
          </div>

          <div className="space-y-4">
            <Switch
              label="Premium Track"
              defaultChecked={formData.premium || false}
              onChange={(checked) => setFormData(prev => ({ ...prev, premium: checked }))}
            />

            <Switch
              label="Published"
              defaultChecked={formData.released || false}
              onChange={(checked) => setFormData(prev => ({ ...prev, released: checked }))}
            />
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <ButtonAction
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </ButtonAction>
            <ButtonAction
              type="submit"
              variant="primary"
              loading={loading}
            >
              {track ? 'Update Track' : 'Create Track'}
            </ButtonAction>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default TrackFormModal;
