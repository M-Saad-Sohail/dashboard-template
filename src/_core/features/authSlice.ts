import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define types for better type safety
interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  session: string | null;
  profile: any | null;
  isLoading: boolean;
  isSigningIn: boolean;
  isSigningUp: boolean;
  error: string | null;
}

// Initial state with proper typing
const initialState: AuthState = {
  user: null,
  session: null,
  profile: null,
  isLoading: false,
  isSigningIn: false,
  isSigningUp: false,
  error: null,
};

// Sign in with email and password (MUST be defined BEFORE the slice)
export const signIn = createAsyncThunk(
  "auth/signIn",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/signin', { ... });
      // const data = await response.json();
      
      // For now, just return mock data
      return { email, password };
    } catch (error: any) {
      return rejectWithValue(error.message || "Sign in failed");
    }
  }
);

// Sign up with email and password
export const signUp = createAsyncThunk(
  "auth/signUp",
  async ({ email, password, name }: { email: string; password: string; name?: string }, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      return { email, password, name };
    } catch (error: any) {
      return rejectWithValue(error.message || "Sign up failed");
    }
  }
);

// Sign out
export const signOut = createAsyncThunk(
  "auth/signOut",
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message || "Sign out failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Synchronous actions (if needed)
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Sign In
      .addCase(signIn.pending, (state) => {
        state.isSigningIn = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.isSigningIn = false;
        // TODO: Set user data from action.payload when API is ready
        // state.user = action.payload.user;
        // state.session = action.payload.session;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isSigningIn = false;
        state.error = action.payload as string;
      })
      
      // Sign Up
      .addCase(signUp.pending, (state) => {
        state.isSigningUp = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isSigningUp = false;
        // TODO: Set user data from action.payload when API is ready
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isSigningUp = false;
        state.error = action.payload as string;
      })
      
      // Sign Out
      .addCase(signOut.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.session = null;
        state.profile = null;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { clearError, setUser } = authSlice.actions;

// Export reducer
export default authSlice.reducer;

// Export types
export type { AuthState, User };
