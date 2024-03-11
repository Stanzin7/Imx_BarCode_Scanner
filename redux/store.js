
import { configureStore } from '@reduxjs/toolkit';

import {
  persistReducer,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore } from 'redux-persist';
import rootReducer from './reducers/rootReducer';

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const AppStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
      }).concat([]),
  });

};
const Store = AppStore();
export const perssistedStore = persistStore(Store);
export default Store;
