import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SheetsState {
  spreadsheetId: string;
  lastSync: string | null;
  isSyncing: boolean;
}

const initialState: SheetsState = {
  spreadsheetId: '',
  lastSync: null,
  isSyncing: false,
};

const sheetsSlice = createSlice({
  name: 'sheets',
  initialState,
  reducers: {
    setSpreadsheetId: (state, action: PayloadAction<string>) => {
      state.spreadsheetId = action.payload;
    },
    setLastSync: (state, action: PayloadAction<string>) => {
      state.lastSync = action.payload;
    },
    setSyncing: (state, action: PayloadAction<boolean>) => {
      state.isSyncing = action.payload;
    },
  },
});

export const { setSpreadsheetId, setLastSync, setSyncing } = sheetsSlice.actions;
export default sheetsSlice.reducer;
