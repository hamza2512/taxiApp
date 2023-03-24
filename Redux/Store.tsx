import {configureStore} from '@reduxjs/toolkit';
import counterReducer from './CounterSlice';
import { TaxiApi } from './TaxiApi';
// import {TaxiApi} from './TaxiApi';

export const store = configureStore({
  reducer: {
    [TaxiApi.reducerPath]: TaxiApi.reducer,
    data: counterReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(TaxiApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
