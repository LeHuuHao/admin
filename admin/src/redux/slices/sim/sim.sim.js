import { createSlice } from '@reduxjs/toolkit';
import { findSimAPI, getSimByIdAPI } from '../../../service/sim/sim.sim.service';
// utils

const initialState = {
  isLoading: false,
  error: null,
  totalElements: 0,
  totalPages: 0,
  numberOfElements: 0,
  sims: [],
  sim: null,
  search: {
    page: 0,
    size: 10,
    value: '',
    id: 0,
    orders: [
      {
        order: 'desc',
        property: 'createdAt',
      },
    ],
    filterBys: {
      startPrice: null,
      endPrice: null
  }
  },
};

const slice = createSlice({
  name: 'sim',
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
    setSims(state, action) {
      state.isLoading = false;
      const response = action.payload;
      state.sims = response.data;
      state.totalElements = response.totalElements;
      state.totalPages = response.totalPages;
      state.numberOfElements = response.numberOfElements;
    },
    setSim(state, action) {
      state.isLoading = false;
      const response = action.payload;
      state.sim = response.data;
    },
    setSimSearch(state, action) {
      state.isLoading = false;
      state.search = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;
// Actions
export const { setSimSearch } = slice.actions;
// ----------------------------------------------------------------------

export function getSims() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    // read state from rootReducer
    const { sim } = getState();
    const resp = await findSimAPI({ ...sim.search, value: `%${sim.search.value}%` });

    if (resp.code === '200') dispatch(slice.actions.setSims(resp));
    else dispatch(slice.actions.hasError(resp));
  };
}

export function getSim(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());

    const resp = await getSimByIdAPI(id);
    if (resp.code === '200') dispatch(slice.actions.setSim(resp));
    else dispatch(slice.actions.hasError(resp));
  };
}
