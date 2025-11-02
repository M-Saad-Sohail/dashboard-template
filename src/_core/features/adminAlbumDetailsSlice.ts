import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AudioAlbum, Audio } from '@/types/album';
import makeRequest from '@/lib/axios-client';
import { RootState } from '../store/store';

interface AdminAlbumDetailsState {
  album: AudioAlbum | null;
  tracks: Audio[];
  allAlbums: AudioAlbum[]; // For dropdown
  loading: boolean;
  updating: boolean;
  error: string | null;
}

// Mock data for testing
const mockAlbum: AudioAlbum = {
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
  tracks: [
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
    },
  ],
};

const initialState: AdminAlbumDetailsState = {
  album: mockAlbum, // Start with mock data
  tracks: mockAlbum.tracks || [],
  allAlbums: [],
  loading: false,
  updating: false,
  error: null,
};

// Async Thunks
interface FetchAlbumBySlugParams {
  slug: string;
  token: string | null;
}

export const fetchAlbumBySlug = createAsyncThunk<
  AudioAlbum,
  FetchAlbumBySlugParams,
  { rejectValue: string }
>(
  'adminAlbumDetails/fetchAlbumBySlug',
  async ({ slug, token }, { rejectWithValue }) => {
    try {
      const response = await makeRequest('get', `/albums/${slug}`, {
        token,
        errorMessage: 'Failed to fetch album details',
      });
      return response as AudioAlbum;
    } catch (error: any) {
      return rejectWithValue(error || 'Failed to fetch album details');
    }
  }
);

interface FetchAllAlbumsParams {
  token: string | null;
}

export const fetchAllAlbumsForDropdown = createAsyncThunk<
  AudioAlbum[],
  FetchAllAlbumsParams,
  { rejectValue: string }
>(
  'adminAlbumDetails/fetchAllAlbumsForDropdown',
  async ({ token }, { rejectWithValue }) => {
    try {
      const response = await makeRequest('get', '/meditation-albums?limit=100', {
        token,
        errorMessage: 'Failed to fetch albums',
      });
      return response.collection || [];
    } catch (error: any) {
      return rejectWithValue(error || 'Failed to fetch albums');
    }
  }
);

interface AddTrackToAlbumParams {
  albumId: string;
  trackId: string;
  token: string | null;
}

export const addTrackToAlbum = createAsyncThunk<
  { albumId: string; trackId: string },
  AddTrackToAlbumParams,
  { rejectValue: string }
>(
  'adminAlbumDetails/addTrackToAlbum',
  async ({ albumId, trackId, token }, { rejectWithValue }) => {
    try {
      await makeRequest('post', `/albums/${albumId}/tracks`, {
        data: { trackId },
        token,
        successMessage: 'Track added to album successfully!',
        errorMessage: 'Failed to add track to album',
      });
      return { albumId, trackId };
    } catch (error: any) {
      return rejectWithValue(error || 'Failed to add track to album');
    }
  }
);

interface RemoveTrackFromAlbumParams {
  albumId: string;
  trackId: string;
  token: string | null;
}

export const removeTrackFromAlbum = createAsyncThunk<
  { albumId: string; trackId: string },
  RemoveTrackFromAlbumParams,
  { rejectValue: string }
>(
  'adminAlbumDetails/removeTrackFromAlbum',
  async ({ albumId, trackId, token }, { rejectWithValue }) => {
    try {
      await makeRequest('delete', `/albums/${albumId}/tracks/${trackId}`, {
        token,
        successMessage: 'Track removed from album successfully!',
        errorMessage: 'Failed to remove track from album',
      });
      return { albumId, trackId };
    } catch (error: any) {
      return rejectWithValue(error || 'Failed to remove track from album');
    }
  }
);

interface ReorderAlbumTracksParams {
  albumId: string;
  trackIds: string[];
  token: string | null;
}

export const reorderAlbumTracks = createAsyncThunk<
  { albumId: string; trackIds: string[] },
  ReorderAlbumTracksParams,
  { rejectValue: string }
>(
  'adminAlbumDetails/reorderAlbumTracks',
  async ({ albumId, trackIds, token }, { rejectWithValue }) => {
    try {
      await makeRequest('put', `/albums/${albumId}/tracks/order`, {
        data: { trackIds },
        token,
        successMessage: 'Tracks reordered successfully!',
        errorMessage: 'Failed to reorder tracks',
      });
      return { albumId, trackIds };
    } catch (error: any) {
      return rejectWithValue(error || 'Failed to reorder tracks');
    }
  }
);

// Slice
const adminAlbumDetailsSlice = createSlice({
  name: 'adminAlbumDetails',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setTracks: (state, action: PayloadAction<Audio[]>) => {
      state.tracks = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch album by slug
    builder
      .addCase(fetchAlbumBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlbumBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.album = action.payload;
        state.tracks = action.payload.tracks || [];
      })
      .addCase(fetchAlbumBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch album';
      });
    
    // Fetch all albums for dropdown
    builder
      .addCase(fetchAllAlbumsForDropdown.fulfilled, (state, action) => {
        state.allAlbums = action.payload;
      });
    
    // Add track to album
    builder
      .addCase(addTrackToAlbum.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(addTrackToAlbum.fulfilled, (state) => {
        state.updating = false;
      })
      .addCase(addTrackToAlbum.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload || 'Failed to add track';
      });
    
    // Remove track from album
    builder
      .addCase(removeTrackFromAlbum.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(removeTrackFromAlbum.fulfilled, (state, action) => {
        state.updating = false;
        state.tracks = state.tracks.filter(track => track.id !== action.payload.trackId);
      })
      .addCase(removeTrackFromAlbum.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload || 'Failed to remove track';
      });
    
    // Reorder tracks
    builder
      .addCase(reorderAlbumTracks.pending, (state) => {
        state.updating = true;
      })
      .addCase(reorderAlbumTracks.fulfilled, (state, action) => {
        state.updating = false;
        // Reorder tracks based on trackIds array
        const orderedTracks = action.payload.trackIds
          .map(id => state.tracks.find(track => track.id === id))
          .filter(Boolean) as Audio[];
        state.tracks = orderedTracks;
      })
      .addCase(reorderAlbumTracks.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload || 'Failed to reorder tracks';
      });
  },
});

export const { clearError, setTracks } = adminAlbumDetailsSlice.actions;
export default adminAlbumDetailsSlice.reducer;
