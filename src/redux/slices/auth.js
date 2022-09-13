import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from '../../utils/axios'

const initialState = {
  data: null,
  status: 'loading',
};

export const fetchRegister = createAsyncThunk(
  'auth/fetchRegister',
  async (params) => {
    const { data } = await axios.post('/auth/register', params);

    return data;
  }
)

export const fetchAuth = createAsyncThunk(
  'auth/fetchAuth',
  async (params) => {
    const { data } = await axios.post('/auth/login', params);

    return data;
  }
)

export const fetchAuthMe = createAsyncThunk(
  'auth/fetchAuthMe',
  async () => {
    const { data } = await axios.get('/auth/me');

    return data;
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchRegister.pending, (state) => {
        state.status = 'loading';
        state.data = null;
      })
      .addCase(fetchRegister.fulfilled, (state, { payload }) => {
        state.status = 'loaded';
        state.data = payload;
      })
      .addCase(fetchRegister.rejected, (state) => {
        state.status = 'error';
        state.data = null;
      })
      .addCase(fetchAuth.pending, (state) => {
        state.status = 'loading';
        state.data = null;
      })
      .addCase(fetchAuth.fulfilled, (state, { payload }) => {
        state.status = 'loaded';
        state.data = payload;
      })
      .addCase(fetchAuth.rejected, (state) => {
        state.status = 'error';
        state.data = null;
      })
      .addCase(fetchAuthMe.pending, (state) => {
        state.status = 'loading';
        state.data = null;
      })
      .addCase(fetchAuthMe.fulfilled, (state, { payload }) => {
        state.status = 'loaded';
        state.data = payload;
      })
      .addCase(fetchAuthMe.rejected, (state) => {
        state.status = 'error';
        state.data = null;
      })
  }
});

export const selectIsAuth = state => Boolean(state.auth.data);
export const authReducer = authSlice.reducer;
export const { logout } = authSlice.actions;
