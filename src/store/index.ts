import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import clientReducer from './slices/clientSlice';
import karagirReducer from './slices/karagirSlice';
import uiReducer from './slices/uiSlice';
import sheetsReducer from './slices/sheetsSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  clients: clientReducer,
  karagirs: karagirReducer,
  ui: uiReducer,
  sheets: sheetsReducer,
});

// Load state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('die_makes_state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

// Save state to localStorage
const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('die_makes_state', serializedState);
  } catch {
    // Ignore write errors
  }
};

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: loadState(),
});

store.subscribe(() => {
  saveState(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
