import { createSlice } from '@reduxjs/toolkit';
import { findProfitConfigAPI, getProfitConfigByIdAPI } from '../../../service/sim/sim.profit-config.service';
// utils

const initialState = {
  isLoading: false,
  error: null,
  totalElements: 0,
  totalPages: 0,
  numberOfElements: 0,
  profitConfigs: [],
  profitConfig: null,
  search: {
    page: 0,
    size: 10,
    value: '',
    id: 0,
    orders: [
      {
        order: 'asc',
        property: 'createdAt',
      },
    ],
  },
};

const slice = createSlice({
  name: 'profitConfig',
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
    setProfitConfigs(state, action) {
      state.isLoading = false;
      const response = action.payload;
      state.profitConfigs = response.data;
      state.totalElements = response.totalElements;
      state.totalPages = response.totalPages;
      state.numberOfElements = response.numberOfElements;
    },
    setProfitConfig(state, action) {
      state.isLoading = false;
      const response = action.payload;
      state.profitConfig = response.data;
    },
    setProfitConfigSearch(state, action) {
      state.isLoading = false;
      state.search = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;
// Actions
export const { setProfitConfigSearch } = slice.actions;
// ----------------------------------------------------------------------

export function getProfitConfigs() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    // read state from rootReducer
    const { profitConfig } = getState();
    const resp = await findProfitConfigAPI({ ...profitConfig.search, value: `%${profitConfig.search.value}%` });

    if (resp.code === '200') dispatch(slice.actions.setProfitConfigs(resp));
    else dispatch(slice.actions.hasError(resp));
  };
}

export function getProfitConfig(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());

    const resp = await getProfitConfigByIdAPI(id);
    if (resp.code === '200') dispatch(slice.actions.setProfitConfig(resp));
    else dispatch(slice.actions.hasError(resp));
  };
}
