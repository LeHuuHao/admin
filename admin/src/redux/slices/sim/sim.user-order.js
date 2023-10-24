import { createSlice } from '@reduxjs/toolkit';
import { findUserOrderAPI, getUserOrderByIdAPI } from '../../../service/sim/sim.user-order.service';
// utils

const initialState = {
  isLoading: false,
  error: null,
  totalElements: 0,
  totalPages: 0,
  numberOfElements: 0,
  userOrders: [],
  userOrder: null,
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
  name: 'userOrder',
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
    setUserOrders(state, action) {
      state.isLoading = false;
      const response = action.payload;
      state.userOrders = response.data;
      state.totalElements = response.totalElements;
      state.totalPages = response.totalPages;
      state.numberOfElements = response.numberOfElements;
    },
    setUserOrder(state, action) {
      state.isLoading = false;
      const response = action.payload;
      state.userOrder = response.data;
    },
    setUserOrderSearch(state, action) {
      state.isLoading = false;
      state.search = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;
// Actions
export const { setUserOrderSearch } = slice.actions;
// ----------------------------------------------------------------------

export function getUserOrders() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    // read state from rootReducer
    const { userOrder } = getState();
    const resp = await findUserOrderAPI({ ...userOrder.search, value: `%${userOrder.search.value}%` });
    if (resp.code === '200') dispatch(slice.actions.setUserOrders(resp));
    else dispatch(slice.actions.hasError(resp));
  };
}

export function getUserOrder(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());

    const resp = await getUserOrderByIdAPI(id);
    if (resp.code === '200') dispatch(slice.actions.setUserOrder(resp));
    else dispatch(slice.actions.hasError(resp));
  };
}
