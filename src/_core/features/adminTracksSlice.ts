import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Audio, PaginationMetadata } from '@/types/album';
import makeRequest from '@/lib/axios-client';
import { RootState } from '../store/store';

interface AdminTracksState {
  tracks: Audio[];
  currentTrack: Audio | null;
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  error: string | null;
  metadata: PaginationMetadata | null;
  filters: {
    section: string;
    groupBy: string;
    search: string;
    released: string;
    premium: string;
    page: number;
    limit: number;
  };
  selectedTracks: string[]; // For bulk actions
}

// Mock data for testing
const mockTracks: Audio[] = [
  {
    id: '1',
    title: 'Deep Relaxation Meditation',
    preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    track: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    artist: 'Meditation Master',
    released: true,
    premium: false,
    duration: 600,
    album: {
      title: 'Morning Meditation',
      slug: 'morning-meditation',
    },
    albumId: '1',
    sections: ['RenewMe'],
    position: 1,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    title: 'Sleep Soundscapes',
    preview: undefined,
    track: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    artist: 'Sleep Expert',
    released: true,
    premium: true,
    duration: 1200,
    album: {
      title: 'Sleep Sounds Premium',
      slug: 'sleep-sounds-premium',
    },
    albumId: '2',
    sections: ['RenewMe', 'Premium'],
    position: 1,
    createdAt: '2024-01-02T00:00:00.000Z',
  },
  {
    id: '3',
    title: 'Mindful Breathing',
    preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    track: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    artist: null,
    released: false,
    premium: false,
    duration: 480,
    album: null,
    albumId: undefined,
    sections: ['RenewMe'],
    position: 1,
    createdAt: '2024-01-03T00:00:00.000Z',
  },
];

const mockMetadata: PaginationMetadata = {
  currentPage: 1,
  totalPages: 1,
  perPage: 10,
  total: 3,
};

const initialState: AdminTracksState = {
  tracks: mockTracks, // Start with mock data
  currentTrack: null,
  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  error: null,
  metadata: mockMetadata,
  filters: {
    section: 'RenewMe',
    groupBy: 'None',
    search: '',
    released: 'all',
    premium: 'all',
    page: 1,
    limit: 10,
  },
  selectedTracks: [],
};

// Async Thunks
export const fetchAdminTracks = createAsyncThunk<
  { collection: Audio[]; metadata: PaginationMetadata },
  { token: string | null },
  { rejectValue: string; state: RootState }
>(
  'adminTracks/fetchTracks',
  async ({ token }, { rejectWithValue, getState }) => {
    const { filters } = getState().adminTracks;
    
    try {
      const params = new URLSearchParams({
        section: filters.section,
        groupBy: filters.groupBy,
        page: filters.page.toString(),
        limit: filters.limit.toString(),
      });
      
      if (filters.search) {
        params.append('search', filters.search);
      }
      if (filters.released !== 'all') {
        params.append('released', filters.released);
      }
      if (filters.premium !== 'all') {
        params.append('premium', filters.premium);
      }
      
      const response = await makeRequest('get', `/tracks?${params}`, {
        token,
        errorMessage: 'Failed to fetch tracks',
      });
      
      return {
        collection: response.collection || [],
        metadata: response.metadata || mockMetadata,
      };
    } catch (error: any) {
      // Return mock data as fallback for testing
      console.warn('API call failed, using mock data:', error);
      return {
        collection: mockTracks.filter(t => {
          const matchesSearch = filters.search ? t.title.toLowerCase().includes(filters.search.toLowerCase()) : true;
          const matchesReleased = filters.released === 'all' || (filters.released === 'published' ? t.released : !t.released);
          const matchesPremium = filters.premium === 'all' || (filters.premium === 'premium' ? t.premium : !t.premium);
          return matchesSearch && matchesReleased && matchesPremium;
        }),
        metadata: mockMetadata,
      };
    }
  }
);

interface CreateTrackParams {
  trackData: Omit<Audio, 'id'> & {
    trackFile?: File;
    previewFile?: File;
  };
  albumSlug?: string; // If provided, create track within album
  token: string | null;
}

export const createTrack = createAsyncThunk<
  Audio,
  CreateTrackParams,
  { rejectValue: string }
>(
  'adminTracks/createTrack',
  async ({ trackData, albumSlug, token }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      // Add item type
      formData.append('item_type', 'Track');
      
      // Add basic fields
      formData.append('title', trackData.title);
      if (trackData.subtitle) formData.append('subtitle', trackData.subtitle);
      formData.append('sections', trackData.sections?.join(',') || 'RenewMe');
      
      if (trackData.artist) formData.append('artist', trackData.artist);
      if (trackData.narrator) formData.append('narrator', trackData.narrator);
      
      // Add duration as string
      formData.append('duration', trackData.duration.toString());
      
      // Add booleans as strings
      formData.append('released', trackData.released ? 'true' : 'false');
      formData.append('premium', trackData.premium ? 'true' : 'false');
      
      // Add numbers as strings
      formData.append('position', (trackData.position || 1).toString());
      if ((trackData as any).preview_duration) formData.append('preview_duration', (trackData as any).preview_duration.toString());
      if ((trackData as any).categoryId) formData.append('category_id', (trackData as any).categoryId.toString());
      
      // Add album ID if not creating within an album
      if (!albumSlug && trackData.albumId) {
        formData.append('album_id', trackData.albumId);
      }
      
      // Add files
      if (trackData.trackFile) {
        formData.append('track', trackData.trackFile);
      }
      if (trackData.previewFile) {
        formData.append('preview', trackData.previewFile);
      }
      
      // Determine endpoint based on whether we're creating within an album
      const endpoint = albumSlug ? `/albums/${albumSlug}/tracks` : '/tracks';

      const response = await makeRequest('post', endpoint, {
        data: formData,
        token,
        successMessage: 'Track created successfully!',
        errorMessage: 'Failed to create track',
      });
      return response as Audio;
    } catch (error: any) {
      return rejectWithValue(error || 'Failed to create track');
    }
  }
);

interface UpdateTrackParams {
  id: string;
  data: Partial<Audio> & {
    trackFile?: File;
    previewFile?: File;
  };
  albumSlug?: string; // If updating within an album context
  token: string | null;
}

export const updateTrack = createAsyncThunk<
  Audio,
  UpdateTrackParams,
  { rejectValue: string }
>(
  'adminTracks/updateTrack',
  async ({ id, data, albumSlug, token }, { rejectWithValue }) => {
    try {
      let requestData: any = data;
      let headers: any = {};
      
      // If files are included, use FormData
      if (data.trackFile || data.previewFile) {
        const formData = new FormData();
        
        // Add basic fields
        if (data.title) formData.append('title', data.title);
        if (data.subtitle) formData.append('subtitle', data.subtitle);
        if (data.sections) formData.append('sections', data.sections.join(','));
        if (data.artist) formData.append('artist', data.artist);
        if (data.narrator) formData.append('narrator', data.narrator);
        
        // Add duration as string
        if (data.duration) formData.append('duration', data.duration.toString());
        
        // Add booleans as strings
        if (data.released !== undefined) formData.append('released', data.released ? 'true' : 'false');
        if (data.premium !== undefined) formData.append('premium', data.premium ? 'true' : 'false');
        
        // Add numbers as strings
        if (data.position) formData.append('position', data.position.toString());
        if ((data as any).preview_duration) formData.append('preview_duration', (data as any).preview_duration.toString());
        if ((data as any).categoryId) formData.append('category_id', (data as any).categoryId.toString());
        
        // Add files
        if (data.trackFile) formData.append('track', data.trackFile);
        if (data.previewFile) formData.append('preview', data.previewFile);
        
        requestData = formData;
      }
      
      // Determine endpoint based on whether we're updating within an album
      const endpoint = albumSlug ? `/albums/${albumSlug}/tracks/${id}` : `/tracks/${id}`;

      const response = await makeRequest('put', endpoint, {
        data: requestData,
        token,
        ...(Object.keys(headers).length > 0 && { headers }),
        successMessage: 'Track updated successfully!',
        errorMessage: 'Failed to update track',
      });
      return response as Audio;
    } catch (error: any) {
      return rejectWithValue(error || 'Failed to update track');
    }
  }
);

interface DeleteTrackParams {
  id: string;
  token: string | null;
}

export const deleteTrack = createAsyncThunk<
  string,
  DeleteTrackParams,
  { rejectValue: string }
>(
  'adminTracks/deleteTrack',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      await makeRequest('delete', `/tracks/${id}`, {
        token,
        successMessage: 'Track deleted successfully!',
        errorMessage: 'Failed to delete track',
      });
      return id;
    } catch (error: any) {
      return rejectWithValue(error || 'Failed to delete track');
    }
  }
);

interface BulkDeleteTracksParams {
  trackIds: string[];
  token: string | null;
}

export const bulkDeleteTracks = createAsyncThunk<
  string[],
  BulkDeleteTracksParams,
  { rejectValue: string }
>(
  'adminTracks/bulkDeleteTracks',
  async ({ trackIds, token }, { rejectWithValue }) => {
    try {
      await makeRequest('post', '/tracks/bulk-delete', {
        data: { ids: trackIds },
        token,
        successMessage: `${trackIds.length} tracks deleted successfully!`,
        errorMessage: 'Failed to delete tracks',
      });
      return trackIds;
    } catch (error: any) {
      return rejectWithValue(error || 'Failed to delete tracks');
    }
  }
);

interface BulkUpdateTracksParams {
  ids: string[];
  updates: Partial<Audio>;
  token: string | null;
}

export const bulkUpdateTracks = createAsyncThunk<
  { ids: string[]; updates: Partial<Audio> },
  BulkUpdateTracksParams,
  { rejectValue: string }
>(
  'adminTracks/bulkUpdateTracks',
  async ({ ids, updates, token }, { rejectWithValue }) => {
    try {
      await makeRequest('post', '/tracks/bulk-update', {
        data: { ids, updates },
        token,
        successMessage: `${ids.length} tracks updated successfully!`,
        errorMessage: 'Failed to update tracks',
      });
      return { ids, updates };
    } catch (error: any) {
      return rejectWithValue(error || 'Failed to update tracks');
    }
  }
);

// Slice
const adminTracksSlice = createSlice({
  name: 'adminTracks',
  initialState,
  reducers: {
    setCurrentTrack: (state, action: PayloadAction<Audio | null>) => {
      state.currentTrack = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<AdminTracksState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.filters.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.filters.limit = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setSelectedTracks: (state, action: PayloadAction<string[]>) => {
      state.selectedTracks = action.payload;
    },
    toggleTrackSelection: (state, action: PayloadAction<string>) => {
      const index = state.selectedTracks.indexOf(action.payload);
      if (index > -1) {
        state.selectedTracks.splice(index, 1);
      } else {
        state.selectedTracks.push(action.payload);
      }
    },
    clearSelectedTracks: (state) => {
      state.selectedTracks = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch tracks
    builder
      .addCase(fetchAdminTracks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminTracks.fulfilled, (state, action) => {
        state.loading = false;
        state.tracks = action.payload.collection;
        state.metadata = action.payload.metadata;
      })
      .addCase(fetchAdminTracks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch tracks';
      });
    
    // Create track
    builder
      .addCase(createTrack.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createTrack.fulfilled, (state, action) => {
        state.creating = false;
        state.tracks.unshift(action.payload);
      })
      .addCase(createTrack.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload || 'Failed to create track';
      });
    
    // Update track
    builder
      .addCase(updateTrack.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateTrack.fulfilled, (state, action) => {
        state.updating = false;
        const index = state.tracks.findIndex(track => track.id === action.payload.id);
        if (index !== -1) {
          state.tracks[index] = action.payload;
        }
      })
      .addCase(updateTrack.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload || 'Failed to update track';
      });
    
    // Delete track
    builder
      .addCase(deleteTrack.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteTrack.fulfilled, (state, action) => {
        state.deleting = false;
        state.tracks = state.tracks.filter(track => track.id !== action.payload);
      })
      .addCase(deleteTrack.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload || 'Failed to delete track';
      });
    
    // Bulk delete tracks
    builder
      .addCase(bulkDeleteTracks.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(bulkDeleteTracks.fulfilled, (state, action) => {
        state.deleting = false;
        state.tracks = state.tracks.filter(track => track.id && !action.payload.includes(track.id));
        state.selectedTracks = [];
      })
      .addCase(bulkDeleteTracks.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload || 'Failed to delete tracks';
      });
    
    // Bulk update tracks
    builder
      .addCase(bulkUpdateTracks.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(bulkUpdateTracks.fulfilled, (state, action) => {
        state.updating = false;
        const { ids, updates } = action.payload;
        state.tracks = state.tracks.map(track => 
          track.id && ids.includes(track.id) ? { ...track, ...updates } : track
        );
        state.selectedTracks = [];
      })
      .addCase(bulkUpdateTracks.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload || 'Failed to update tracks';
      });
  },
});

export const { 
  setCurrentTrack, 
  setFilters, 
  setPage, 
  setLimit, 
  clearError,
  setSelectedTracks,
  toggleTrackSelection,
  clearSelectedTracks
} = adminTracksSlice.actions;

export default adminTracksSlice.reducer;
