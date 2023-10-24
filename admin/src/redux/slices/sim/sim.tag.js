import { createSlice } from '@reduxjs/toolkit';
import { findTagsAPI, getTagByIdAPI } from '../../../service/sim/sim.tag.service';
// utils

const initialState = {
  isLoading: false,
  error: null,
  totalElements: 0,
  totalPages: 0,
  numberOfElements: 0,
  tags: [],
  tag: null,
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
  name: 'blogTag',
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
    setTags(state, action) {
      state.isLoading = false;
      const response = action.payload;
      state.tags = response.data;
      state.totalElements = response.totalElements;
      state.totalPages = response.totalPages;
      state.numberOfElements = response.numberOfElements;
    },
    setTag(state, action) {
      state.isLoading = false;
      const response = action.payload;
      state.tag = response.data;
    },
    setTagSearch(state, action) {
      state.isLoading = false;
      state.search = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;
// Actions
export const { setTagSearch } = slice.actions;
// ----------------------------------------------------------------------

export function getTags() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    // read state from rootReducer
    const { tag } = getState();

    const resp = await findTagsAPI({ ...tag.search, value: `%${tag.search.value}%` });

    if (resp.code === '200') dispatch(slice.actions.setTags(resp));
    else dispatch(slice.actions.hasError(resp));
  };
}

export function getTag(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());

    const resp = await getTagByIdAPI(id);
    if (resp.code === '200') dispatch(slice.actions.setTags(resp));
    else dispatch(slice.actions.hasError(resp));
  };
}
