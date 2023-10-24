import { createSlice } from '@reduxjs/toolkit';
import { findStaffOrderAPI, getStaffOrderByIdAPI } from '../../../service/sim/sim.staff-order.service';
// utils

const initialState = {
  isLoading: false,
  error: null,
  totalElements: 0,
  totalPages: 0,
  numberOfElements: 0,
  staffOrders: [],
  staffOrder: null,
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
  name: 'staffOrder',
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
    setStaffOrders(state, action) {
      state.isLoading = false;
      const response = action.payload;
      state.staffOrders = response.data;
      state.totalElements = response.totalElements;
      state.totalPages = response.totalPages;
      state.numberOfElements = response.numberOfElements;
    },
    setStaffOrder(state, action) {
      state.isLoading = false;
      const response = action.payload;
      state.staffOrder = response.data;
    },
    setStaffOrderSearch(state, action) {
      state.isLoading = false;
      state.search = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;
// Actions
export const { setStaffOrderSearch } = slice.actions;
// ----------------------------------------------------------------------

export function getStaffOrders() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    // read state from rootReducer
    const { staffOrder } = getState();
    const resp = await findStaffOrderAPI({ ...staffOrder.search, value: `%${staffOrder.search.value}%` });
    if (resp.code === '200') dispatch(slice.actions.setStaffOrders(resp));
    else dispatch(slice.actions.hasError(resp));
  };
}

export function getStaffOrder(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());

    const resp = await getStaffOrderByIdAPI(id);
    if (resp.code === '200') dispatch(slice.actions.setStaffOrder(resp));
    else dispatch(slice.actions.hasError(resp));
  };
}
