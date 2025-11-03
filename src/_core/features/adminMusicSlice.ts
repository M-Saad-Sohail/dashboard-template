import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Audio, PaginationMetadata } from '@/types/album';
import makeRequest from '@/lib/axios-client';
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
    createdAt: '2024-01-01T00:00:00.000Z',
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
    createdAt: '2024-01-02T00:00:00.000Z',
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
  { token: string | null },
  { rejectValue: string; state: RootState }
>(
  'adminMusic/fetchMusic',
  async ({ token }, { rejectWithValue, getState }) => {
    const { filters } = getState().adminMusic;
    
    try {
      const params = new URLSearchParams({
        section: filters.section,
        page: filters.page.toString(),
        limit: filters.limit.toString(),
      });
      
      if (filters.search) {
        params.append('search', filters.search);
      }
      
      const response = await makeRequest('get', `/music?${params}`, {
        token,
        errorMessage: 'Failed to fetch music',
      });
      
      return {
        collection: response.collection || [],
        metadata: response.metadata || mockMetadata,
      };
    } catch (error: any) {
      // Return mock data as fallback for testing
      console.warn('API call failed, using mock data:', error);
      return {
        collection: mockMusic.filter(m => 
          filters.search ? m.title.toLowerCase().includes(filters.search.toLowerCase()) : true
        ),
        metadata: mockMetadata,
      };
    }
  }
);

interface CreateMusicParams {
  musicData: Omit<Audio, 'id'> & {
    trackFile?: File;
    previewFile?: File;
    coverArtFile?: File;
  };
  token: string | null;
}

export const createMusic = createAsyncThunk<
  Audio,
  CreateMusicParams,
  { rejectValue: string }
>(
  'adminMusic/createMusic',
  async ({ musicData, token }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      // Add item type
      formData.append('item_type', 'Music');
      
      // Add basic fields
      formData.append('title', musicData.title);
      formData.append('sections', musicData.sections?.join(',') || 'RenewMe');
      
      if (musicData.artist) formData.append('artist', musicData.artist);
      
      // Add duration as string
      formData.append('duration', musicData.duration.toString());
      
      // Add booleans as strings
      formData.append('released', musicData.released ? 'true' : 'false');
      formData.append('premium', musicData.premium ? 'true' : 'false');
      
      // Add numbers as strings
      formData.append('position', (musicData.position || 1).toString());
      if (musicData.albumId) formData.append('album_id', musicData.albumId);
      
      // Add files
      if (musicData.trackFile) {
        formData.append('track', musicData.trackFile);
      }
      if (musicData.previewFile) {
        formData.append('preview', musicData.previewFile);
      }
      // Note: According to the workflow, no cover images for music

      const response = await makeRequest('post', '/music', {
        data: formData,
        token,
        successMessage: 'Music created successfully!',
        errorMessage: 'Failed to create music',
      });
      return response as Audio;
    } catch (error: any) {
      return rejectWithValue(error || 'Failed to create music');
    }
  }
);

interface UpdateMusicParams {
  id: string;
  data: Partial<Audio> & {
    trackFile?: File;
    previewFile?: File;
    coverArtFile?: File;
  };
  token: string | null;
}

export const updateMusic = createAsyncThunk<
  Audio,
  UpdateMusicParams,
  { rejectValue: string }
>(
  'adminMusic/updateMusic',
  async ({ id, data, token }, { rejectWithValue }) => {
    try {
      let requestData: any = data;
      let headers: any = {};
      
      // If files are included, use FormData
      if (data.trackFile || data.previewFile || data.coverArtFile) {
        const formData = new FormData();
        
        // Add basic fields
        if (data.title) formData.append('title', data.title);
        if (data.sections) formData.append('sections', data.sections.join(','));
        if (data.artist) formData.append('artist', data.artist);
        
        // Add duration as string
        if (data.duration) formData.append('duration', data.duration.toString());
        
        // Add booleans as strings
        if (data.released !== undefined) formData.append('released', data.released ? 'true' : 'false');
        if (data.premium !== undefined) formData.append('premium', data.premium ? 'true' : 'false');
        
        // Add numbers as strings
        if (data.position) formData.append('position', data.position.toString());
        if (data.albumId) formData.append('album_id', data.albumId);
        
        // Add files
        if (data.trackFile) formData.append('track', data.trackFile);
        if (data.previewFile) formData.append('preview', data.previewFile);
        // Note: According to the workflow, no cover images for music
        
        requestData = formData;
      }

      const response = await makeRequest('put', `/music/${id}`, {
        data: requestData,
        token,
        ...(Object.keys(headers).length > 0 && { headers }),
        successMessage: 'Music updated successfully!',
        errorMessage: 'Failed to update music',
      });
      return response as Audio;
    } catch (error: any) {
      return rejectWithValue(error || 'Failed to update music');
    }
  }
);

interface DeleteMusicParams {
  id: string;
  token: string | null;
}

export const deleteMusic = createAsyncThunk<
  string,
  DeleteMusicParams,
  { rejectValue: string }
>(
  'adminMusic/deleteMusic',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      await makeRequest('delete', `/music/${id}`, {
        token,
        successMessage: 'Music deleted successfully!',
        errorMessage: 'Failed to delete music',
      });
      return id;
    } catch (error: any) {
      return rejectWithValue(error || 'Failed to delete music');
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
