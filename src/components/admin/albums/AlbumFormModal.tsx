'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/modal';
import ButtonAction from '@/components/ui/button/ButtonAction';
import InputField from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Switch from '@/components/form/switch/Switch';
import { AudioAlbum } from '@/types/album';

interface AlbumFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<AudioAlbum, 'id'>) => void;
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
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    coverPortrait: '',
    coverSmallLandscape: '',
    premium: false,
    released: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (album) {
      setFormData({
        title: album.title || '',
        slug: album.slug || '',
        description: album.description || '',
        coverPortrait: album.coverPortrait || '',
        coverSmallLandscape: album.coverSmallLandscape || '',
        premium: album.premium || false,
        released: album.released || false,
      });
    } else {
      setFormData({
        title: '',
        slug: '',
        description: '',
        coverPortrait: '',
        coverSmallLandscape: '',
        premium: false,
        released: false,
      });
    }
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title || formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.slug || !/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug must be lowercase with hyphens only';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
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

          <TextArea
            label="Description"
            name="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter album description (optional)"
            rows={3}
          />

          <InputField
            label="Cover Portrait URL"
            name="coverPortrait"
            value={formData.coverPortrait}
            onChange={(e) => setFormData(prev => ({ ...prev, coverPortrait: e.target.value }))}
            placeholder="https://example.com/cover-portrait.jpg"
            helperText="Portrait image URL for the album"
          />

          <InputField
            label="Cover Landscape URL"
            name="coverSmallLandscape"
            value={formData.coverSmallLandscape}
            onChange={(e) => setFormData(prev => ({ ...prev, coverSmallLandscape: e.target.value }))}
            placeholder="https://example.com/cover-landscape.jpg"
            helperText="Landscape image URL for the album"
          />

          <div className="space-y-4">
            <Switch
              label="Premium Album"
              checked={formData.premium}
              onChange={(checked) => setFormData(prev => ({ ...prev, premium: checked }))}
              helperText="Mark this album as premium content"
            />

            <Switch
              label="Published"
              checked={formData.released}
              onChange={(checked) => setFormData(prev => ({ ...prev, released: checked }))}
              helperText="Make this album visible to users"
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
              {album ? 'Update Album' : 'Create Album'}
            </ButtonAction>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AlbumFormModal;
