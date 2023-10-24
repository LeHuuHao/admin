import { createSlice } from '@reduxjs/toolkit';
import { findOrderAPI, getOrderByIdAPI } from '../../../service/sim/sim.order.service';
// utils

const initialState = {
  isLoading: false,
  error: null,
  totalElements: 0,
  totalPages: 0,
  numberOfElements: 0,
  orders: [],
  order: null,
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
  name: 'order',
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
    setOrders(state, action) {
      state.isLoading = false;
      const response = action.payload;
      state.orders = response.data;
      state.totalElements = response.totalElements;
      state.totalPages = response.totalPages;
      state.numberOfElements = response.numberOfElements;
    },
    setOrder(state, action) {
      state.isLoading = false;
      const response = action.payload;
      state.order = response.data;
    },
    setOrderSearch(state, action) {
      state.isLoading = false;
      state.search = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;
// Actions
export const { setOrderSearch } = slice.actions;
// ----------------------------------------------------------------------

export function getOrders() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    // read state from rootReducer
    const { order } = getState();
    const resp = await findOrderAPI({ ...order.search, value: `%${order.search.value}%` });

    if (resp.code === '200') dispatch(slice.actions.setOrders(resp));
    else dispatch(slice.actions.hasError(resp));
  };
}

export function getOrder(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());

    const resp = await getOrderByIdAPI(id);
    if (resp.code === '200') dispatch(slice.actions.setOrder(resp));
    else dispatch(slice.actions.hasError(resp));
  };
}
