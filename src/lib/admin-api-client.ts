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
