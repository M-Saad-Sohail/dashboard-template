'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/modal';
import ButtonAction from '@/components/ui/button/ButtonAction';
import InputField from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import Switch from '@/components/form/switch/Switch';
import { Audio } from '@/lib/admin-api-client';

// Extend Audio interface for music-specific fields
interface MusicData extends Omit<Audio, 'id'> {
  genre?: string;
  coverPortrait?: string;
  playCount?: number;
}

interface MusicFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MusicData) => void;
  music?: Audio | null;
  loading?: boolean;
}

const MusicFormModal: React.FC<MusicFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  music,
  loading,
}) => {
  const [formData, setFormData] = useState<MusicData>({
    title: '',
    artist: '',
    track: '',
    duration: 0,
    premium: false,
    released: false,
    genre: '',
    coverPortrait: '',
    preview: '',
    album: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [durationInput, setDurationInput] = useState({ minutes: 0, seconds: 0 });

  useEffect(() => {
    if (music) {
      setFormData({
        title: music.title || '',
        artist: music.artist || '',
        track: music.track || '',
        duration: music.duration || 0,
        premium: music.premium || false,
        released: music.released || false,
        genre: (music as any).genre || '',
        coverPortrait: (music as any).coverPortrait || '',
        preview: (music as any).preview || '',
        album: (music as any).album || null,
      });
      // Convert duration to minutes and seconds
      const minutes = Math.floor(music.duration / 60);
      const seconds = music.duration % 60;
      setDurationInput({ minutes, seconds });
    } else {
      setFormData({
        title: '',
        artist: '',
        track: '',
        duration: 0,
        premium: false,
        released: false,
        genre: '',
        coverPortrait: '',
        preview: '',
        album: null,
      });
      setDurationInput({ minutes: 0, seconds: 0 });
    }
    setErrors({});
  }, [music, isOpen]);

  const genreOptions = [
    { value: '', label: 'Select Genre' },
    { value: 'Pop', label: 'Pop' },
    { value: 'Rock', label: 'Rock' },
    { value: 'Hip Hop', label: 'Hip Hop' },
    { value: 'Electronic', label: 'Electronic' },
    { value: 'Classical', label: 'Classical' },
    { value: 'Jazz', label: 'Jazz' },
    { value: 'Country', label: 'Country' },
    { value: 'R&B', label: 'R&B' },
    { value: 'Ambient', label: 'Ambient' },
    { value: 'Meditation', label: 'Meditation' },
    { value: 'Other', label: 'Other' },
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
      newErrors.track = 'Audio URL is required';
    } else if (!isValidUrl(formData.track)) {
      newErrors.track = 'Please enter a valid URL';
    }

    if (formData.coverPortrait && !isValidUrl(formData.coverPortrait)) {
      newErrors.coverPortrait = 'Please enter a valid URL';
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
      onSubmit(formData);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="px-6 py-6">
        <h3 className="text-xl font-semibold text-black dark:text-white mb-6">
          {music ? `Edit Music: ${music.title}` : 'Upload Music'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            name="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            error={!!errors.title}
            placeholder="Enter music title"
          />

          <InputField
            name="artist"
            value={formData.artist || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, artist: e.target.value }))}
            placeholder="Enter artist name"
          />

          <InputField
            name="album"
            value={(formData as any).album || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, album: { title: e.target.value } } as any))}
            placeholder="Enter album name (optional)"
          />

          <InputField
            name="track"
            value={formData.track}
            onChange={(e) => setFormData(prev => ({ ...prev, track: e.target.value }))}
            error={!!errors.track}
            placeholder="https://example.com/music.mp3"
          />

          <InputField
            name="coverPortrait"
            value={formData.coverPortrait || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, coverPortrait: e.target.value }))}
            error={!!errors.coverPortrait}
            placeholder="https://example.com/cover.jpg"
          />

          <Select
            value={formData.genre || ''}
            onChange={(value) => setFormData(prev => ({ ...prev, genre: value }))}
            options={genreOptions}
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
              label="Premium Music"
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
              {music ? 'Update Music' : 'Upload Music'}
            </ButtonAction>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default MusicFormModal;
