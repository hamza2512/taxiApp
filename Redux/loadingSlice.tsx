import {createSlice} from '@reduxjs/toolkit';

import {RootState} from './Store';

const initialState = {
  isLoading: false,
};

export const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    SET_IS_LOADING: (state: RootState) => {
      state.isLoading = false;
    },
    SET_IS_LOADING_FINISHED: (state: RootState) => {
      state.isLoading = true;
    },
  },
});

// Action creators are generated for each case reducer function
export const {SET_IS_LOADING, SET_IS_LOADING_FINISHED} = loadingSlice.actions;

export default loadingSlice.reducer;
