import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { adminApiClient, Audio, PaginationMetadata } from '@/lib/admin-api-client';
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
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Sleep Soundscapes',
    preview: null,
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
    createdAt: new Date().toISOString(),
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
    createdAt: new Date().toISOString(),
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
  void,
  { rejectValue: string; state: RootState }
>(
  'adminTracks/fetchTracks',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { filters } = getState().adminTracks;
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
      
      const response = await adminApiClient.get(`/tracks?${params}`);
      
      return {
        collection: response.collection || [],
        metadata: response.metadata || mockMetadata,
      };
    } catch (error: any) {
      // Return mock data as fallback for testing
      console.warn('API call failed, using mock data:', error?.message);
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

export const createTrack = createAsyncThunk<
  Audio,
  Omit<Audio, 'id'>,
  { rejectValue: string }
>(
  'adminTracks/createTrack',
  async (trackData, { rejectWithValue }) => {
    try {
      const response = await adminApiClient.post('/tracks', trackData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to create track');
    }
  }
);

export const updateTrack = createAsyncThunk<
  Audio,
  { id: string; data: Partial<Audio> },
  { rejectValue: string }
>(
  'adminTracks/updateTrack',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await adminApiClient.put(`/tracks/${id}`, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to update track');
    }
  }
);

export const deleteTrack = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'adminTracks/deleteTrack',
  async (id, { rejectWithValue }) => {
    try {
      await adminApiClient.delete(`/tracks/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to delete track');
    }
  }
);

export const bulkDeleteTracks = createAsyncThunk<
  string[],
  string[],
  { rejectValue: string }
>(
  'adminTracks/bulkDeleteTracks',
  async (trackIds, { rejectWithValue }) => {
    try {
      await adminApiClient.post('/tracks/bulk-delete', { ids: trackIds });
      return trackIds;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to delete tracks');
    }
  }
);

export const bulkUpdateTracks = createAsyncThunk<
  { ids: string[]; updates: Partial<Audio> },
  { ids: string[]; updates: Partial<Audio> },
  { rejectValue: string }
>(
  'adminTracks/bulkUpdateTracks',
  async ({ ids, updates }, { rejectWithValue }) => {
    try {
      await adminApiClient.post('/tracks/bulk-update', { ids, updates });
      return { ids, updates };
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to update tracks');
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
        state.tracks = state.tracks.filter(track => !action.payload.includes(track.id));
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
          ids.includes(track.id) ? { ...track, ...updates } : track
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
