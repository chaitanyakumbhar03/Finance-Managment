import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  // Add other UI state as needed
}

const initialState: UIState = {
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Add other UI reducers as needed
  },
});

export default uiSlice.reducer;
