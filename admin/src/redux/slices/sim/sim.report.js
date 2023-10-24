import { createSlice } from '@reduxjs/toolkit';
import { statisticOrder, statisticOrderByUser } from '../../../service/sim/sim.order.service';
// utils

const initialState = {
  isLoading: false,
  error: null,
  totalElements: 0,
  totalPages: 0,
  numberOfElements: 0,
  reports: [],
  reportOrder: null,
  search: {
    page: 0,
    size: 10,
    filterBys: {
        startAt: '',
        endAt: ''
    }
  },
};

const slice = createSlice({
  name: 'report',
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
    setReports(state, action) {
      state.isLoading = false;
      const response = action.payload;
      state.reports = response.data;
      state.totalElements = response.totalElements;
      state.totalPages = response.totalPages;
      state.numberOfElements = response.numberOfElements;
    },
    setReportOrder(state, action) {
      state.isLoading = false;
      const response = action.payload;
      state.reportOrder = response.data;
    },
    setReportSearch(state, action) {
      state.isLoading = false;
      state.search = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;
// Actions
export const { setReportSearch } = slice.actions;
// ----------------------------------------------------------------------

export function getReportsFilterByUser() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    // read state from rootReducer
    const { report } = getState();
    const resp = await statisticOrderByUser(report.search);

    if (resp.code === '200') 
      dispatch(slice.actions.setReports(resp));
    else dispatch(slice.actions.hasError(resp));
  };
}

export function getReportOrder() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    // read state from rootReducer
    const { report } = getState();
    const resp = await statisticOrder(report.search);

    if (resp.code === '200') dispatch(slice.actions.setReportOrder(resp));
    else dispatch(slice.actions.hasError(resp));
  };
}
