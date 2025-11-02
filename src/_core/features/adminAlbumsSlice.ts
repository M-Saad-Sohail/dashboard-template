import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AudioAlbum, PaginationMetadata } from '@/types/album';
import makeRequest from '@/lib/axios-client';
import { RootState } from '../store/store';

interface AdminAlbumsState {
  albums: AudioAlbum[];
  currentAlbum: AudioAlbum | null;
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
    page: number;
    limit: number;
  };
}

// Fallback/Mock data for testing
const mockAlbums: AudioAlbum[] = [
  {
    id: '1',
    title: 'Morning Meditation',
    slug: 'morning-meditation',
    author: 'John Doe',
    narrator: 'Jane Smith',
    description: 'Start your day with peaceful meditation',
    duration: 1800,
    coverPortrait: 'https://via.placeholder.com/300x400',
    coverSmallLandscape: 'https://via.placeholder.com/400x200',
    premium: false,
    released: true,
    sections: ['RenewMe'],
    position: 1,
    tracks: [],
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    title: 'Sleep Sounds Premium',
    slug: 'sleep-sounds-premium',
    author: 'Sarah Johnson',
    narrator: 'Mike Wilson',
    description: 'Premium collection for better sleep',
    duration: 3600,
    coverPortrait: 'https://via.placeholder.com/300x400',
    coverSmallLandscape: 'https://via.placeholder.com/400x200',
    premium: true,
    released: true,
    sections: ['RenewMe', 'Premium'],
    position: 2,
    tracks: [],
    createdAt: '2024-01-02T00:00:00.000Z',
  },
  {
    id: '3',
    title: 'Mindfulness Journey',
    slug: 'mindfulness-journey',
    author: 'Emily Brown',
    narrator: null,
    description: 'A complete mindfulness experience',
    duration: 2400,
    coverPortrait: null,
    coverSmallLandscape: null,
    premium: false,
    released: false,
    sections: ['RenewMe'],
    position: 3,
    tracks: [],
    createdAt: '2024-01-03T00:00:00.000Z',
  },
];

const mockMetadata: PaginationMetadata = {
  currentPage: 1,
  totalPages: 1,
  perPage: 10,
  total: 3,
};

const initialState: AdminAlbumsState = {
  albums: mockAlbums, // Start with mock data
  currentAlbum: null,
  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  error: null,
  metadata: mockMetadata, // Start with mock metadata
  filters: {
    section: 'RenewMe',
    groupBy: 'Living in Balance',
    search: '',
    page: 1,
    limit: 10,
  },
};

// Async Thunks
export const fetchAdminAlbums = createAsyncThunk<
  { collection: AudioAlbum[]; metadata: PaginationMetadata },
  { token: string | null },
  { rejectValue: string; state: RootState }
>(
  'adminAlbums/fetchAlbums',
  async ({ token }, { rejectWithValue, getState }) => {
    const { filters } = getState().adminAlbums;
    
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
      
      const response = await makeRequest('get', `/meditation-albums?${params}`, {
        token,
        errorMessage: 'Failed to fetch albums',
      });
      
      return {
        collection: response.collection || [],
        metadata: response.metadata || mockMetadata,
      };
    } catch (error: any) {
      // Return mock data as fallback for testing
      console.warn('API call failed, using mock data:', error);
      return {
        collection: mockAlbums.filter(a => 
          filters.search ? a.title.toLowerCase().includes(filters.search.toLowerCase()) : true
        ),
        metadata: mockMetadata,
      };
    }
  }
);

interface CreateAlbumParams {
  albumData: Omit<AudioAlbum, 'id'>;
  token: string | null;
}

export const createAlbum = createAsyncThunk<
  AudioAlbum,
  CreateAlbumParams,
  { rejectValue: string }
>(
  'adminAlbums/createAlbum',
  async ({ albumData, token }, { rejectWithValue }) => {
    try {
      const response = await makeRequest('post', '/albums', {
        data: albumData,
        token,
        successMessage: 'Album created successfully!',
        errorMessage: 'Failed to create album',
      });
      return response as AudioAlbum;
    } catch (error: any) {
      return rejectWithValue(error || 'Failed to create album');
    }
  }
);

interface UpdateAlbumParams {
  id: string;
  data: Partial<AudioAlbum>;
  token: string | null;
}

export const updateAlbum = createAsyncThunk<
  AudioAlbum,
  UpdateAlbumParams,
  { rejectValue: string }
>(
  'adminAlbums/updateAlbum',
  async ({ id, data, token }, { rejectWithValue }) => {
    try {
      const response = await makeRequest('put', `/albums/${id}`, {
        data,
        token,
        successMessage: 'Album updated successfully!',
        errorMessage: 'Failed to update album',
      });
      return response as AudioAlbum;
    } catch (error: any) {
      return rejectWithValue(error || 'Failed to update album');
    }
  }
);

interface DeleteAlbumParams {
  id: string;
  token: string | null;
}

export const deleteAlbum = createAsyncThunk<
  string,
  DeleteAlbumParams,
  { rejectValue: string }
>(
  'adminAlbums/deleteAlbum',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      await makeRequest('delete', `/albums/${id}`, {
        token,
        successMessage: 'Album deleted successfully!',
        errorMessage: 'Failed to delete album',
      });
      return id;
    } catch (error: any) {
      return rejectWithValue(error || 'Failed to delete album');
    }
  }
);

// Slice
const adminAlbumsSlice = createSlice({
  name: 'adminAlbums',
  initialState,
  reducers: {
    setCurrentAlbum: (state, action: PayloadAction<AudioAlbum | null>) => {
      state.currentAlbum = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<AdminAlbumsState['filters']>>) => {
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
    // Fetch albums
    builder
      .addCase(fetchAdminAlbums.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminAlbums.fulfilled, (state, action) => {
        state.loading = false;
        state.albums = action.payload.collection;
        state.metadata = action.payload.metadata;
      })
      .addCase(fetchAdminAlbums.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch albums';
      });
    
    // Create album
    builder
      .addCase(createAlbum.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createAlbum.fulfilled, (state, action) => {
        state.creating = false;
        state.albums.unshift(action.payload);
      })
      .addCase(createAlbum.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload || 'Failed to create album';
      });
    
    // Update album
    builder
      .addCase(updateAlbum.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateAlbum.fulfilled, (state, action) => {
        state.updating = false;
        const index = state.albums.findIndex(album => album.id === action.payload.id);
        if (index !== -1) {
          state.albums[index] = action.payload;
        }
      })
      .addCase(updateAlbum.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload as string || 'Failed to update album';
      });
    
    // Delete album
    builder
      .addCase(deleteAlbum.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteAlbum.fulfilled, (state, action) => {
        state.deleting = false;
        state.albums = state.albums.filter(album => album.id !== action.payload);
      })
      .addCase(deleteAlbum.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload as string || 'Failed to delete album';
      });
  },
});

export const { setCurrentAlbum, setFilters, setPage, setLimit, clearError } = adminAlbumsSlice.actions;
export default adminAlbumsSlice.reducer;
