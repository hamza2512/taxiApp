import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface CounterState {
  modal: boolean;
  color: boolean;
  userData: object;
  deriverId: string;
  driveWithVedio: boolean;
  recording: boolean;
}

const initialState: CounterState = {
  modal: false,
  color: false,
  userData: {},
  deriverId: '',
  driveWithVedio: true,
  recording: false,
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    setmodal: (state, action: PayloadAction<boolean>) => {
      state.modal = action.payload;
    },
    setColor: (state, action: PayloadAction<boolean>) => {
      state.modal = action.payload;
    },
    setUSerData: (state, action: PayloadAction<object>) => {
      state.userData = action.payload;
    },
    setDriverId: (state, action: PayloadAction<string>) => {
      state.deriverId = action.payload;
    },
    setDriverPreference: (state, action: PayloadAction<boolean>) => {
      state.driveWithVedio = action.payload;
    },
    setRecordingStart: (state, action: PayloadAction<boolean>) => {
      state.recording = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setmodal,
  setColor,
  setUSerData,
  setDriverId,
  setDriverPreference,
  setRecordingStart,
} = counterSlice.actions;

export default counterSlice.reducer;
