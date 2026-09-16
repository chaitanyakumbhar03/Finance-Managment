import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Karagir, KaragirProject, LumpsumPayment, AdditionalItem } from '../../types';

interface KaragirState {
  items: Karagir[];
}

const initialState: KaragirState = {
  items: [
    {
      id: 'k_nainesh',
      name: 'Nainesh Madve',
      address: 'Osar',
      phoneNumber: '91 8999748057',
      createdAt: '2026-02-18T00:00:00Z',
      projects: [
        {
          id: 'kp_nainesh_1',
          projectName: 'Banubali Chain Die (Lot 1) - Ritik Jain',
          clientProjectId: 'p_ritik_1',
          dieDetails: {
            totalDies: 2,
            designs: 'Banubali Chain Die',
            sizes: 'Standard',
            dieType: 'Bahubali Chain Die'
          },
          totalAmount: 10000,
          advancePayment: 0,
          lumpsumPayments: [
            { id: 'klp_n1_1_s1', date: '2026-02-19T00:00:00Z', amount: 4000, notes: 'Advance paid to Karagir' },
            { id: 'klp_n1_1_s2', date: '2026-03-02T00:00:00Z', amount: 6000, notes: 'Full amount cleared' }
          ],
          pendingPayment: 0,
          totalPaid: 10000,
          createdAt: '2026-02-19T00:00:00Z'
        },
        {
          id: 'kp_nainesh_2',
          projectName: 'Banubali Chain Die Bulk (Lot 2) - Ritik Jain',
          clientProjectId: 'p_ritik_2',
          dieDetails: {
            totalDies: 14,
            designs: 'Banubali Chain Die',
            sizes: 'Standard',
            dieType: 'Bahubali Chain Die'
          },
          totalAmount: 80000,
          advancePayment: 0,
          lumpsumPayments: [
            { id: 'klp_n2_s1', date: '2026-03-31T00:00:00Z', amount: 20000, notes: '1) 20000 (31-03-26)' },
            { id: 'klp_n2_s2', date: '2026-04-23T00:00:00Z', amount: 20000, notes: '2) 20000 (23-04-26)' },
            { id: 'klp_n2_s3', date: '2026-05-17T00:00:00Z', amount: 40000, notes: '3) 40000 (17-05-26)' }
          ],
          pendingPayment: 0,
          totalPaid: 80000,
          createdAt: '2026-03-31T00:00:00Z'
        }
      ]
    },
    {
      id: 'k_dipak',
      name: 'Dipak Patil',
      address: 'Vasgoan',
      phoneNumber: '91 9545213759',
      createdAt: '2026-03-30T00:00:00Z',
      projects: [
        {
          id: 'kp_dipak_1',
          projectName: 'Banubali Chain Die Bulk (Lot 2) - Ritik Jain',
          clientProjectId: 'p_ritik_2',
          dieDetails: {
            totalDies: 7,
            designs: 'Banubali Chain Die',
            sizes: 'Standard',
            dieType: 'Bahubali Chain Die'
          },
          totalAmount: 35000,
          advancePayment: 0,
          lumpsumPayments: [
            { id: 'klp_d2_s1', date: '2026-03-31T00:00:00Z', amount: 20000, notes: '20000 (31-03-2026)' },
            { id: 'klp_d2_s2', date: '2026-05-13T00:00:00Z', amount: 5000, notes: '+ 5000 (13-05-2026)' },
            { id: 'klp_d2_s3', date: '2026-05-25T00:00:00Z', amount: 10000, notes: '+ 10000 (25-05-26)' }
          ],
          pendingPayment: 0,
          totalPaid: 35000,
          createdAt: '2026-03-31T00:00:00Z'
        }
      ]
    },
    {
      id: 'k_jatin',
      name: 'Jatin Ambhire',
      address: 'Gungwada',
      phoneNumber: '91 7030191547',
      createdAt: '2026-05-01T00:00:00Z',
      projects: [
        {
          id: 'kp_jatin_1',
          projectName: 'Banubali Chain Die Bulk (Lot 2) - Ritik Jain',
          clientProjectId: 'p_ritik_2',
          dieDetails: {
            totalDies: 7,
            designs: 'Banubali Chain Die',
            sizes: 'Standard',
            dieType: 'Bahubali Chain Die'
          },
          totalAmount: 47000,
          advancePayment: 0,
          lumpsumPayments: [
            { id: 'klp_j2_s1', date: '2026-05-08T00:00:00Z', amount: 10000, notes: '10000 (08-05-2026)' },
            { id: 'klp_j2_s2', date: '2026-05-21T00:00:00Z', amount: 20000, notes: '+ 20000 (21-05-2026)' },
            { id: 'klp_j2_s3', date: '2026-05-25T00:00:00Z', amount: 17000, notes: '+ 17,000 (25-05-26)' }
          ],
          pendingPayment: 0,
          totalPaid: 47000,
          createdAt: '2026-05-08T00:00:00Z'
        }
      ]
    }
  ],
};

const karagirSlice = createSlice({
  name: 'karagirs',
  initialState,
  reducers: {
    addKaragir: (state, action: PayloadAction<Karagir>) => {
      state.items.push(action.payload);
    },
    updateKaragir: (state, action: PayloadAction<Karagir>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteKaragir: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    setKaragirs: (state, action: PayloadAction<Karagir[]>) => {
      state.items = action.payload;
    },
    mergeKaragirs: (state, action: PayloadAction<Karagir[]>) => {
      const newItems = action.payload.filter(
        newItem => !state.items.some(item => item.id === newItem.id)
      );
      state.items = [...state.items, ...newItems];
    },
    // Karagir Project actions
    addKaragirProject: (state, action: PayloadAction<{ karagirId: string; project: KaragirProject }>) => {
      const karagir = state.items.find(item => item.id === action.payload.karagirId);
      if (karagir) {
        if (!karagir.projects) karagir.projects = [];
        karagir.projects.push(action.payload.project);
      }
    },
    updateKaragirProject: (state, action: PayloadAction<{ karagirId: string; project: KaragirProject }>) => {
      const karagir = state.items.find(item => item.id === action.payload.karagirId);
      if (karagir && karagir.projects) {
        const index = karagir.projects.findIndex(p => p.id === action.payload.project.id);
        if (index !== -1) {
          karagir.projects[index] = action.payload.project;
        }
      }
    },
    deleteKaragirProject: (state, action: PayloadAction<{ karagirId: string; projectId: string }>) => {
      const karagir = state.items.find(item => item.id === action.payload.karagirId);
      if (karagir && karagir.projects) {
        karagir.projects = karagir.projects.filter(p => p.id !== action.payload.projectId);
      }
    },
    addKaragirLumpsum: (state, action: PayloadAction<{ karagirId: string; projectId: string; payment: LumpsumPayment }>) => {
      const karagir = state.items.find(item => item.id === action.payload.karagirId);
      if (karagir && karagir.projects) {
        const project = karagir.projects.find(p => p.id === action.payload.projectId);
        if (project) {
          project.lumpsumPayments.push(action.payload.payment);
          project.totalPaid = project.advancePayment + project.lumpsumPayments.reduce((acc, p) => acc + p.amount, 0);
          project.pendingPayment = Math.max(0, project.totalAmount - project.totalPaid);
        }
      }
    },
    addKaragirProjectAdditionalItem: (
      state, 
      action: PayloadAction<{ karagirId: string; projectId: string; item: AdditionalItem }>
    ) => {
      const karagir = state.items.find(item => item.id === action.payload.karagirId);
      if (karagir && karagir.projects) {
        const project = karagir.projects.find(p => p.id === action.payload.projectId);
        if (project) {
          if (!project.additionalItems) {
            project.additionalItems = [];
          }
          project.additionalItems.push(action.payload.item);
          // Increase total wages by karagirRate * quantity
          project.totalAmount += action.payload.item.karagirRate * action.payload.item.quantity;
          project.pendingPayment = Math.max(0, project.totalAmount - project.totalPaid);
        }
      }
    },
    deleteKaragirProjectAdditionalItem: (
      state,
      action: PayloadAction<{ karagirId: string; projectId: string; itemId: string }>
    ) => {
      const karagir = state.items.find(item => item.id === action.payload.karagirId);
      if (karagir && karagir.projects) {
        const project = karagir.projects.find(p => p.id === action.payload.projectId);
        if (project && project.additionalItems) {
          const itemIndex = project.additionalItems.findIndex(item => item.id === action.payload.itemId);
          if (itemIndex !== -1) {
            const item = project.additionalItems[itemIndex];
            // Decrease total wages
            project.totalAmount = Math.max(0, project.totalAmount - item.karagirRate * item.quantity);
            project.additionalItems.splice(itemIndex, 1);
            project.pendingPayment = Math.max(0, project.totalAmount - project.totalPaid);
          }
        }
      }
    }
  },
});

export const { 
  addKaragir, 
  updateKaragir, 
  deleteKaragir, 
  setKaragirs, 
  mergeKaragirs,
  addKaragirProject,
  updateKaragirProject,
  deleteKaragirProject,
  addKaragirLumpsum,
  addKaragirProjectAdditionalItem,
  deleteKaragirProjectAdditionalItem
} = karagirSlice.actions;

export default karagirSlice.reducer;
