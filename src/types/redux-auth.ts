export interface User {
  id: string;
  fullName: string;
  email: string;
  authToken?: string;
  subscriptionStatus: string;
  about?: string;
  companies?: string;
  createdAt?: string;
  currentPeriodEnd?: string;
  currentPeriodStart?: string;
  customUrl?: string;
  firstName?: string;
  imdbUrl?: string;
  instagramUrl?: string;
  lastName?: string;
  linkedinUrl?: string;
  phone?: string;
  planName?: string;
  planPrice?: string;
  planInterval?: string;
  primaryGoal?: string;
  profilePhoto?: string;
  supportEmail?: string;
  twitterUrl?: string;
  updatedAt?: string;
  websiteUrl?: string;
  stripeId?: string;
  stepUpVerified?: boolean;
  stepUpVerifiedUntil?: string;
}

export interface AuthState {
  isAuth: boolean;
  user: User | null;
  authToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: any | null;
}
