import { configureStore } from '@reduxjs/toolkit';
import userSlice from '../slice/userSlice';
import adminSlice from '../slice/adminSlice';
import deliveryBoySlice from '../slice/deliveryBoySlice';
import reatilerSlice from '../slice/reatilerSlice'
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import { combineReducers } from 'redux';

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  auth: userSlice,
  admin: adminSlice,
  deliveryBoy: deliveryBoySlice,
  reatiler: reatilerSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

// persistor.purge();


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
