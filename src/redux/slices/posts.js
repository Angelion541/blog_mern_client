import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from '../../utils/axios'

const initialState = {
  posts: {
    items: [],
    status: 'loading',
  },
  tags: {
    items: [],
    status: 'loading',
  }
};

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async () => {
    const { data } = await axios.get('/posts');

    return data;
  }
);

export const fetchRemovePost = createAsyncThunk(
  'posts/fetchRemovePosts',
  async (id) => axios.delete(`/posts/${id}`)
);

export const fetchTags = createAsyncThunk(
  'posts/fetchTags',
  async () => {
    const { data } = await axios.get('/tags');

    return data;
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {

  },
  extraReducers: builder => {
    // Get posts
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.posts.items = [];
        state.posts.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, { payload }) => {
        state.posts.items = payload;
        state.posts.status = 'loaded';
      })
      .addCase(fetchPosts.rejected, (state) => {
        state.posts.items = [];
        state.posts.status = 'error';
      });
    // Get tags
    builder
      .addCase(fetchTags.pending, (state) => {
        state.tags.items = [];
        state.tags.status = 'loading';
      })
      .addCase(fetchTags.fulfilled, (state, { payload }) => {
        state.tags.items = payload;
        state.tags.status = 'loaded';
      })
      .addCase(fetchTags.rejected, (state) => {
        state.tags.items = [];
        state.tags.status = 'error';
      });
    // Delete post
    builder
      .addCase(fetchRemovePost.pending, (state, action) => {
        state.posts.items = state.posts.items.filter(obj => obj._id !== action.meta.arg);
      })
  }
});

export const postsReducer = postsSlice.reducer;