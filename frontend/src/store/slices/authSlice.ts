import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authService, LoginPayload, RegisterPayload } from '../../services/auth';
import { tokenStorage } from '../../services/storage';
import { AuthTokens, User } from '../../types';

export type AuthState = {
  user: User | null;
  tokens: AuthTokens | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  tokens: null,
  status: 'idle',
  error: null,
};

export const registerUser = createAsyncThunk(
  'auth/register',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const response = await authService.register(payload);
      await tokenStorage.save(response.tokens);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Registration failed');
    }
  },
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await authService.login(payload);
      await tokenStorage.save(response.tokens);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Login failed');
    }
  },
);

export const loadSession = createAsyncThunk('auth/loadSession', async (_, { rejectWithValue }) => {
  try {
    const tokens = await tokenStorage.get();
    if (!tokens) {
      return rejectWithValue('Missing tokens');
    }
    const user = await authService.getProfile();
    return { user, tokens };
  } catch (error: any) {
    await tokenStorage.clear();
    return rejectWithValue(error.response?.data?.message ?? 'Unable to load session');
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await tokenStorage.clear();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) ?? action.error.message ?? null;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) ?? action.error.message ?? null;
      })
      .addCase(loadSession.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadSession.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
        state.error = null;
      })
      .addCase(loadSession.rejected, (state, action) => {
        state.status = 'failed';
        state.user = null;
        state.tokens = null;
        state.error = (action.payload as string) ?? action.error.message ?? null;
      })
      .addCase(logoutUser.fulfilled, () => initialState);
  },
});

export default authSlice.reducer;
