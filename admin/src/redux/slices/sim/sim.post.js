import { createSlice } from '@reduxjs/toolkit';
import { findPostsAPI, getPostByIdAPI, getPostBySlugAPI } from '../../../service/sim/sim.post.service';
// utils

const initialState = {
  isLoading: false,
  error: null,
  totalElements: 0,
  totalPages: 0,
  numberOfElements: 0,
  posts: [],
  post: null,
  search: {
    page: 0,
    size: 10,
    value: '',
    orders: [
      {
        order: "desc",
        property: 'createdAt'
      }
    ],
    filterBys: {
      status: null,
      categories: null,
      tags: null,
      uid: null
    }
  }
};

const slice = createSlice({
  name: 'simPost',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
      state.error = null
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    setPosts(state, action) {
      state.isLoading = false;
      const response = action.payload;
      state.posts = response.data;
      state.totalElements = response.totalElements;
      state.totalPages = response.totalPages;
      state.numberOfElements = response.numberOfElements;
    },
    setPost(state, action) {
      state.isLoading = false;
      const response = action.payload;
      state.post = response.data;
    },
    setGPLXPostSearch(state, action) {
      state.isLoading = false;
      state.search = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;
// Actions
export const { setGPLXPostSearch } = slice.actions
// ----------------------------------------------------------------------

export function getGPLXPosts() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    // read state from rootReducer
    const { post } = getState()
    const resp = await findPostsAPI({ ...post.search, value: `%${post.search.value}%` });

    if (resp.code === '200')
      dispatch(slice.actions.setPosts(resp));
    else
      dispatch(slice.actions.hasError(resp));
  };
}

export function getGPLXPost(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());

    const resp = await getPostByIdAPI(id);
    if (resp.code === '200')
      dispatch(slice.actions.setPost(resp));
    else
      dispatch(slice.actions.hasError(resp));
  };
}

export function findBySlugPost(slug) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());

    const resp = await getPostBySlugAPI(slug);
    if (resp.code === '200')
      dispatch(slice.actions.setPost(resp));
    else
      dispatch(slice.actions.hasError(resp));
  };
}