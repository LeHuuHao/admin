import { createSlice } from '@reduxjs/toolkit';
import { findPriceConfigAPI, getPriceConfigByIdAPI } from '../../../service/sim/sim.price-config.service';
// utils

const initialState = {
  isLoading: false,
  error: null,
  totalElements: 0,
  totalPages: 0,
  numberOfElements: 0,
  priceConfigs: [],
  priceConfig: null,
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
  name: 'priceConfig',
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
    setPriceConfigs(state, action) {
      state.isLoading = false;
      const response = action.payload;
      state.priceConfigs = response.data;
      state.totalElements = response.totalElements;
      state.totalPages = response.totalPages;
      state.numberOfElements = response.numberOfElements;
    },
    setPriceConfig(state, action) {
      state.isLoading = false;
      const response = action.payload;
      state.priceConfig = response.data;
    },
    setPriceConfigSearch(state, action) {
      state.isLoading = false;
      state.search = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;
// Actions
export const { setPriceConfigSearch } = slice.actions;
// ----------------------------------------------------------------------

export function getPriceConfigs() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    // read state from rootReducer
    const { priceConfig } = getState();
    const resp = await findPriceConfigAPI({ ...priceConfig.search, value: `%${priceConfig.search.value}%` });

    if (resp.code === '200') dispatch(slice.actions.setPriceConfigs(resp));
    else dispatch(slice.actions.hasError(resp));
  };
}

export function getPriceConfig(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());

    const resp = await getPriceConfigByIdAPI(id);
    if (resp.code === '200') dispatch(slice.actions.setPriceConfig(resp));
    else dispatch(slice.actions.hasError(resp));
  };
}
