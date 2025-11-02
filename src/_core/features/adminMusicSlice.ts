import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { adminApiClient, Audio, PaginationMetadata } from '@/lib/admin-api-client';
import { RootState } from '../store/store';

interface AdminMusicState {
  music: Audio[];
  currentMusic: Audio | null;
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  error: string | null;
  metadata: PaginationMetadata | null;
  filters: {
    section: string;
    search: string;
    page: number;
    limit: number;
  };
}

// Mock data for testing
const mockMusic: Audio[] = [
  {
    id: '1',
    title: 'Peaceful Piano',
    preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    track: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    artist: 'Piano Master',
    released: true,
    premium: false,
    duration: 900,
    album: null,
    sections: ['RenewMe'],
    position: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Nature Ambience',
    preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    track: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    artist: 'Sound Designer',
    released: true,
    premium: true,
    duration: 1800,
    album: null,
    sections: ['RenewMe', 'Premium'],
    position: 2,
    createdAt: new Date().toISOString(),
  },
];

const mockMetadata: PaginationMetadata = {
  currentPage: 1,
  totalPages: 1,
  perPage: 10,
  total: 2,
};

const initialState: AdminMusicState = {
  music: mockMusic, // Start with mock data
  currentMusic: null,
  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  error: null,
  metadata: mockMetadata,
  filters: {
    section: 'RenewMe',
    search: '',
    page: 1,
    limit: 10,
  },
};

// Async Thunks
export const fetchAdminMusic = createAsyncThunk<
  { collection: Audio[]; metadata: PaginationMetadata },
  void,
  { rejectValue: string; state: RootState }
>(
  'adminMusic/fetchMusic',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { filters } = getState().adminMusic;
      const params = new URLSearchParams({
        section: filters.section,
        page: filters.page.toString(),
        limit: filters.limit.toString(),
      });
      
      if (filters.search) {
        params.append('search', filters.search);
      }
      
      const response = await adminApiClient.get(`/music?${params}`);
      
      return {
        collection: response.collection || [],
        metadata: response.metadata || mockMetadata,
      };
    } catch (error: any) {
      // Return mock data as fallback for testing
      console.warn('API call failed, using mock data:', error?.message);
      return {
        collection: mockMusic.filter(m => 
          filters.search ? m.title.toLowerCase().includes(filters.search.toLowerCase()) : true
        ),
        metadata: mockMetadata,
      };
    }
  }
);

export const createMusic = createAsyncThunk<
  Audio,
  Omit<Audio, 'id'>,
  { rejectValue: string }
>(
  'adminMusic/createMusic',
  async (musicData, { rejectWithValue }) => {
    try {
      const response = await adminApiClient.post('/music', musicData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to create music');
    }
  }
);

export const updateMusic = createAsyncThunk<
  Audio,
  { id: string; data: Partial<Audio> },
  { rejectValue: string }
>(
  'adminMusic/updateMusic',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await adminApiClient.put(`/music/${id}`, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to update music');
    }
  }
);

export const deleteMusic = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'adminMusic/deleteMusic',
  async (id, { rejectWithValue }) => {
    try {
      await adminApiClient.delete(`/music/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to delete music');
    }
  }
);

// Slice
const adminMusicSlice = createSlice({
  name: 'adminMusic',
  initialState,
  reducers: {
    setCurrentMusic: (state, action: PayloadAction<Audio | null>) => {
      state.currentMusic = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<AdminMusicState['filters']>>) => {
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
  },
  extraReducers: (builder) => {
    // Fetch music
    builder
      .addCase(fetchAdminMusic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminMusic.fulfilled, (state, action) => {
        state.loading = false;
        state.music = action.payload.collection;
        state.metadata = action.payload.metadata;
      })
      .addCase(fetchAdminMusic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch music';
      });
    
    // Create music
    builder
      .addCase(createMusic.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createMusic.fulfilled, (state, action) => {
        state.creating = false;
        state.music.unshift(action.payload);
      })
      .addCase(createMusic.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload || 'Failed to create music';
      });
    
    // Update music
    builder
      .addCase(updateMusic.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateMusic.fulfilled, (state, action) => {
        state.updating = false;
        const index = state.music.findIndex(music => music.id === action.payload.id);
        if (index !== -1) {
          state.music[index] = action.payload;
        }
      })
      .addCase(updateMusic.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload || 'Failed to update music';
      });
    
    // Delete music
    builder
      .addCase(deleteMusic.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteMusic.fulfilled, (state, action) => {
        state.deleting = false;
        state.music = state.music.filter(music => music.id !== action.payload);
      })
      .addCase(deleteMusic.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload || 'Failed to delete music';
      });
  },
});

export const { setCurrentMusic, setFilters, setPage, setLimit, clearError } = adminMusicSlice.actions;
export default adminMusicSlice.reducer;
