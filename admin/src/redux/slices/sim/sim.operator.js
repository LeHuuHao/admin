import { createSlice } from '@reduxjs/toolkit';
import { findOperatorAPI, getOperatorByIdAPI } from '../../../service/sim/sim.operator.service';
// utils

const initialState = {
  isLoading: false,
  error: null,
  totalElements: 0,
  totalPages: 0,
  numberOfElements: 0,
  operators: [],
  operator: null,
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
  name: 'operator',
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
    setOperators(state, action) {
      state.isLoading = false;
      const response = action.payload;
      state.operators = response.data;
      state.totalElements = response.totalElements;
      state.totalPages = response.totalPages;
      state.numberOfElements = response.numberOfElements;
    },
    setOperator(state, action) {
      state.isLoading = false;
      const response = action.payload;
      state.operator = response.data;
    },
    setOperatorSearch(state, action) {
      state.isLoading = false;
      state.search = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;
// Actions
export const { setOperatorSearch } = slice.actions;
// ----------------------------------------------------------------------

export function getOperators() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    // read state from rootReducer
    const { operator } = getState();
    const resp = await findOperatorAPI({ ...operator.search, value: `%${operator.search.value}%` });

    if (resp.code === '200') dispatch(slice.actions.setOperators(resp));
    else dispatch(slice.actions.hasError(resp));
  };
}

export function getOperator(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());

    const resp = await getOperatorByIdAPI(id);
    if (resp.code === '200') dispatch(slice.actions.setOperator(resp));
    else dispatch(slice.actions.hasError(resp));
  };
}
