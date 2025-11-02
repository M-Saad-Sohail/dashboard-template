import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { addMinutes } from 'date-fns';
// import Cookies from 'js-cookie';
// import { LockLocalStorage } from 'modules/Lock/constants';
// import { WEB_PASSWORD } from 'shared/configs/App';
// import LocalStorageUtil from 'shared/utils/LocalStorage';
// import { clearCookies, setCookiesForUser } from '@/helper/redux-auth-helper';
import makeRequest from '@/lib/axios-client';
import { AuthState, User } from '@/types/redux-auth';

const initialState: AuthState = {
  isAuth: false,
  user: null,
  authToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Async thunk for login
export const login = createAsyncThunk(
  'auth/login',
  async (user: User | null, { rejectWithValue }) => {
    try {
      if (!user) {
        return rejectWithValue('User data is required');
      }

      if (user.authToken) {
        // LocalStorageUtil.set('authToken', user.authToken);
        // setCookiesForUser(user, user.authToken);
      }

      return user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

// Login user with credentials
export const loginUser = createAsyncThunk<
  { user: User; authToken: string },
  { email: string; password: string }, // Argument type
  { rejectValue: string } // Reject value type
>(
  'auth/loginUser',
  async (payload: { email: string; password: string }, { rejectWithValue, dispatch }) => {
    try {
      const response = await makeRequest('post', '/login', {
        data: payload,
        successMessage: 'Login Successfully',
        errorMessage: 'Login failed. Please try again.',
        logoutCallback: () => dispatch(logout()),
      });

      return {
        user: response.user,
        authToken: response.authToken
      };
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Login failed');
    }
  }
);

// ─── SIGNUP THUNK ──────

export const signupUser = createAsyncThunk<
  { user: User; authToken: string },
  { first_name: string; last_name: string; email: string; password: string },
  { rejectValue: string }
>(
  'auth/signupUser',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await makeRequest('post', '/user-signup', {
        data: payload,
        successMessage: 'Account created successfully!',
        errorMessage: 'Signup failed. Please try again.',
        logoutCallback: () => dispatch(logout()),
      });

      return { user: response.user, authToken: response.authToken };
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Signup failed');
    }
  }
);


// ─── FORGOT PASSWORD THUNK ──────
export const forgotPassword = createAsyncThunk<
  { message: string },              // Success return type
  { email: string },                // Argument type
  { rejectValue: string }           // Reject type
>(
  'auth/forgotPassword',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await makeRequest('post', '/forgot-password', {
        data: payload,
        successMessage: 'Password reset link sent to your email!',
        errorMessage: 'Failed to send reset link. Please try again.',
      });

      return { message: response.message || 'Email sent successfully' };
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to send reset link');
    }
  }
);

// ─── RESET PASSWORD THUNK ──────
export const resetPassword = createAsyncThunk<
  { message: string },                  // Success return type
  { password: string; token: string },  // Arguments
  { rejectValue: string }               // Reject type
>(
  'auth/resetPassword',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await makeRequest('post', '/reset-password', {
        data: payload,
        successMessage: 'Password updated! Redirecting to login...',
        errorMessage: 'Failed to reset password. Please try again.',
      });

      return { message: response.message || 'Password reset successful' };
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to reset password');
    }
  }
);


// Send verification email
export const sendVerificationEmail = createAsyncThunk<
  { ok: boolean; cooldownSeconds?: number },
  { email: string },
  { rejectValue: string }
>(
  'auth/sendVerificationEmail',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await makeRequest('post', '/change-password-request', {
        data: payload,
      });

      if (response?.message?.toLowerCase().includes('verification code sent')) {
        return { ok: true, cooldownSeconds: 60 };
      }

      return rejectWithValue('Unexpected response from server');
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to send verification email');
    }
  }
);

// ─── VERIFY EMAIL CODE THUNK ──────
export const verifyEmailCode = createAsyncThunk<
  { ok: boolean; message: string },
  { email: string; verification_code: string },
  { rejectValue: string }
>(
  'auth/verifyEmailCode',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await makeRequest('post', '/verify-change-password-request', {
        data: payload,
      });

      if (response?.message?.toLowerCase().includes('verified')) {
        return { ok: true, message: response.message };
      }

      return rejectWithValue(response?.message || 'Verification failed');
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to verify email');
    }
  }
);



const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: User; authToken: string } | null>) => {
      const payload = action.payload;

      if (payload) {
        state.user = payload.user;
        state.authToken = payload.authToken;
        state.isAuth = true;
        state.isAuthenticated = true;

        // Only set cookies - Redux Persist handles localStorage
        // setCookiesForUser(payload.user, payload.authToken);
      } else {
        state.user = null;
        state.authToken = null;
        state.isAuth = false;
        state.isAuthenticated = false;
        // clearCookies();
        // Clear only specific keys, not everything
        // LocalStorageUtil.remove('authToken');
        // LocalStorageUtil.remove('user');
      }
    },

    logout: (state) => {
      state.user = null;
      state.isAuth = false;
      state.isAuthenticated = false;
      state.authToken = null;
      // Clear localStorage items
      // LocalStorageUtil.remove('authToken');
      // LocalStorageUtil.remove('user');
      // clearCookies();
    },

    // unlock: (state, action: PayloadAction<string>) => {
    //   const password = action.payload;
    //   if (password === WEB_PASSWORD) {
    //     state.isAuth = true;
    //     const expiration = addMinutes(new Date(), 15);
    //     LocalStorageUtil.set(LockLocalStorage.Expiration, expiration);
    //   }
    // },

    // verify: (state) => {
    //   const currentExpiration = LocalStorageUtil.get(LockLocalStorage.Expiration);
    //   const hasExpiration = !!currentExpiration;
    //   const expiration = hasExpiration ? new Date(currentExpiration) : new Date();
    //   const now = new Date();

    //   if (now.getTime() >= expiration.getTime()) {
    //     state.isAuth = false;
    //     LocalStorageUtil.set(LockLocalStorage.Expiration, '');
    //   } else {
    //     state.isAuth = true;
    //   }
    // },

    initializeAuth: (state) => {
      // Sync cookies if authToken exists in state
      if (state.authToken) {
        // Cookies.set('authToken', state.authToken, {
        //   path: '/',
        //   sameSite: 'Lax',
        //   secure: process.env.NODE_ENV === 'production',
        // });
      }
    },

    setError: (state, action: PayloadAction<any>) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.authToken = action.payload.authToken;
        state.isAuthenticated = true;
        state.isAuth = true;
        state.loading = false;
        state.error = null;

        // Only set cookies - Redux Persist handles state persistence
        // setCookiesForUser(action.payload.user, action.payload.authToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
        state.user = null;
        state.authToken = null;
        state.isAuthenticated = false;
        state.isAuth = false;
      });

    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.authToken = action.payload.authToken;
        state.isAuthenticated = true;
        state.isAuth = true;
        state.loading = false;
        state.error = null;

        // Only set cookies - Redux Persist handles state persistence
        // setCookiesForUser(action.payload.user, action.payload.authToken);
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Signup failed';
      });

    builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        console.log('Forgot Password Success:', action.payload.message);
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to send reset link';
      });

    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        console.log('Reset Password Success:', action.payload.message);
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to reset password';
      });

    builder
      .addCase(sendVerificationEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendVerificationEmail.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(sendVerificationEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to send verification email';
      });

    builder
      .addCase(verifyEmailCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmailCode.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        console.log('Email verification success:', action.payload.message);
      })
      .addCase(verifyEmailCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Email verification failed';
      });

  },
});

export const {
  setUser,
  logout,
  // unlock,
  // verify,
  initializeAuth,
  setError,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;