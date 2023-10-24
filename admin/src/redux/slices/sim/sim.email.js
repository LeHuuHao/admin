import { createSlice } from '@reduxjs/toolkit';
import { findEmailAPI, getEmailByIdAPI } from '../../../service/sim/sim.email.service';
// utils

const initialState = {
  isLoading: false,
  error: null,
  totalElements: 0,
  totalPages: 0,
  numberOfElements: 0,
  emails: [],
  email: null,
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
  name: 'email',
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
    setEmails(state, action) {
      state.isLoading = false;
      const response = action.payload;
      state.emails = response.data;
      state.totalElements = response.totalElements;
      state.totalPages = response.totalPages;
      state.numberOfElements = response.numberOfElements;
    },
    setEmail(state, action) {
      state.isLoading = false;
      const response = action.payload;
      state.email = response.data;
    },
    setEmailSearch(state, action) {
      state.isLoading = false;
      state.search = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;
// Actions
export const { setEmailSearch } = slice.actions;
// ----------------------------------------------------------------------

export function getEmails() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    // read state from rootReducer
    const { email } = getState();
    const resp = await findEmailAPI({ ...email.search, value: `%${email.search.value}%` });

    if (resp.code === '200') dispatch(slice.actions.setEmails(resp));
    else dispatch(slice.actions.hasError(resp));
  };
}

export function getEmail(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());

    const resp = await getEmailByIdAPI(id);
    if (resp.code === '200') dispatch(slice.actions.setEmail(resp));
    else dispatch(slice.actions.hasError(resp));
  };
}
