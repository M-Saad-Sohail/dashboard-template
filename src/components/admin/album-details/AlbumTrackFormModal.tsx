'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/modal';
import ButtonAction from '@/components/ui/button/ButtonAction';
import InputField from '@/components/form/input/InputField';
import Switch from '@/components/form/switch/Switch';
import FileUploadField from '@/components/form/input/FileUploadField';
import type { Audio, AudioAlbum } from '@/types/album';

interface AlbumTrackFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Audio, 'id'> & {
    trackFile?: File;
    previewFile?: File;
    albumSlug?: string;
  }) => void;
  track?: Audio | null;
  album?: AudioAlbum | null;
  albumSlug?: string;
  loading?: boolean;
}

const AlbumTrackFormModal: React.FC<AlbumTrackFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  track,
  album,
  albumSlug,
  loading,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    track: '',
    duration: 0,
    premium: false,
    released: false,
    preview: null as string | null,
    sections: 'RenewMe',
    subtitle: '',
    narrator: '',
  });

  const [files, setFiles] = useState<{
    track: File | null;
    preview: File | null;
  }>({
    track: null,
    preview: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [durationInput, setDurationInput] = useState({ minutes: 0, seconds: 0 });
  const [audioDurations, setAudioDurations] = useState<{
    track: number;
    preview: number;
  }>({ track: 0, preview: 0 });

  useEffect(() => {
    if (track) {
      setFormData({
        title: track.title || '',
        artist: track.artist || '',
        track: track.track || '',
        duration: track.duration || 0,
        premium: track.premium || false,
        released: track.released || false,
        preview: track.preview || '',
        sections: track.sections?.join(',') || 'RenewMe',
        subtitle: track.subtitle || '',
        narrator: track.narrator || '',
      });
      // Set duration input fields from track duration
      const minutes = Math.floor((track.duration || 0) / 60);
      const seconds = (track.duration || 0) % 60;
      setDurationInput({ minutes, seconds });
    } else {
      setFormData({
        title: '',
        artist: '',
        track: '',
        duration: 0,
        premium: false,
        released: false,
        preview: '',
        sections: 'RenewMe',
        subtitle: '',
        narrator: '',
      });
      setDurationInput({ minutes: 0, seconds: 0 });
    }
    setFiles({ track: null, preview: null });
    setErrors({});
  }, [track, isOpen]);

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

    // Only require track file for new tracks
    if (!track && !files.track && !formData.track) {
      newErrors.track = 'Track audio file is required';
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

    // Submit the track data with files
    onSubmit({
      title: formData.title,
      artist: formData.artist,
      track: formData.track,
      duration: formData.duration,
      premium: formData.premium,
      released: formData.released,
      subtitle: formData.subtitle,
      narrator: formData.narrator,
      preview: formData.preview || undefined,
      sections: formData.sections?.split(',').filter(s => s.trim()) || ['RenewMe'],
      album: null,
      trackFile: files.track || undefined,
      previewFile: files.preview || undefined,
      albumSlug: albumSlug,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="px-6 py-6">
        <h3 className="text-xl font-semibold text-black dark:text-white mb-6">
          {track ? `Edit Track: ${track.title}` : `Create Track for ${album?.title || 'Album'}`}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Title"
            name="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            error={errors.title}
            required
            placeholder="Enter track title"
          />

          <InputField
            label="Artist"
            name="artist"
            value={formData.artist}
            onChange={(e) => setFormData(prev => ({ ...prev, artist: e.target.value }))}
            placeholder="Enter artist name (optional)"
          />

          <InputField
            label="Subtitle"
            name="subtitle"
            value={formData.subtitle}
            onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
            placeholder="Enter subtitle (optional)"
          />

          <InputField
            label="Narrator"
            name="narrator"
            value={formData.narrator}
            onChange={(e) => setFormData(prev => ({ ...prev, narrator: e.target.value }))}
            placeholder="Enter narrator name (optional)"
          />

          <FileUploadField
            label="Track Audio File"
            name="track"
            accept="audio/*"
            onChange={handleAudioFileChange('track')}
            error={errors.track}
            helperText={track?.track ? 'Upload new file to replace existing' : 'MP3, WAV, OGG, AAC, or FLAC'}
            required={!track}
          />
          {files.track && audioDurations.track > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400 -mt-2">
              Duration: {Math.floor(audioDurations.track / 60)}:{(audioDurations.track % 60).toString().padStart(2, '0')}
            </p>
          )}

          <FileUploadField
            label="Preview Audio File (Optional)"
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

          <InputField
            label="Sections"
            name="sections"
            value={formData.sections}
            onChange={(e) => setFormData(prev => ({ ...prev, sections: e.target.value }))}
            placeholder="Enter sections (comma-separated)"
            helperText="Default: RenewMe"
          />

          <div className="space-y-4">
            <div>
              <Switch
                label="Premium Track"
                defaultChecked={formData.premium}
                onChange={(checked) => setFormData(prev => ({ ...prev, premium: checked }))}
              />
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Mark this track as premium content
              </p>
            </div>

            <div>
              <Switch
                label="Published"
                defaultChecked={formData.released}
                onChange={(checked) => setFormData(prev => ({ ...prev, released: checked }))}
              />
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Make this track visible to users
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
              {track ? 'Update Track' : 'Create Track'}
            </ButtonAction>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AlbumTrackFormModal;
