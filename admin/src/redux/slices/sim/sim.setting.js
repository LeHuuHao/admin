import { createSlice } from '@reduxjs/toolkit';
import { findSettingAPI, getSettingByIdAPI } from '../../../service/sim/sim.setting.service';
// utils

const initialState = {
  isLoading: false,
  error: null,
  totalElements: 0,
  totalPages: 0,
  numberOfElements: 0,
  settings: [],
  setting: null,
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
  name: 'setting',
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
    setSettings(state, action) {
      state.isLoading = false;
      const response = action.payload;
      state.settings = response.data;
      state.totalElements = response.totalElements;
      state.totalPages = response.totalPages;
      state.numberOfElements = response.numberOfElements;
    },
    setSetting(state, action) {
      state.isLoading = false;
      const response = action.payload;
      state.setting = response.data;
    },
    setSettingSearch(state, action) {
      state.isLoading = false;
      state.search = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;
// Actions
export const { setSettingSearch } = slice.actions;
// ----------------------------------------------------------------------

export function getSettings() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    // read state from rootReducer
    const { setting } = getState();
    const resp = await findSettingAPI({ ...setting.search, value: `%${setting.search.value}%` });

    if (resp.code === '200') dispatch(slice.actions.setSettings(resp));
    else dispatch(slice.actions.hasError(resp));
  };
}

export function getSetting(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());

    const resp = await getSettingByIdAPI(id);
    if (resp.code === '200') dispatch(slice.actions.setSetting(resp));
    else dispatch(slice.actions.hasError(resp));
  };
}
