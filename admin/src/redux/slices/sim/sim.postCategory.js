import { createSlice } from '@reduxjs/toolkit';
import { findPostCategoriesAPI, getPostCategoryByIdAPI } from '../../../service/sim/sim.postCategory.service';
// utils

const initialState = {
  isLoading: false,
  error: null,
  totalElements: 0,
  totalPages: 0,
  numberOfElements: 0,
  postCategories: [],
  postCategory: null,
  search: {
    page: 0,
    size: 10,
    value: '',
    orders: [
      {
        order: 'desc',
        property: 'createdAt',
      },
    ],
  },
};

const slice = createSlice({
  name: 'gplxCategory',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
      state.error = null;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    setPostCategories(state, action) {
      state.isLoading = false;
      const response = action.payload;
      state.postCategories = response.data;
      state.totalElements = response.totalElements;
      state.totalPages = response.totalPages;
      state.numberOfElements = response.numberOfElements;
    },
    setPostCategory(state, action) {
      state.isLoading = false;
      const response = action.payload;
      state.postCategory = response.data;
    },
    setPostCategorySearch(state, action) {
      state.isLoading = false;
      state.search = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;
// Actions
export const { setPostCategorySearch } = slice.actions;
// ----------------------------------------------------------------------

export function getPostCategories() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    // read state from rootReducer
    const { postCategory } = getState();

    const resp = await findPostCategoriesAPI({ ...postCategory.search, value: `%${postCategory.search.value}%` });

    if (resp.code === '200') dispatch(slice.actions.setPostCategories(resp));
    else dispatch(slice.actions.hasError(resp));
  };
}

export function getPostCategory(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());

    const resp = await getPostCategoryByIdAPI(id);
    if (resp.code === '200') dispatch(slice.actions.setPostCategory(resp));
    else dispatch(slice.actions.hasError(resp));
  };
}
