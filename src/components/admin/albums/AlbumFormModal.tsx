'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/modal';
import ButtonAction from '@/components/ui/button/ButtonAction';
import InputField from '@/components/form/input/InputField';
import Switch from '@/components/form/switch/Switch';
import FileUploadField from '@/components/form/input/FileUploadField';
import { AudioAlbum } from '@/types/album';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import Image from 'next/image';

interface AlbumFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<AudioAlbum, 'id'> & {
    coverPortraitFile?: File;
    coverLandscapeFile?: File;
  }) => void;
  album?: AudioAlbum | null;
  loading?: boolean;
}

const AlbumFormModal: React.FC<AlbumFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  album,
  loading,
}) => {
  const dispatch = useAppDispatch();
  const { authToken } = useAppSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    coverPortrait: '',
    coverSmallLandscape: '',
    sections: 'RenewMe',
    author: '',
    narrator: '',
    premium: false,
    released: false,
  });

  const [files, setFiles] = useState<{
    coverPortrait: File | null;
    coverSmallLandscape: File | null;
  }>({
    coverPortrait: null,
    coverSmallLandscape: null,
  });

  const [previews, setPreviews] = useState<{
    coverPortrait: string | null;
    coverSmallLandscape: string | null;
  }>({
    coverPortrait: null,
    coverSmallLandscape: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (album) {
      setFormData({
        title: album.title || '',
        slug: album.slug || '',
        coverPortrait: album.coverPortrait || '',
        coverSmallLandscape: album.coverSmallLandscape || '',
        sections: album.sections?.join(',') || 'RenewMe',
        author: album.author || '',
        narrator: album.narrator || '',
        premium: album.premium || false,
        released: album.released || false,
      });
      setPreviews({
        coverPortrait: album.coverPortrait || null,
        coverSmallLandscape: album.coverSmallLandscape || null,
      });
    } else {
      setFormData({
        title: '',
        slug: '',
        coverPortrait: '',
        coverSmallLandscape: '',
        sections: 'RenewMe',
        author: '',
        narrator: '',
        premium: false,
        released: false,
      });
      setPreviews({
        coverPortrait: null,
        coverSmallLandscape: null,
      });
    }
    setFiles({
      coverPortrait: null,
      coverSmallLandscape: null,
    });
    setErrors({});
  }, [album, isOpen]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: !album ? generateSlug(title) : prev.slug,
    }));
  };

  const handleFileChange = (field: 'coverPortrait' | 'coverSmallLandscape') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles(prev => ({ ...prev, [field]: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title || formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.slug || !/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug must be lowercase with hyphens only';
    }

    // Only require images for new albums
    if (!album && !files.coverPortrait && !formData.coverPortrait) {
      newErrors.coverPortrait = 'Portrait cover image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Submit the album data with files
    onSubmit({
      ...formData,
      sections: formData.sections?.split(',').filter(s => s.trim()) || ['RenewMe'],
      coverPortraitFile: files.coverPortrait || undefined,
      coverLandscapeFile: files.coverSmallLandscape || undefined,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="px-6 py-6">
        <h3 className="text-xl font-semibold text-black dark:text-white mb-6">
          {album ? `Edit Album: ${album.title}` : 'Create Album'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleTitleChange}
            error={errors.title}
            required
            placeholder="Enter album title"
          />

          <InputField
            label="Slug"
            name="slug"
            value={formData.slug}
            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
            error={errors.slug}
            required
            placeholder="album-slug"
            helperText="URL-friendly version of the title"
          />

          <InputField
            label="Author"
            name="author"
            value={formData.author}
            onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
            placeholder="Enter author name (optional)"
          />

          <InputField
            label="Narrator"
            name="narrator"
            value={formData.narrator}
            onChange={(e) => setFormData(prev => ({ ...prev, narrator: e.target.value }))}
            placeholder="Enter narrator name (optional)"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FileUploadField
                label="Cover Portrait Image"
                name="coverPortrait"
                accept="image/*"
                onChange={handleFileChange('coverPortrait')}
                error={errors.coverPortrait}
                helperText="Portrait image for the album"
                required={!album}
              />
              {previews.coverPortrait && (
                <div className="mt-2">
                  <Image
                    src={previews.coverPortrait}
                    alt="Cover Portrait Preview"
                    width={120}
                    height={160}
                    className="rounded-lg object-cover"
                  />
                </div>
              )}
            </div>

            <div>
              <FileUploadField
                label="Cover Landscape Image"
                name="coverSmallLandscape"
                accept="image/*"
                onChange={handleFileChange('coverSmallLandscape')}
                helperText="Landscape image for the album (optional)"
              />
              {previews.coverSmallLandscape && (
                <div className="mt-2">
                  <Image
                    src={previews.coverSmallLandscape}
                    alt="Cover Landscape Preview"
                    width={160}
                    height={90}
                    className="rounded-lg object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Switch
                label="Premium Album"
                defaultChecked={formData.premium}
                onChange={(checked) => setFormData(prev => ({ ...prev, premium: checked }))}
              />
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Mark this album as premium content
              </p>
            </div>

            <div>
              <Switch
                label="Published"
                defaultChecked={formData.released}
                onChange={(checked) => setFormData(prev => ({ ...prev, released: checked }))}
              />
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Make this album visible to users
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
              {album ? 'Update Album' : 'Create Album'}
            </ButtonAction>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AlbumFormModal;