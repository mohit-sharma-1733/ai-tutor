import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { contactsService } from '../../services/contacts';
import { Contact } from '../../types';
import { logoutUser } from './authSlice';

export type ContactsState = {
  items: Contact[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  nextCursor?: string | null;
  refreshing: boolean;
};

const initialState: ContactsState = {
  items: [],
  status: 'idle',
  error: null,
  nextCursor: null,
  refreshing: false,
};

export const fetchContacts = createAsyncThunk(
  'contacts/fetch',
  async (cursor?: string, { rejectWithValue }) => {
    try {
      const response = await contactsService.list(cursor);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Unable to fetch contacts');
    }
  },
);

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    resetContacts: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state, action) => {
        state.status = 'loading';
        state.error = null;
        if (action.meta.arg) {
          state.refreshing = false;
        } else {
          state.refreshing = true;
        }
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.refreshing = false;
        if (action.meta.arg) {
          state.items = [...state.items, ...action.payload.data];
        } else {
          state.items = action.payload.data;
        }
        state.nextCursor = action.payload.nextCursor;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.status = 'failed';
        state.refreshing = false;
        state.error = (action.payload as string) ?? action.error.message ?? null;
      })
      .addCase(logoutUser.fulfilled, () => initialState);
  },
});

export const { resetContacts } = contactsSlice.actions;
export default contactsSlice.reducer;
