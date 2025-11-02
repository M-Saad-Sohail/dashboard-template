import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://api2.myrenewme.com/api';

export const adminApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor
adminApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
adminApiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // if (error.response?.status === 401) {
    //   // Redirect to login
    //   window.location.href = '/auth/signin';
    // }
    return Promise.reject(error);
  }
);

// Common interfaces matching backend API responses
export interface Audio {
  id?: string;
  title: string;
  preview?: string;
  track: string;
  artist: string | null;
  released: boolean;
  premium: boolean;
  duration: number;
  album: {
    title: string;
    slug: string;
  } | null;
  // Admin-only fields
  albumId?: string;
  sections?: string[];
  position?: number;
  createdAt?: string;
}

export interface AudioAlbum {
  id?: string;
  title: string;
  slug: string;
  author?: string | null;
  narrator?: string | null;
  description?: string;
  duration?: number;
  tracks?: Audio[];
  coverPortrait?: string | null;
  coverSmallLandscape?: string | null;
  premium?: boolean;
  released?: boolean;
  sections?: string[];
  position?: number;
  createdAt?: string;
}

export interface PaginationMetadata {
  currentPage: number;
  totalPages: number;
  perPage: number;
  total: number;
}

// Response interfaces matching backend
export interface AlbumCollectionResponse {
  collection: Array<{
    title: string;
    slug: string;
    coverPortrait?: string | null;
    coverSmallLandscape?: string | null;
  }>;
  metadata: PaginationMetadata;
}

export interface AlbumDetailResponse {
  title: string;
  slug: string;
  author: string | null;
  narrator: string | null;
  duration: number;
  tracks: Audio[];
}

export interface ItemCollectionResponse {
  collection: Audio[];
  metadata: PaginationMetadata;
}
