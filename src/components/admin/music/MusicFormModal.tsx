'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/modal';
import ButtonAction from '@/components/ui/button/ButtonAction';
import InputField from '@/components/form/input/InputField';
import Switch from '@/components/form/switch/Switch';
import FileUploadField from '@/components/form/input/FileUploadField';
import type { Audio } from '@/types/album';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import Image from 'next/image';

// Extend Audio interface for music-specific fields
interface MusicData extends Omit<Audio, 'id'> {
  coverArt?: string;
  playCount?: number;
  sections?: string[];
}

interface MusicFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MusicData & {
    trackFile?: File;
    previewFile?: File;
    coverArtFile?: File;
  }) => void;
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
  const dispatch = useAppDispatch();
  const { authToken } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState<MusicData>({
    title: '',
    artist: '',
    track: '',
    duration: 0,
    premium: false,
    released: false,
    preview: '',
    album: null,
    sections: ['RenewMe'],
  });

  const [files, setFiles] = useState<{
    track: File | null;
    preview: File | null;
  }>({
    track: null,
    preview: null,
  });

  const [previews, setPreviews] = useState<{
    coverArt: string | null;
  }>({
    coverArt: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [durationInput, setDurationInput] = useState({ minutes: 0, seconds: 0 });
  const [audioDurations, setAudioDurations] = useState<{
    track: number;
    preview: number;
  }>({ track: 0, preview: 0 });

  useEffect(() => {
    if (music) {
      setFormData({
        title: music.title || '',
        artist: music.artist || '',
        track: music.track || '',
        duration: music.duration || 0,
        premium: music.premium || false,
        released: music.released || false,
        preview: music.preview || '',
        album: music.album || null,
        sections: music.sections || ['RenewMe'],
      });
      // Convert duration to minutes and seconds
      const minutes = Math.floor(music.duration / 60);
      const seconds = music.duration % 60;
      setDurationInput({ minutes, seconds });
      setPreviews({
        coverArt: (music as any).coverArt || null,
      });
    } else {
      setFormData({
        title: '',
        artist: '',
        track: '',
        duration: 0,
        premium: false,
        released: false,
        preview: '',
        album: null,
        sections: ['RenewMe'],
      });
      setDurationInput({ minutes: 0, seconds: 0 });
      setPreviews({ coverArt: null });
    }
    setFiles({ track: null, preview: null });
    setErrors({});
  }, [music, isOpen]);

  const genreOptions = [
    { value: '', label: 'Select Genre' },
    { value: 'Ambient', label: 'Ambient' },
    { value: 'Classical', label: 'Classical' },
    { value: 'Electronic', label: 'Electronic' },
    { value: 'Jazz', label: 'Jazz' },
    { value: 'Meditation', label: 'Meditation' },
    { value: 'Nature', label: 'Nature Sounds' },
    { value: 'Piano', label: 'Piano' },
    { value: 'Relaxation', label: 'Relaxation' },
    { value: 'Spa', label: 'Spa Music' },
    { value: 'World', label: 'World Music' },
    { value: 'Other', label: 'Other' },
  ];

  const handleAudioFileChange = (field: 'track' | 'preview') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles(prev => ({ ...prev, [field]: file }));

      // Get audio duration
      const audio = new Audio();
      audio.onloadedmetadata = () => {
        const duration = Math.floor(audio.duration);
        setAudioDurations(prev => ({ ...prev, [field]: duration }));

        // Auto-set duration if it's the main track
        if (field === 'track' && duration > 0) {
          const minutes = Math.floor(duration / 60);
          const seconds = duration % 60;
          setDurationInput({ minutes, seconds });
          setFormData(prev => ({ ...prev, duration }));
        }
      };
      audio.src = URL.createObjectURL(file);
    }
  };

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

    // Only require track file for new music
    if (!music && !files.track && !formData.track) {
      newErrors.track = 'Music file is required';
    }

    if (formData.duration === 0) {
      newErrors.duration = 'Duration is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Submit the music data with files
    onSubmit({
      ...formData,
      trackFile: files.track || undefined,
      previewFile: files.preview || undefined,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="px-6 py-6">
        <h3 className="text-xl font-semibold text-black dark:text-white mb-6">
          {music ? `Edit Music: ${music.title}` : 'Upload Music'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Title"
            name="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            error={errors.title}
            required
            placeholder="Enter music title"
          />

          <InputField
            label="Artist"
            name="artist"
            value={formData.artist || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, artist: e.target.value }))}
            placeholder="Enter artist name"
          />

          <InputField
            label="Album (Optional)"
            name="album"
            value={formData.album?.title || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, album: { title: e.target.value } } as any))}
            placeholder="Enter album name (optional)"
          />

          <FileUploadField
            label="Music File"
            name="track"
            accept="audio/*"
            onChange={handleAudioFileChange('track')}
            error={errors.track}
            helperText={music?.track ? 'Upload new file to replace existing' : 'MP3, WAV, OGG, AAC, or FLAC'}
            required={!music}
          />
          {files.track && audioDurations.track > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400 -mt-2">
              Duration: {Math.floor(audioDurations.track / 60)}:{(audioDurations.track % 60).toString().padStart(2, '0')}
            </p>
          )}

          <FileUploadField
            label="Preview (Optional)"
            name="preview"
            accept="audio/*"
            onChange={handleAudioFileChange('preview')}
            helperText="Short preview clip (30-60 seconds)"
          />
          {files.preview && audioDurations.preview > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400 -mt-2">
              Preview Duration: {Math.floor(audioDurations.preview / 60)}:{(audioDurations.preview % 60).toString().padStart(2, '0')}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                Duration <span className="text-meta-1">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={durationInput.minutes}
                  onChange={(e) => handleDurationChange('minutes', e.target.value)}
                  placeholder="0"
                  min="0"
                  className="w-20 rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                <span className="text-black dark:text-white">min</span>
                <input
                  type="number"
                  value={durationInput.seconds}
                  onChange={(e) => handleDurationChange('seconds', e.target.value)}
                  placeholder="0"
                  min="0"
                  max="59"
                  className="w-20 rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                <span className="text-black dark:text-white">sec</span>
              </div>
              {errors.duration && (
                <p className="mt-1 text-sm text-meta-1">{errors.duration}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Switch
                label="Premium Music"
                defaultChecked={formData.premium}
                onChange={(checked) => setFormData(prev => ({ ...prev, premium: checked }))}
              />
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Mark this music as premium content
              </p>
            </div>

            <div>
              <Switch
                label="Published"
                defaultChecked={formData.released}
                onChange={(checked) => setFormData(prev => ({ ...prev, released: checked }))}
              />
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Make this music visible to users
              </p>
            </div>
          </div>

          {errors.submit && (
            <div className="text-red-500 text-sm">{errors.submit}</div>
          )}

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
              {music ? 'Update Music' : 'Create Music'}
            </ButtonAction>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default MusicFormModal;